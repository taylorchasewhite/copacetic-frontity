"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaSearch, FaTimes } from "react-icons/fa";

interface PostHit {
  type: "post";
  id: number;
  title: string;
  slug: string;
  date: string;
}
interface CategoryHit {
  type: "category";
  id: number;
  name: string;
  slug: string;
}
interface TagHit {
  type: "tag";
  id: number;
  name: string;
  slug: string;
}
interface SearchResults {
  posts: PostHit[];
  categories: CategoryHit[];
  tags: TagHit[];
}

const EMPTY: SearchResults = { posts: [], categories: [], tags: [] };

/**
 * Live combobox-style search: debounced fetch to /api/search, dropdown of
 * grouped hits (posts / categories / tags). Submits to /search?q= when
 * the user presses Enter without picking a result.
 */
export function TopSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [results, setResults] = useState<SearchResults>(EMPTY);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // Mobile-only: collapses the search to an icon button until tapped.
  const [mobileOpen, setMobileOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced fetch.
  useEffect(() => {
    const q = value.trim();
    if (!q) {
      setResults(EMPTY);
      setLoading(false);
      return;
    }
    setLoading(true);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: ctrl.signal,
        });
        if (res.ok) setResults((await res.json()) as SearchResults);
      } catch {
        /* ignore abort */
      } finally {
        setLoading(false);
      }
    }, 180);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
  }, [value]);

  // Close on outside click / Escape.
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setMobileOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const hasResults =
    results.posts.length + results.categories.length + results.tags.length > 0;

  function go(href: string) {
    setOpen(false);
    setMobileOpen(false);
    setValue("");
    router.push(href);
  }

  return (
    <div ref={wrapRef} className="relative flex w-full justify-end sm:max-w-xl sm:justify-center">
      {/* Mobile: collapsed icon button. */}
      <button
        type="button"
        aria-label={mobileOpen ? "Close search" : "Open search"}
        aria-expanded={mobileOpen}
        onClick={() => {
          const next = !mobileOpen;
          setMobileOpen(next);
          if (next) {
            requestAnimationFrame(() => inputRef.current?.focus());
          }
        }}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-primary-600 hover:bg-primary-50 hover:text-accent-600 sm:hidden"
      >
        {mobileOpen ? (
          <FaTimes className="h-4 w-4" aria-hidden />
        ) : (
          <FaSearch className="h-4 w-4" aria-hidden />
        )}
      </button>

      {/* Search panel: a flexible row that becomes a dropdown sheet on mobile. */}
      <div
        className={`${
          mobileOpen ? "flex" : "hidden"
        } absolute left-0 right-0 top-full z-[85] mt-2 flex-col gap-2 sm:relative sm:top-auto sm:mt-0 sm:flex sm:flex-1`}
      >
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            const q = value.trim();
            if (!q) return;
            go(`/search?q=${encodeURIComponent(q)}`);
          }}
          className="flex items-center gap-2 rounded-full border border-primary-200 bg-white px-4 py-2 shadow-sm transition focus-within:border-accent-400 focus-within:ring-2 focus-within:ring-accent-200"
        >
          <FaSearch className="h-4 w-4 text-primary-400" aria-hidden />
          <input
            ref={inputRef}
            type="search"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search posts, categories, tags…"
            aria-label="Search"
            className="w-full bg-transparent text-sm text-primary-800 outline-none placeholder:text-primary-400"
          />
        </form>

        {open && value.trim() && (
          <div
            role="listbox"
            className="max-h-[70vh] overflow-y-auto rounded-md border border-primary-100 bg-white py-2 shadow-xl"
          >
          {loading && !hasResults && (
            <div className="px-4 py-3 text-sm text-primary-500">Searching…</div>
          )}
          {!loading && !hasResults && (
            <div className="px-4 py-3 text-sm text-primary-500">
              No matches.
            </div>
          )}

          {results.posts.length > 0 && (
            <Group label="Posts">
              {results.posts.map((p) => (
                <ResultRow
                  key={`p-${p.id}`}
                  onClick={() => go(`/${p.slug}`)}
                  primary={p.title}
                  secondary={new Date(p.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                />
              ))}
            </Group>
          )}

          {results.categories.length > 0 && (
            <Group label="Categories">
              {results.categories.map((c) => (
                <ResultRow
                  key={`c-${c.id}`}
                  onClick={() => go(`/category/${c.slug}`)}
                  primary={c.name}
                  secondary="category"
                />
              ))}
            </Group>
          )}

          {results.tags.length > 0 && (
            <Group label="Tags">
              {results.tags.map((t) => (
                <ResultRow
                  key={`t-${t.id}`}
                  onClick={() => go(`/tag/${t.slug}`)}
                  primary={t.name}
                  secondary="tag"
                />
              ))}
            </Group>
          )}

          {hasResults && (
            <div className="border-t border-primary-100 px-4 py-2 text-right">
              <Link
                href={`/search?q=${encodeURIComponent(value.trim())}`}
                onClick={() => setOpen(false)}
                className="text-xs font-heading text-accent-600 hover:underline"
              >
                See all results →
              </Link>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}

function Group({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-1">
      <div className="px-4 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-primary-400">
        {label}
      </div>
      <ul>{children}</ul>
    </div>
  );
}

function ResultRow({
  onClick,
  primary,
  secondary,
}: {
  onClick: () => void;
  primary: string;
  secondary?: string;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-baseline justify-between gap-3 px-4 py-2 text-left text-sm text-primary-800 hover:bg-accent-100"
      >
        <span className="truncate">{primary}</span>
        {secondary && (
          <span className="shrink-0 text-xs text-primary-400">{secondary}</span>
        )}
      </button>
    </li>
  );
}
