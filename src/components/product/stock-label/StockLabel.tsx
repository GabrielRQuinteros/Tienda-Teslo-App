'use client';

import { getStockAction } from "@/app/actions";
import { useEffect, useState } from "react";

interface Props {
    slug: string
}


export const StockLabel = ({ slug }: Props) => {
  const [stock, setStock] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const getStock = async (slug: string) => {
      try {
        const stockValue = await getStockAction(slug);
        setStock(stockValue ?? 0);
        setIsLoading(false);
      } catch {
        setStock(0);
        setIsLoading(false);
      }
    };

    getStock(slug);
  }, [slug]);

  return (
    <> { isLoading?
          <h1 className="antialiased font-bold text-3xl animate-pulse">Cargando ...</h1>
          :<h1 className="antialiased font-bold text-3xl">Stock: { stock ?? 0 }</h1>
      }
    </>
  );
};