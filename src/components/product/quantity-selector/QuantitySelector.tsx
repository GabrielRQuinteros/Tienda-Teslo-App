'use client';

import clsx from "clsx";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5"

interface Props {
    minInput: number,
    maxInput: number,
    selectedQuantity: number,
    onChangeQuantity: ( quantity: number )=> void
}


export const QuantitySelector = ({ minInput, maxInput, selectedQuantity, onChangeQuantity }: Props) => {

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
            <IoRemoveCircleOutline size={30} className={ clsx( {"text-gray-400": selectedQuantity === minInput} ) }/>
        </button>
        <input  className="w-20 mx-3 px-5 text-center bg-gray-200 rounded-md font-semibold text-gray-600"
                min={minInput}
                max={maxInput}
                value={selectedQuantity}
                inputMode="numeric"
                readOnly
                />
        <button onClick={ () => addItem() } >
            <IoAddCircleOutline size={30} className={ clsx( {"text-gray-400": selectedQuantity === maxInput} ) }/>
        </button>
    </div>
  )
}
