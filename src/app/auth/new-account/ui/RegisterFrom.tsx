'use client'

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { SubmitHandler, useForm } from "react-hook-form";
import { loginUser, registerUser } from "@/actions";

type FormInputs = {
  name: string;
  email: string;
  password: string;
}



export const RegisterFrom = () => {

  const [errorMesage, setErrorMesage] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();

  const  onSubmit: SubmitHandler<FormInputs> = async ( data ) => {
    setErrorMesage('')

    const { name, email, password } = data;

    // Server action
    const resp = await registerUser(name, email, password);

    if( !resp.ok ) {
      setErrorMesage( resp.message )
      return
    };

    await loginUser( email.toLowerCase(), password );

    window.location.replace('/');

  }

  return (
    <form onSubmit={ handleSubmit( onSubmit ) } className="flex flex-col">

        {/* {
          errors.name?.type === 'required' && (
            <span className="text-red-500">* EL nombre es requerido</span>
          )
        } */}

        <label htmlFor="name">Nombre completo</label>
        <input
          autoFocus
          className={
            clsx(
              "px-5 py-2 border bg-gray-200 rounded mb-5",
              {
                'border-red-500': errors.name
              }
            )
          }
          type="text"
          { ...register('name', { required: true } ) }
        />

        <label htmlFor="email">Correo electrónico</label>
        <input
          className={
            clsx(
              "px-5 py-2 border bg-gray-200 rounded mb-5",
              {
                'border-red-500': errors.email
              }
            )
          }
          type="email"
          { ...register('email', { required: true, pattern: /^\S+@\S+$/i } ) }
        />


        <span className="text-red-500"> {errorMesage} </span>


        <label htmlFor="password">Contraseña</label>
        <input
          className={
            clsx(
              "px-5 py-2 border bg-gray-200 rounded mb-5",
              {
                'border-red-500': errors.password
              }
            )
          }
          type="password" 
          { ...register('password', { required: true, minLength: 6 }) }
        />

        <button
          type="submit"
          className="btn-primary">
          Crear 
        </button>


        {/* divisor l ine */ }
        <div className="flex items-center my-5">
          <div className="flex-1 border-t border-gray-500"></div>
          <div className="px-2 text-gray-800">O</div>
          <div className="flex-1 border-t border-gray-500"></div>
        </div>

        <Link
          href="/auth" 
          className="btn-secondary text-center">
          Ingresar
        </Link>

      </form>
  )
}
