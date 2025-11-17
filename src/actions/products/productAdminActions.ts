'use server';

import { authConfig } from "@/auth.config";
import { Gender, Prisma } from '@/generated/prisma';
import { calculatePagination, createServerResponse, DEFAULT_PAGE_SIZE, PaginatedResponse } from "@/helpers";
import prisma from "@/lib/prisma/prisma";
import { StatusCodes } from "http-status-codes";
import { getServerSession } from "next-auth";
import { ProductFilter, ProductResume, ProductImageUploaded } from './interfaces/interface';
import {z} from 'zod'
import cloudinaryClient from "@/helpers/integrations/client/CloudinaryClient";
/** Devuelve un listado de productos paginado y filtrado por los valores del Filtro
 * @param page 
 * @param filters 
 * @returns 
 */
export async function getPaginatedProducts(page: number = 0, filters: ProductFilter = {}) {
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
    const where = await buildProductWhere(filters);

    const totalItems = await prisma.product.count({ where });
    const pagination = calculatePagination(totalItems, page, DEFAULT_PAGE_SIZE);

    const products = await prisma.product.findMany({
      where,
      skip: (pagination.currentPage - 1) * pagination.pageSize,
      take: pagination.pageSize,
      select: {
        id: true,
        gender: true,
        price: true,
        sizes: true,
        inStock: true,
        slug: true,
        title: true,
        images: {
          select: {
            id: true,
            url: true
          }
        }
      }
    });

    const productResume: ProductResume[] = products.map(product => ({
      id: product.id,
      title: product.title,
      inStock: product.inStock,
      price: product.price,
      sizes: product.sizes.map( size => size.toString() ),
      gender: product.gender.toString(),
      images: product.images.map(img => ({
        id: img.id.toString(),
        url: img.url
      }))
    }));

    const paginatedProducts: PaginatedResponse<ProductResume> = {
      data: productResume,
      totalItems,
      totalPages: pagination.totalPages,
      currentPage: pagination.currentPage,
      pageSize: pagination.pageSize,
      hasNext: pagination.hasNext,
      hasPrev: pagination.hasPrev,
    };

    return createServerResponse(true, StatusCodes.OK, paginatedProducts, null);
  } catch (error) {
    console.error("Error al obtener productos paginados:", error);
    return createServerResponse(
      false,
      StatusCodes.INTERNAL_SERVER_ERROR,
      null,
      "Ha ocurrido un error al obtener los productos. Por favor contacte con el administrador."
    );
  }
}

/** Construye el where a partir de los valores del Filtro de Producto
 * @param filters 
 * @returns 
 */
export async function buildProductWhere(filters: ProductFilter): Promise<Prisma.ProductWhereInput> {
  const where: Prisma.ProductWhereInput = {};

  if (filters.id) {
    where.id = {
      contains: filters.id,
      mode: "insensitive",
    };
  }

  if (filters.slug) {
    where.slug = {
      contains: filters.slug,
      mode: "insensitive",
    };
  }

  if (filters.title) {
    where.title = {
      contains: filters.title,
      mode: "insensitive",
    };
  }

  if (filters.gender) {
    where.gender = {
      equals: (filters.gender as Gender ),
    };
  }

  if (filters.sizes && filters.sizes.length > 0) {
    where.sizes = {
      hasSome: filters.sizes as Prisma.EnumSizeNullableListFilter["hasSome"],
    };
  }

  return where;
}




const normalizeSlug = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")      // reemplaza espacios por guiones
    .replace(/[^a-z0-9-]/g, "") // elimina caracteres inválidos
    .replace(/-+/g, "_");       // evita guiones duplicados
};

const productSchema = z.object({
  id: z.uuid().optional().nullable(),
  title: z.string().min(3).max(255),
  slug: z
    .string()
    .min(3)
    .max(255)
    .transform(normalizeSlug),

  description: z.string(),
  price: z.coerce.number().min(0).transform(val => Number(val.toFixed(2))),
  inStock: z.coerce.number().min(0).transform(val => Number(val.toFixed(0))),
  category: z.string().nonempty(),
  sizes: z.coerce.string().transform(val => JSON.parse(val)),
  tags: z.string(),
  gender: z.enum(Gender),
});

/** Crea o Actualiza un producto en la BD
 * @param formData 
 * @returns 
 */
