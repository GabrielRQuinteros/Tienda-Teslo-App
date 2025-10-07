import { Prisma, PrismaClient } from "@/generated/prisma";
import { initialData } from "@/seed/seed";
import prisma from '@/lib/prisma/prisma'

const productData: Prisma.ProductCreateInput[] = initialData.products.map(
  (product) => ({
    title: product.title,
    description: product.description,
    inStock: product.inStock,
    price: product.price,
    sizes: product.sizes,
    slug: product.slug,
    tags: product.tags,
    gender: product.gender,
    type: product.type,
    category: {
      connectOrCreate: {
        where: { name: product.type },
        create: { name: product.type },
      },
    },
    images: { create: product.images.map((image) => ({ url: image })) },
  })
);

export async function main() {
    if( process.env.NODE_ENV === 'production' )
        return;

    try{
        await prisma.productImage.deleteMany();
        await prisma.product.deleteMany();
        await prisma.category.deleteMany();
    }catch( e ) {
        console.log({e});
    }

    for (const u of productData) {
        await prisma.product.create({ data: u });
    }
}

main();
