'use client';

import Image from "next/image";
import toast, { Toast } from "react-hot-toast";
import { BiCheckCircle } from "react-icons/bi";

type SuccessToastProps = {
  t: Toast;
  message: string;
};

export default function SuccessToast({ t, message }: SuccessToastProps) {
  return (
    <div
      className={`${
        t.visible ? 'animate-custom-enter' : 'animate-custom-leave'
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-gray-300`}
    >
      {/* Contenido principal */}
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          
          {/* Ícono de la app */}
          <div className="flex-shrink-0 pt-0.5">
            <Image
              className="h-10 w-10 rounded-full"
              src="/imgs/TesloIcon.png"
              alt="Icono de Teslo"
              height={150}
              width={150}
            />
          </div>

          {/* Texto de éxito */}
          <div className="ml-3 flex items-start gap-2">
            <BiCheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div className="flex flex-col">
              <p className="text-sm font-bold text-gray-900 tracking-wide">
                Operación exitosa
              </p>
              <p className="mt-0.5 text-sm text-gray-600">{message}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Botón de cierre */}
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.remove(t.id)}
          className="w-full cursor-pointer border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
