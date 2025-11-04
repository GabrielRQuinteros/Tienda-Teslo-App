import { OrderResume } from "@/actions/orders/interfaces/interfases"
import { OrderCard } from "./OrderCard/OrderCard"


interface Props {
  resumedOrdersList: OrderResume[]
}

export const OrderCardList = ({ resumedOrdersList }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      {resumedOrdersList.map(order => (
        <OrderCard key={order.id} orderResumed={order} />
      ))}
    </div>
  )
}