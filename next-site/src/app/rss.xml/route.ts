import { getPosts } from "@/lib/wp";
import { siteConfig } from "@/lib/site";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://taylorchasewhite.com";

// Cache for an hour, regenerate in the background.
export const revalidate = 3600;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, "").trim();
}

export async function GET() {
  const { items } = await getPosts({ perPage: 20 });

  const itemsXml = items
    .map((p) => {
      const link = `${SITE}/${p.slug}`;
      const title = escapeXml(stripHtml(p.title.rendered));
      const description = escapeXml(stripHtml(p.excerpt.rendered));
      const author = p._embedded?.author?.[0]?.name ?? "Taylor White";
      return `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <dc:creator>${escapeXml(author)}</dc:creator>
      <description>${description}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.title)}</title>
    <link>${SITE}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en-us</language>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
