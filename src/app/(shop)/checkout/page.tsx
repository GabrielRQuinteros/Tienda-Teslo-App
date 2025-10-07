import { Title } from "@/components";
import Link from "next/link";
import { Product } from "../../../components/interfaces/product.interface";
import { initialData } from "@/seed/seed";
import Image from "next/image";

const productsInCart: Product[] = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
];

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
                  <p className="">${prod.price} x 3</p>
                  <p className="font-bold">Subtotal: ${prod.price * 3}</p>
                </div>
              </div>
            ))}
            </div>
          </div>
          
          {/* Checkout - Resumen de Orden de Compra */}
          <div className="bg-white p-7 shadow-lg rounded-xl flex flex-col mt-4 md:mt-0">
            
            <h2 className="w-full text-center text-xl font-bold mb-2">Dirección de entrega</h2>
            
            <div className="grid grid-cols-2 mb-10" >
              <div className="col-span-1">
                <p className="text-lg" >Nombre usuario:</p>
                <p>Calle y numero:</p>
                <p>Ciudad:</p>
                <p>País:</p>
                <p>Código Postal:</p>
                <p>Teléfono:</p>
              </div>
              <div className="col-span-1">
                <p className="text-lg" >{"Gabriel Quinteros"}</p>
                <p>{"San Martin 1234"}</p>
                <p>{"Buenos Aires"}</p>
                <p>{"Argentina"}</p>
                <p>{"1888"}</p>
                <p>{"011-1234-1234"}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

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

              <p className="mt-5 mb-4 " >
                  {/* Disclaimer */}
                  <span className="text-xs" >
                      Al hacer click en &quot;Colocar Orden&quot;, usted acepta nuestros 
                      <a  href="#"
                          className="underline text-gray-600 ml-1">
                          Términos y Condiciones.
                      </a>
                  </span>

              </p>

              <Link href={"/orders/1234"}
                    className="flex btn-primary justify-center"
                    >
                      Colocar orden
              </Link>
            </div>
          </div>
        
        
        </div>
      </div>
    </div>
  );
}