export async function createUpdateProduct(formData: FormData) {
  const session = await getServerSession(authConfig);
  const sessionUserId = session?.user.id;

  if (!sessionUserId) {
    return createServerResponse(false, StatusCodes.UNAUTHORIZED, null, "No se encuentra logeado.");
  }

  if (!session.user.roles!.includes("admin")) {
    return createServerResponse(false, StatusCodes.FORBIDDEN, null, "Sin permisos.");
  }

  const data = Object.fromEntries(formData);
  const parsed = productSchema.safeParse(data);

  if (!parsed.success) {
    return createServerResponse(false, StatusCodes.BAD_REQUEST, null, parsed.error.message);
  }

  const product = parsed.data;
  const { id, title, slug, description, price, tags, gender, inStock, category, sizes } = product;
  const images = formData.getAll("images") as File[];

  if(images.length <= 0 ) {
    return createServerResponse(false, StatusCodes.BAD_REQUEST, null, "El producto debe tener al menos una imagen");
  }
  for (const file of images) {
    if (file.size > 5 * 1024 * 1024) {
      return createServerResponse(false, StatusCodes.BAD_REQUEST, null, `La imagen ${file.name} es demasiado grande. Máximo de peso 5MB`);
    }
    if (!file.type.startsWith("image/")) {
      return createServerResponse(false, StatusCodes.BAD_REQUEST, null, `Archivo inválido: ${file.name}`);
    }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1) Buscar o crear categoría dentro de la misma transacción
      let categoryDB = await tx.category.findUnique({
        where: { name: category },
      });

      if (!categoryDB) {
        categoryDB = await tx.category.create({
          data: { name: category },
        });
      }

      // 2) Crear producto
      if (!id) {
        const product= await tx.product.create({
          data: {
            slug,
            gender: gender as Gender,
            title,
            description,
            inStock,
            price,
            sizes,
            tags: Array.isArray(tags) ? tags : [tags],
            category: { connect: { id: categoryDB.id } },
            type: category,
          },
        });

        const imagesUploaded = await uploadImages( images, product.id );

        // Persist uploaded images linking to the created product using the transaction client
        await tx.productImage.createMany({
          data: imagesUploaded.map(imgUp => ({
            url: imgUp.url,
            publicId: imgUp.publicId,
            productId: product.id
          }))
        });
        return product;
      }

      // 3) Actualizar producto
      const productInDB = await tx.product.findUnique( { where: {id }, include: {images: true } } );

      if( !productInDB ) {
        throw Error( "Producto no encontrado" );
      }

      const imagesToBeDeleted = productInDB.images;
      await deleteImagesFromCloudinary( imagesToBeDeleted.map( i => i.publicId ) );
      await tx.productImage.deleteMany( { where: { id: { in: imagesToBeDeleted.map( i => i.id ) } } } );

      const imagesUploaded = await uploadImages( images, productInDB.id );
      
      await tx.productImage.createMany({
          data: imagesUploaded.map(imgUp => ({
            url: imgUp.url,
            publicId: imgUp.publicId,
            productId: productInDB.id
          }))
      });

      const updatedProduct =  await tx.product.update({
        where: { id },
        data: {
          slug,
          gender: gender as Gender,
          title,
          description,
          inStock,
          price,
          sizes,
          tags: Array.isArray(tags) ? tags : [tags],
          category: { connect: { id: categoryDB.id } },
          type: category,
        },
      });
      return updatedProduct;
    });

    return createServerResponse(
      true,
      id ? StatusCodes.OK : StatusCodes.CREATED,
      result.id,
      id ? "Producto actualizado correctamente." : "Producto creado correctamente."
    );

  } catch (error) {
    console.error(error);
    return createServerResponse(
      false,
      StatusCodes.INTERNAL_SERVER_ERROR,
      null,
      "Ocurrió un error durante la transacción."
    );
  }
}

/** Sube las imagenes a Cloudinary 
 * @param files 
 */
const uploadImages = async( images: File[], productId: string ): Promise<ProductImageUploaded[]> => {
  const uploaded = await Promise.all( images.map((file) => cloudinaryClient.uploadImage(file, `products/${productId ?? "temp"}`)) );
  return uploaded.map( upImg => ({ publicId: upImg.publicId, url: upImg.url } as ProductImageUploaded) );
}

/** Elimina las imagenes de Cloudinary
 * @param publicIds 
 */
const deleteImagesFromCloudinary = async( publicIds: string[] ) => {
  for (const publicId of publicIds) {
    if( !publicId || publicId != "")
      await cloudinaryClient.deleteImage(publicId);
  }
}