'use server';
import { Category } from "@/components";
import { createServerResponse } from "@/helpers";
import prisma from "@/lib/prisma/prisma";
import { StatusCodes } from "http-status-codes";

export async function getCategories() {
  try {
    const categories= await prisma.category.findMany();
    const categoriesResponse: Category[] = categories.map( c => ({ id: c.id, name: c.name } as Category)  );
    return createServerResponse( true, StatusCodes.OK, categoriesResponse, null );
} catch (error) {
    console.error(error);
    return createServerResponse( false, StatusCodes.INTERNAL_SERVER_ERROR, null, "Se ha producido un error en el servidor. Contacte al administrador" );
  }
}