import Link from "next/link";
import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";
import { PatternHero } from "@/components/pattern-hero";
import type { PaginatedResult, WPPost } from "@/lib/wp-types";

interface ArchiveViewProps {
  title?: string;
  subtitle?: string;
  result: PaginatedResult<WPPost>;
  basePath: string;
  /** Optional decorative SVG pattern shown behind the title banner. */
  pattern?: string;
}

export function ArchiveView({
  title,
  subtitle,
  result,
  basePath,
  pattern,
}: ArchiveViewProps) {
  return (
    <>
      {(title || subtitle) && (
        <PatternHero pattern={pattern ?? "/patterns/pattern-floral.svg"}>
          <header className="mx-auto w-[92%] max-w-content px-6 py-20 text-center">
            {subtitle && (
              <p className="font-heading text-sm text-accent-700">
                {subtitle}
              </p>
            )}
            {title && (
              <h1
                className="mt-2 font-heading text-4xl font-bold text-primary-800 md:text-5xl"
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}
          </header>
        </PatternHero>
      )}

      <div className="mx-auto w-[92%] max-w-content py-10">
        {result.items.length === 0 ? (
          <p className="text-center text-primary-600">
            No posts here yet.{" "}
            <Link href="/" className="text-accent-500 hover:underline">
              Back home
            </Link>
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {result.items.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            <Pagination
              page={result.page}
              totalPages={result.totalPages}
              basePath={basePath}
              className="mt-14"
            />
          </>
        )}
      </div>
    </>
  );
}
