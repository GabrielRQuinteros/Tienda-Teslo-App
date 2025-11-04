import { CustomPaypalButton, PaymentSection, Size, Title } from "@/components";
import clsx from "clsx";
import { IoCardOutline } from "react-icons/io5";
import { AddressResume } from "../../checkout/(checkout)/ui/AddressResume";
import { OrderResume } from "../../checkout/(checkout)/ui/OrderResume";
import { getOrderById } from "@/actions";
import { showErrorToast } from "@/helpers/toast-funtions/ToastFunctions";
import { redirect } from "next/navigation";
import { OrderResponse } from "@/actions/orders/interfaces/interfases";
import { Address } from "@/helpers";
import { CartProduct } from "@/components/store/CartStore";
import { ProductsResume } from "@/components/cart/ui/products-resume/ProductsResume";
import { OrderStatus } from "@/components/cart/ui/order-status/OrderStatus";

interface Props {
  params: {
    id: string;
  };
}

export default async function OrderPage({ params }: Props) {
  const { id } = await params;
  const response = await getOrderById(id);

  if( ! response.ok ) {
    showErrorToast(response.message!);
    redirect('/');
  }

  const order = ( response.data as OrderResponse); 

  const address: Address = {
    firstname: order.OrderAddress.firstName,
    lastname: order.OrderAddress.lastName,
    address1: order.OrderAddress.address,
    address2: order.OrderAddress.address2 ?? '',
    zipCode: order.OrderAddress.postalCode,
    city: order.OrderAddress.city,
    country: order.OrderAddress.countryId,
    phone: order.OrderAddress.phone,
  };

  const products: CartProduct[] = order.OrderItem.map(item => ({
      productId: item.productId,
      slug: item.product.slug,
      title: item.product.title,
      price: item.price,
      quantity: item.quantity,
      size: item.size as Size,
      image: item.product.images[0].url
    }));


  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Orden #${id}`} />
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10">
          {/* Carrito */}
          <div className="flex flex-col mt-5">
            {/* Items List */}
            <div className="flex flex-col gap-2 mt-4">
              <OrderStatus isPaid={ order.isPaid } />
              <ProductsResume products={products} />
            </div>
          </div>

          {/* Checkout - Resumen de Orden de Compra */}
          <div className="bg-white p-7 shadow-lg rounded-xl flex flex-col mt-4 md:mt-0">
            <AddressResume address={ address }/>
            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />
            <OrderResume productsList={products}/>

            <div className="mt-5 w-full">
              
            </div>
            <PaymentSection order={order}  />
          </div>
        </div>
      </div>
    </div>
  );
}
