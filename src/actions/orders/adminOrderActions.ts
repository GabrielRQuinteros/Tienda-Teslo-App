'use server'

import { authConfig } from "@/auth.config";
import { OrderFilters } from "@/components";
import { Prisma } from "@/generated/prisma";
import { calculatePagination, createServerResponse, DEFAULT_PAGE_SIZE, PaginatedResponse } from "@/helpers";
import prisma from "@/lib/prisma/prisma"
import { StatusCodes } from "http-status-codes";
import { getServerSession } from "next-auth";
import { OrderResume } from "./interfaces/interfases";

export async function getPaginatedOrders( page: number = 0, orderFilters: OrderFilters={}  ) {
  
    const session = await getServerSession( authConfig );
    const sessionUserId = session?.user.id;
    if( !sessionUserId )
        return createServerResponse( false, StatusCodes.UNAUTHORIZED, null, "No se encuentra logeado para realizar esta acción." );

    if( !session.user.roles!.includes('admin') ) {
        return createServerResponse( false, StatusCodes.FORBIDDEN, null, "Usted no tiene permisos para realizar esta acción." );
    }

    try {
        const where = await buildOrderWhere(orderFilters);
        const totalItems = await prisma.order.count({ where });
        const pagination = calculatePagination(totalItems, page, DEFAULT_PAGE_SIZE);
        const orders = await prisma.order.findMany({
          where,
          skip: (pagination.currentPage - 1) * pagination.pageSize,
          take: pagination.pageSize,
          orderBy: { createdAt: "desc" },
          include: {
            user: true,
            OrderItem: true,
            OrderAddress: true,
          },
        });

        const resumedOrders= orders.map( order => ( { id: order.id, firstName: order.OrderAddress?.firstName, lastName: order.OrderAddress?.lastName, isPaid: order.isPaid } as OrderResume ) )

        const paginatedOrders: PaginatedResponse<OrderResume> = {
          data: resumedOrders,
          totalItems,
          totalPages: pagination.totalPages,
          currentPage: pagination.currentPage,
          pageSize: pagination.pageSize,
          hasNext: pagination.hasNext,
          hasPrev: pagination.hasPrev
        };
        return createServerResponse( true, StatusCodes.OK, paginatedOrders, null );

  } catch (error) {
    console.log(`Error:Alerta:Ha ocurrido un error al tratar de obtener las ordenes paginadas en administración:error` );
    return createServerResponse(false, StatusCodes.INTERNAL_SERVER_ERROR, null, "Ha ocurrido un error. Porfavor, contacte con el administrador.");
  }
}

export async function buildOrderWhere( filters: OrderFilters ): Promise<Prisma.OrderWhereInput> {
  const where: Prisma.OrderWhereInput = {};

  if (filters.amount !== undefined && filters.amount !== null) {
    where.total = filters.amount;
  } else if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
    where.total = {};
    if (filters.minAmount !== undefined) {
      (where.total as Prisma.FloatFilter).gte = filters.minAmount;
    }
    if (filters.maxAmount !== undefined) {
      (where.total as Prisma.FloatFilter).lte = filters.maxAmount;
    }
  }

  if (filters.orderId) {
    where.id = {
      contains: filters.orderId,
      mode: "insensitive",
    };
  }

  if (filters.userId) {
    where.userId = filters.userId;
  }

  if (filters.date instanceof Date && !isNaN(filters.date.getTime())) {
    const start = new Date(filters.date);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(filters.date);
    end.setUTCHours(23, 59, 59, 999);

    where.createdAt = {
      gte: start,
      lte: end,
    };
  }

  if( filters.isPaid !== undefined ) {
    where.isPaid = filters.isPaid
  }
  
  return where;
}