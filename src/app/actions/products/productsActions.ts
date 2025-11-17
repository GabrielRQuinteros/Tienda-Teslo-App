'use server';

import { Product, ProductFilters, ProductWithImages, Types } from "@/components";
import { Prisma } from "@/generated/prisma";
import { calculatePagination, createServerResponse, DEFAULT_PAGE_SIZE, PaginatedResponse } from "@/helpers";
import prisma from "@/lib/prisma/prisma";
import { StatusCodes } from "http-status-codes";
import { FullImage } from '../../../components/interfaces/product.interface';

export async function getPaginatedProductsWithImages(
  page: number,
  filters: ProductFilters = {}
) {
  try {
    // Construir where dinámico
    const where = await buildProductWhere(filters);

    // Total filtrado
    const totalItems = await prisma.product.count({ where });

    // Calcular metadata de paginación
    const pagination = calculatePagination(totalItems, page, DEFAULT_PAGE_SIZE);

    // Query paginada con filtros
    const products = await prisma.product.findMany({
      where,
      skip: (pagination.currentPage - 1) * pagination.pageSize,
      take: pagination.pageSize,
      include: {
        images: {
          take: 2,
          select: { url: true }
        }
      }
    });

    // Adaptar para frontend
    const productsFront: Product[] = products.map(
      (prod) => ({
        ...prod,
        images: prod.images.map((img) => img.url)
      } as Product)
    );

    // Respuesta estándar
    const response: PaginatedResponse<Product> = {
      data: productsFront,
      ...pagination
    };

    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Error al buscar los productos");
  }
}


export async function buildProductWhere(filters: ProductFilters): Promise<Prisma.ProductWhereInput>{
  const where: Prisma.ProductWhereInput = {};

  if (filters.gender) {
    where.gender = filters.gender;
  }

  if (filters.type) {
    where.type = filters.type;
  }

  if (filters.sizes && filters.sizes.length > 0) {
    where.sizes = {
      hasSome: filters.sizes
    };
  }

  if (filters.minPrice || filters.maxPrice) {
    where.price = {};
    if (filters.minPrice !== undefined) {
      where.price.gte = filters.minPrice;
    }
    if (filters.maxPrice !== undefined) {
      where.price.lte = filters.maxPrice;
    }
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { tags: { has: filters.search.toLowerCase() } }
    ];
  }

  if (filters.tags && filters.tags.length > 0) {
    where.tags = {
      hasSome: filters.tags.map((t) => t.toLowerCase())
    };
  }
  return where;
}



export const getProductBySlug = async (slug: string): Promise<Product | null> => {

  try {
    const product = await prisma.product.findFirst({
      where: {
        slug: slug
      },
      include: {
        images: {
          select: { url: true }
        }
      }
    });

    if (!product) return null;

    const productFront: Product = {
      ...product,
      description: product.description ?? "",
      images: product.images.map((img) => img.url),
      gender: product.gender,
      type: product.type as Types
    };
    return productFront;
  } catch (error) {
    console.log("Error al buscar producto por slug");
    return null;
  }

}


export const getStockAction = async (slug: string): Promise<number | null> => {

  try {
    const product = await prisma.product.findFirst({
      where: { slug: slug },
      select: { inStock: true }
    });

    if (!product) return null;
    return product.inStock;
  } catch (error) {
    console.log("Error al buscar producto por slug");
    return null;
  }
}

export const getProductById = async (id: string) => {

  try {
    const product = await prisma.product.findFirst({
      where: { id: id },
      include: {
        images: {
          select: {
            id: true,
            url: true,
          }
        }
      }
    });

    if (!product)
      return createServerResponse(false, StatusCodes.NOT_FOUND, null, "El producto no fue encontrado.");

    const productFront: ProductWithImages = {
      ...product,
      description: product.description ?? "",
      images: product.images.map(  img => ({ id: String(img.id), url: img.url } as FullImage) ),
      gender: product.gender,
      type: product.type as Types
    };
    return createServerResponse(true, StatusCodes.OK,productFront, "Producto encontrado" );
  } catch (error) {
    console.log(error)   
    return createServerResponse(false, StatusCodes.INTERNAL_SERVER_ERROR, null, "Ha ocurrido un error en el servidor. Porfavor, comuniquese con el administrador.");
  }
}