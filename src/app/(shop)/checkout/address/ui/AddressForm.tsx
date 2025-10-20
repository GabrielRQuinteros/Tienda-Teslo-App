'use client';
import { deleteUserAddress, saveUserAddress, UserAddressResponse } from "@/app/actions/address/addressActions";
import { CustomCheckbox } from "@/components/forms/CustomCheckbox";
import { useAddressStore } from "@/components/store/AddressStore";
import { Address, Country } from "@/helpers";
import { useState } from "react";
import { RegisterOptions, SubmitHandler, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { showErrorToast } from "@/helpers/toast-funtions/ToastFunctions";



type FormInputs = {
    firstname: string,
    lastname:string,
    address1: string,
    address2?: string | null,
    zipCode: string, //Código Postal
    city: string,
    country: string,
    phone: string,
}


interface Props {
    countries: Country[],
    defaultUserAddress?: UserAddressResponse | null;
}


export const AddressForm = ( { countries = [], defaultUserAddress }:Props ) => {
    const firstNameValidations: RegisterOptions<FormInputs, "firstname"> = {
        required: 'Este campo es un campo requerido',
    }
    const lastnameValidations: RegisterOptions<FormInputs, "lastname"> = {
        required: 'Este campo es un campo requerido',
    }
    const address1Validations: RegisterOptions<FormInputs, "address1"> = {
        required: 'Este campo es un campo requerido',
    }
    const address2Validations: RegisterOptions<FormInputs, "address2"> = {
    }
    
    const zipcodeValidations: RegisterOptions<FormInputs, "zipCode"> = {
        required: 'Este campo es un campo requerido',
    }
    const countryValidations: RegisterOptions<FormInputs, "country"> = {
        required: 'Este campo es un campo requerido',
    }
    const cityValidations: RegisterOptions<FormInputs, "city"> = {
        required: 'Este campo es un campo requerido',
    }
    const phoneValidations: RegisterOptions<FormInputs, "phone"> = {
        required: 'Este campo es un campo requerido',
    }
    
    
    const [rememberAddressCheck, setRememberAddressCheck] = useState(Boolean(defaultUserAddress));
    const toggleCheckbox = () => setRememberAddressCheck( checkboxValue => !checkboxValue );
    const { setAddressFromStore, getAddressFromStore } = useAddressStore();
    // const storeDefaultAddress: Address | undefined = getAddressFromStore();
    let defaultValues: Partial<FormInputs> = { };
    
    if( defaultUserAddress ) {
      defaultValues= { ...defaultUserAddress, country: defaultUserAddress.country.id };
    }
    
    const { handleSubmit, register, formState:{ isSubmitting, isValid, errors } } = useForm<FormInputs>(
        {
          defaultValues: defaultValues
        }
    );
    const { data: session }= useSession();
    
    const onSubmit: SubmitHandler<FormInputs> = async ( dataInputs: FormInputs ) => {
        const  { address1, address2, city, country, firstname, lastname, phone, zipCode } = dataInputs;
        const  newAddress: Address = { address1, address2, city, country, firstname, lastname, phone, zipCode };
        setAddressFromStore(newAddress);

        if( rememberAddressCheck ) {
          const response = await saveUserAddress( newAddress, session!.user.id );
          if( !response.ok) {
              showErrorToast("Ups! No se pudo guardar la dirección ingresada para futuras compras.")
              return;
          }
        } else {
          const response = await deleteUserAddress(session!.user.id);
          setAddressFromStore(undefined);
          if( !response.ok) {
              showErrorToast("Ups! No se pudo eliminar la dirección guardada para futuras compras.")
              return;
          }
        }
        
    }
    
    
    
    return (
        <form className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2" 
          onSubmit={handleSubmit(onSubmit)}>

          <div className="flex flex-col mb-2">
            <span>Nombres</span>
            <input 
              type="text"
              { ...register('firstname', firstNameValidations ) }
              className="p-2 border rounded-md bg-gray-200"
              placeholder="Nombres"
            />
          </div>

          <div className="flex flex-col mb-2">
            <span>Apellidos</span>
            <input 
              type="text" 
              className="p-2 border rounded-md bg-gray-200"
              { ...register('lastname', lastnameValidations ) }
              placeholder="Apellidos"
            />
          </div>

          <div className="flex flex-col mb-2">
            <span>Dirección</span>
            <input 
              type="text" 
              className="p-2 border rounded-md bg-gray-200"
              { ...register('address1', address1Validations ) }
              placeholder="Dirección"
            />
          </div>

          <div className="flex flex-col mb-2">
            <span>Dirección 2 (opcional)</span>
            <input 
              type="text" 
              className="p-2 border rounded-md bg-gray-200"
              { ...register('address2', address2Validations ) }
              placeholder="Dirección"
            />
          </div>


          <div className="flex flex-col mb-2">
            <span>Código postal</span>
            <input 
              type="text" 
              className="p-2 border rounded-md bg-gray-200"
              { ...register('zipCode', zipcodeValidations ) }
              placeholder="Código Postal"
            />
          </div>

          <div className="flex flex-col mb-2">
            <span>Ciudad</span>
            <input 
              type="text" 
              className="p-2 border rounded-md bg-gray-200"
              placeholder="Ciudad"
              { ...register('city', cityValidations ) }
            />
          </div>

          <div className="flex flex-col mb-2">
            <span>País</span>
            <select 
              className="p-2 border rounded-md bg-gray-200"
              { ...register('country', countryValidations ) }
            >
              <option value="" defaultChecked >[ Seleccione ]</option>
              {countries.map( country => (<option key={country.id} value={country.id} >{country.name}</option>))}
            </select>
          </div>

          <div className="flex flex-col mb-2">
            <span>Teléfono</span>
            <input 
              type="text" 
              className="p-2 border rounded-md bg-gray-200"
              { ...register('phone', phoneValidations ) }
              placeholder="Teléfono"
            />
          </div>

            <div className="flex items-center flex-row gap-2" >
                <CustomCheckbox isChecked={rememberAddressCheck} toggleChecked={toggleCheckbox } />
                <span className="text-sm" >¿Recordar esta dirección?</span>
            </div>


          <div className="flex flex-col mb-2 sm:mt-3 self-center">
            <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="btn-primary flex w-full sm:w-1/2 justify-center cursor-pointer"
                >
                    {isSubmitting ? "Procesando..." : "Siguiente"}
            </button>
          </div>


        </form>
  )
}
