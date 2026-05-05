import type { Metadata } from "next";
import { ABOUT_ENTRIES, type AboutEntry } from "@/lib/about-entries";
import { AboutTimeline } from "@/components/about-timeline";
import { PatternHero } from "@/components/pattern-hero";
import { patternForSeed } from "@/lib/patterns";
import { getPageBySlug, getPageRevisions } from "@/lib/wp";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About",
  description: "About Taylor Chase White — a slider through time.",
};

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

/**
 * Build the timeline from WordPress: the live About page is the
 * "current" entry, and every WP revision becomes an older entry. If
 * authentication isn't configured (or revisions fail), we fall back to
 * the manually maintained `ABOUT_ENTRIES` list.
 */
async function loadEntries(): Promise<AboutEntry[]> {
  let currentEntry: AboutEntry | null = null;
  let pageId: number | null = null;
  let pageTitle = "About";

  try {
    const page = await getPageBySlug("about");
    if (page) {
      pageId = page.id;
      pageTitle = stripTags(page.title?.rendered ?? "") || "About";
      const date = page.modified ?? page.date;
      currentEntry = {
        date,
        label: String(new Date(date).getFullYear()),
        title: pageTitle,
        html: page.content?.rendered ?? "",
      };
    }
  } catch (err) {
    console.warn("/about: failed to load WP about page:", err);
  }

  let revisionEntries: AboutEntry[] = [];
  if (pageId !== null) {
    const revisions = await getPageRevisions(pageId);

    // Collapse revisions that share the same minute and have identical
    // content — WP autosaves can produce a flurry of near-duplicates.
    const seen = new Set<string>();
    revisionEntries = revisions
      .map<AboutEntry | null>((rev) => {
        const date = rev.modified ?? rev.date;
        const html = rev.content?.rendered ?? "";
        const key = `${date.slice(0, 16)}::${stripTags(html).slice(0, 80)}`;
        if (seen.has(key) || !html) return null;
        seen.add(key);
        const revTitle = stripTags(rev.title?.rendered ?? "") || pageTitle;
        return {
          date,
          label: new Date(date).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          }),
          title: revTitle,
          html,
        };
      })
      .filter((e): e is AboutEntry => e !== null)
      // Drop any revision that matches the current page's date — the
      // current entry already represents that state.
      .filter((e) => !currentEntry || e.date !== currentEntry.date);
  }

  if (currentEntry) {
    return [currentEntry, ...revisionEntries];
  }

  // Total fallback: nothing from WP at all.
  return ABOUT_ENTRIES;
}

export default async function AboutPage() {
  const entries = await loadEntries();
  return (
    <>
      <PatternHero pattern={patternForSeed("about")}>
        <header className="mx-auto w-[92%] max-w-content px-6 py-16 text-center md:py-20">
          <p className="font-heading text-sm text-accent-700">About</p>
          <h1 className="mt-2 font-heading text-4xl font-bold text-primary-800 md:text-5xl">
            Taylor Chase White
          </h1>
          {entries.length > 1 && (
            <p className="mt-3 text-primary-600">
              Drag the slider below to read what I’ve written about myself
              at different points in time — pulled live from this page’s
              edit history in WordPress.
            </p>
          )}
        </header>
      </PatternHero>

      <div className="mx-auto w-[92%] max-w-content py-10">
        <div className="rounded-md border border-primary-100 bg-white p-6 shadow-sm md:p-10">
          <AboutTimeline entries={entries} />
        </div>
      </div>
    </>
  );
}
