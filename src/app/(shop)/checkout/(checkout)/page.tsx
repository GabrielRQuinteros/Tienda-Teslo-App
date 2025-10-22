import { Title } from "@/components";
import Link from "next/link";
import { ProductsInCartResume } from "./ui/ProductsInCartResume";
import { PlaceOrder } from "./ui/PlaceOrder";

export default function CheckoutPage() {



  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title="Verificar Orden" />
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10">
          {/* Carrito */}
          <div className="flex flex-col mt-5">
            <span className="text-lg">Ajustar elementos</span>
            <Link href="/cart" className="underline mb-5 text-gray-500 tracking-wide hover:text-gray-700">
              Editar carrito
            </Link>

            {/* Items List */}
            <div className="flex flex-col gap-2 mt-4">
            <ProductsInCartResume/>
            </div>
          </div>
          
          {/* Checkout - Resumen de Orden de Compra */}
          <PlaceOrder/>
        
        
        </div>
      </div>
    </div>
  );
}
