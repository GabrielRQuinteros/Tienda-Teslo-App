'use client';
import { setTransacionId, verifyOrderTransaction } from "@/actions/payments/actions";
import { showErrorToast, showSuccessToast } from "@/helpers/toast-funtions/ToastFunctions";
import { CreateOrderActions, CreateOrderData, OnApproveActions, OnApproveData, type PayPalButtonStyle } from "@paypal/paypal-js";
import {
    PayPalButtons,
    usePayPalScriptReducer
} from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";

interface Props {
    showSpinner: boolean,
    tesloOrderId: string,
    amount: number
}


export const CustomPaypalButton = ( { showSpinner, tesloOrderId, amount }: Props ) => {

    const router = useRouter();
    const style: PayPalButtonStyle = {
        color: "blue", // Estilo azul clásico
        shape: "pill", // Forma rectangular
        label: "paypal", // Etiqueta "Pagar con PayPal"
        height: 40, // Altura del botón
        layout: "vertical", // Disposición vertical
    };

    const [{ isPending }] = usePayPalScriptReducer();

    if( isPending ) {
        return ( 
            <div className="animate-pulse h-[118px]">
                <div className="h-11 bg-gray-300 rounded"></div>
                <div className="h-11 bg-gray-300 rounded mt-2"></div>
                <div className="h-3 bg-gray-300 rounded mt-2"></div>
            </div>
         )
    }

    const roundedAmount = Math.ceil(amount * 100) / 100;

const createOrder = async ( data: CreateOrderData, actions: CreateOrderActions ): Promise<string> => {
    const paypalTransactionId = await actions.order.create(
    {
        intent: "CAPTURE",
        purchase_units: [ 
            {
                invoice_id: tesloOrderId,
                amount: {
                    value: roundedAmount.toFixed(2),
                    currency_code: "USD"
                },
            }
            ]
    });

    if( ! paypalTransactionId ) {
        showErrorToast("Ha ocurrido un error y no se ha podido realizar la transacción.")
        return "";
    }
    await setTransacionId( tesloOrderId, paypalTransactionId )

    return paypalTransactionId;
}

    const onApprove = async (data: OnApproveData, actions: OnApproveActions) =>{
        const details = await actions.order?.capture();
        if( !details)
            return;
        const response = await verifyOrderTransaction( details.id! );
        if( !response.ok ) {
            showErrorToast("No se pudo verificar el pago. Contacte al administrador");
            return;
        }
        const isPaid: boolean = response.data as boolean;
        if( isPaid )
            showSuccessToast("La orden ha sido pagada con éxito");
        else
            showErrorToast("Al verificar la orden, su proveedor su proveedor de pagos no ha confirmado el pago");
        router.refresh();
    }


    return (
        <div className="">
            { (showSpinner && isPending) && <div className="spinner" /> }
            <PayPalButtons
                style={style}
                disabled={false}
                forceReRender={[style]}
                fundingSource={undefined}
                createOrder={createOrder}
                onApprove={onApprove}
            />
        </div>
    );
}