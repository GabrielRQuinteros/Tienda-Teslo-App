import { getUserAdmin } from "@/actions/orders/adminUserActions";
import { UserResume } from "@/actions/orders/interfaces/interfases";
import { Title } from "@/components";
import { showErrorToast } from "@/helpers/toast-funtions/ToastFunctions";
import { StatusCodes } from "http-status-codes";
import { notFound, redirect } from "next/navigation";
import UserEditForm, { UserEdit } from "./ui/UserEditForm";
import { montserAlt } from "@/config/fonts";

interface Props {
  params: {
    id: string;
  };
}

export default async function AdminEditUserPage({ params }: Props) {
    const { id } = await params;
    const response = await getUserAdmin( id );
    if( ! response.ok ) {
        if( response.status === StatusCodes.NOT_FOUND )
            notFound();
        else
        {
            showErrorToast("Ha ocurrido un error interno. Profavor contacte con el administrador");
            redirect("/");
        }
    }

    const user: UserResume = response.data!;
    const userEdit: UserEdit = { ...user, role: user.roles.includes('admin')?'admin':'user' };

  return (
    <>
        <Title title={`Edición del usuario`} />
        <h2 className={`text-xl ${montserAlt.className} font-bold mb-5`}>ID: #{user.id}</h2>
        <UserEditForm user={userEdit} />
    </>
  );
}