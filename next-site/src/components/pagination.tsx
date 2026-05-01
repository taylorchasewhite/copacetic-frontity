import Link from "next/link";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";

interface PaginationProps {
  page: number;
  totalPages: number;
  /** Base path WITHOUT trailing slash, e.g. "/category/nature" or "" for home. */
  basePath: string;
  className?: string;
}

function pageHref(basePath: string, page: number): string {
  const base = basePath || "";
  if (page <= 1) return base || "/";
  return `${base}/page/${page}`;
}

export function Pagination({
  page,
  totalPages,
  basePath,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const linkBase =
    "inline-flex items-center gap-1 text-sm text-primary-600 transition-colors hover:text-accent-500";

  return (
    <nav
      aria-label="Pagination"
      className={`flex items-center justify-between border-t border-primary-100 pt-6 text-primary-400 ${className}`}
    >
      {hasPrev ? (
        <Link
          href={pageHref(basePath, page - 1)}
          aria-label="Newer posts"
          className={linkBase}
        >
          <IoIosArrowRoundBack className="h-5 w-5" />
          Newer
        </Link>
      ) : (
        <span className="invisible">placeholder</span>
      )}

      <span className="text-xs text-primary-400">
        Page {page} of {totalPages}
      </span>

      {hasNext ? (
        <Link
          href={pageHref(basePath, page + 1)}
          aria-label="Older posts"
          className={linkBase}
        >
          Older
          <IoIosArrowRoundForward className="h-5 w-5" />
        </Link>
      ) : (
        <span className="invisible">placeholder</span>
      )}
    </nav>
  );
}
