import { OrderResponse } from "@/actions/orders/interfaces/interfases"
import { CustomPaypalButton } from "../paypal"

interface Props {
    order: OrderResponse
}

export const PaymentSection = ( { order }: Props ) => {
    
    
    if( order.isPaid )
        return <></>

    return (
        <div className="mt-2 z-0"  >
            <CustomPaypalButton showSpinner={true} amount={order.total} tesloOrderId={order.id}/>
        </div>
    )
}
