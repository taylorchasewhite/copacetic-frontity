"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";
import type { MenuItem } from "@/lib/site";

interface NavMenuProps {
  items: MenuItem[];
}

/**
 * Desktop top nav. Items with `children` render as a parent link plus a
 * hover/focus dropdown of sub-pages.
 */
export function NavMenu({ items }: NavMenuProps) {
  return (
    <ul className="flex items-center gap-6">
      {items.map((item) => (
        <li key={item.href}>
          {item.children?.length ? (
            <NavDropdown item={item} />
          ) : (
            <Link
              href={item.href}
              className="font-heading text-primary-700 hover:text-accent-500"
            >
              {item.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}

function NavDropdown({ item }: { item: MenuItem }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 font-heading text-primary-700 hover:text-accent-500"
      >
        {item.label}
        <FaChevronDown className="h-3 w-3 opacity-60" aria-hidden />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-2"
        >
          <ul className="overflow-hidden rounded-md border border-primary-100 bg-white py-2 shadow-lg">
            <li>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 font-heading text-sm text-primary-700 hover:bg-accent-100 hover:text-accent-700"
              >
                {item.label} overview
              </Link>
            </li>
            <li className="my-1 border-t border-primary-100" aria-hidden />
            {item.children!.map((child) => (
              <li key={child.href}>
                <Link
                  href={child.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 font-heading text-sm text-primary-700 hover:bg-accent-100 hover:text-accent-700"
                >
                  {child.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
