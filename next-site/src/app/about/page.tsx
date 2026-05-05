import type { Metadata } from "next";
import { ABOUT_ENTRIES } from "@/lib/about-entries";
import { AboutTimeline } from "@/components/about-timeline";
import { PatternHero } from "@/components/pattern-hero";
import { patternForSeed } from "@/lib/patterns";

export const metadata: Metadata = {
  title: "About",
  description: "About Taylor Chase White — a slider through time.",
};

export default function AboutPage() {
  return (
    <>
      <PatternHero pattern={patternForSeed("about")}>
        <header className="mx-auto w-[92%] max-w-content px-6 py-16 text-center md:py-20">
          <p className="font-heading text-sm text-accent-700">About</p>
          <h1 className="mt-2 font-heading text-4xl font-bold text-primary-800 md:text-5xl">
            Taylor Chase White
          </h1>
          <p className="mt-3 text-primary-600">
            Drag the slider below to read what I’ve written about myself
            at different points in time.
          </p>
        </header>
      </PatternHero>

      <div className="mx-auto w-[92%] max-w-content py-10">
        <div className="rounded-md border border-primary-100 bg-white p-6 shadow-sm md:p-10">
          <AboutTimeline entries={ABOUT_ENTRIES} />
        </div>
      </div>
    </>
  );
}
