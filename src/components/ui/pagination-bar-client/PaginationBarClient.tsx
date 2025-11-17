"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  showFirstLast?: boolean;
}

export const PaginationBarClient = ({ currentPage, totalPages, showFirstLast = false }: PaginationBarProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const getPageLink = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());

    return `${pathname}?${params.toString()}`;
  };

  const pages: number[] = [];
  if (currentPage > 1) pages.push(currentPage - 1);
  pages.push(currentPage);
  if (currentPage < totalPages) pages.push(currentPage + 1);

  return (
    <div className="flex justify-center border-2 border-gray-300 rounded-full w-fit py-2 px-12 justify-self-center m-4 md:px-54 gap-6">
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
