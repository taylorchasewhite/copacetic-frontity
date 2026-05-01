"use client";

import { useEffect, useState } from "react";
import { LOGO_EMOJI } from "@/lib/logo-emoji";

interface LogoEmojiProps {
  initial: string;
}

/**
 * Build an inline-SVG favicon containing the given emoji. Modern browsers
 * (Chrome, Edge, Firefox, Safari 16+) render SVG favicons natively,
 * including emoji glyphs.
 */
function emojiFaviconHref(emoji: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><text x="50%" y="50%" font-size="52" text-anchor="middle" dominant-baseline="central">${emoji}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Swap (or insert) the document's favicon to the given href. Removes any
 * existing icon links first so the new one wins in every browser.
 */
function setFavicon(href: string) {
  if (typeof document === "undefined") return;
  document
    .querySelectorAll<HTMLLinkElement>("link[rel~='icon']")
    .forEach((el) => el.parentNode?.removeChild(el));
  const link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/svg+xml";
  link.href = href;
  document.head.appendChild(link);
}

/**
 * Animated emoji button. On click the current emoji swipes UP and fades
 * out while the next one swipes UP from below into place. The browser tab
 * favicon also updates to match the current emoji.
 */
export function LogoEmoji({ initial }: LogoEmojiProps) {
  const [current, setCurrent] = useState(initial);
  const [previous, setPrevious] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  // Sync favicon whenever `current` changes (including initial mount, so the
  // tab icon matches the daily-seeded SSR emoji even before any clicks).
  useEffect(() => {
    setFavicon(emojiFaviconHref(current));
  }, [current]);

  function pickNext() {
    if (LOGO_EMOJI.length <= 1) return;
    let next = current;
    while (next === current) {
      next = LOGO_EMOJI[Math.floor(Math.random() * LOGO_EMOJI.length)];
    }
    setPrevious(current);
    setCurrent(next);
    setTick((t) => t + 1);
  }

  return (
    <button
      type="button"
      onClick={pickNext}
      aria-label="Change emoji"
      className="relative inline-block h-7 w-7 overflow-hidden align-middle"
    >
      {/* Outgoing: starts in place, swipes up & fades out. */}
      {previous !== null && (
        <span
          key={`out-${tick}`}
          aria-hidden
          className="absolute inset-0 flex items-center justify-center text-2xl leading-none animate-emoji-out"
        >
          {previous}
        </span>
      )}

      {/* Incoming: starts below, swipes up into place. */}
      <span
        key={`in-${tick}`}
        aria-hidden
        className="absolute inset-0 flex items-center justify-center text-2xl leading-none animate-emoji-in"
      >
        {current}
      </span>
    </button>
  );
}
