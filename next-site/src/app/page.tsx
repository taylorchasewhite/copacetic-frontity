import { getCategoryIdsBySlugs, getPosts } from "@/lib/wp";
import { ArchiveView } from "@/components/archive-view";
import { HomeHero } from "@/components/home-hero";
import { quoteForSeed } from "@/lib/quotes";
import { OURGOV_CATEGORY_SLUGS } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function HomePage() {
  let result;
  try {
    const ourgovIds = await getCategoryIdsBySlugs(OURGOV_CATEGORY_SLUGS);
    result = await getPosts({ perPage: 12, categoriesExclude: ourgovIds });
  } catch (err) {
    console.warn("HomePage: failed to fetch posts:", err);
    result = { items: [], totalPages: 1, total: 0, page: 1, perPage: 12 };
  }

  // Stable per-day seed so the SSR'd quote only rotates daily.
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      86_400_000
  );
  const initialQuote = quoteForSeed(dayOfYear);

  return (
    <>
      <HomeHero pattern="/patterns/mountains.svg" quote={initialQuote} />
      <ArchiveView result={result} basePath="" />
    </>
  );
}
