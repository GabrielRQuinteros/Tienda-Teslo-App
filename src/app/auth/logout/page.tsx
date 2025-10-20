'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

export default function LogoutPage() {
  const router = useRouter();
  const { data: session }= useSession();
  const isAuthenticated = Boolean(session?.user);

  useEffect(() => {
      if( !isAuthenticated )
        router.push("/auth/login");
  }, [isAuthenticated, router]) ;

   return (
    <div className="flex items-center justify-center min-h-screen md:bg-gray-50">
      <div className="flex flex-col bg-white p-10 md:rounded-3xl md:shadow-xl md:border
             md:border-gray-200 max-w-sm w-full text-center md:h-100 h-full
               items-center justify-center mx-5 md:mx-0">
        
        {/* Ícono de puerta */}
        <div className="w-30 h-25 flex items-center justify-center text-gray-800 ">
          <Image src={'/imgs/brand-logo.png'}
                          width={380}
                          height={210}
                          alt='Teslo Logo'
                          className='mb-2 mx-auto'
                          />
        </div>

        {/* Título principal */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Cerrando sesión
        </h1>

        {/* Subtítulo discreto */}
        <p className="text-gray-700  mb-6 animate-pulse">
          Por favor espere...
        </p>
      </div>
    </div>
  );
}