import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryBySlug, getPosts } from "@/lib/wp";
import { ArchiveView } from "@/components/archive-view";
import { patternForSeed } from "@/lib/patterns";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string; page?: string[] }>;
}

async function resolve(slug: string, pageSeg?: string[]) {
  const cat = await getCategoryBySlug(slug);
  if (!cat) return null;

  let page = 1;
  if (pageSeg && pageSeg.length > 0) {
    if (pageSeg[0] !== "page" || !pageSeg[1]) return null;
    const n = Number(pageSeg[1]);
    if (!Number.isInteger(n) || n < 2) return null;
    page = n;
  }

  const result = await getPosts({ category: cat.id, page, perPage: 12 });
  return { cat, result, page };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) return {};
  return { title: `Category: ${cat.name}` };
}

export default async function CategoryPage({ params }: Props) {
  const { slug, page: pageSeg } = await params;
  const data = await resolve(slug, pageSeg);
  if (!data) notFound();

  return (
    <ArchiveView
      subtitle="Category"
      title={data.cat.name}
      result={data.result}
      basePath={`/category/${slug}`}
      pattern={patternForSeed(`category:${slug}`)}
    />
  );
}
