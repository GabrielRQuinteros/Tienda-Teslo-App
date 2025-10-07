"use client";
import { Product } from "@/components/interfaces";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Props {
  product: Product;
}

export const ProductGridItem = ({ product }: Props) => {
  
    const [displayImage, setDisplayImage] = useState(product.images[0]);

    const onMouseEnter = () => {
        if( product.images[1] )
        setDisplayImage( (__) => product.images[1] );
    }
    const onMouseLeave = () => {
        setDisplayImage( (__) => product.images[0]);
    }

    return (
    <div className="rounded overflow-hidden fade-in">
        <Link href={`/product/${product.slug}`}>
        <Image
            src={`/products/${displayImage}`}
            alt={product.title}
            className="w-full object-cover rounded-lg"
            width={500}
            height={500}
            onMouseEnter={() => onMouseEnter()}
            onMouseLeave={() => onMouseLeave()}
        />
        </Link>

        <div className="flex flex-col p-4">
        <Link
            href={`/product/${product.slug}`}
            className="font-bold hover:text-gray-600"
        >
            {product.title}
        </Link>
        <span className="font-bold">${product.price}</span>
        </div>
    </div>
    );
};
