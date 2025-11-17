"use client";

import { useForm } from "react-hook-form";
import { Category, ProductWithImages } from "@/components";
import { useEffect, useState } from "react";
import { castUrlArrayToFileList } from "@/helpers/casts/casts";
import Image from "next/image";
import { createUpdateProduct } from "@/actions/products/productAdminActions";
import { useRouter } from "next/navigation";
import { showErrorToast, showSuccessToast } from "@/helpers/toast-funtions/ToastFunctions";
import Link from "next/link";
import { BiImageAdd } from "react-icons/bi";
import { StatusCodes } from "http-status-codes";


interface Props {
  product: ProductWithImages;
  categories: Category[];
}

interface ProductFormInputs {
  title: string;
  slug: string;
  description: string;
  price: number;
  tags: string;
  gender: string;
  category: string;
  sizes: string[];
  inStock: number;
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

export const ProductForm = ({ product, categories }: Props) => {
  
  const [images, setImages] = useState<File[]>([]);
  useEffect(() => {
    if (!product?.images?.length) return;

    (async () => {
      try {
        const urls = product.images.map((img) => img.url);

        if (typeof castUrlArrayToFileList === "function") {
          const fileList = await castUrlArrayToFileList(urls);
          setImages(Array.from(fileList));
          return;
        }

        const fetchedFiles: File[] = await Promise.all(
          urls.map(async (u, idx) => {
            const res = await fetch(u);
            const blob = await res.blob();
            const ext = blob.type.split("/")[1] || "jpg";
            return new File([blob], `product-image-${idx}.${ext}`, { type: blob.type });
          })
        );

        setImages(fetchedFiles);
      } catch (err) {
        console.warn("No se pudieron cargar imágenes iniciales:", err);
      }
    })();
  }, [product.images]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormInputs>({
    defaultValues: {
      title: product.title || "",
      slug: product.slug || "",
      description: product.description || "",
      price: product.price || 0,
      tags: product.tags?.join(", ") || "",
      gender: product.gender || "",
      category: product.type,
      sizes: product.sizes || [],
      inStock: product.inStock,
    },
  });
  
  const selectedSizes = watch("sizes", []);
  const toggleSize = (size: string) => {
    const currentSizes = watch("sizes") || [];
    if (currentSizes.includes(size)) {
      setValue( "sizes", currentSizes.filter((s) => s !== size) );
    } else {
      setValue("sizes", [...currentSizes, size]);
    }
  };
  
  const router = useRouter();

  const onAddImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    const existingNames = new Set(images.map((f) => f.name));
    const filteredNewFiles = newFiles.filter((f) => !existingNames.has(f.name));

    setImages((prev) => [...prev, ...filteredNewFiles]);
    event.currentTarget.value = "";
  };

  const onDeleteImage = (fileName: string) => {
    setImages((prev) => prev.filter((f) => f.name !== fileName));
  };

  const imagesToShow = images.map((file) => ({
    id: file.name + "|" + file.lastModified,
    url: URL.createObjectURL(file),
    name: file.name,
  }));



  const onSubmit = async (data: ProductFormInputs) => {
    try {
      const formData = new FormData();

      if (product.id) {
        formData.append("id", product.id);
      }
      formData.append("title", data.title);
      formData.append("slug", data.slug);
      formData.append("description", data.description || "");
      formData.append("price", data.price.toString());
      formData.append("tags", data.tags || "");
      formData.append("gender", data.gender || "");
      formData.append("inStock", data.inStock.toString());
      formData.append("category", data.category || "");
      formData.append("sizes", JSON.stringify(data.sizes || []));

      // Agregamos TODAS las imágenes que tenemos en el state
      images.forEach((file) => {
        formData.append("images", file);
      });

      const response = await createUpdateProduct(formData);

      if (!response.ok) {
        showErrorToast(response.message || "Error al guardar producto");
        return;
      }
      showSuccessToast(response.message || "Producto guardado");
      if( response.status === StatusCodes.CREATED ) {
        const id = response.data!
        router.push(`/admin/products/${id}`);
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error("Error en onSubmit:", err);
      showErrorToast("Error inesperado al guardar");
    }
  };
  

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-8"
    >
      {/* Textos */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span className="font-bold" >Título</span>
          <input
            type="text"
            {...register("title", { required: "El título es obligatorio" })}
            className="p-2 border rounded-md bg-gray-200"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        <div className="flex flex-col mb-2">
          <span className="font-bold" >Slug</span>
          <input
            type="text"
            {...register("slug", { required: "El slug es obligatorio" })}
            className="p-2 border rounded-md bg-gray-200"
          />
          {errors.slug && (
            <p className="text-red-500 text-sm">{errors.slug.message}</p>
          )}
        </div>

        <div className="flex flex-col mb-2">
          <span className="font-bold" >Descripción</span>
          <textarea
            rows={5}
            {...register("description")}
            className="p-2 border rounded-md bg-gray-200"
          ></textarea>
        </div>

        <div className="flex flex-col mb-2">
          <span className="font-bold" >Precio</span>
          <input
            type="number"
            {...register("price", { valueAsNumber: true, min: 0 })}
            className="p-2 border rounded-md bg-gray-200"
          />
        </div>
        
        <div className="flex flex-col mb-2">
          <span className="font-bold" >Stock</span>
          <input
            type="number"
            {...register("inStock", { valueAsNumber: true, min: 0 })}
            className="p-2 border rounded-md bg-gray-200"
          />
        </div>

        <div className="flex flex-col mb-2">
          <span className="font-bold" >Tags (separados por coma)</span>
          <input
            type="text"
            {...register("tags")}
            className="p-2 border rounded-md bg-gray-200"
          />
        </div>

        <div className="flex flex-col mb-2">
          <span className="font-bold" >Género</span>
          <select
            {...register("gender", { required: "Seleccione un género" })}
            className="p-2 border rounded-md bg-gray-200"
          >
            <option value="">[Seleccione]</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kid">Kid</option>
            <option value="unisex">Unisex</option>
          </select>
          {errors.gender && ( <p className="text-red-500 text-sm">{errors.gender.message}</p> )}
        
        </div>

        <div className="flex flex-col mb-4">
          <span className="font-bold" >Categoría</span>
          <select {...register("category")} defaultValue={product.type} className="p-2 border rounded-md bg-gray-200">
            <option value="">[Seleccione]</option>
            { categories.map( cat => (<option key={cat.id} value={cat.name}>{cat.name}</option> )  ) }
          </select>
        </div>
        
        <div className="flex-row w-full gap-4 hidden sm:flex">
          <Link className="btn-secondary w-full lg:w-1/2 cursor-pointer"
                href={`/admin/products`}>
            Volver
          </Link>
          <button type="submit" className="btn-primary w-full lg:w-1/2 cursor-pointer">
            Guardar
          </button>
      </div>
        
      </div>

      {/* Selector de tallas y fotos */}
      <div className="w-full">
        <div className="flex flex-col">
          <span className="font-bold" >Tallas</span>
          <div className="flex flex-wrap">
            {sizes.map((size) => {
              const isSelected = selectedSizes.includes(size);
              return (
                <div
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`flex items-center justify-center w-10 h-10 mr-2 border rounded-md cursor-pointer transition
                    ${isSelected ? "bg-gray-900 text-white border-transparent" : "bg-gray-100 text-gray-900 border-gray-900 shadow"}`}
                >
                  <span>{size}</span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col mb-2 mt-3">
            <span className="font-bold">Fotos</span>

            {/* Input oculto */}
            <input
              id="fileInput"
              type="file"
              multiple
              className="hidden"
              accept="image/png, image/jpeg, image/jpg, image/webp, image/avif"
              onChange={onAddImages}
            />
            <button
              type="button"
              className="btn-primary mt-2 !py-2.5 cursor-pointer flex flex-row gap-2 items-center justify-center"
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              Agregar
              <BiImageAdd size={23} />
            </button>
          </div>

          <div className="mb-6 font-bold text-sm">
            <span>Recomendaciones:</span>
            <ul className="list-disc ml-5">
              <li>Tamaño: 500px x 500px</li>
              <li>Optimizar: Comprimir imágenes</li>
              <li>Formatos: png, jpeg</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mx-1" >
             {imagesToShow.map((img) => (
              <div key={img.id} className="shadow rounded-b-2xl transition-transform duration-300 lg:hover:-translate-y-3 border border-gray-150">
                <Image src={img.url} alt={img.name} className="w-full h-70 object-cover rounded-top" width={500} height={500} />
                <button
                  className="btn-danger !rounded-t-none !rounded-b-md w-full cursor-pointer"
                  type="button"
                  onClick={() => onDeleteImage(img.name)}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-row w-full gap-4 sm:hidden">
        <Link className="btn-secondary w-full lg:w-1/2 cursor-pointer"
              href={`/admin/products`}>
          Volver
        </Link>
        <button type="submit" className="btn-primary w-full lg:w-1/2 cursor-pointer">
          Guardar
        </button>
      </div>
    </form>
  );
};