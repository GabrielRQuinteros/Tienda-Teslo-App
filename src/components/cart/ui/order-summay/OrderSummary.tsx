'use client';
import { CartResume, useCartStore } from '@/components/store/CartStore';
import { currencyFormat } from '@/helpers';
import Link from 'next/link'
import React, { useState } from 'react'

export const OrderSummary = () => {
    const { getResumeCartInfo } = useCartStore();

    const { productsQuantity, taxes, subtotal, total } = getResumeCartInfo();
    return (
    <>
        <div className="bg-white p-7 shadow-lg rounded-xl flex flex-col md:ml-4 h-[300px]">
            <h2 className="w-full text-center text-xl font-bold" >Resumen de Orden</h2>
            <div className="grid grid-cols-3 mt-3 gap-3" >
              
            <span className="col-span-2 font-semibold" >Nro. Productos</span>
            <span className="col-span-1 text-right font-semibold">{productsQuantity} artículos</span>
            
            <span className="col-span-2" >Subtotal</span>
            <span className="col-span-1 text-right">{currencyFormat(subtotal)}</span>
            
            <span className="col-span-2" >Impuestos (15%)</span>
            <span className="col-span-1 text-right">{currencyFormat(taxes)}</span>
            
            
            <span className="col-span-2 text-xl font-bold mt-auto" >Total</span>
            <span className="col-span-1 text-right text-xl font-bold">{currencyFormat(total)}</span>
        
            </div>

            <div className="mt-5 w-full">
              <Link href={"/checkout/address"}
                    className="flex btn-primary justify-center"
                    >
                      Checkout
              </Link>
            </div>
          </div>
    </>
  )
}
