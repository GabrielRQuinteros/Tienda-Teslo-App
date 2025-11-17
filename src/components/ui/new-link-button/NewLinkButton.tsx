import Link from "next/link"
import { IoAddOutline } from "react-icons/io5"

interface Props {
    title?: string,
    href: string,
    className?: string,
}

export const NewLinkButton = ( { href, title, className }: Props ) => {
  return (
    <div className={`${className}`} >
        <Link   className="btn-primary flex gap-2 items-center"
                href={ href } 
         >
        <span>{title? title : "Nuevo"}</span>
        <IoAddOutline size={15}/>
        </Link>
    </div>
  )
}
