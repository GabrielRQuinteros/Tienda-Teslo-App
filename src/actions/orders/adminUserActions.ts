'use server';

import { getServerSession } from "next-auth";
import { authConfig } from "@/auth.config";
import { StatusCodes } from "http-status-codes";
import { calculatePagination, createServerResponse, DEFAULT_PAGE_SIZE } from "@/helpers";
import { UserResume } from './interfaces/interfases';
import { Prisma, Role, User } from "@/generated/prisma";
import { UserFilters } from "@/components";
import prisma from "@/lib/prisma/prisma";

export async function getPaginatedUsers(page: number = 0, userFilters: UserFilters = {}) {
  const session = await getServerSession(authConfig);
  const sessionUserId = session?.user.id;

  if (!sessionUserId) {
    return createServerResponse(
      false,
      StatusCodes.UNAUTHORIZED,
      null,
      "No se encuentra logeado para realizar esta acción."
    );
  }

  if (!session.user.roles!.includes("admin")) {
    return createServerResponse(
      false,
      StatusCodes.FORBIDDEN,
      null,
      "Usted no tiene permisos para realizar esta acción."
    );
  }

  try {
    const where = await buildUserWhere(userFilters);

    const totalItems = await prisma.user.count({ where });
    const pagination = calculatePagination(totalItems, page, DEFAULT_PAGE_SIZE);

    const users: Partial<User>[] = await prisma.user.findMany({
      where,
      skip: (pagination.currentPage - 1) * pagination.pageSize,
      take: pagination.pageSize,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        roles: true,
      },
    });

    const resumedUsers: UserResume[] = users.map((user) => ({
      id: user.id ?? "",
      name: user.name ?? "",
      email: user.email ?? "",
      roles: user.roles ?? [],
      isActive: user.isActive ?? false,
    }));

    const paginatedUsers = {
      data: resumedUsers,
      totalItems,
      totalPages: pagination.totalPages,
      currentPage: pagination.currentPage,
      pageSize: pagination.pageSize,
      hasNext: pagination.hasNext,
      hasPrev: pagination.hasPrev,
    };

    return createServerResponse(true, StatusCodes.OK, paginatedUsers, null);
  } catch (error) {
    console.error(
      "Error:Ha ocurrido un error al tratar de obtener los usuarios paginados en administración:",
      error
    );
    return createServerResponse(
      false,
      StatusCodes.INTERNAL_SERVER_ERROR,
      null,
      "Ha ocurrido un error. Por favor, contacte con el administrador."
    );
  }
}

export async function buildUserWhere(filters: UserFilters): Promise<Prisma.UserWhereInput> {
  const where: Prisma.UserWhereInput = {};

  if (filters.id && filters.id.trim() !== "") {
    where.id = {
      contains: filters.id.trim(),
      mode: "insensitive",
    };
  }

  if (filters.name && filters.name.trim() !== "") {
    where.name = {
      contains: filters.name.trim(),
      mode: "insensitive",
    };
  }

  if (filters.email && filters.email.trim() !== "") {
    where.email = {
      contains: filters.email.trim(),
      mode: "insensitive",
    };
  }

  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive;
  }

  if (filters.roles && filters.roles.length > 0) {
    where.roles = {
      hasSome: filters.roles.map( rolString => roleFromString(rolString)).filter(role => role != undefined),
    };
  }

  return where;
}


const roleFromString = (value: string): Role | undefined => {
  if (Object.values(Role).includes(value as Role)) {
    return value as Role;
  }
  return undefined; // undefined en caso de rol desconocido.
};



export async function getUserAdmin ( id: string ) {

  const session = await getServerSession(authConfig);
  const sessionUserId = session?.user.id;

  if (!sessionUserId) {
    return createServerResponse(
      false,
      StatusCodes.UNAUTHORIZED,
      null,
      "No se encuentra logeado para realizar esta acción."
    );
  }

  if (!session.user.roles!.includes("admin")) {
    return createServerResponse(
      false,
      StatusCodes.FORBIDDEN,
      null,
      "Usted no tiene permisos para realizar esta acción."
    );
  }

  const user = await prisma.user.findUnique( {
    where: {
      id
    },
    select: {
      id: true,
      email: true,
      name: true,
      isActive: true,
      roles: true,
      image: true
    }
  } );

  if( !user )
    return createServerResponse( false, StatusCodes.NOT_FOUND, null, "No se encontro el usuario en sistema" );
  const resumedUser: UserResume = { ...user, email: user.email!, name: user.name!, image: user.image ? user.image : undefined };
  return createServerResponse( true, StatusCodes.OK, resumedUser, "Usuario encontrado" );
}



export async function updateUserAdmin ( id: string, userEdited: UserResume ) {

  const session = await getServerSession(authConfig);
  const sessionUserId = session?.user.id;
  if (!sessionUserId) {
    return createServerResponse(
      false,
      StatusCodes.UNAUTHORIZED,
      null,
      "No se encuentra logeado para realizar esta acción."
    );
  }

  if (!session.user.roles!.includes("admin")) {
    return createServerResponse(
      false,
      StatusCodes.FORBIDDEN,
      null,
      "Usted no tiene permisos para realizar esta acción."
    );
  }

  try {
    const user = await prisma.user.update( {
    where: {
      id: id
    },
    data: {
        name: userEdited.name,
        email: userEdited.email,
        isActive: userEdited.isActive,
        roles: (userEdited.roles.includes('admin')? ['admin', 'user']:['user']) as Role[]
    }
  });
  if( ! user ) 
    return createServerResponse( false, StatusCodes.NOT_FOUND, null, "El usuario buscado no existe en sistema" );

  const userResumedUpdated: UserResume= { id: user.id, email: user.email!, isActive: user.isActive, name: user.name!, roles: user.roles.map( rol => rol.toString() ) };
  return createServerResponse( true, StatusCodes.OK, userResumedUpdated, "Usuario actualizado correctamente" );
  } catch (error) {
    console.log(error);
    return createServerResponse( false, StatusCodes.INTERNAL_SERVER_ERROR, null, "Error interno del sistema. Contacte al administrador" );
  }
}
