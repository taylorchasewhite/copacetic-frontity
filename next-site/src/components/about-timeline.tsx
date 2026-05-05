"use client";

import { useState } from "react";
import type { AboutEntry } from "@/lib/about-entries";

interface Props {
  entries: AboutEntry[];
}

/**
 * Horizontal "about me through time" slider. Entries are passed
 * newest-first (per ABOUT_ENTRIES); we render a timeline of dates and
 * let the visitor scrub between historical write-ups Taylor wrote about
 * himself. The current entry is shown by default.
 */
export function AboutTimeline({ entries }: Props) {
  const [index, setIndex] = useState(0);
  const current = entries[index];
  const formatted = new Date(current.date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
  });
  const max = entries.length - 1;

  return (
    <div>
      <header className="mb-6 flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-4">
          <h2
            className="font-heading text-2xl font-bold text-primary-800 md:text-3xl"
            // Allow inline emphasis in the title.
          >
            {current.title ?? "About"}
          </h2>
          <time
            dateTime={current.date}
            className="whitespace-nowrap text-sm text-primary-500"
          >
            written {formatted}
          </time>
        </div>

        {entries.length > 1 && (
          <div className="flex flex-col gap-2">
            <input
              type="range"
              min={0}
              max={max}
              step={1}
              value={max - index}
              onChange={(e) => setIndex(max - Number(e.target.value))}
              aria-label="Scrub between about-me versions over time"
              className="w-full accent-accent-500"
            />
            <ol className="flex justify-between text-xs text-primary-500">
              {[...entries]
                .slice()
                .reverse()
                .map((entry, i) => {
                  const entryIndex = max - i;
                  const active = entryIndex === index;
                  return (
                    <li key={entry.date}>
                      <button
                        type="button"
                        onClick={() => setIndex(entryIndex)}
                        className={
                          active
                            ? "font-semibold text-accent-600 underline"
                            : "hover:text-accent-600 hover:underline"
                        }
                      >
                        {entry.label}
                      </button>
                    </li>
                  );
                })}
            </ol>
          </div>
        )}
      </header>

      <article
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: current.html }}
      />
    </div>
  );
}
