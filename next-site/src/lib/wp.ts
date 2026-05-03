import type {
  PaginatedResult,
  WPPage,
  WPPost,
  WPTerm,
} from "./wp-types";

const API_URL =
  process.env.WP_API_URL ?? "https://old.taylorchasewhite.com/wp-json/wp/v2";

// How long (seconds) the framework should cache WP responses before
// revalidating in the background. Tune per-route if needed.
const DEFAULT_REVALIDATE = 60 * 60; // 1 hour

interface FetchOptions {
  revalidate?: number;
  tags?: string[];
}

async function wpFetch<T>(
  path: string,
  search: Record<string, string | number | boolean | undefined> = {},
  opts: FetchOptions = {}
): Promise<{ data: T; headers: Headers }> {
  const url = new URL(`${API_URL}${path}`);
  for (const [k, v] of Object.entries(search)) {
    if (v === undefined) continue;
    url.searchParams.set(k, String(v));
  }

  const res = await fetch(url, {
    next: {
      revalidate: opts.revalidate ?? DEFAULT_REVALIDATE,
      tags: opts.tags,
    },
  });

  if (!res.ok) {
    throw new Error(
      `WP fetch failed: ${res.status} ${res.statusText} for ${url.toString()}`
    );
  }

  // Some hosting providers (caching layers, WAFs, maintenance pages) reply
  // with HTML even on a 200 — guard so the JSON parser doesn't blow up the
  // entire prerender with an opaque "Unexpected token <" error.
  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    const preview = (await res.text()).slice(0, 120).replace(/\s+/g, " ");
    throw new Error(
      `WP returned non-JSON (${contentType || "no content-type"}) for ${url.toString()} :: ${preview}`
    );
  }

  const data = (await res.json()) as T;
  return { data, headers: res.headers };
}

function paginated<T>(
  items: T[],
  headers: Headers,
  page: number,
  perPage: number
): PaginatedResult<T> {
  const total = Number(headers.get("x-wp-total") ?? items.length);
  const totalPages = Number(headers.get("x-wp-totalpages") ?? 1);
  return { items, total, totalPages, page, perPage };
}

export async function getPosts({
  page = 1,
  perPage = 10,
  category,
  tag,
  search,
}: {
  page?: number;
  perPage?: number;
  category?: number;
  tag?: number;
  search?: string;
} = {}): Promise<PaginatedResult<WPPost>> {
  const { data, headers } = await wpFetch<WPPost[]>("/posts", {
    page,
    per_page: perPage,
    _embed: 1,
    categories: category,
    tags: tag,
    search,
  });
  return paginated(data, headers, page, perPage);
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const { data } = await wpFetch<WPPost[]>("/posts", {
    slug,
    _embed: 1,
  });
  return data[0] ?? null;
}

export async function getPageBySlug(slug: string): Promise<WPPage | null> {
  const { data } = await wpFetch<WPPage[]>("/pages", {
    slug,
    _embed: 1,
  });
  return data[0] ?? null;
}

export async function getCategoryBySlug(slug: string): Promise<WPTerm | null> {
  const { data } = await wpFetch<WPTerm[]>("/categories", { slug });
  return data[0] ?? null;
}

export async function getTagBySlug(slug: string): Promise<WPTerm | null> {
  const { data } = await wpFetch<WPTerm[]>("/tags", { slug });
  return data[0] ?? null;
}

export async function getAllPostSlugs(): Promise<string[]> {
  // For build-time static generation. Caps at 100 per call; paginate if you
  // grow beyond that.
  const { data } = await wpFetch<WPPost[]>("/posts", {
    per_page: 100,
    _fields: "slug",
  });
  return data.map((p) => p.slug);
}
