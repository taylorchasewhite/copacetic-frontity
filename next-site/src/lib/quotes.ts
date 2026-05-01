import quotesData from "../../content/quotes.json";

export interface Quote {
  quote: string;
  author?: string;
}

export const quotes: Quote[] = quotesData as Quote[];

/** Random quote — for client/runtime use. */
export function randomQuote(): Quote {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

/**
 * Pick a quote based on a numeric seed (e.g. day-of-year), so the homepage
 * renders deterministically per request but rotates regularly. Used by the
 * server-rendered hero.
 */
export function quoteForSeed(seed: number): Quote {
  const i = ((seed % quotes.length) + quotes.length) % quotes.length;
  return quotes[i];
}
