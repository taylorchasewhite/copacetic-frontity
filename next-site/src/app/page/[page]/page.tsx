import { notFound } from "next/navigation";
import { getPosts } from "@/lib/wp";
import { ArchiveView } from "@/components/archive-view";

export const revalidate = 3600;

interface Props {
  params: Promise<{ page: string }>;
}

export default async function HomePagedPage({ params }: Props) {
  const { page: pageStr } = await params;
  const page = Number(pageStr);
  if (!Number.isInteger(page) || page < 2) notFound();

  const result = await getPosts({ perPage: 12, page });
  if (result.items.length === 0) notFound();

  return <ArchiveView result={result} basePath="" />;
}
