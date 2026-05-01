import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/wp";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://taylorchasewhite.com";

// Pull every post for the sitemap. Caps at 100 per WP request, so we
// page through.
async function getAllPosts() {
  const out: { slug: string; modified: string }[] = [];
  let page = 1;
  while (true) {
    const { items, totalPages } = await getPosts({ page, perPage: 100 });
    for (const p of items) out.push({ slug: p.slug, modified: p.modified });
    if (page >= totalPages) break;
    page++;
  }
  return out;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE}/search`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE}/${p.slug}`,
    lastModified: new Date(p.modified),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticEntries, ...postEntries];
}
