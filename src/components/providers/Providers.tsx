'use client';

import { SessionProvider } from 'next-auth/react';
import { PayPalScriptProvider} from "@paypal/react-paypal-js";

interface Props {
  children: React.ReactNode;
}

export const Providers = ({ children }: Props) => {

  const paypalClientId: string | undefined = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  if( !paypalClientId)
    console.log("No encontre el Client ID de Paypal");
  return (
      <SessionProvider>
        <PayPalScriptProvider options={
          { clientId: paypalClientId || "",
            intent: "capture",
            currency: 'USD',
           }
          }>
          {children}
        </PayPalScriptProvider>
      </SessionProvider>
      )
};