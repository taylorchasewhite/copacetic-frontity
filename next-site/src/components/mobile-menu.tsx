"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes, FaSearch } from "react-icons/fa";
import { siteConfig } from "@/lib/site";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  // Lock body scroll while drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        data-mobile-menu-trigger
        onClick={() => setOpen(true)}
        className="mr-3 inline-flex items-center justify-center p-2 text-primary-700 hover:text-accent-500 md:hidden"
      >
        <FaBars className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <aside
            role="dialog"
            aria-modal="true"
            className="absolute left-0 top-0 h-full w-[80%] max-w-sm bg-primary-700 px-8 py-6 shadow-xl"
          >
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 p-2 text-white hover:text-accent-300"
            >
              <FaTimes className="h-5 w-5" />
            </button>

            <Link
              href="/search"
              onClick={() => setOpen(false)}
              className="mt-8 inline-flex items-center gap-2 font-heading text-white hover:text-accent-300"
            >
              <FaSearch /> Search
            </Link>

            <nav className="mt-8 flex flex-col gap-4">
              {siteConfig.menu.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.href} className="flex flex-col gap-2">
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 font-heading text-xl text-white hover:text-accent-300"
                    >
                      {Icon && (
                        <Icon className="h-5 w-5 shrink-0 text-white/70" />
                      )}
                      <span>{item.label}</span>
                    </Link>
                    {item.children?.length ? (
                      <div className="ml-8 flex flex-col gap-2 border-l border-white/20 pl-4">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setOpen(false)}
                            className="font-heading text-base text-white/80 hover:text-accent-300"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
