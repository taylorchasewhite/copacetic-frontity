import Link from "next/link";
import Image from "next/image";
import type { WPPost, WPTerm } from "@/lib/wp-types";
import { localizeWpLink } from "@/lib/links";
import { isAllowedImageHost } from "@/lib/images";

function featuredUrl(post: WPPost): string | undefined {
  const src = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  return typeof src === "string" && src.length > 0 ? src : undefined;
}

function primaryCategory(post: WPPost): WPTerm | undefined {
  const groups = post._embedded?.["wp:term"] ?? [];
  return groups.flat().find((t) => t?.taxonomy === "category");
}

export function PostCard({ post }: { post: WPPost }) {
  const href = `/${post.slug}`;
  const img = featuredUrl(post);
  const category = primaryCategory(post);
  return (
    <article className="group flex flex-col overflow-hidden rounded-md border border-primary-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-md">
      {img && (
        <Link href={href} className="relative block aspect-[16/9] w-full">
          {isAllowedImageHost(img) ? (
            <Image
              src={img}
              alt={post.title.rendered}
              fill
              className="object-cover transition group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={img}
              alt={post.title.rendered}
              className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-[1.02]"
              loading="lazy"
              decoding="async"
            />
          )}
        </Link>
      )}
      <div className="flex flex-1 flex-col p-5">
        {category && (
          <Link
            href={localizeWpLink(category.link)}
            className="mb-2 inline-block self-start rounded-full bg-accent-50 px-2.5 py-0.5 text-xs font-medium text-accent-700 transition-colors hover:bg-accent-100"
            dangerouslySetInnerHTML={{ __html: category.name }}
          />
        )}
        <h2 className="font-heading text-lg font-semibold text-primary-800">
          <Link
            href={href}
            className="hover:text-accent-500"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
        </h2>
        <p
          className="mt-2 line-clamp-3 text-sm text-primary-600"
          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
        />
        <time
          className="mt-3 text-xs text-primary-400"
          dateTime={post.date}
        >
          {(() => {
            const d = new Date(post.date);
            const month = d.toLocaleDateString("en-US", { month: "short" });
            const day = d.getDate();
            const yy = String(d.getFullYear()).slice(-2);
            return `${month} ${day}, '${yy}`;
          })()}
        </time>
      </div>
    </article>
  );
}
