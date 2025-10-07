// Estategias de Cacheo de pagina web
export const revalidate = 60;


import { PaginationBar, Product, ProductFilters, Title } from "@/components";
import { ProductsGrid } from "@/components/products";
import { getPaginatedProductsWithImages } from "../actions";
import { PaginatedResponse } from "@/helpers";
import { redirect } from "next/navigation";

interface HomeProps {
  searchParams?: {
    page?: string;
    gender?: string;
    type?: string;
    sizes?: string;
    minPrice?: string;
    maxPrice?: string;
    tags?: string;
    search?: string;
  };
}


export const metadata = {
 title: 'Home',
 description: 'Tesolo Tienda de Ropa asociada a Tesla',
};

export default async function Home({ searchParams = {} }: HomeProps) {
  // Desestructurar query params
  const { page = "1" } = await searchParams;

  if( isNaN(Number(page)) ) 
    redirect('/');

  // Construir filtros tipados
  const filters: ProductFilters = {};

  // Ejecutar query con filtros
  const response: PaginatedResponse<Product> =
    await getPaginatedProductsWithImages(Number(page), filters);

  if( response.currentPage != Number(page) )
    redirect(`?page=${response.currentPage}`)


  const getPageLink = ( page: number ) => {
    return `?page=${page}`;
  }

  return (
    <>
      <Title title="Tienda" subtitle="Todos los productos" className="mb-2" />
      <ProductsGrid products={response.data} />
      <PaginationBar currentPage={response.currentPage} totalPages={response.totalPages} showFirstLast getPageLink={getPageLink}/>
    </>
  );
}