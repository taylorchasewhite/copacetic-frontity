"use client";

import { useState, type ReactNode } from "react";

interface CollapseProps {
  children: ReactNode;
  /** How many of the children to show by default. */
  initial?: number;
  more?: string;
  less?: string;
}

/**
 * Renders an array of children with a "show more" toggle. Used to keep
 * the GitHub repo grid focused on the latest few until the visitor opts
 * in to the rest.
 */
export function Collapse({
  children,
  initial = 5,
  more = "Show more",
  less = "Show fewer",
}: CollapseProps) {
  const [open, setOpen] = useState(false);
  const items = Array.isArray(children) ? children : [children];
  const hidden = items.length - initial;
  const visible = open ? items : items.slice(0, initial);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible}
      </div>
      {hidden > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="rounded-full border border-primary-200 bg-white px-4 py-1.5 text-sm font-heading text-primary-600 transition hover:border-accent-300 hover:text-accent-600"
          >
            {open ? less : `${more} (${hidden})`}
          </button>
        </div>
      )}
    </>
  );
}
