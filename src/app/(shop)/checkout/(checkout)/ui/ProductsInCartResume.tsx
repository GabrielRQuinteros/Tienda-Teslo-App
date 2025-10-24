"use client";
import { ProductsResume } from "@/components/cart/ui/products-resume/ProductsResume";
import { useCartStore } from "@/components/store/CartStore";
import React from "react";

export const ProductsInCartResume = () => {
  const { productsInCart } = useCartStore();

  return (
    <>
      <ProductsResume products={productsInCart} />
    </>
  );
};
