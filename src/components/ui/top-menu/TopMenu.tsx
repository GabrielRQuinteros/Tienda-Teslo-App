'use client';
import { useUIStore } from "@/components/store/store";
import { montserAlt } from "@/config/fonts"
import Link from "next/link"
import { IoCartOutline, IoSearchOutline } from "react-icons/io5"


export const TopMenu = () => {

  const { openSideMenu, closeSideMenu, isSideMenuOpen } = useUIStore( (state) => state);

  const onToggleMenu = ( __: React.MouseEvent<HTMLButtonElement>) => {
    if( isSideMenuOpen )
        closeSideMenu();
    else
        openSideMenu();
  }


  return (
    <nav className="flex px-5 justify-between items-center w-full">

        {/* Logo */}
        <div>
            <Link
                href="/"
                >
                <span className={`${montserAlt.className} antialiased font-bold`}>Teslo</span>
                <span > | Shop</span>
            </Link>
        </div>

        {/* Center menu */}
        <div className="hidden sm:flex gap-1">
            <Link className="mt-2 p-2 rounded-md transition-all duration-200 hover:bg-gray-100 font-semibold"
                    href="/gender/men"
                    >
                    Hombres
            </Link>
            <Link className="mt-2 p-2 rounded-md transition-all duration-200 hover:bg-gray-100 font-semibold"
                    href="/gender/women"
                    >
                    Mujeres
            </Link>
            <Link className="mt-2 p-2 rounded-md transition-all duration-200 hover:bg-gray-100 font-semibold"
                    href="/gender/kids"
                    >
                    Niños
            </Link>
        </div>
        
        {/* Search, Cart, Menu */}
        <div className="flex items-center gap-4">
            <Link href="/search">
                <IoSearchOutline size={20} />
            </Link>
            <Link href="/cart">
                <div className="relative">
                    <span className="absolute -right-2 -top-2 text-xs rounded-full px-1 font-bold  bg-blue-700 text-white " >3</span>
                    <IoCartOutline size={20} />
                </div>
            </Link>

            <button className="m-2 p-2 rounded-md transition-all duration-200 hover:bg-gray-100"
                    onClick={ onToggleMenu }
                    >
                Menú
            </button>
        </div>


    </nav>
  )
}
