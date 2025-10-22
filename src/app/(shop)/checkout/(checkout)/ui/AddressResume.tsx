'use client';

import { CountryResponse, getCountryById } from "@/app/actions/address/addressActions";
// import { getCountryById } from "@/app/actions/address/addressActions";
import { Address } from "@/helpers";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";


interface Props {
    address: Address | null
}

export const AddressResume = ( { address }: Props ) => {

    const router = useRouter();
    const [country, setCountry] = useState<string>("");
    if( ! address )
        redirect( '/checkout/address' );

    const fullname = `${address.firstname} ${ address?.lastname }`;
    
    useEffect(() => {
    // Solo buscamos el país si tenemos el id
        if (!address?.country) return;

        getCountryById(address.country).then((resp) => {
            if (!resp.ok) {
                router.replace("/checkout/address");
                return;
            }
            setCountry((resp.data as CountryResponse).name);
        });
    }, [address.country, router]);

    return (
        <>
            <h2 className="w-full text-center text-xl font-bold mb-2">Dirección de entrega</h2>
            <div className="grid grid-cols-2 mb-10" >
                <div className="col-span-1">
                    <p className="text-lg" >Nombre usuario:</p>
                    <p>Calle y numero:</p>
                    <p>Ciudad:</p>
                    <p>País:</p>
                    <p>Código Postal:</p>
                    <p>Teléfono:</p>
                </div>
                <div className="col-span-1">
                    <p className="text-lg" >{fullname}</p>
                    <p>{address?.address1}</p>
                    <p>{address?.city}</p>
                    <p>{country}</p>
                    <p>{address.zipCode}</p>
                    <p>{address.phone}</p>
                </div>
                </div>
        </>
  );
}
