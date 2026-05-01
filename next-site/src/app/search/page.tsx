import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/wp";
import { PostCard } from "@/components/post-card";

export const revalidate = 600;

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  const result = query ? await getPosts({ search: query, perPage: 24 }) : null;

  return (
    <div className="mx-auto w-[92%] max-w-content py-10">
      <h1 className="mb-2 font-heading text-3xl font-bold text-primary-800">
        Search
      </h1>
      {!query && (
        <p className="text-primary-600">
          Use the search bar above to find posts, categories, and tags.
        </p>
      )}

      {result && (
        <div className="mt-6">
          <p className="mb-6 text-primary-600">
            {result.total} result{result.total === 1 ? "" : "s"} for{" "}
            <span className="font-semibold">&ldquo;{query}&rdquo;</span>
          </p>
          {result.items.length === 0 ? (
            <p className="text-primary-600">
              No posts matched.{" "}
              <Link href="/" className="text-accent-500 hover:underline">
                Back home
              </Link>
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {result.items.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
