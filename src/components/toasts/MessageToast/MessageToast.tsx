
'use client';

import Image from "next/image";
import toast, { Toast } from "react-hot-toast";

type MessageToastProps = {
  t: Toast;
  message: string;
};

export default function MessageToast({ t, message }: MessageToastProps) {
  return (
    <div
      className={`${
        t.visible ? 'animate-custom-enter' : 'animate-custom-leave'
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
            <Image className="h-10 w-10 rounded-full" src={'/imgs/TesloIcon.png'} alt={"Icono de Teslo"} height={150} width={150} />
        </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">{message}</p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full cursor-pointer border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}