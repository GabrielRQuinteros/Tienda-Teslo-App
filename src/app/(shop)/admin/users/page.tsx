import { getPaginatedUsers } from '@/actions/orders/adminUserActions';
import { UserResume } from '@/actions/orders/interfaces/interfases';
import { authConfig } from '@/auth.config';
import { Title, UserFilters } from '@/components';
import UserFilterBar from '@/components/admin/filters/users-filter-bar/UserFilterBar';
import { UserCardList } from '@/components/users/UserCardList/UserCardList';
import { UserTable } from '@/components/users/UserTable/UserTable';
import { PaginatedResponse } from '@/helpers';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

// Hecho para que no cachee esta pagina.
export const revalidate=0;

interface UserProps {
    searchParams?: {
      page?: string
      id?: string;
      name?: string;
      email?: string;
      roles?: string;
      isActive?: string;
    };
}

export default async function AdminUserPage({ searchParams = {} }: UserProps) {

  const session = await getServerSession( authConfig );
  const sessionUserId = session?.user.id;
  if( !sessionUserId )
    redirect('/');
  
  const params = await searchParams;
  const { page="0" } = params;
  
   const filters: UserFilters = {
      id: params.id,
      email: params.email,
      name: params.name,
      isActive: params.isActive=== "true" ? true: params.isActive === "false"? false: undefined,
      roles: params.roles?.split(",").filter( rol => rol == 'user' || rol == 'admin' ),
  }
  const response = await getPaginatedUsers( Number(page), filters );
  if( !response.ok )
    redirect('/');
  const resumedUsersList = (response.data as PaginatedResponse<UserResume>).data;
  return (
    <>
      <Title title="Usuarios del Sistema" />
      <div className="mb-10">
        <UserFilterBar/>
        <div className="hidden md:block">
          <UserTable resumedUserList={resumedUsersList} />
        </div>
        <div className="block md:hidden mb-4">
          <UserCardList resumedUsersList={resumedUsersList} />
        </div>
      </div>
    </>
  );
}