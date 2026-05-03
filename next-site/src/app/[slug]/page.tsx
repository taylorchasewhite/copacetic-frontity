import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { getPageBySlug, getPostBySlug } from "@/lib/wp";
import { WpHtml } from "@/components/wp-html";
import { PostCategories } from "@/components/post-categories";
import { PostProgressBar } from "@/components/post-progress-bar";
import { PatternHero } from "@/components/pattern-hero";
import { patternForSeed } from "@/lib/patterns";
import { isAllowedImageHost } from "@/lib/images";
import type { WPPost, WPTerm } from "@/lib/wp-types";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function resolve(slug: string): Promise<WPPost | null> {
  // WordPress can return malformed (HTML) responses intermittently when the
  // upstream is misbehaving. For *transient* failures we re-throw so Next.js
  // surfaces an error (and does NOT cache a 404 for an hour); for genuine
  // "no such post or page" results we return null so the route renders 404.
  try {
    const post = await getPostBySlug(slug);
    if (post) return post;
  } catch (err) {
    if ((err as { isTransient?: boolean })?.isTransient) throw err;
    console.error(`[/${slug}] WP post lookup failed:`, err);
  }
  try {
    const page = await getPageBySlug(slug);
    if (page) return page;
  } catch (err) {
    if ((err as { isTransient?: boolean })?.isTransient) throw err;
    console.error(`[/${slug}] WP page lookup failed:`, err);
  }
  return null;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await resolve(slug);
  if (!item) return {};
  return {
    title: item.title.rendered.replace(/<[^>]+>/g, ""),
    description: item.excerpt.rendered.replace(/<[^>]+>/g, "").slice(0, 200),
  };
}

export default async function ContentPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await resolve(slug);
  if (!item) notFound();

  const featured = item._embedded?.["wp:featuredmedia"]?.[0];
  // WordPress occasionally returns a malformed embedded media object
  // (e.g. the API root payload) with no `source_url`. Treat that as no
  // featured image rather than crashing `next/image` with `src=undefined`.
  const featuredSrc =
    featured && typeof featured.source_url === "string"
      ? featured.source_url
      : undefined;
  const author = item._embedded?.author?.[0];
  const isPost = item.type === "post";

  // Pull categories from the embedded "wp:term" matrix (categories are taxonomy "category").
  const termGroups = item._embedded?.["wp:term"] ?? [];
  const categories: WPTerm[] = termGroups
    .flat()
    .filter((t) => t?.taxonomy === "category");

  return (
    <>
      {isPost && <PostProgressBar />}

      <PatternHero pattern={patternForSeed(`post:${slug}`)}>
        <header className="mx-auto w-[92%] max-w-content px-6 py-16 text-center md:py-20">
          {isPost && categories.length > 0 && (
            <PostCategories
              categories={categories}
              className="mb-4 justify-center"
            />
          )}
          <h1
            className="font-heading text-4xl font-bold text-primary-800 md:text-5xl"
            dangerouslySetInnerHTML={{ __html: item.title.rendered }}
          />
          {isPost && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-primary-700">
              {author && (
                <span>
                  by{" "}
                  <span className="font-semibold text-primary-800">
                    {author.name}
                  </span>
                </span>
              )}
              <time dateTime={item.date}>
                {new Date(item.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
          )}
        </header>
      </PatternHero>

      <div className="mx-auto w-[92%] max-w-content py-10">
        <article className="rounded-md border border-primary-100 bg-white p-6 shadow-sm md:p-10">
          {featuredSrc && (
            <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-md">
              {isAllowedImageHost(featuredSrc) ? (
                <Image
                  src={featuredSrc}
                  alt={featured?.alt_text || ""}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1150px) 100vw, 1150px"
                  priority
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featuredSrc}
                  alt={featured?.alt_text || ""}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              )}
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            <WpHtml html={item.content.rendered} />
          </div>
        </article>
      </div>
    </>
  );
}
