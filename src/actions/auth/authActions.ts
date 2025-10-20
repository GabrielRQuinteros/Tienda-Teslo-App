"use server";

import { Role } from "@/generated/prisma";
import { createServerResponse, UserFront } from "@/helpers";
import prisma from "@/lib/prisma/prisma";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";

export const registerUser = async ( fullname: string, email: string, password: string) => {
  
  try {
    const userInBD = await prisma.user.findFirst({ where: { email: email },});

    if (userInBD)
      return createServerResponse( false, StatusCodes.CONFLICT, null, "El email ya se encuentra registrado.");

    const encriptedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: fullname,
        email: email,
        password: encriptedPassword,
        roles: ["user" as Role],
      },
    });
    const userResponse: UserFront = { ...user, password: undefined, roles: user.roles.map((role) => role.toString()),
    };

    return createServerResponse<UserFront>( true, StatusCodes.CREATED, userResponse, null );
  } catch (error) {
    console.log(error);
    return createServerResponse( false, StatusCodes.INTERNAL_SERVER_ERROR, null, "Ups, ha ocurrido un error inesperado" );
  }
};
