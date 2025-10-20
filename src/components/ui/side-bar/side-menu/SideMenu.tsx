'use client';

import { MenuItem } from "./menu-item/MenuItem"
import { menuItems1, menuItems2 } from './items';
import { useSession } from "next-auth/react";


export const SideMenu = () => {

  const { data: session, status }= useSession();
  let menuItemsN1 = menuItems1;
  const menuItemsN2 = menuItems2;
  const isAuthenticated = Boolean(session?.user);

  if( !isAuthenticated ) {
    menuItemsN1= menuItems1.filter( items => items.label == 'Ingresar');
  } else {
    menuItemsN1= menuItems1.filter( items => items.label != 'Ingresar');
  }

  const isAdmin= session?.user.roles?.some( rol => rol === 'admin' );

  return (
    <>
        {/* Menu Items */}
        { menuItemsN1.map( item => <MenuItem key={item.order} label={item.label} href={item.href} icon={ item.icon } aditionalAction={item.aditionalActions} /> )}  
        {/* Line Separator */}
        {
          isAdmin && (
            <>
              <div className="w-full h-px bg-gray-200 my-10"></div>
              { menuItemsN2.map( item => <MenuItem key={item.order} label={item.label} href={item.href} icon={ item.icon } aditionalAction={item.aditionalActions} /> )} 
            </>
          )
        }
    </>


  )
}
