'use client';
import { Size } from "@/components/interfaces"
import clsx from "clsx";

interface Props {
    selectedSize: Size | undefined;
    avialableSizes: Size[];
    onSizeSelect: ( size: Size ) => void 
}



export const SizeSelector = ({ selectedSize, avialableSizes, onSizeSelect }: Props) => {

  return (
    <div className="my-5" >
        <h3 className="font-bold mb-4">Tallas disponibles</h3>
        <div className="flex">
            { avialableSizes.map( size => 
                <button key={size}
                        className={ clsx(  "px-2 py-1 text-lg hover:underline",
                                            { "text-gray-500 underline": selectedSize == size }
                                        )
                                 }
                        onClick={ () => onSizeSelect(size) }
                    >
                    {size}
                </button>
             ) }
        </div>
    </div>
  )
}
