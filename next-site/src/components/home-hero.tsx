import { type Quote } from "@/lib/quotes";
import { PatternHero } from "@/components/pattern-hero";
import { HomeHeroQuote } from "@/components/home-hero-quote";

interface HomeHeroProps {
  pattern: string;
  quote: Quote;
}

/**
 * Server-rendered homepage hero. Uses the shared PatternHero so the
 * dimensions, padding, and pattern treatment match the category/tag/post
 * archive headers exactly. The quote itself is a small client component
 * so visitors can click to shuffle to a new one.
 */
export function HomeHero({ pattern, quote }: HomeHeroProps) {
  return (
    <PatternHero pattern={pattern}>
      <header className="mx-auto w-[92%] max-w-content px-6 py-20 text-center">
        <HomeHeroQuote initial={quote} />
      </header>
    </PatternHero>
  );
}
