'use server'
import { Country } from "@/helpers";
import prisma from "@/lib/prisma/prisma";

export async function getAllCountries(): Promise<Country[]>{
  try {
    const countriesFromDB = await prisma.country.findMany();
    return countriesFromDB.map( cdb => ({ id: cdb.id, name: cdb.name } as Country) )
  } catch (error) {
    console.log(error);
    throw Error('Ha ocurrido un error al intentar obtener los paises');
  }
}