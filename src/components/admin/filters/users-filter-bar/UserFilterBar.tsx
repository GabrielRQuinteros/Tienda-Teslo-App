"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

interface UserFilters {
  id?: string;
  name?: string;
  email?: string;
  roles?: string;
  isActive?: string;
}

export const UserFilterBar = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const idParam = searchParams.get("id") || "";
  const nameParam = searchParams.get("name") || "";
  const emailParam = searchParams.get("email") || "";
  const roleParam = searchParams.get("roles") || "";
  const isActiveParam = searchParams.get("isActive") || "";

  const { register, handleSubmit, reset, setValue } = useForm<UserFilters>({
    defaultValues: {
      id: "",
      name: "",
      email: "",
      roles: "",
      isActive: "",
    },
  });

  // Sincronizar con los parámetros de URL
  useEffect(() => {
    setValue("id", idParam);
    setValue("name", nameParam);
    setValue("email", emailParam);
    setValue("roles", roleParam);
    setValue("isActive", isActiveParam);
  }, [nameParam, emailParam, roleParam, isActiveParam, setValue]);

  const onSubmit = (data: UserFilters) => {
    const params = new URLSearchParams();

    if (data.name && data.name.trim() !== "") {
      params.set("name", data.name.trim());
    }
    if (data.id && data.id.trim() !== "") {
      params.set("id", data.id.trim());
    }

    if (data.email && data.email.trim() !== "") {
      params.set("email", data.email.trim());
    }

    if (data.roles && data.roles !== "") {
      params.set("roles", data.roles);
    }

    if (data.isActive && data.isActive !== "") {
      params.set("isActive", data.isActive);
    }

    router.push(`?${params.toString()}`);
  };

  const handleReset = () => {
    reset({
      id: "",
      name: "",
      email: "",
      roles: "",
      isActive: "",
    });
    router.push("/admin/users");
  };

  return (
    <div className="border-2 border-gray-200 rounded-xl px-4 py-2 mb-4">
      <h2 className="font-bold text-lg mb-1 mt-1">Filtros</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-4 flex-wrap mb-1 md:grid md:grid-cols-3"
      >
        {/* Filtro por nombre */}
        <div className="flex flex-col w-full md:col-span-1">
          <label className="font-bold text-sm mb-1" htmlFor="id">
            ID
          </label>
          <input
            type="text"
            className="text-input"
            placeholder="Nombre del usuario"
            {...register("id")}
          />
        </div>
        <div className="flex flex-col w-full md:col-span-1">
          <label className="font-bold text-sm mb-1" htmlFor="name">
            Nombre
          </label>
          <input
            type="text"
            className="text-input"
            placeholder="Nombre del usuario"
            {...register("name")}
          />
        </div>

        {/* Filtro por email */}
        <div className="flex flex-col w-full md:col-span-1">
          <label className="font-bold text-sm mb-1" htmlFor="email">
            Email
          </label>
          <input
            type="text"
            className="text-input"
            placeholder="Correo electrónico"
            {...register("email")}
          />
        </div>

        {/* Filtro por rol */}
        <div className="flex flex-col w-full md:col-span-1">
          <label className="font-bold text-sm mb-1" htmlFor="role">
            Rol
          </label>
          <select {...register("roles")} className="select-input">
            <option value="">Todos...</option>
            <option value="admin">Administrador</option>
            <option value="user">Usuario</option>
          </select>
        </div>

        {/* Filtro por estado activo */}
        <div className="flex flex-col w-full md:col-span-1">
          <label className="font-bold text-sm mb-1" htmlFor="isActive">
            Estado
          </label>
          <select {...register("isActive")} className="select-input">
            <option value="">Todos...</option>
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>

        {/* Botones */}
        <div className="flex flex-col gap-4 w-full col-span-2 md:col-span-1 md:flex-row xl:col-span-1 self-end ">
          <button type="submit" className="btn-primary hover:cursor-pointer w-full md:max-h-[42px]">
            Buscar
          </button>
          <button
            type="button"
            className="btn-secondary hover:cursor-pointer font-bold !text-gray-00  w-full md:max-h-[42px]"
            onClick={handleReset}
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserFilterBar;
