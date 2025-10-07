import { QuantitySelector, Title } from "@/components";
import Link from "next/link";
import { Product } from "../../../components/interfaces/product.interface";
import { initialData } from "@/seed/seed";
import Image from "next/image";
import { redirect } from "next/navigation";

const productsInCart: Product[] = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
];

const isCartEmpty = () => {
  return false;
}


export default function CartPage() {

  if( isCartEmpty() )
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
            {productsInCart.map((prod) => (
              <div key={prod.slug} className="flex">
                <Image
                  src={`/products/${prod.images[0]}`}
                  width={100}
                  height={100}
                  alt={prod.title}
                  className="mr-5 rounded"
                  style={{
                    width: '100px',
                    height: '100px'
                  }}
                />
                <div className="">
                  <p className="">{prod.title}</p>
                  <p className="">${prod.price}</p>
                  
                  <div className="flex flex-row gap-2 lg:gap-5 flex-wrap" >
                  <QuantitySelector
                    defaultInput={3}
                    maxInput={5}
                    minInput={1}
                  />
                  <button className="underline">Remover</button>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
          {/* Checkout - Resumen de Orden de Compra */}
          <div className="bg-white p-7 shadow-lg rounded-xl flex flex-col md:ml-4 h-[300px]">
            <h2 className="w-full text-center text-xl font-bold" >Resumen de Orden</h2>
            <div className="grid grid-cols-3 mt-3 gap-3" >
              
              <span className="col-span-2 font-semibold" >Nro. Productos</span>
              <span className="col-span-1 text-right font-semibold">3 artículos</span>
              
              <span className="col-span-2" >Subtotal</span>
              <span className="col-span-1 text-right">$300.000</span>
              
              <span className="col-span-2" >Impuestos (15%)</span>
              <span className="col-span-1 text-right">$60.000</span>
              
              
              <span className="col-span-2 text-xl font-bold mt-auto" >Total</span>
              <span className="col-span-1 text-right text-xl font-bold">$60.000</span>
        
            </div>

            <div className="mt-5 w-full">
              <Link href={"/checkout/address"}
                    className="flex btn-primary justify-center"
                    >
                      Checkout
              </Link>
            </div>
          </div>
        
        
        </div>
      </div>
    </div>
  );
}
