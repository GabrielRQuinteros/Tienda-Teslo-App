import { ProductFilter, ProductResume } from '@/actions/products/interfaces/interface';
import { getPaginatedProducts } from '@/actions/products/productAdminActions';
import { authConfig } from '@/auth.config';
import { Title } from '@/components';
import ProductsFilterBar from '@/components/admin/filters/products-filter-bar/ProductsFilterBar';
import { ProductCardList } from '@/components/products/ProductsCardList/ProductCard/ProductsCardList';
import { ProductsTable } from '@/components/products/ProductsTable/ProductsTable';
import { NewLinkButton } from '@/components/ui/new-link-button/NewLinkButton';
import { PaginationBarClient } from '@/components/ui/pagination-bar-client/PaginationBarClient';
import { PaginatedResponse } from '@/helpers';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';


// Hecho para que no cachee esta pagina.
export const revalidate=0;

interface ProductProps {
    searchParams?: {
        page?: string;
        id?: string;
        slug?: string
        title?: string;
        sizes?: string;
        gender?: string
    };
}

export default async function AdminProductsPage ({ searchParams = {} }: ProductProps) {
    const session = await getServerSession( authConfig );
    const sessionUserId = session?.user.id;
    if( !sessionUserId )
        redirect('/');
    
    const params = await searchParams;
    const { page="0" } = params;

    const productFilter: ProductFilter = {
        id: params.id || undefined,
        slug: params.slug || undefined,
        title: params.title || undefined,
        sizes: params.sizes ? params.sizes.split(',').map(s => s.trim()) : undefined,
        gender: params.gender || undefined,
    };

    const response = await getPaginatedProducts( Number(page), productFilter );

  if( !response.ok )
    redirect('/');

  const resumedProductList = (response.data as PaginatedResponse<ProductResume>).data;
  const currentPage = response.data!.currentPage;
  const totalPages = response.data!.totalPages;

  return (
    <>
      <Title title="Administración de Productos" />
      <div className="mb-10">
        <ProductsFilterBar/>
        <NewLinkButton href="/admin/products/new" className={"flex flex-row-reverse pb-4"}/>
        <div className="hidden md:block">
          <ProductsTable resumedProductList={resumedProductList} />
        </div>
        <div className="block md:hidden mb-4">
          <ProductCardList productsResumedList={resumedProductList} />
        </div>
      </div>
      <PaginationBarClient currentPage={currentPage} totalPages={ totalPages} showFirstLast={true} />
    </>
  );
}