'use server'

import { authConfig } from "@/auth.config";
import { $Enums, Prisma, Product } from "@/generated/prisma";
import { Address, createServerResponse } from "@/helpers";
import prisma from "@/lib/prisma/prisma";
import { StatusCodes } from "http-status-codes";
import { getServerSession } from "next-auth";
import { CreateOrderResponse, OrderItem, OrderRequest, OrderResponse, OrderResume } from "./interfaces/interfases";
import AsyncLock from "async-lock";
import { Size } from "@/components";



const lock = new AsyncLock();

export async function createOrder ( requestData: OrderRequest ) {
    
  try {
    const session = await getServerSession( authConfig );
    const userId = session?.user.id;

    if( !userId )
        return createServerResponse( false, StatusCodes.UNAUTHORIZED, null, "No se encuentra logeado para realizar esta acción." );
    
    if( requestData.orderItems.length <= 0 )
        return createServerResponse( false, StatusCodes.BAD_REQUEST, null, "No puede crearse una orden que no contenga productos a comprar" );
    
    // REENTRANTLOCK --> Bloqueamos la ejecución concurrente de la sección críticas que actualiza el stock y crea la orden
    return await lock.acquire('order-creation', async () => {
      
      const productIds = requestData.orderItems.map((item) => item.productId);
      const currentProductsData = await prisma.product.findMany({
        where: { id: { in: productIds } },
      });

      if (isOrderOutOfStock(currentProductsData, requestData.orderItems)) {
        return createServerResponse(
          false,
          StatusCodes.CONFLICT,
          null,
          'No hay suficiente stock de alguno de los productos.'
        );
      }

      const subtotal = calculateSubtotal(currentProductsData, requestData.orderItems);
      const taxPercent = 0.15;
      const tax = calculateTax(subtotal, taxPercent);
      const total = calculateTotal(subtotal, tax);
      const orderItems = calculateOrderItemsInputs(currentProductsData, requestData.orderItems);
      const orderAddress = calculateOrderAddressInputs(requestData.address);
      const itemsInOrder = orderItems.reduce((acc, item) => acc + item.quantity, 0);

      // Transacción atómica --> actualiza stock y crea orden en una sola operación
      const createdOrder = await prisma.$transaction(async (tx) => {
        // Actualizamos el stock de cada producto
        for (const item of requestData.orderItems) {
          const updated = await tx.product.updateMany({
            where: {
              id: item.productId,
              inStock: { gte: item.quantity },
            },
            data: {
              inStock: { decrement: item.quantity },
            },
          });

          if (updated.count === 0) {
            // Al lanzar un Error hace Rollback
            throw new Error(`Sin stock suficiente para el producto ${item.productId}`);
          }
        }

        // Creamos la orden
        const order = await tx.order.create({
          data: {
            subTotal: subtotal,
            total,
            tax,
            isPaid: false,
            itemsInOrder,
            user: { connect: { id: userId } },
            OrderItem: { create: orderItems },
            OrderAddress: { create: orderAddress },
          },
        });
        return order;
      });

      const createOrderResponse: CreateOrderResponse = { ...createdOrder };
      return createServerResponse(true, StatusCodes.CREATED, createOrderResponse, null);
    });
  } catch (error) {
    console.error('Error creando orden:', error);
    return createServerResponse(
      false,
      StatusCodes.INTERNAL_SERVER_ERROR,
      null,
      'Ha ocurrido un error inesperado al crear la orden.'
    );
  }
}

/** Comprueba si el stock actual puede cubrir todos los productos de la orden.
 * @param currentProductsData 
 * @param orderItems 
 * @returns 
 */
function isOrderOutOfStock(currentProductsData: Product[], orderItems: OrderItem[]) {
    
    const productQuantity = orderItems.reduce((acc, item) => {
            acc[item.productId] = (acc[item.productId] ?? 0) + item.quantity;
            return acc;
            }, {} as Record<string, number>);
    
    for ( const curProd of currentProductsData ) {
        const quantityInOrder = productQuantity[curProd.id ];
        if( curProd.inStock < quantityInOrder  ) 
            return true;
    }
    return false;
}


/** Calcula el suubtotal de la orden de compra.
 * @param currentProductsData 
 * @param orderItems 
 * @returns 
 */
function calculateSubtotal(currentProductsData: Product[], orderItems: OrderItem[]) {
    const productQuantity = orderItems.reduce((acc, item) => {
            acc[item.productId] = (acc[item.productId] ?? 0) + item.quantity;
            return acc;
            }, {} as Record<string, number>);

    const subtotal = currentProductsData.reduce((acc, product) => {
                                                    const quantity = productQuantity[product.id] ?? 0;
                                                    return acc + product.price * quantity;
                                                }, 0);
    return subtotal;
}


