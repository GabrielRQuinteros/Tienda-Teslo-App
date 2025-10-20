'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { IoInformationCircleOutline } from 'react-icons/io5';
import clsx from 'clsx';
import Link from 'next/link';

export const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/'

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsPending(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    setIsPending(false);

    if (res?.error) {
      setError('Email o contraseña incorrectos');
    } else {
      router.push(redirectTo);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <label htmlFor="email" className="font-bold">
        Correo electrónico:
      </label>
      <input
        className="px-5 py-2 border bg-gray-50 rounded mb-5"
        type="email"
        name="email"
        placeholder="Correo electrónico"
        required
      />

      <label htmlFor="password" className="font-bold">
        Contraseña:
      </label>
      <input
        className="px-5 py-2 border bg-gray-50 rounded mb-5"
        type="password"
        name="password"
        placeholder="Contraseña"
        required
      />

      <button
        type="submit"
        disabled={isPending}
        className={clsx(
          "btn-primary font-normal tracking-wide shadow-sm hover:shadow-none",
          { 
            "opacity-60 cursor-not-allowed": isPending,
            "cursor-pointer": !isPending
           }
        )}
      >
        {isPending ? 'Ingresando...' : 'Ingresar'}
      </button>

      <div className="flex items-center my-5">
        <div className="flex-1 border-t-2 border-gray-300 rounded"></div>
        <div className="px-2 text-gray-400">O</div>
        <div className="flex-1 border-t-2 border-gray-300 rounded"></div>
      </div>

      <Link href="/auth/new-account" className="btn-secondary text-center mb-5">
        Crear una cuenta
      </Link>

      <div
        className={clsx(
          "flex items-center justify-center gap-2 mt-2 bg-red-100 rounded-sm py-1.5 overflow-hidden transition-all duration-300",
          { "opacity-100": error, "opacity-0": !error }
        )}
      >
        <IoInformationCircleOutline size={22} className="text-red-500" />
        <p className="text-red-500 text-center tracking-wide">{error}</p>
      </div>
    </form>
  );
};