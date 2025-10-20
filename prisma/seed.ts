import { Prisma, Role, User } from "@/generated/prisma";
import { initialData } from "@/seed/seed";
import prisma from '@/lib/prisma/prisma'
import bcrypt from 'bcrypt';

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
  }));




export async function main() {
    if( process.env.NODE_ENV === 'production' )
        return;

      try{
        await prisma.productImage.deleteMany();
        await prisma.product.deleteMany();
        await prisma.category.deleteMany();
        await prisma.user.deleteMany();
        await prisma.country.deleteMany();
      }catch( e ) {
        console.log({e});
      }
      
      for (const u of productData) {
        await prisma.product.create({ data: u });
      }
      const users = await Promise.all( initialData.users.map(async (user) => ({...user,password: await bcrypt.hash(user.password!, 10),})));
      const usersData: Prisma.UserCreateInput[] = users.map(
        userData => (
          {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            roles: userData.roles.map((r: string) => r as Role),
          } as User
        )
      );
      for (const u of usersData) {
        await prisma.user.create({ data: u });
      }
      const countriesData: Prisma.CountryCreateInput[] =  initialData.countries.map(
        country => ({
          id: country.id,
          name: country.name
        })
      );
      
      await prisma.country.createMany({
        data: countriesData,
        skipDuplicates: true,
      });
}

main();
