import { getProductById } from "@/app/actions";
import { Category, Product, ProductWithImages, Title } from "@/components";
import { StatusCodes } from "http-status-codes";
import { notFound, redirect } from "next/navigation";
import { ProductForm } from "../ui/ProductForm";
import { getCategories } from "@/app/actions/categories/categoryActions";


interface Props {
  // Params == Path Variables
  params: {
    id:string,
  }
}

const defaultNewProductValues: ProductWithImages = {
      inStock: 0,
      price:0,
      title:"",
      gender:"unisex",
      type: "",
      description:"",
      tags:[""],
      slug:"",
      sizes:[],
      images:[],
    }


export default async function AdminProductPage( { params }: Props ) {
  
  const { id } = await params;
  const respCategories= await getCategories();
  
  const isNewProduct = id === 'new';
  
  let product: ProductWithImages;

  if( isNewProduct ) {
    product = defaultNewProductValues;
  }else {
    const respProduct = await getProductById(id);
    if( !respProduct.ok ) {
      if( respProduct.status === StatusCodes.NOT_FOUND )
        notFound();
      else {
        redirect('/')
      }
    }  
    product = respProduct.data!;
  }

  const categories: Category[] = respCategories.data!;
  const title = isNewProduct? "Nuevo Producto": `Edición del producto: ${product.title}`;
  
  return (
    <>
      <Title title={ `${title}` } />
      <ProductForm product={product} categories={categories} />
    </>
  );
}