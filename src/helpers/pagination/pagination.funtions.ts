import { PaginationResult } from "../interfaces/pagination.interfaces";

export function calculatePagination( totalItems: number, page: number, pageSize: number ): PaginationResult {
  const totalPages = Math.ceil(totalItems / pageSize);
  
  // Ajustar página dentro de límites
  const currentPage = Math.min(Math.max(page, 1), totalPages || 1);

  return {
    totalItems,
    pageSize,
    currentPage,
    totalPages,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}