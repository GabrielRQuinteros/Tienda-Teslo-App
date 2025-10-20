import { create } from 'zustand'
import { Size } from '../interfaces';
import { persist } from 'zustand/middleware';

interface CartState {
  productsInCart: CartProduct[]
}

export interface CartProduct {
    productId: string,
    slug: string,
    title: string,
    price: number,
    quantity: number,
    size: Size,
    image: string

}

export interface CartResume {
    total: number,
    subtotal: number,
    productsQuantity: number,
    taxes: number
}

interface Actions {
    addCartProduct: ( cartProduct: CartProduct ) => void,
    updateProductQuantity: ( cartProduct: CartProduct, quantity: number ) => void,
    removeCartProduct: (cartProduct: CartProduct ) => void,
    clearCart: () => void,
    getTotalItems: () => number,
    getResumeCartInfo: () => CartResume

}

type CartStore = CartState & Actions;

/** Permite usar el Store del carrito de compras
 */
export const useCartStore = create<CartStore>()(
  persist<CartStore>(
    (set, get) => ({
      productsInCart: [],
      clearCart: () => set({ productsInCart: [] }),
      addCartProduct: ( newProduct: CartProduct ) => {
        const { productsInCart } = get();
        set({ productsInCart: handleAddCartProduct(productsInCart, newProduct) });
      },
      getTotalItems: () => {
        const { productsInCart } = get();
        return productsInCart.reduce((acumulador, productoActual) => (acumulador + productoActual.quantity), /*Valor inicial */ 0 );
      },
      updateProductQuantity: ( cartProduct: CartProduct, quantity: number ) =>{
        const { productsInCart } = get();
        set( { productsInCart: handleUpdateProductQuantity( productsInCart, cartProduct, quantity ) } )
      },
      removeCartProduct: (cartProduct: CartProduct ) =>  {
        const { productsInCart } = get();
        set( { productsInCart: handleRemoveProductInCart( productsInCart, cartProduct ) } )
      },
      getResumeCartInfo: () => {
        const { productsInCart }= get();
        return handleResumeCartInfo( productsInCart );
      }
    }),
    {
      name: 'shopping-cart',
    }
  )
);



/** Agregar los productos al array de productos, si el nuevo producto existe en el array agrega solo la cantidad del nuevo producto
 * si no existe en el array agrega la una nueva entrada/registro al array.
 * @param productsInCart 
 * @param newProduct 
 * @returns 
 */
function handleAddCartProduct( productsInCart: CartProduct[], newProduct: CartProduct ): CartProduct[] {
  const existsInCart = productsInCart.find(
    (p) => p.productId === newProduct.productId && p.size === newProduct.size
  );

  if (!existsInCart) {
    return [...productsInCart, newProduct];
  }

  return productsInCart.map((p) => {
    if( p.productId == newProduct.productId && p.size === newProduct.size){
      p.quantity+= newProduct.quantity;
    } 
    return p; 
  });
}

/** Dada una lista de productos del carrito, busca un producto del carrito y actualiza la cantidad si es que esta en la lista.
 * @param productsInCart 
 * @param cartProduct 
 * @param quantity 
 */
function handleUpdateProductQuantity(productsInCart: CartProduct[], selectedProduct: CartProduct, quantity: number): CartProduct[] | undefined {
  return productsInCart.map( p => {
    if( p.productId == selectedProduct.productId && p.size == selectedProduct.size )
      p.quantity= quantity;
    return p;
  } )
}


/** Filtra y me devuelve un array de los productos en el carrito que no sean el producto pasado por parametro.
 * @param productsInCart 
 * @param productToRemove 
 * @returns 
 */
function handleRemoveProductInCart(productsInCart: CartProduct[], productToRemove: CartProduct): CartProduct[] | undefined {
  return productsInCart.filter( p => !(p.productId == productToRemove.productId && p.size == productToRemove.size) );
}


/** Esta Función devuelve el resumen de la orden de compra del carrito.
 * @param productsInCart 
 */
function handleResumeCartInfo(productsInCart: CartProduct[]): CartResume {
  
  const productsQuantity = productsInCart.reduce((acumulador, productoActual) => (acumulador + productoActual.quantity), /*Valor inicial */ 0 );
  const subtotal = productsInCart.reduce((acumulador, productoActual) => (acumulador + ( productoActual.quantity * productoActual.price ) ), /*Valor inicial */ 0 );
  const taxes = 0.15 * subtotal;
  const total = taxes + subtotal;

  const resume: CartResume = {
    productsQuantity,
    subtotal,
    taxes,
    total,

  }
  return resume;
}

