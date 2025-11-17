"use client";
import { Dialog, DialogPanel, DialogTitle, Description } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

interface UserEdit {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  role: "user" | "admin";
}

interface Props {
  user: UserEdit;
  onSave: (data: UserEdit) => Promise<void> | void;
}

export default function UserEditModal({ user, onSave }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<UserEdit>({
    defaultValues: user,
  });

  useEffect(() => {
    reset(user);
  }, [user, reset]);

  const onSubmit = async (data: UserEdit) => {
    await onSave(data);
    setIsOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-white text-black p-6 rounded-xl w-[400px] shadow-2xl border border-gray-200">
            <DialogTitle className="text-xl font-semibold mb-4 text-gray-900">
              Editar Usuario
            </DialogTitle>
            <Description className="sr-only">Formulario para editar usuario existente</Description>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Nombre
                </label>
                <input
                  {...register("name", { required: "El nombre es obligatorio" })}
                  type="text"
                  className="border border-gray-300 focus:border-black focus:ring-1 focus:ring-black p-2 w-full rounded-md bg-gray-50"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Email
                </label>
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
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  {...register("isActive")}
                  type="checkbox"
                  className="w-4 h-4 accent-black"
                />
                <label className="text-sm text-gray-700">Activo</label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Rol
                </label>
                <select
                  {...register("role")}
                  className="border border-gray-300 focus:border-black focus:ring-1 focus:ring-black p-2 w-full rounded-md bg-gray-50"
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
