import type { Metadata } from "next";
import { ArchiveView } from "@/components/archive-view";
import { getCategoryIdsBySlugs, getPosts } from "@/lib/wp";
import { OURGOV_CATEGORY_SLUGS } from "@/lib/site";
import { patternForSeed } from "@/lib/patterns";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "OurGov",
  description:
    "Features and announcements from OurGov — a body of civic-tech work.",
};

export default async function OurGovIndex() {
  const ids = await getCategoryIdsBySlugs(OURGOV_CATEGORY_SLUGS);
  const result =
    ids.length === 0
      ? { items: [], total: 0, totalPages: 1, page: 1, perPage: 24 }
      : await getPosts({ categories: ids, perPage: 24 });

  return (
    <ArchiveView
      title="OurGov"
      subtitle="Features and announcements"
      result={result}
      basePath="/ourgov"
      pattern={patternForSeed("ourgov")}
    />
  );
}
