import { ProductResume } from "@/actions/products/interfaces/interface"
import { ProductTableRow } from "./ProductsTableRow"

interface Props {
    resumedProductList: ProductResume[]
}
export const ProductsTable = ( { resumedProductList }: Props ) => {
  return (
    <table className="min-w-full">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th scope="col" className="text-sm font-semibold text-gray-900 px-6 py-4 text-left">
                Imagen
              </th>
              <th scope="col" className="text-sm font-semibold text-gray-900 px-6 py-4 text-left">
                #ID
              </th>
              <th scope="col" className="text-sm font-semibold text-gray-900 px-6 py-4 text-left">
                Nombre
              </th>
              <th scope="col" className="text-sm font-semibold text-gray-900 px-6 py-4 text-left">
                Precio
              </th>
              <th scope="col" className="text-sm font-semibold text-gray-900 px-6 py-4 text-left">
                Stock
              </th>
              <th scope="col" className="text-sm font-semibold text-gray-900 px-6 py-4 text-left">
                Talles
              </th>
              <th scope="col" className="text-sm font-semibold text-gray-900 px-6 py-4 text-left">
                Genero
              </th>
              <th scope="col" className="text-sm font-semibold text-gray-900 px-6 py-4 text-left">
                Opciones
              </th>
            </tr>
          </thead>
        <tbody>
            { resumedProductList.map( productResumed => ( <ProductTableRow key={productResumed.id} productResumed={productResumed} /> ) ) }
        </tbody>
    </table>
  )
}
