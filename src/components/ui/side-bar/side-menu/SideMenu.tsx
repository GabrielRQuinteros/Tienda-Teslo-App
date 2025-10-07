import { IoLogInOutline, IoLogOutOutline, IoPeopleOutline, IoPersonOutline, IoShirtOutline, IoTicketOutline } from "react-icons/io5"
import { MenuItem } from "./menu-item/MenuItem"


interface MenuItemData {
    order: number,
    label: string,
    icon?: React.ReactNode,
    href: string
}

const menuItems1: MenuItemData[] = [
    { order: 1, label: 'Perfil', href: "/profile", icon: <IoPersonOutline size={30}/>},
    { order: 2, label: 'Ordenes', href: "/orders", icon: <IoTicketOutline size={30}/>},
    { order: 3, label: 'Ingresar', href: "/auth/login", icon: <IoLogInOutline size={30}/>},
    { order: 4, label: 'Salir', href: "/auth/logout",  icon: <IoLogOutOutline size={30}/>},    
]
const menuItems2: MenuItemData[] = [
    { order: 5, label: 'Productos', href: "/products-admin", icon: <IoShirtOutline size={30}/>},
    { order: 6, label: 'Todas las Ordenes', href: "/orders-admin", icon: <IoTicketOutline size={30}/>},
    { order: 7, label: 'Usuarios', href: "/users-admin", icon: <IoPeopleOutline size={30}/>},
]

export const SideMenu = () => {
  return (
    <>
        {/* Menu Items */}
        { menuItems1.map( item => <MenuItem key={item.order} label={item.label} href={item.href} icon={ item.icon } /> )}  
        {/* Line Separator */}
        <div className="w-full h-px bg-gray-200 my-10"></div>
        { menuItems2.map( item => <MenuItem key={item.order} label={item.label} href={item.href} icon={ item.icon } /> )} 
    </>


  )
}
