"use client";

import { useEffect, useState } from "react";
import { FaTv, FaPaintBrush } from "react-icons/fa";

export const THEME_STORAGE_KEY = "tcw-site-mode";

/**
 * Inline script injected into <head> so the chosen mode is applied before
 * React hydrates. Avoids a flash of the wrong theme on first paint.
 */
export function ThemeModeScript() {
  const code = `(function(){try{var m=localStorage.getItem('${THEME_STORAGE_KEY}');if(m==='vintage'){document.documentElement.setAttribute('data-mode','vintage');}else{document.documentElement.setAttribute('data-mode','modern');}}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

type Mode = "modern" | "vintage";

/**
 * Header button that toggles the site between the modern UI and a
 * pared-down "vintage" 90s/2000s blog UI. Choice persists in
 * localStorage.
 */
export function ThemeModeToggle() {
  const [mode, setMode] = useState<Mode>("modern");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved =
      (document.documentElement.getAttribute("data-mode") as Mode | null) ??
      "modern";
    setMode(saved);
    setMounted(true);
  }, []);

  function toggle() {
    const next: Mode = mode === "modern" ? "vintage" : "modern";
    setMode(next);
    document.documentElement.setAttribute("data-mode", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }

  // Avoid hydration mismatch: render a stable placeholder until mounted.
  const Icon = mode === "modern" ? FaTv : FaPaintBrush;
  const label =
    mode === "modern" ? "Switch to vintage UI" : "Switch to modern UI";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      suppressHydrationWarning
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-primary-500 transition-colors hover:bg-primary-50 hover:text-accent-600"
    >
      <Icon className="h-4 w-4" aria-hidden />
      <span className="sr-only">{mounted ? label : "Toggle UI mode"}</span>
    </button>
  );
}
