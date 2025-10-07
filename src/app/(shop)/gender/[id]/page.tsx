
import { getPaginatedProductsWithImages } from "@/app/actions";
import { isValidCategory, PaginationBar, Title } from "@/components";
import { Gender as Gender, Product, ProductFilters } from "@/components/interfaces";
import { ProductsGrid } from "@/components/products";
import { PaginatedResponse } from "@/helpers";
import { categoryToSpanish } from "@/helpers/categories.helpers";
import { notFound, redirect } from "next/navigation";


interface Props {
  // Params == Path Variables
  params: {
    id:string,
  },
  // searchParams == QueryParams
  searchParams:{
    page: string
  }
}

export default async function CategoryPage( { params, searchParams }: Props ) {
    
  const { id: gender} = await params;
  const { page: pageParam} = await searchParams;

  let page= pageParam;

  if( ! isValidCategory(gender) ) {
    notFound();
  }
  const categorySpan = categoryToSpanish( gender as Gender );
  if( ! categorySpan )
    notFound();

  if( isNaN(Number(page)) ) 
    page="1"

  // Construir filtros tipados
    const filters: ProductFilters = { gender: (gender as Gender) };
  
  // Ejecutar query con filtros
  const response: PaginatedResponse<Product> = await getPaginatedProductsWithImages(Number(page), filters);
  
  if( response.currentPage != Number(page) )
    redirect(`/gender/${gender}?page=${response.currentPage}`)


  const getPageLink = (page: number) => {
    return `/gender/${gender}?page=${page}`;
  }

  const products = response.data;

  return (
    <>
      <Title title={`Artículos de ${categorySpan}`} className="mb-2" />
      <ProductsGrid products={products} />
      <PaginationBar currentPage={response.currentPage} totalPages={response.totalPages} showFirstLast getPageLink={getPageLink} />
    </>
  );
}