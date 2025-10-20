export interface Address {
  firstname: string,
  lastname:string,
  address1: string,
  address2?: string | null,
  zipCode: string, //Código Postal
  city: string,
  country: string,
  phone: string,
}