'use client';

import { QuantitySelector } from "@/components/product";
import { useCartStore } from "@/components/store/CartStore";
import { currencyFormat } from "@/helpers";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const ProductsInCart = () => {

    const { productsInCart, updateProductQuantity, removeCartProduct } = useCartStore();

    return (
        <>
        {productsInCart.map((prod) => (
            <div key={prod.slug + prod.size} className="flex">
            <Image
                src={`/products/${prod.image}`}
                width={100}
                height={100}
                alt={prod.title}
                className="mr-5 rounded"
                style={{
                width: "100px",
                height: "100px",
                }}
            />
            <div>
                <Link href={`/product/${prod.slug}`} className="hover:underline cursor-pointer" >
                    <p className=""> <strong className="font-bold" >{prod.size}</strong> - {prod.title}</p>
                </Link>
                <p className="">{currencyFormat(prod.price)}</p>

                <div className="flex flex-row gap-2 lg:gap-5 flex-wrap">
                <QuantitySelector onChangeQuantity={ (quantity) => updateProductQuantity(prod, quantity) } selectedQuantity={prod.quantity}/>
                <button className="underline cursor-pointer"
                        onClick={ ()=>( removeCartProduct( prod ) )}
                    >
                    Remover
                </button>
                </div>
            </div>
            </div>
        ))}
        </>
    );
};
