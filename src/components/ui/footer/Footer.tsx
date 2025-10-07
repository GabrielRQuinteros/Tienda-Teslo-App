import { montserAlt } from "@/config/fonts"
import Link from "next/link"

export const Footer = () => {
  return (
    <footer className="flex w-full justify-center mt-auto text-xs bg-gray-200 h-[100px] items-center">
        <Link href={"/"} >
            <span className={ `${montserAlt.className} antialiased font-bold` } >Teslo</span>
            <span> | Shop</span>
            <span> &copy;  2025</span>
        </Link>
        <Link   href={'/'}
                className="mx-3 underline"
                >
                Privacidad & Legalidad
        </Link>
    </footer>
  )
}
