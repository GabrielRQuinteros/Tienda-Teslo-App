
/** Convierte una fecha en un string a un objeto Date.
 * @param value 
 * @returns 
 */
export function parseDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return !isNaN(date.getTime()) ? date : undefined;
}
