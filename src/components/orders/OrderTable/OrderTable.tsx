import { OrderResume } from "@/actions/orders/interfaces/interfases"
import { OrderTableRow } from "./OrderTableRow"

interface Props {
    resumedOrdersList: OrderResume[]
}
export const OrderTable = ( { resumedOrdersList }: Props ) => {
  return (
    <table className="min-w-full">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th scope="col" className="text-sm font-semibold text-gray-900 px-6 py-4 text-left">
                #ID
              </th>
              <th scope="col" className="text-sm font-semibold text-gray-900 px-6 py-4 text-left">
                Receptor
              </th>
              <th scope="col" className="text-sm font-semibold text-gray-900 px-6 py-4 text-left">
                Estado
              </th>
              <th scope="col" className="text-sm font-semibold text-gray-900 px-6 py-4 text-left">
                Opciones
              </th>
            </tr>
          </thead>
        <tbody>
            { resumedOrdersList.map( order => ( <OrderTableRow key={order.id} orderResumed={order} /> ) ) }
        </tbody>
    </table>
  )
}
