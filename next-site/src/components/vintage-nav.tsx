"use client";

import Link from "next/link";

/**
 * Vintage-mode "site map" link. The modern UI has a persistent left rail
 * for navigation, but vintage mode hides the sidebar — so we expose a
 * plain text link to a dedicated /sitemap page next to the modern toggle.
 * Hidden in modern mode via globals.css.
 */
export function VintageNav() {
  return (
    <div data-vintage-nav className="hidden">
      <Link
        href="/sitemap"
        className="inline-flex shrink-0 items-center whitespace-nowrap px-2 py-1 text-sm text-primary-700 underline hover:text-accent-600"
      >
        site map
      </Link>
    </div>
  );
}
