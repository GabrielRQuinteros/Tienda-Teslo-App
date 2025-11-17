import { ProductCard } from "./ProductsCard"
import { ProductResume } from "@/actions/products/interfaces/interface"

interface Props {
  productsResumedList: ProductResume[]
}

export const ProductCardList = ({ productsResumedList: resumedOrdersList }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      {resumedOrdersList.map(productResumed => (
        <ProductCard key={productResumed.id} productResumed={productResumed} />
      ))}
    </div>
  )
}