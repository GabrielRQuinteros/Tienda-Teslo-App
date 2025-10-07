'use client';

import { Product, QuantitySelector, Size, SizeSelector } from "@/components"
import { useState } from "react";

interface Props {
    product: Product
}

export const AddToCart = ({ product }: Props) => {

    const [size, setSize] = useState<Size|undefined>(undefined);
    const [quantity, setQuantity] = useState<number>(1);

    const onSizeSelect = ( size: Size ) => {
        setSize( size );
    }

    const onQuantityChange = ( quantity: number ) => {
        setQuantity( quantity );
    }

    const onAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
        if( !size ) {
            //TODO: Show Message Missing Size Selector
        }

        if( quantity > product.inStock || quantity < 1 ) {
            //TODO: Show Message Quantity Out of Bounds
        }


    }

  return (
    <>
        {/* Selector de Tallas */}
        <SizeSelector avialableSizes={product.sizes} selectedSize={ size } onSizeSelect={ onSizeSelect }  />

        {/* Selector de Cantidad */}
        <QuantitySelector minInput={1} maxInput={product.inStock} selectedQuantity={quantity} onChangeQuantity={onQuantityChange}/>
        {/* Botón de agregar al carrito */}
        <button className="py-2 px-6 max-w-80 bg-sky-700 rounded-md text-white text-lg mt-3"
                onClick={onAddToCart}
            >
            Agregar al carrito
        </button>
    </>
  )
}
