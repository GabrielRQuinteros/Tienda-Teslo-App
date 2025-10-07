import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";

export default function EmptyCartPage() {
  return (
    <div className="flex justify-center items-center h-[800px]">
      <IoCartOutline size={80} className="mx-5" />
      <div className="flex flex-col items-center">
        <h1>
          Tu carrito esta vacío
        </h1>
        <Link href={'/'}
              className="text-gray-600 mt-2 text-2xl"
                >Regresar</Link>
      </div>
    </div>
  );
}