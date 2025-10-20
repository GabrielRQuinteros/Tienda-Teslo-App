import { montserAlt } from '@/config/fonts';
import Image from 'next/image';
import { LoginForm } from './ui/LoginForm';
import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/auth.config';
import { redirect } from 'next/navigation';

export default async function LoginPage() {

  const session = await getServerSession(authConfig);
  if( session?.user )
    redirect( '/' );

  return (
    <div className="flex flex-col min-h-screen justify-center px-12 w-full sm:w-[620px] xl:w-full sm:mx-auto" >
      
      {/* Logo */}
        <Image src={'/imgs/brand-logo.png'}
                width={380}
                height={210}
                alt='Teslo Logo'
                className='w-35 mb-2 mx-auto'

                />

      <h1 className={ `${ montserAlt.className } text-3xl mb-5` }>Ingresar</h1>
      
      <Suspense fallback={ <div className='animate-pulse text-gray-500'>Cargando...</div> } >
        <LoginForm/>
      </Suspense>
      
    </div>
  );
}