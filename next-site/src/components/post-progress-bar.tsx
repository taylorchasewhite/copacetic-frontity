"use client";

import { useEffect, useState } from "react";

/**
 * Fixed top reading-progress bar. Mirrors the Frontity progressbar but reads
 * scroll position itself rather than relying on a hook + ref forwarding.
 */
export function PostProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function update() {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, scrollTop / max) : 0);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      className="fixed left-0 z-[2] h-1 w-full bg-transparent top-[40px] md:top-[70px]"
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-accent-400 transition-[width] duration-100"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
