'use client';
import { montserAlt } from '@/config/fonts';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {

  const onLogin = ( event: React.FormEvent ) => {
        event.preventDefault();
        // TODO: Implementar Login
    }

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

      <div className="flex flex-col" >

        <label htmlFor="email" className='font-bold'>Correo electrónico:</label>
        <input
          className="px-5 py-2 border bg-gray-50 rounded mb-5"
          type="email"
          name='email'
          placeholder='Correo electrónico' />


        <label htmlFor="password" className='font-bold'>Contraseña:</label>
        <input
          className="px-5 py-2 border bg-gray-50 rounded mb-5"
          type="password"
          name='password'
          placeholder='Contraseña' />
        <button
          
          className="btn-primary font-normal tracking-wide shadow-sm hover:shadow-none">
          Ingresar
        </button>


        {/* divisor line */ }
        <div className="flex items-center my-5">
          <div className="flex-1 border-t-2 border-gray-300 rounded"></div>
          <div className="px-2 text-gray-400">O</div>
          <div className="flex-1 border-t-2 border-gray-300 rounded"></div>
        </div>

        <Link
          href="/auth/new-account" 
          className="btn-secondary text-center mb-10">
          Crear una cuenta
        </Link>

      </div>
    </div>
  );
}