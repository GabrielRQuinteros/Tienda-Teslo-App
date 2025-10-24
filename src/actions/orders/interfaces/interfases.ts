import { Size } from "@/components";
import { Address } from "@/helpers";

export interface CreateOrderResponse {
    id: string;
    subTotal: number;
    tax: number;
    total: number;
    itemsInOrder: number;
    isPaid: boolean;
    paidAt: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
    userId: string;
}

export interface OrderRequest {
    address: Address,
    orderItems: OrderItem[]
}

export interface OrderItem {
    productId: string, 
    size: Size,
    quantity: number
}

export interface OrderAddress {
    id: string;
    firstName: string;
    lastName: string;
    address: string;
    address2: string | null;
    postalCode: string;
    city: string;
    phone: string;
    countryId: string;
    orderId: string;
}

export interface OrderItemWithProduct {
    id: string;
    quantity: number;
    price: number;
    size: Size;
    orderId: string;
    productId: string;
    product: {
        id: string;
        title: string;
        description: string | null;
        inStock: number;
        price: number;
        sizes: string[];
        slug: string;
        type: string;
        tags: string[];
        gender: string;
        categoryId: string;
        images: {
            id: number;
            url: string;
        }[];
        
    };
}

export interface OrderResponse {
    id: string;
    subTotal: number;
    tax: number;
    total: number;
    itemsInOrder: number;
    isPaid: boolean;
    paidAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    OrderAddress: OrderAddress;
    OrderItem: OrderItemWithProduct[];
}


export interface OrderResume {
    id: string;
    isPaid: boolean;
    firstName: string;
    lastName: string;
}

