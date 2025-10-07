import Link from "next/link";

export interface PaginationBarProps {
  currentPage: number;       // La página actual
  totalPages: number;        // Cantidad total de páginas
  getPageLink: (page: number) => string; // Función que genera el link
  showFirstLast?: boolean;   // Mostrar botones "Primera" y "Última"
}

export const PaginationBar = ({  currentPage,  totalPages,  getPageLink,  showFirstLast = false }: PaginationBarProps) => {
  
    if (totalPages <= 1) return <></>;

  // Calculamos páginas a mostrar (prev, current, next)
  const pages: number[] = [];
  if (currentPage > 1) pages.push(currentPage - 1);   // anterior
  pages.push(currentPage);                            // actual
  if (currentPage < totalPages) pages.push(currentPage + 1); // siguiente

  return (
    <div className="flex justify-center border-2 border-gray-300 rounded-full w-fit py-2  px-12 justify-self-center m-4 md:px-54 gap-6">
      <nav aria-label="Page navigation">
        <ul className="flex gap-1">
          {/* Botón Primera */}
          {showFirstLast && (
            <li>
              <Link
                href={getPageLink(1)}
                aria-disabled={currentPage === 1}
                className={`px-3 font-bold py-1 rounded-lg transition-all duration-300 ${
                  currentPage === 1
                    ? "text-gray-400 pointer-events-none"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                Primera
              </Link>
            </li>
          )}

          {/* Páginas dinámicas */}
          {pages.map((page) => (
            <li key={page}>
              <Link
                href={getPageLink(page)}
                aria-current={page === currentPage ? "page" : undefined}
                className={`px-3 font-bold py-1 rounded transition-all duration-300 ${
                  page === currentPage
                    ? "bg-gray-500 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                {page}
              </Link>
            </li>
          ))}

          {/* Botón Última */}
          {showFirstLast && (
            <li>
              <Link
                href={getPageLink(totalPages)}
                aria-disabled={currentPage === totalPages}
                className={`px-3 font-bold py-1 rounded transition-all duration-300 ${
                  currentPage === totalPages
                    ? "text-gray-400 pointer-events-none"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                Última
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};