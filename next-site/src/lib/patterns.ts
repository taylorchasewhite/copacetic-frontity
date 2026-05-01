// List of decorative SVG backgrounds copied from the original Frontity
// theme into /public/patterns. Used to give each archive/post a unique
// hero backdrop, just like the old site.

export const PATTERNS: readonly string[] = [
  "arctic",
  "beach",
  "canyon",
  "circles",
  "desert",
  "dotted-flowers",
  "farm",
  "floral-field",
  "floral-hawaiian",
  "fruit",
  "happy-hearts",
  "hiker",
  "mountains",
  "neighborhood",
  "pattern-dimensions",
  "pattern-facets",
  "pattern-floral",
  "pattern-shortlines",
  "pattern-tile-green",
  "pattern-tile-light-fade",
  "pattern-wiggles",
  "rockies",
  "seafloor",
  "skyline-chicago",
  "skyline-houston",
  "skyline-madison",
  "skyline-minneapolis",
  "skyline-newyork",
  "skyline-philadelphia",
  "skyline-saint-louis",
  "space-cosmos",
  "space-planets",
  "stars-chalk",
  "sunflowers",
  "valley-shores",
  "watercolor-paper",
] as const;

/**
 * Deterministically pick a pattern based on a string seed (e.g. a slug).
 * Same seed → same pattern, so a given post/category always gets the same
 * backdrop across page loads (no jarring change on revisit) but different
 * pages still get variety.
 */
export function patternForSeed(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(hash) % PATTERNS.length;
  return `/patterns/${PATTERNS[idx]}.svg`;
}

/** Pick a random pattern (use only on the client / non-SSR'd content). */
export function randomPattern(): string {
  const i = Math.floor(Math.random() * PATTERNS.length);
  return `/patterns/${PATTERNS[i]}.svg`;
}
