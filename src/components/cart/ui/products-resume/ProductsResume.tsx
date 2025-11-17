import { CartProduct } from "@/components/store/CartStore";
import { currencyFormat } from "@/helpers";
import { adaptUrlSource } from "@/helpers/casts/casts";
import Image from "next/image";
import React from "react";

interface Props {
    products: CartProduct[]
}

export const ProductsResume = ({ products }: Props) => {
  return (
    <>
      { products.map((prod) => (
        <div key={prod.slug + prod.size} className="flex">
          <Image
            src={adaptUrlSource(prod.image)}
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