/** Calcula el importe de impuestos que se agregan a la orden
 * @param subtotal 
 * @param taxPercent 
 * @returns 
 */
function calculateTax( subtotal: number, taxPercent: number ) {
    return subtotal * taxPercent;
}

/** Calcula el importe total de la orden de compra
 * @param subtotal 
 * @param tax 
 * @returns 
 */
function calculateTotal ( subtotal: number, tax: number) {
    return subtotal + tax;
}

/** Genera los OrderItemsInput para poder crear Los OrderItems de la Orden
 * @param currentProductsData 
 * @param orderItems 
 */
function calculateOrderItemsInputs(currentProductsData: Product[], orderItems: OrderItem[]): Prisma.OrderItemCreateManyOrderInput[] {

    const orderItemsInputs = orderItems.map( orderItem => {
        const product = currentProductsData.find( curProd => curProd.id === orderItem.productId );
        return {
            size: orderItem.size as $Enums.Size,
            quantity: orderItem.quantity,
            productId: orderItem.productId,
            price: product!.price
        } as Prisma.OrderItemCreateManyOrderInput;
    } );
    return orderItemsInputs;
}

/** Crea el OrderAddressInput para poder crear en cascada el Address de la Orden.
 * @param address 
 * @returns 
 */
function calculateOrderAddressInputs( address: Address  ): Prisma.OrderAddressCreateInput {
    return { 
        address: address.address1,
        address2: address.address2,
        postalCode: address.zipCode,
        firstName: address.firstname,
        lastName: address.lastname,
        phone: address.phone,
        city: address.city,
        country: {
            connect: {
                id: address.country
            }
        },
     } as Prisma.OrderAddressCreateInput;
}


/** Función que devuelve los datos de una Orden de Compra en base a su ID.
 * @param id 
 * @returns 
 */
export async function getOrderById ( id: string ) {

  const session = await getServerSession( authConfig );
  const sessionUserId = session?.user.id;
  if( !sessionUserId )
      return createServerResponse( false, StatusCodes.UNAUTHORIZED, null, "No se encuentra logeado para realizar esta acción." );

  if( !id )
    return createServerResponse( false, StatusCodes.BAD_REQUEST, null, "No se ha suministrado el identificador de la orden" );

  const order = await prisma.order.findUnique( {
    where: {
      id: id
    },
    include: {
      OrderAddress: true,
      OrderItem: {
        include: {
          product: {
            include: {
              images: true
            }
          }
        }
      },
    },
  } );

  if( ! order ) 
    return createServerResponse(false, StatusCodes.NOT_FOUND, null, `La orden con identificador #${id}, no fue encontrada`);

  if( order.userId !== sessionUserId ) 
    return createServerResponse( false, StatusCodes.FORBIDDEN, null, `No tiene permisos para realizar esta acción.` );

  const response: OrderResponse = {
    ...order,
    OrderAddress: { ...order.OrderAddress! },
    OrderItem: order.OrderItem.map(item => ({
      ...item,
      size: item.size.toString() as Size,
      product: {
        ...item.product,
        gender: item.product.gender.toString(),
        sizes: item.product.sizes.map(size => size.toString()),
        images: item.product.images 
      }
    }))
  };

  return createServerResponse(true, StatusCodes.OK, response, null);
}


/** Esta función devuelve un listado resumido de Ordenes para la tabla de listado de ordenes.
 * @param userId 
 * @returns 
 */
export async function getOrdersByUser ( userId: string ) {

  const session = await getServerSession( authConfig );
  const sessionUserId = session?.user.id;
  if( !sessionUserId )
      return createServerResponse( false, StatusCodes.UNAUTHORIZED, null, "No se encuentra logeado para realizar esta acción." );

  if( userId != sessionUserId && !session.user.roles!.includes('admin') ) {
    return createServerResponse( false, StatusCodes.FORBIDDEN, null, "Usted no tiene permisos para realizar esta acción." );
  }

  const orders = await prisma.order.findMany( {
    where: {
      userId: userId,
    },
    select: {
      id: true,
      isPaid: true,
      OrderAddress: {
        select: {
          firstName: true,
          lastName: true
        }
      }
    }
  });

  const orderSimpleList: OrderResume[] = orders.map ( order => (
      { 
        id: order.id,
        firstName: order.OrderAddress?.firstName,
        lastName: order.OrderAddress?.lastName,
        isPaid: order.isPaid        
      }) as OrderResume );

  return createServerResponse ( true, StatusCodes.OK, orderSimpleList, null );
}
