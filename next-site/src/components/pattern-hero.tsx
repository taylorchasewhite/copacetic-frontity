import type { ReactNode } from "react";

interface PatternHeroProps {
  pattern: string;
  children: ReactNode;
  /** Light variant (cream background, blended overlay) for archives. */
  variant?: "light" | "dark";
  className?: string;
}

/**
 * Decorative banner with a tiled SVG pattern overlaid on a brand color,
 * mirroring the LightPatternBox / PatternBox from the Frontity theme.
 */
export function PatternHero({
  pattern,
  children,
  variant = "light",
  className = "",
}: PatternHeroProps) {
  const base =
    variant === "light"
      ? "bg-accent-100"
      : "bg-accent-700 border-t-[10px] border-accent-400";

  return (
    <section className={`relative overflow-hidden ${base} ${className}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage: `url(${pattern})`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
          backgroundAttachment: "fixed",
        }}
      />
      <div className="relative z-[1]">{children}</div>
    </section>
  );
}
