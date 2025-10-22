import { CartProduct } from "@/components/store/CartStore";
import { currencyFormat } from "@/helpers";

interface Props {
    productsList: CartProduct[]
}

export const OrderResume = ( { productsList }:Props ) => {

    const productsCount = productsList.reduce((accumulator, product) => accumulator + product.quantity, 0);
    const subtotal = productsList.reduce((accumulator, product) => accumulator + product.quantity * product.price, 0);
    const taxPersent = 0.15;
    const taxes = subtotal *  taxPersent;
    const total = subtotal + taxes;
    return (
    <>
      <h2 className="w-full text-center text-xl font-bold">Resumen de Orden</h2>
      <div className="grid grid-cols-3 mt-3 gap-3">
        <span className="col-span-2 font-semibold">Nro. Productos</span>
        <span className="col-span-1 text-right font-semibold">{productsCount} artículos</span>

        <span className="col-span-2">Subtotal</span>
        <span className="col-span-1 text-right">{currencyFormat(subtotal)}</span>

        <span className="col-span-2">Impuestos (15%)</span>
        <span className="col-span-1 text-right">{currencyFormat(taxes)}</span>

        <span className="col-span-2 text-xl font-bold mt-auto">Total</span>
        <span className="col-span-1 text-right text-xl font-bold">{currencyFormat(total)}</span>
      </div>
    </>
  );
};
