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

  // Try the cached fetch first. If WordPress hands back HTML (caching layer,
  // WAF, maintenance page, malware redirect, etc.) we retry once with cache
  // disabled so a single bad response can't poison the ISR cache for the
  // full revalidate window.
  let res = await fetch(url, {
    next: {
      revalidate: opts.revalidate ?? DEFAULT_REVALIDATE,
      tags: opts.tags,
    },
  });

  let contentType = res.headers.get("content-type") ?? "";
  if (res.ok && !contentType.includes("application/json")) {
    res = await fetch(url, { cache: "no-store" });
    contentType = res.headers.get("content-type") ?? "";
  }

  if (!res.ok) {
    throw new Error(
      `WP fetch failed: ${res.status} ${res.statusText} for ${url.toString()}`
    );
  }

  if (!contentType.includes("application/json")) {
    const preview = (await res.text()).slice(0, 120).replace(/\s+/g, " ");
    const err = new Error(
      `WP returned non-JSON (${contentType || "no content-type"}) for ${url.toString()} :: ${preview}`
    );
    (err as Error & { isTransient?: boolean }).isTransient = true;
    throw err;
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
  categories,
  categoriesExclude,
  tag,
  search,
}: {
  page?: number;
  perPage?: number;
  category?: number;
  categories?: number[];
  categoriesExclude?: number[];
  tag?: number;
  search?: string;
} = {}): Promise<PaginatedResult<WPPost>> {
  const { data, headers } = await wpFetch<WPPost[]>("/posts", {
    page,
    per_page: perPage,
    _embed: 1,
    categories: categories?.length
      ? categories.join(",")
      : category,
    categories_exclude: categoriesExclude?.length
      ? categoriesExclude.join(",")
      : undefined,
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

/**
 * Resolve several category slugs to their numeric IDs in a single WP
 * REST call. Missing slugs are silently skipped. Used for OurGov
 * filtering on home/blog and for the `/ourgov` aggregator page.
 */
export async function getCategoryIdsBySlugs(
  slugs: readonly string[]
): Promise<number[]> {
  if (slugs.length === 0) return [];
  try {
    const { data } = await wpFetch<WPTerm[]>("/categories", {
      slug: slugs.join(","),
      per_page: 100,
    });
    return data.map((t) => t.id);
  } catch (err) {
    console.warn("getCategoryIdsBySlugs failed:", err);
    return [];
  }
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
