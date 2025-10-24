import { getOrdersByUser } from '@/actions';
import { OrderResume } from '@/actions/orders/interfaces/interfases';
import { authConfig } from '@/auth.config';
import { Title } from '@/components';
import { OrderTable } from '@/components/orders/OrderTable/OrderTable';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

// Hecho para que no cachee esta pagina.
export const revalidate=0;

export default async function OrdersPage() {

  const session = await getServerSession( authConfig );
  const sessionUserId = session?.user.id;
  if( !sessionUserId )
    redirect('/');

  const response = await getOrdersByUser(session.user.id);

  if( !response.ok )
    redirect('/');

  const resumedOrdersList = (response.data as OrderResume[]);
  return (
    <>
      <Title title="Orders" />
      <div className="mb-10">
        <OrderTable resumedOrdersList={resumedOrdersList} />
      </div>
    </>
  );
}