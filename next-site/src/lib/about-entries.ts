// Versioned "about me" entries. The /about page renders these as a
// horizontal slider so visitors can browse what Taylor wrote about
// himself at different points in time.
//
// To add a new "current" about, add a new entry at the TOP of the array
// with the most recent date — newest first. Older entries stay around
// as a public history.

export interface AboutEntry {
  /** ISO date — when this version was written. */
  date: string;
  /** Short label shown on the timeline tick. */
  label: string;
  /** Optional headline shown above the body. */
  title?: string;
  /** HTML body. Plain paragraphs are fine; basic tags allowed. */
  html: string;
}

export const ABOUT_ENTRIES: AboutEntry[] = [
  {
    date: "2024-01-01",
    label: "2024",
    title: "Hi, I’m Taylor.",
    html: `
      <p>
        I build things on the web — sometimes for work, sometimes for the
        sheer joy of seeing an idea boot up. I care about civic tech,
        thoughtful UI, and writing things down so other people can use
        them.
      </p>
      <p>
        This site is part journal, part workshop, part scrapbook. Older
        versions of this page are kept around as a slider on the right —
        a public record of how I’ve described myself over the years.
      </p>
    `,
  },
];
