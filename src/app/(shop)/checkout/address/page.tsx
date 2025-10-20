import { Title } from "@/components";
import { AddressForm } from "./ui/AddressForm";
import { getAllCountries } from "@/app/actions/countries/countriesActions";
import { getServerSession, Session } from "next-auth";
import { getUserAddress, UserAddressResponse } from "@/app/actions/address/addressActions";
import { redirect } from "next/navigation";



export const metadata = {
 title: 'Checkout-Dirección',
 description: 'Ingrese la dirección de entrega de su orden de compra',
};

export default async function CheckoutPage() {

  const countries = await getAllCountries();
  const session: Session | null = await getServerSession();
  const userId = session!.user.

  const response = await getUserAddress( userId );
  if( ! response.ok ) {
    redirect('/');
  }
  const userAddress = response.data as UserAddressResponse | null;

   return (
    <div className="flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0">
      <div className="w-full  xl:w-[1000px] flex flex-col justify-center text-left">
        <Title title="Dirección" subtitle="Dirección de entrega" />
        <AddressForm countries={countries} defaultUserAddress={userAddress} />
      </div>
    </div>
  );
}