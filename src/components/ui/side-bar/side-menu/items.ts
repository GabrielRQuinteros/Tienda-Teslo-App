import { signOut } from "next-auth/react";
import React from "react";
import { IoPersonOutline, IoTicketOutline, IoLogInOutline, IoLogOutOutline, IoShirtOutline, IoPeopleOutline } from "react-icons/io5";

export interface MenuItemData {
    order: number,
    label: string,
    icon?: React.ReactNode,
    href: string,
    aditionalActions?: () => Promise<void>,
}

const logoutAction = async () => {
  try {
    //! CUIDADO => POR DEFECTO ESTO REDIRIGE ALA RAIZ SI NO SE LE PONE EL REDIRECT FALSE, Y REDIRIGE A LA RAIZ
      await signOut( {
        redirect: false
      } );
  } catch (error) {
    console.log(error)
  }
}

export const menuItems1: MenuItemData[] = [
    { order: 1, label: 'Perfil', href: "/profile", icon: React.createElement(IoPersonOutline, { size: 30 })},
    { order: 2, label: 'Ordenes', href: "/orders", icon: React.createElement(IoTicketOutline, { size: 30 })},
    { order: 3, label: 'Ingresar', href: "/auth/login", icon: React.createElement(IoLogInOutline, { size: 30 })},
    { order: 4, label: 'Salir', href: "/auth/logout",  icon: React.createElement(IoLogOutOutline, { size: 30 }), aditionalActions: logoutAction},    
]
export const menuItems2: MenuItemData[] = [
    { order: 5, label: 'Productos', href: "/products-admin", icon: React.createElement(IoShirtOutline, { size: 30 })},
    { order: 6, label: 'Todas las Ordenes', href: "/orders-admin", icon: React.createElement(IoTicketOutline, { size: 30 })},
    { order: 7, label: 'Usuarios', href: "/users-admin", icon: React.createElement(IoPeopleOutline, { size: 30 })},
]