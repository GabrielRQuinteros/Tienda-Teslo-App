import Link from "next/link";
import { IoPricetagOutline, IoArrowForward, IoMaleFemaleOutline, IoShirtOutline } from "react-icons/io5";

interface Props {
  productResumed: {
    id: string;
    gender: string;
    inStock: number;
    price: number;
    sizes: string[];
    title: string;
  };
}

export const ProductCard = ({
  productResumed: { id, gender, inStock, price, sizes, title },
}: Props) => {
  return (
    <div className="bg-white border-2 border-gray-300 rounded-xl p-4 shadow-sm">
      {/* Encabezado */}
      <div className="flex flex-row justify-between mb-4 mt-2">
        <div className="flex justify-between items-center gap-1">
          <IoPricetagOutline className="text-gray-700" size={20} />
          <span className="text-sm font-semibold text-gray-800">
            ID: #{id}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <IoMaleFemaleOutline className="text-gray-700" size={18} />
          <span className="text-sm text-gray-700 capitalize">{gender}</span>
        </div>
      </div>

      {/* Información del producto */}
      <div className="mb-3">
        <p className="text-gray-800 font-semibold text-lg">{title}</p>
        <p className="text-gray-600 text-sm mt-1">
          <strong>Precio:</strong> ${price.toFixed(2)}
        </p>
        <p className="text-gray-600 text-sm mt-1">
          <strong>Stock:</strong> {inStock > 0 ? `${inStock} disponibles` : "Sin stock"}
        </p>
        <div className="text-gray-600 text-sm mt-1 flex items-center gap-1">
          <IoShirtOutline size={16} />
          <strong>Talles:</strong>
          <span>{sizes.join(", ") || "N/A"}</span>
        </div>
      </div>

      {/* Ver más */}
      <div className="mt-3 flex flex-row justify-end">
        <Link
          href={`/admin/products/${id}`}
          className="text-gray-500 hover:underline text-[16px] font-semibold flex items-center gap-2"
        >
          Editar <IoArrowForward size={20} />
        </Link>
      </div>
    </div>
  );
};
