
import type { Metadata } from "next";
import { Toaster } from 'react-hot-toast';

import "./globals.css";
import { geistMono, geistSans } from "@/config/fonts";
import { Providers } from "@/components";
import { toastDefaultOptions } from "@/components/toasts/toastBase.config";


export const metadata: Metadata = {
  description: "Teslo Shop una tienda para encontrá la prenda de ropa que estabas buscando para hombres, mujeres o niños. Asociada con la renombrada marca Tesla para llevarte con nuestras prendas hacia el futuro.",
  title: {
    template: '%s - Teslo | Shop',
    default: 'Home - Teslo | Shop'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions= { toastDefaultOptions }
          />
        </Providers>
      </body>
    </html>
  );
}
