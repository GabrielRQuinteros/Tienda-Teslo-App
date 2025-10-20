'use client';

import { Product, QuantitySelector, Size, SizeSelector } from "@/components"
import { CartProduct, useCartStore } from "@/components/store/CartStore";
import { useState } from "react";

interface Props {
    product: Product
}

export const AddToCart = ({ product }: Props) => {

    const [size, setSize] = useState<Size|undefined>(undefined);
    const [quantity, setQuantity] = useState<number>(1);

    const [isPristine, setIsPristine] = useState<boolean>(true);
    const { addCartProduct }= useCartStore();


    const onSizeSelect = ( size: Size ) => {
        setSize( size );
    }

    const onQuantityChange = ( quantity: number ) => {
        setQuantity( quantity );
    }

    const onAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
        setIsPristine(false);
        if( !size ) return;
        if( quantity > product.inStock || quantity < 1 ) return;
        
        const newProductInCart: CartProduct = { 
            title: product.title,
            quantity: quantity,
             price: product.price,
            productId: product.id!,
            size: size,
            slug: product.slug,
            image: product.images[0]
        }
        addCartProduct(newProductInCart);
        setQuantity(1);
        setSize(undefined);
        setIsPristine(true);
    }

  return (
    <>
        { !isPristine && !size && <span className="text-red-600 text-sm font-bold">* Debe seleccionar una talla</span>}
        
        {/* Selector de Tallas */}
        <SizeSelector avialableSizes={product.sizes} selectedSize={ size } onSizeSelect={ onSizeSelect }  />

        {/* Selector de Cantidad */}
        <QuantitySelector minInput={1} maxInput={product.inStock} selectedQuantity={quantity} onChangeQuantity={onQuantityChange}/>
        {/* Botón de agregar al carrito */}
        <button className="py-2 px-6 max-w-80 bg-sky-700 rounded-md text-white text-lg mt-3 cursor-pointer"
                onClick={onAddToCart}
            >
            Agregar al carrito
        </button>
    </>
  )
}
