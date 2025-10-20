'use server';

import { Address, createServerResponse } from "@/helpers";
import prisma from "@/lib/prisma/prisma";
import { StatusCodes } from "http-status-codes";

export async function saveUserAddress( newAddress:Address, userId: string ) {
  
    try {
    const user = await prisma.user.findFirst( {
        where: {
            id: userId
        }
    } );

    if( !user )
        return createServerResponse( false, StatusCodes.BAD_REQUEST, null, "El usuario indicado no existe." );

    const currentUserAddress = await prisma.userAddress.findFirst( {
        where: {
            user: {
                id: userId
            }
        }
    } );

    let newUserAddress = undefined;
     if (!currentUserAddress) {
      // Crear nueva dirección Y vincularla al usuario
      newUserAddress = await prisma.userAddress.create({
        data: {
          firstname: newAddress.firstname,
          lastname: newAddress.lastname,
          address1: newAddress.address1,
          address2: newAddress.address2,
          city: newAddress.city,
          phone: newAddress.phone,
          zipCode: newAddress.zipCode,
          countryId: newAddress.country,
          user: {
            connect: { id: userId }
          }
        }
      });
    } else {
      // Actualizar dirección existente
      newUserAddress = await prisma.userAddress.update({
        where: {
          id: currentUserAddress.id
        },
        data: {
          firstname: newAddress.firstname,
          lastname: newAddress.lastname,
          address1: newAddress.address1,
          address2: newAddress.address2,
          city: newAddress.city,
          phone: newAddress.phone,
          zipCode: newAddress.zipCode,
          countryId: newAddress.country,
        }
      });
    }
    const addressResponse: Address = { ...newUserAddress, country: newUserAddress.countryId };
    return createServerResponse( true, StatusCodes.OK, addressResponse, null );
  } catch (error) {
    return createServerResponse( false, StatusCodes.INTERNAL_SERVER_ERROR, null, "Ha ocurrido un error inesperado. Porfavor, comuníquese con el administrador." );
  }
}



export async function deleteUserAddress( userId: string ) {
    try {
        const user = await prisma.user.findFirst( {
            where: {
                id: userId
            }
        } );
    if( !user )
        return createServerResponse( false, StatusCodes.BAD_REQUEST, null, "El usuario indicado no existe." );

    const address = await prisma.userAddress.findFirst({ where: { id: user.userAddressId! } });
    if (address) {
        await prisma.userAddress.delete({ where: { id: address.id } });
    }
    return createServerResponse(true, StatusCodes.NO_CONTENT, null, null);
    } catch (error) {
        console.log(error)
        return createServerResponse( false, StatusCodes.INTERNAL_SERVER_ERROR, null, "Ha ocurrido un error inesperado. Porfavor, comuníquese con el administrador." )
    }
}

export async function getUserAddress( userId: string ) {

  if( !userId ) {
    return createServerResponse(false, StatusCodes.BAD_REQUEST, null, "No se suministro el identificador del usuario");
  }
  const userSearch = await prisma.user.findFirst( { where: { id: userId }, select: { userAddressId: true } } );

  if(! userSearch)
    return createServerResponse( false, StatusCodes.BAD_REQUEST, null, "El usuario ingresado no existe" );
  
  console.log(userSearch);

  if( ! userSearch.userAddressId )
    return createServerResponse( true, StatusCodes.OK, null, "El usuario no posee una direccion de usuario guardada");
  
  const userAddress = await prisma.userAddress.findFirst( 
    { 
      where: { id: userSearch.userAddressId },
      include: { country: true },
    }
    )

  return createServerResponse( true, StatusCodes.OK, userAddress, null );
}

export interface CountryResponse {
  id: string;
  name: string;
}

export interface UserAddressResponse {
  id: string;
  firstname: string;
  lastname: string;
  address1: string;
  address2: string | null;
  zipCode: string;
  city: string;
  phone: string;
  countryId: string;
  country: CountryResponse;
}