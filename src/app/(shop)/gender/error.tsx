// Next necesita que el archivo este sea Client Side aun cuando el error se produce desde el lado del servidor.
'use client';
import { PageNotFound } from "@/components";

export default function GenderErrorPage(  ) {

  return (
    <PageNotFound/>
  );
}