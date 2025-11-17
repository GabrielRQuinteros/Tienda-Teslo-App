'use client';
import { useForm } from "react-hook-form";
import { UserResume } from "@/actions/orders/interfaces/interfases";
import { updateUserAdmin } from "@/actions/orders/adminUserActions";
import { showErrorToast, showSuccessToast } from "@/helpers/toast-funtions/ToastFunctions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export interface UserEdit {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  role: "user" | "admin";
  image?: string
}

interface Props {
  user: UserEdit;
}

export default function UserEditForm({ user}: Props) {
  
  const router = useRouter();
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<UserEdit>({ defaultValues: user,});
      
  
  const onSubmit = async (data: UserEdit) => {
    const userResume: UserResume = {
      email: data.email,
      name: data.name,
      isActive: data.isActive,
      id: user.id,
      roles: data.role === 'admin'? ['admin', 'user']: ['user'] }; 
    const response = await updateUserAdmin( user.id, userResume );
    if( !response.ok ) {
        showErrorToast("Ha ocurrido un error y no se pudo actualizar el usuario. Contacte con el administrador");
    }
    router.push('/admin/users');
    showSuccessToast(`Se edito correctamente al usuario: #${response.data?.id} `);
  };

  return (
    <div className="lg:grid lg:grid-cols-2 w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="col-span-1">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">Nombre</label>
          <input
            {...register("name", { required: "El nombre es obligatorio" })}
            type="text"
            className="border border-gray-300 focus:border-black focus:ring-1 focus:ring-black p-2 w-full rounded-md bg-gray-50"
          />
          {errors.name && (<p className="text-red-500 text-xs mt-1">{errors.name.message}</p>)}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-gray-700">Rol</label>
          <select
            {...register("role")}
            className="border border-gray-300 focus:border-black focus:ring-1 focus:ring-black p-2 w-full rounded-md bg-gray-50"
          >
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div className="mb-4 md:mb-6">
          <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
          <input
            {...register("email", {
              required: "El email es obligatorio",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Formato de email inválido",
              },
            })}
            type="email"
            className="border border-gray-300 focus:border-black focus:ring-1 focus:ring-black p-2 w-full rounded-md bg-gray-50"
          />
          {errors.email && (<p className="text-red-500 text-xs mt-1">{errors.email.message}</p>)}
        </div>

        <div className="mb-4 flex items-center gap-2 justify-center md:mb-22">
          <input
            {...register("isActive")}
            type="checkbox"
            className="w-4 h-4 accent-black"
          />
          <label className="text-sm text-gray-700">Activo</label>
        </div>

        

        <div className="flex flex-col justify-end gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary cursor-pointer"
          >
            {isSubmitting ? "Guardando..." : "Guardar"}
          </button>
          <Link
            type="button"
            href={"/admin/users"}
            className="btn-secondary w-full"
          >
            Volver
          </Link>
        </div>
      </form>
      <div className="col-span-1" >
        <Image  src={ user.image ? user.image : "/imgs/profilePlaceholder.jpg"}
                height={400}
                width={400}
                className="h-full mx-auto  lg:block hidden"
                alt="Imagen del perfil del usuario"

                />
      </div>
    </div>
  );
}
