import { getPaginatedOrders } from '@/actions/orders/adminOrderActions';
import { OrderResume } from '@/actions/orders/interfaces/interfases';
import { authConfig } from '@/auth.config';
import { OrderFilters, Title } from '@/components';
import OrderFiltersBar from '@/components/admin/filters/orders-filter-bar/OrderFilterBar';
import { OrderCardList } from '@/components/orders/OrderCardList/OrderCardList';
import { OrderTable } from '@/components/orders/OrderTable/OrderTable';
import { PaginatedResponse, parseDate } from '@/helpers';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

// Hecho para que no cachee esta pagina.
export const revalidate=0;

interface OrderProps {
    searchParams?: {
        page?: string;
        isPaid?: string;
        maxAmount?: string;
        minAmount?: string;
        amount?: string;
        orderId?: string;
        userId?: string;
        date?: string;
    };
}
export default async function OrdersPage({ searchParams = {} }: OrderProps) {

  const session = await getServerSession( authConfig );
  const sessionUserId = session?.user.id;
  if( !sessionUserId )
    redirect('/');
  
  const params = await searchParams;
  const { page="0" } = params;
  
  const filters: OrderFilters = {
    isPaid: params.isPaid === 'true'? true: params.isPaid === 'false'? false: undefined,
    maxAmount: !isNaN(Number(params.maxAmount))?Number(params.maxAmount):undefined,
    minAmount: !isNaN(Number(params.minAmount))?Number(params.minAmount):undefined,
    amount: !isNaN(Number(params.amount))?Number(params.amount):undefined,
    orderId: params.orderId,
    userId: params.userId,
    date:  parseDate( params.date),
  }

  const response = await getPaginatedOrders( Number(page), filters );

  if( !response.ok )
    redirect('/');

  const resumedOrdersList = (response.data as PaginatedResponse<OrderResume>).data;


  return (
    <>
      <Title title="Orders" />
      <div className="mb-10">
        <OrderFiltersBar/>
        <div className="hidden md:block">
          <OrderTable resumedOrdersList={resumedOrdersList} />
        </div>
        <div className="block md:hidden mb-4">
          <OrderCardList resumedOrdersList={resumedOrdersList} />
        </div>
      </div>
    </>
  );
}