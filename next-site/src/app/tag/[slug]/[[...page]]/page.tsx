import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPosts, getTagBySlug } from "@/lib/wp";
import { ArchiveView } from "@/components/archive-view";
import { patternForSeed } from "@/lib/patterns";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string; page?: string[] }>;
}

async function resolve(slug: string, pageSeg?: string[]) {
  const tag = await getTagBySlug(slug);
  if (!tag) return null;

  let page = 1;
  if (pageSeg && pageSeg.length > 0) {
    if (pageSeg[0] !== "page" || !pageSeg[1]) return null;
    const n = Number(pageSeg[1]);
    if (!Number.isInteger(n) || n < 2) return null;
    page = n;
  }

  const result = await getPosts({ tag: tag.id, page, perPage: 12 });
  return { tag, result, page };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  if (!tag) return {};
  return { title: `Tag: ${tag.name}` };
}

export default async function TagPage({ params }: Props) {
  const { slug, page: pageSeg } = await params;
  const data = await resolve(slug, pageSeg);
  if (!data) notFound();

  return (
    <ArchiveView
      subtitle="Tag"
      title={data.tag.name}
      result={data.result}
      basePath={`/tag/${slug}`}
      pattern={patternForSeed(`tag:${slug}`)}
    />
  );
}
