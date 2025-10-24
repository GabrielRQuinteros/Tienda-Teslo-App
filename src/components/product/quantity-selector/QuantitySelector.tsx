'use client';

import clsx from "clsx";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5"

interface Props {
    minInput?: number,
    maxInput?: number,
    selectedQuantity: number,
    onChangeQuantity: ( quantity: number )=> void
}


export const QuantitySelector = ({ minInput=1, maxInput=1000, selectedQuantity, onChangeQuantity }: Props) => {

    console.log("ESTE ES MI SELECTED QUANTITY ", selectedQuantity)
    const addItem = () => {
        if( selectedQuantity + 1 >= maxInput  )
            onChangeQuantity(maxInput);
        else
            onChangeQuantity( selectedQuantity + 1 );
    }

    const removeItem = () => {
        if( selectedQuantity -1 <= minInput  )
            onChangeQuantity(minInput);
        else
            onChangeQuantity( selectedQuantity - 1 );
    }


  return (
    <div className="flex flex-row my-2">
        <button onClick={ () =>  removeItem() } >
            <IoRemoveCircleOutline size={30} className={ clsx( {"text-gray-400": selectedQuantity === minInput,
                                                                 "cursor-pointer": selectedQuantity !== minInput,}
             ) }/>
        </button>
        <input  className="w-20 mx-3 px-5 text-center bg-gray-200 rounded-md font-semibold text-gray-600"
                min={minInput}
                max={maxInput}
                value={maxInput > 0 ?selectedQuantity:0}
                inputMode="numeric"
                readOnly
                id="quantity-selector"
                />
        <button onClick={ () => addItem() } >
            <IoAddCircleOutline size={30} className={ clsx( {"text-gray-400": selectedQuantity === maxInput,
                                                             "cursor-pointer": selectedQuantity !== maxInput,}
             ) }/>
        </button>
    </div>
  )
}
