export interface ProductFilter {
  id?: string;
  slug?: string
  title?: string;
  sizes?: string[];
  gender?: string
}

export interface ProductResume {
    id: string;
    title: string;
    inStock: number;
    price: number;
    sizes: string[];
    gender: string;
    images: ProductImageResume[]
}

export interface ProductImageResume {
    id: string,
    url: string
}

export interface ProductImageUploaded {
  publicId: string,
  url: string
}