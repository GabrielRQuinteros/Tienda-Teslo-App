import { string } from "zod";

export interface Product {
    id?: string,
    description?: string;
    images: string[];
    inStock: number;
    price: number;
    sizes: Size[];
    slug: string;
    tags: string[];
    title: string;
    type: Types;
    gender: Gender
}

export type Size = 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL';
export type Types = 'shirts'|'pants'|'hoodies'|'hats'|"";
export type Gender = 'men'|'women'|'kids'|'unisex';


export interface ProductFilters {
  gender?: Gender;
  type?: Types;
  sizes?: Size[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  tags?: string[];
}

export interface Country {
  name: string;
  id: string;
}

export interface SeedData {
    products: Product[],
    users: SeedUser[],
    countries: Country[]
}


interface SeedUser {
  id?: string,
  name: string
  email: string,
  roles: string[],
  password?: string
}



export interface ProductWithImages {
    id?: string,
    description?: string;
    images: FullImage[];
    inStock: number;
    price: number;
    sizes: Size[];
    slug: string;
    tags: string[];
    title: string;
    type: Types;
    gender: Gender
}

export interface FullImage {
  id: string,
  url: string
}