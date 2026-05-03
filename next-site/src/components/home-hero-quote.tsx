"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { quotes, type Quote } from "@/lib/quotes";

interface HomeHeroQuoteProps {
  initial: Quote;
}

// useLayoutEffect on the server warns; safely no-op there.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Click-to-shuffle quote. Mirrors the logo emoji animation: the current
 * quote swipes up & fades out while the next one swipes up from below.
 * The initial quote is chosen server-side (daily seed), so the SSR'd HTML
 * stays stable.
 *
 * Height is pinned to the *initial* quote's measured size on first paint,
 * so swapping to longer quotes will bleed into surrounding padding rather
 * than reflowing the page.
 */
export function HomeHeroQuote({ initial }: HomeHeroQuoteProps) {
  const [current, setCurrent] = useState<Quote>(initial);
  const [previous, setPrevious] = useState<Quote | null>(null);
  const [tick, setTick] = useState(0);
  const sizerRef = useRef<HTMLSpanElement>(null);
  const [lockedHeight, setLockedHeight] = useState<number | null>(null);

  // Measure the initial quote once, then freeze the container height.
  useIsoLayoutEffect(() => {
    if (lockedHeight != null) return;
    if (sizerRef.current) {
      setLockedHeight(sizerRef.current.getBoundingClientRect().height);
    }
  }, [lockedHeight]);

  function shuffle() {
    if (quotes.length <= 1) return;
    let next = current;
    let guard = 0;
    while (next.quote === current.quote && guard < 10) {
      next = quotes[Math.floor(Math.random() * quotes.length)];
      guard++;
    }
    setPrevious(current);
    setCurrent(next);
    setTick((t) => t + 1);
  }

  return (
    <button
      type="button"
      onClick={shuffle}
      aria-label="Show another quote"
      className="group relative block w-full cursor-pointer text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/40"
      style={lockedHeight != null ? { height: `${lockedHeight}px` } : undefined}
    >
      {/* Hidden sizer — only used on the very first render to capture the
          initial quote's height. After that the container is fixed and the
          sizer no longer participates in layout. */}
      {lockedHeight == null && (
        <span ref={sizerRef} aria-hidden className="invisible block">
          <QuoteContent quote={initial} />
        </span>
      )}

      {previous !== null && (
        <span
          key={`out-${tick}`}
          aria-hidden
          className="absolute inset-x-0 top-0 block animate-slide-out-left"
        >
          <QuoteContent quote={previous} />
        </span>
      )}

      <span
        key={`in-${tick}`}
        className="absolute inset-x-0 top-0 block animate-slide-in-right"
      >
        <QuoteContent quote={current} />
      </span>
    </button>
  );
}

function QuoteContent({ quote }: { quote: Quote }) {
  return (
    <figure>
      <blockquote className="font-heading text-2xl italic leading-snug text-primary-800 md:text-4xl md:leading-tight">
        <span className="mr-1 select-none text-accent-500">&ldquo;</span>
        {quote.quote}
        <span className="ml-1 select-none text-accent-500">&rdquo;</span>
      </blockquote>
      {quote.author && (
        <figcaption className="mt-4 font-heading text-sm text-accent-700">
          — {quote.author}
        </figcaption>
      )}
    </figure>
  );
}
