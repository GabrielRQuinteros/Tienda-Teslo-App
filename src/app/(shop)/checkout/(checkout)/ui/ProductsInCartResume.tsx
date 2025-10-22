"use client";
import { useCartStore } from "@/components/store/CartStore";
import { currencyFormat } from "@/helpers";
import Image from "next/image";
import React from "react";

export const ProductsInCartResume = () => {
  const { productsInCart } = useCartStore();

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
            <span className="">
              {prod.size} - {prod.title} ({prod.quantity}){" "}
            </span>

            <p className="font-bold">
              Subtotal: {currencyFormat(prod.price * prod.quantity)}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};
