import { OrderResume } from "@/actions/orders/interfaces/interfases"
import Link from "next/link"
import { IoArrowForward, IoCardOutline, IoTicketOutline } from "react-icons/io5"

interface Props {
  orderResumed: OrderResume
}

export const OrderCard = ({ orderResumed: { id, firstName, lastName, isPaid } }: Props) => {
  const fullName = `${firstName} ${lastName}`

  return (
    <div className="bg-white border-2 border-gray-300 rounded-xl p-4 shadow-sm">
      
      <div className="flex flex-row justify-between mb-4 mt-2">
        <div className="flex justify-between items-center gap-1">
          <IoTicketOutline className="text-gray-700" size={20} />
          <span className="text-sm font-semibold text-gray-800">
            ID: #{id}
          </span>
        </div>
        <div className="flex items-center">
            <IoCardOutline className={isPaid ? "text-green-800" : "text-red-800"} />
            <span className={`ml-1 text-sm ${isPaid ? "text-green-800" : "text-red-800"}`}>
              {isPaid ? "Paga" : "No paga"}
            </span>
        </div>
      </div>

      <p className="text-gray-700 text-sm mb-4"> <strong>Receptor: </strong>{fullName}</p>

      <div className="mt-3 flex flex-row justify-end">
        <Link
          href={`/orders/${id}`}
          className="text-gray-500 hover:underline text-[16px] font-semibold flex items-center gap-2"
        >
          Ver mas <IoArrowForward size={20} />
        </Link>
      </div>
    </div>
  )
}