

export interface PaginatedResponse<T> {
  data: T[];                // Los ítems de la página actual
  currentPage: number;      // Página actual
  pageSize: number;         // Cantidad de ítems por página
  totalPages: number;       // Cantidad total de páginas
  totalItems: number;       // Total de ítems en la colección
  hasNext: boolean;         // ¿Hay página siguiente?
  hasPrev: boolean;         // ¿Hay página anterior?
}

export const DEFAULT_PAGE_SIZE=12;

export interface PaginationResult {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}