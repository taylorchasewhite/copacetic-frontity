import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { getPosts } from "@/lib/wp";
import type { WPPost } from "@/lib/wp-types";

export const metadata: Metadata = {
  title: "Site map",
  description: "All pages and recent posts on this site.",
};

export const revalidate = 3600;

export default async function SitemapPage() {
  let recent: WPPost[] = [];
  try {
    const result = await getPosts({ perPage: 50 });
    recent = result.items;
  } catch {
    recent = [];
  }

  return (
    <div className="mx-auto w-[92%] max-w-content py-10">
      <h1 className="font-heading text-3xl font-bold text-primary-800">
        Site map
      </h1>
      <p className="mt-2 text-primary-600">
        Every section of the site, in one place.
      </p>

      <section className="mt-8">
        <h2 className="font-heading text-xl font-bold text-primary-800">
          Pages
        </h2>
        <ul className="mt-3 list-disc pl-6">
          {siteConfig.menu.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </section>

      {recent.length > 0 && (
        <section className="mt-8">
          <h2 className="font-heading text-xl font-bold text-primary-800">
            Recent posts
          </h2>
          <ul className="mt-3 list-disc pl-6">
            {recent.map((p) => (
              <li key={p.id}>
                <Link href={`/${p.slug}`}>
                  <span dangerouslySetInnerHTML={{ __html: p.title.rendered }} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8">
        <h2 className="font-heading text-xl font-bold text-primary-800">
          Elsewhere
        </h2>
        <ul className="mt-3 list-disc pl-6">
          {siteConfig.socialLinks.map(([name, url]) => (
            <li key={name}>
              <a href={url} target="_blank" rel="noreferrer noopener">
                {name}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
