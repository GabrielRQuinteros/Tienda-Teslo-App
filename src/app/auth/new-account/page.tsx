'use client';
import { registerUser } from '@/actions';
import { montserAlt } from '@/config/fonts';
import { showErrorToast } from '@/helpers/toast-funtions/ToastFunctions';
import clsx from 'clsx';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RegisterOptions, SubmitHandler, useForm } from 'react-hook-form';

type FormInputs = {
  fullname: string,
  email:string,
  password: string
}

export default function NewAccountPage() {

    const router = useRouter();
    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm<FormInputs>();

    const nameValidations: RegisterOptions<FormInputs, 'fullname'> = {
        required: 'El campo nombre completo es obligatorio',
        minLength: { value: 6, message: 'Debe tener al menos 6 caracteres' },
      };

    const emailValidations: RegisterOptions<FormInputs, 'email'> = {
      required: 'El email es un campo obligatorio',
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'El formato del correo no es válido',
      },
    };

    const passwordValidations: RegisterOptions<FormInputs, 'password'> = {
      required: 'La contraseña es obligatoria',
      minLength: { value: 6, message: 'Debe tener al menos 6 caracteres' },
    };


    const onSubmit: SubmitHandler<FormInputs> = async ( dataInputs ) => {
      
      const {fullname, email, password} = dataInputs;
      const response = await registerUser( fullname, email, password );

      if( !response.ok) {
        const { message, status } = response;
          showErrorToast(message!)
          return;
      }

      const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
          });
      
      if (res?.error) {
        showErrorToast("Se ha registrado con exito!.Pero no puede loguearse en este momento. Disculpe!!!");
      } else {
        router.push('/');
      }
    }

  return (
    <div className="flex flex-col min-h-screen justify-center px-12 w-full sm:w-[620px] xl:w-full sm:mx-auto" >

      {/* Logo */}
      <Image  src={'/imgs/brand-logo.png'}
              width={380}
              height={210}
              alt='Teslo Logo'
              className='w-35 mb-4 mx-auto'
      />

      <h1 className={ `${ montserAlt.className } text-3xl mb-5 ` }>Crear una cuenta</h1>

      <form className="flex flex-col" onSubmit={ handleSubmit(onSubmit) } >

        <label htmlFor="fullname" className='font-bold'>Nombre Completo</label>
        <input  className={ clsx( "px-5 py-2 border bg-gray-50 rounded mb-5",
                  {"border-red-500": errors.fullname,})}
                type="text"
                {...register('fullname', nameValidations )}
                placeholder='Nombre Completo' />
        {errors.fullname && <p className="text-red-500 mb-1">{errors.fullname.message}</p>}

        
        <label htmlFor="email" className='font-bold'>Correo electrónico:</label>
        <input
          className={ clsx( "px-5 py-2 border bg-gray-50 rounded mb-5",
              {"border-red-500": errors.email})}
          type="email"
          { ...register('email', emailValidations ) }

          placeholder='Correo electrónico' />
        {errors.email && <p className="text-red-500 mb-1">{errors.email.message}</p>}

        <label htmlFor="password" className='font-bold'>Contraseña:</label>
        <input
          className={ clsx( "px-5 py-2 border bg-gray-50 rounded mb-5",
              {"border-red-500": errors.password})}
          type="password"
          { ...register('password', passwordValidations ) }
          placeholder='Contraseña' />
        {errors.password && <p className="text-red-500 mb-1">{errors.password.message}</p>}

        <button type='submit'
          disabled={isSubmitting}
           className={clsx(
            'btn-primary font-normal tracking-wide shadow-sm',
            {
              'opacity-70 cursor-not-allowed': isSubmitting,
              'hover:shadow-none cursor-pointer': !isSubmitting,
            }
          )}
        >
          {isSubmitting ? 'Creando cuenta...' : 'Crear una nueva cuenta'}
        </button>

        {/* divisor line */ }
        <div className="flex items-center my-5">
          <div className="flex-1 border-t-2 border-gray-300 rounded"></div>
          <div className="px-2 text-gray-400">O</div>
          <div className="flex-1 border-t-2 border-gray-300 rounded"></div>
        </div>

        <Link
          href="/auth/login" 
          className="btn-secondary text-center mb-10 tracking-wide font-bol">
          Ingresar
        </Link>

      </form>
    </div>
  );
}


