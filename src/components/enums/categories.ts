// Definición tipo Category
interface Category {
  id: string;
  name: string;
}

// Constante con categorías (simulando enum)
const Categories = {
  KIDS: { id: "kids", name: "kids" },
  MEN: { id: "men", name: "men" },
  WOMEN: { id: "women", name: "women" },
  UNISEX: { id: "women", name: "women" },
} as const;

// Array de categorías
const CategoryList: Category[] = Object.values(Categories);

// Helpers:
/**
 * Comprueba si un id de categoría está en la lista de categorías
 * @param id 
 * @returns 
 */
export function isValidCategory(id: string): boolean {
  return CategoryList.some(c => c.id === id);
}
