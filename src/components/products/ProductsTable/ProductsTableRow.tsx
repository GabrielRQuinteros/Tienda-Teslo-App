import { ProductResume } from "@/actions/products/interfaces/interface"
import { ProductImage } from "@/components/product/product-image/ProductImage"
import { currencyFormat } from "@/helpers"
import Image from "next/image"
import Link from "next/link"

interface Props {
    productResumed: ProductResume
}

export const ProductTableRow = ( {productResumed:{ id, gender, inStock, price, sizes, title, images } }: Props ) => {
  return (
    <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">

              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <ProductImage 
                  src={images[0]?.url}
                  alt={title}
                  width={80}
                  height={80}
                  className="w-20 h-20"
                  />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{title}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{currencyFormat(price)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{inStock}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sizes.join(",")}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{gender}</td>
              <td className="text-sm text-gray-900 font-light px-6 ">
                <Link href={ `/admin/products/${id}` } className="hover:underline font-bold">
                  Editar
                </Link>
              </td>
    </tr>
  )
}
