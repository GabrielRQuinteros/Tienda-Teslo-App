"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

interface ProductsFilter {
  id?: string;
  title?: string;
  sizes?: string;
  gender?: string;
}

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const GENDERS = ["kids", "men", "women", "unisex"];

export const ProductsFilterBar = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const idParam = searchParams.get("id") || "";
  const titleParam = searchParams.get("title") || "";
  const sizeParam = searchParams.get("sizes") || "";
  const genderParam = searchParams.get("gender") || "";

  const { register, handleSubmit, reset, setValue } = useForm<ProductsFilter>({
    defaultValues: {
      id: "",
      title: "",
      sizes: "",
      gender: "",
    },
  });

  // Sincronizar con los parámetros de URL
  useEffect(() => {
    setValue("id", idParam);
    setValue("title", titleParam);
    setValue("sizes", sizeParam);
    setValue("gender", genderParam);
  }, [idParam, titleParam, sizeParam, genderParam, setValue]);

  const onSubmit = (data: ProductsFilter) => {
    const params = new URLSearchParams();

    if (data.id && data.id.trim() !== "") {
      params.set("id", data.id);
    }

    if (data.title && data.title.trim() !== "") {
      params.set("title", data.title);
    }

    if (data.sizes && data.sizes !== "") {
      params.set("sizes", data.sizes);
    }

    if (data.gender && data.gender !== "") {
      params.set("gender", data.gender);
    }

    router.push(`?${params.toString()}`);
  };

  const handleReset = () => {
    reset({
      id: "",
      title: "",
      sizes: "",
      gender: "",
    });

    router.push("/admin/products");
  };

  return (
    <div className="border-2 border-gray-200 rounded-xl px-4 py-2 mb-4">
      <h2 className="font-bold text-lg mb-1 mt-1">Filtros de Productos</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-4 flex-wrap mb-1 md:grid md:grid-cols-3"
      >
        {/* ID */}
        <div className="flex flex-col w-full md:col-span-1">
          <label htmlFor="id" className="font-bold text-sm mb-1">
            ID del Producto
          </label>
          <input
            type="text"
            className="text-input"
            placeholder="Identificador"
            {...register("id")}
          />
        </div>

        {/* Título */}
        <div className="flex flex-col w-full md:col-span-1">
          <label htmlFor="title" className="font-bold text-sm mb-1">
            Título
          </label>
          <input
            type="text"
            className="text-input"
            placeholder="Nombre del producto"
            {...register("title")}
          />
        </div>

        {/* Talle */}
        <div className="flex flex-col w-full md:col-span-1">
          <label htmlFor="sizes" className="font-bold text-sm mb-1">
            Talle
          </label>
          <select
            {...register("sizes")}
            className="select-input"
          >
            <option value="">Todos...</option>
            {SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Género */}
        <div className="flex flex-col w-full md:col-span-1">
          <label htmlFor="gender" className="font-bold text-sm mb-1">
            Género
          </label>
          <select
            {...register("gender")}
            className="select-input"
          >
            <option value="">Todos...</option>
            {GENDERS.map((gender) => (
              <option key={gender} value={gender}>
                {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Botones */}
        <div className="flex flex-col gap-2 w-full col-span-2 md:flex-row xl:col-span-1 self-end">
          <button
            type="submit"
            className="btn-primary hover:cursor-pointer w-full max-h-[42px]"
          >
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

export default ProductsFilterBar;
