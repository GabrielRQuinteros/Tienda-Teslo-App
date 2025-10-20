'use client';
import { ProductsInCart, Title } from "@/components";
import { OrderSummary } from "@/components/cart/ui/order-summay/OrderSummary";
import { useCartStore } from "@/components/store/CartStore";
import Link from "next/link";
import { redirect } from "next/navigation";



export default function CartPage() {
  
  const isCartEmpty = useCartStore( state => state.productsInCart.length === 0);

  if( isCartEmpty )
    redirect('empty');

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title="Carrito" />
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10">
          {/* Carrito */}
          <div className="flex flex-col mt-5">
            <span className="text-lg">¿Queres agregar mas items?</span>
            <Link href="/" className="underline mb-5 text-gray-500 tracking-wide hover:text-gray-700">
              Seguir comprando
            </Link>

            {/* Items List */}
            <div className="flex flex-col gap-2 mt-4">
              <ProductsInCart/>
            </div>
          </div>
          {/* Checkout - Resumen de Orden de Compra */}
          <OrderSummary/>
        
        
        </div>
      </div>
    </div>
  );
}
