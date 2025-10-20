
/** Función que formatea números a valor de moneda en dolares 
 */
export const currencyFormat = (value: number): string => {
    return Intl.NumberFormat( 'en-US' , {
    style: "currency",
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,  
}).format(value);
}