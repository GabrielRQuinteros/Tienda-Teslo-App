import { OrderResume } from "@/actions/orders/interfaces/interfases"
import Link from "next/link"
import { IoCardOutline } from "react-icons/io5"

interface Props {
    orderResumed: OrderResume
}

export const OrderTableRow = ( {orderResumed:{ firstName, lastName, isPaid, id } }: Props ) => {
    const fullname = `${firstName} ${lastName}`;
  return (
    <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">

              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{id}</td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {fullname}
              </td>
              <td className="flex items-center text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {
                    isPaid? 
                    <>
                        <IoCardOutline className="text-green-800" />
                        <span className='mx-2 text-green-800'>Pagada </span>
                    </>
                    :
                    <>
                        <IoCardOutline className="text-red-800" />
                        <span className='mx-2 text-red-800'>No Pagada</span>
                    </>
                }

              </td>
              <td className="text-sm text-gray-900 font-light px-6 ">
                <Link href={ `/orders/${id}` } className="hover:underline font-bold">
                  Ver orden
                </Link>
              </td>
    </tr>
  )
}
