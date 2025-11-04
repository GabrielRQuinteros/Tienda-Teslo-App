"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

interface OrderFilters {
  orderId?: string;
  isPaid?: string; // Cambiamos a string para que coincida con el select
}

export const OrderFiltersBar = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("orderId") || "";
  const isPaidParam = searchParams.get("isPaid");

  const { register, handleSubmit, reset, setValue } = useForm<OrderFilters>({
    defaultValues: {
      orderId: "",
      isPaid: "",
    },
  });

  // Sincronizar con los parámetros de URL
  useEffect(() => {
    setValue("orderId", orderId);
    setValue("isPaid", isPaidParam || "");
  }, [orderId, isPaidParam, setValue]);

  const onSubmit = (data: OrderFilters) => {
    const params = new URLSearchParams();

    if (data.orderId && data.orderId.trim() !== "") {
      params.set("orderId", data.orderId);
    }

    if (data.isPaid && data.isPaid !== "") {
      params.set("isPaid", data.isPaid);
    }

    router.push(`?${params.toString()}`);
  };

  const handleReset = () => {
    reset({
      orderId: "",
      isPaid: "",
    });

    router.push("/admin/orders");
  };

  return (
    <div className="border-2 border-gray-200 rounded-xl px-4 py-2 mb-4">
      <h2 className="font-bold text-lg mb-1 mt-1">Filtros</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-4 flex-wrap mb-1 md:grid md:grid-cols-3"
      >
        <div className="flex flex-col w-full md:col-span-2 xl:col-span-1">
          <label className="font-bold text-sm mb-1" htmlFor="orderId">
            ID de Orden
          </label>
          <input
            type="text"
            className="text-input"
            placeholder="Identificador de Orden"
            {...register("orderId")}
          />
        </div>

        <div className="flex flex-col w-full md:col-span-1 xl:col-span-1">
          <label htmlFor="isPaid" className="font-bold text-sm mb-1">
            Estado:
          </label>
          <select
            {...register("isPaid")}
            className="select-input"
          >
            <option value="">Todas...</option>
            <option value="true">Pagada</option>
            <option value="false">No Pagada</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 w-full col-span-2 md:flex-row xl:col-span-1 self-end ">
          <button type="submit" className="btn-primary hover:cursor-pointer w-full max-h-[42px]">
            Buscar
          </button>
          <button
            type="button"
            className="btn-secondary hover:cursor-pointer font-bold !text-gray-700 w-full max-h-[42px]"
            onClick={handleReset}
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderFiltersBar;