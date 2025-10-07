import { notFound } from "next/navigation";
import { montserAlt } from "@/config/fonts";
import { Product, ProductMobileSlideShow, ProductSlideShow, QuantitySelector, SizeSelector, StockLabel } from "@/components";
import { getProductBySlug } from "@/app/actions";
import { Metadata, ResolvingMetadata } from "next";
import { AddToCart } from "./add-to-cart/AddToCart";


/// METADATA DINÁMICA //
/** Función que genera la metadata de la página de forma dinámica dependiendo del producto que fue indicado en el Slug
 * @param param0 
 * @param parent 
 * @returns 
 */
export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const product: Product | null = await getProductBySlug( slug );
  if( ! product )
    notFound();
  return {
    title: product.title ?? 'Producto no encontrado',
    description: product.description ?? '',
    openGraph: {
      title: product.title ?? 'Producto no encontrado',
      description: product.description ?? '',
      images: [`/products/${product.images[1]}`]
    }
  }
}


interface Props {
  params: {
    slug: string
  }
}

export default async function ProductPage( { params }: Props) {
  
  const { slug } = await params;
  
  const product: Product | null = await getProductBySlug( slug );

  if( ! product )
    notFound();
  
  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">
      
      {/* SlideShow */}
      <div className="col-span-1 md:col-span-2 ">
        {/* Desktop slideshow */}
        <ProductSlideShow title={product.title} images={product.images} className="hidden md:block" />

        {/* Mobile slideshow */}
        <ProductMobileSlideShow title={product.title} images={product.images} className="block md:hidden" />

      </div>

      {/* Detalles */}
      <div className="col-span-1 px-5 md:col-span-1 flex flex-col">
        <StockLabel slug={product.slug}/>
        <h1 className={`${montserAlt.className} antialiased font-bold text-3xl`} >
          {product.title}
        </h1>
        <span className="text-lg mb-5 mt-1 text-gray-800 justify-end">${ product.price.toFixed(2) }</span>

        {/* Add to Cart */}
        <AddToCart product={product}/>
      
      {/* Descripion */}
      <h2 className="text-sm tracking-wide mt-5 mb-1 font-bold text-gray-400">Descripción</h2>
      <p className="font-light" >{product.description}</p>
      </div>


    </div>
  );
}