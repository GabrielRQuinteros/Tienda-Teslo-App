'use server';
import { authConfig } from "@/auth.config";
import { Order } from "@/generated/prisma";
import { createServerResponse } from "@/helpers";
import { sleep } from "@/helpers/devtools/devtools";
import { PaypalOrderDetails } from "@/helpers/integrations";
import paypalClient from "@/helpers/integrations/client/PaypalClient";
import { withRetry } from "@/helpers/resilience/resilienceHelper";
import prisma from "@/lib/prisma/prisma";
import { StatusCodes } from "http-status-codes";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export const setTransacionId = async ( orderId: string, transactionId: string ) => {

    try {
        const session = await getServerSession( authConfig );
        const userId = session?.user.id;
        
        if( !userId )
            return createServerResponse( false, StatusCodes.UNAUTHORIZED, null, "No se encuentra logueado para realizar esta acción." );
        
        if( !transactionId )
            return createServerResponse( false, StatusCodes.BAD_REQUEST, null, "No se proporsionó un id de transacción" );
        
        
        if( !orderId )
            return createServerResponse( false, StatusCodes.BAD_REQUEST, null, "No se proporsionó un id de orden" );

        const order: Order | null = await prisma.order.findUnique( { where: { id: orderId } } );

        if( ! order) 
            return createServerResponse( false, StatusCodes.NOT_FOUND, null, "El identificador de la orden indicada no existe en sistema" );


        if( order.userId != userId && !(session.user.roles?.includes('admin')) ) {
            console.log(`DANGER:AccionPeligrosa: el usuario ${userId} ha intentado modificar el el estado de la orden ${orderId} a pago.`)
            return createServerResponse(  false, StatusCodes.FORBIDDEN, null, "No esta autorizado a realizar esta acción.");
        }

        if( order.isPaid ) {
            console.log(`WARNING:Conflicto: el usuario ${userId} pago 2 o mas veces por la orden: ${order.id}. Id de la transaccion en conflicto: ${transactionId}`);
            return createServerResponse( false, StatusCodes.CONFLICT, null, "La orden ya se encontraba pagada, porfavor contacte con el administrador" );
        }

        const updatedOrder = await prisma.order.update( {
            where: {id: order.id },
            data: { transactionId: transactionId }
        } );

        if( ! updatedOrder ) {
            return createServerResponse( false, StatusCodes.INTERNAL_SERVER_ERROR, null, "Hubo un error al intentar actualizar la orden" );
        }
        return createServerResponse( true, StatusCodes.OK, null , "Id de transacción actualizado con éxito" );
    } catch (error) {
        console.log("ERROR:ErrorInterno:Error al intentar actualizar el id de la transacción. " + error);
        return createServerResponse( false, StatusCodes.INTERNAL_SERVER_ERROR, null, "Error interno, contacte con el administrador" );
    }
}



export const verifyOrderTransaction = async ( transactionId: string ) => {

    const session = await getServerSession( authConfig );
        const userId = session?.user.id;
        
        if( !userId )
            return createServerResponse( false, StatusCodes.UNAUTHORIZED, null, "No se encuentra logueado para realizar esta acción." );
        
        if( !transactionId )
            return createServerResponse( false, StatusCodes.BAD_REQUEST, null, "No se proporsionó un id de transaccion" );

        const order: Order | null = await prisma.order.findFirst( { where: { transactionId: transactionId } } );

        if( ! order) 
            return createServerResponse( false, StatusCodes.NOT_FOUND, null, "No existe en sistema una orden asociada a tal transacción." );

        if( order.userId != userId && !(session.user.roles?.includes('admin')) ) {
            console.log(`DANGER:AccionPeligrosa: el usuario ${userId} ha intentado modificar el estado de una orden ajena a pago.`)
            return createServerResponse(  false, StatusCodes.FORBIDDEN, null, "No esta autorizado a realizar esta acción.");
        }
        sleep(5000);

        try {
            const result:PaypalOrderDetails = await withRetry<PaypalOrderDetails>( async () => { return paypalClient.getOrderDetails(order.transactionId!) } );
            console.log(result);
            if( result.status == 'APPROVED' || result.status == 'COMPLETED') {
                const { purchase_units } = result;
                const { invoice_id: orderId } = purchase_units[0];
                await prisma.order.update( {
                    where: { id: orderId },
                    data: { isPaid: true }
                } );
                revalidatePath(`/orders/${orderId}`);
                return createServerResponse( true, StatusCodes.OK, true, "Se ha verificado el pago. El pago fue aprobado. Orden Actualizada" );
            } else {
                return createServerResponse( true, StatusCodes.OK, false, `El pago se ha consultado y no se encuentra aprobado. Esta en estado ${result.status}`);
            }
        } catch (error) {
            console.error(`ERROR:Ha ocurrido un error al tratar de verificar el pago ${error}`);
            return createServerResponse( false, StatusCodes.INTERNAL_SERVER_ERROR, null, "Ha ocurrido un error al tratar de verificar el pago." )
        }
}