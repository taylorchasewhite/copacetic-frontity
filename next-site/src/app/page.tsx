import { getPosts } from "@/lib/wp";
import { ArchiveView } from "@/components/archive-view";
import { HomeHero } from "@/components/home-hero";
import { quoteForSeed } from "@/lib/quotes";

export const revalidate = 3600;

export default async function HomePage() {
  const result = await getPosts({ perPage: 12 });

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
