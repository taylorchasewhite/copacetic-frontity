import { NextResponse } from "next/server";
import { getPosts } from "@/lib/wp";

interface CategoryHit {
  type: "category";
  id: number;
  name: string;
  slug: string;
}

interface TagHit {
  type: "tag";
  id: number;
  name: string;
  slug: string;
}

interface PostHit {
  type: "post";
  id: number;
  title: string;
  slug: string;
  date: string;
}

const WP_API =
  process.env.WP_API_URL ?? "https://old.taylorchasewhite.com/wp-json/wp/v2";

/**
 * Live search endpoint. Hits WP REST in parallel for posts + categories
 * + tags, all filtered by the same `q` query string. Results are cached
 * for a minute to keep keystrokes cheap.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();
  if (!q) {
    return NextResponse.json({ posts: [], categories: [], tags: [] });
  }

  const cache = { next: { revalidate: 60 } };

  const [postsRes, catsRes, tagsRes] = await Promise.all([
    getPosts({ search: q, perPage: 6 }).catch(() => null),
    fetch(
      `${WP_API}/categories?search=${encodeURIComponent(q)}&per_page=5`,
      cache
    )
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => []),
    fetch(`${WP_API}/tags?search=${encodeURIComponent(q)}&per_page=5`, cache)
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => []),
  ]);

  const posts: PostHit[] = (postsRes?.items ?? []).map((p) => ({
    type: "post",
    id: p.id,
    title: p.title.rendered.replace(/<[^>]+>/g, ""),
    slug: p.slug,
    date: p.date,
  }));

  const categories: CategoryHit[] = (catsRes as Array<{
    id: number;
    name: string;
    slug: string;
  }>).map((c) => ({
    type: "category",
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));

  const tags: TagHit[] = (tagsRes as Array<{
    id: number;
    name: string;
    slug: string;
  }>).map((t) => ({ type: "tag", id: t.id, name: t.name, slug: t.slug }));

  return NextResponse.json(
    { posts, categories, tags },
    { headers: { "Cache-Control": "public, max-age=30" } }
  );
}
