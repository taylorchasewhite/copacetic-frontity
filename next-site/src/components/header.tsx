import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { emojiForSeed } from "@/lib/logo-emoji";
import { LogoEmoji } from "./logo-emoji";
import { MobileMenu } from "./mobile-menu";
import { TopSearch } from "./top-search";
import { ThemeModeToggle } from "./theme-mode";

export function Header() {
  // Rotate the logo emoji daily — stable for the whole day so SSR/CDN
  // caching stays valid, but feels fresh each visit. Click swaps it.
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      86_400_000
  );
  const emoji = emojiForSeed(dayOfYear);

  return (
    <header className="fixed left-0 top-0 z-[90] w-full border-b border-primary-100 bg-white">
      <div className="mx-auto flex h-[40px] w-full items-center gap-4 px-4 sm:h-[70px] sm:px-6">
        <MobileMenu />
        <div className="flex flex-shrink-0 items-center gap-2">
          <LogoEmoji initial={emoji} />
          <Link
            href="/"
            className="whitespace-nowrap font-heading text-lg font-bold text-primary-700 md:text-xl"
          >
            {siteConfig.logo}
          </Link>
        </div>
        <div className="flex flex-1 justify-center">
          <TopSearch />
        </div>
        <div className="flex flex-shrink-0 items-center gap-1">
          <ThemeModeToggle />
        </div>
        {/* Right gutter to balance the left logo column on wide screens. */}
        <div className="hidden md:block md:w-[80px]" aria-hidden />
      </div>
    </header>
  );
}
