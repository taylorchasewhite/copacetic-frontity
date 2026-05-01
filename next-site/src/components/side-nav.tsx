"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site";

/**
 * Persistent left-rail navigation, visible on md+ screens. Mirrors the
 * site's primary menu and highlights the active route. Mobile users get
 * the existing MobileMenu drawer instead.
 */
export function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-[70px] z-[80] hidden h-[calc(100vh-70px)] w-[220px] overflow-y-auto border-r border-primary-100 bg-white px-4 py-8 md:block">
      <nav>
        <ul className="flex flex-col gap-1">
          {siteConfig.menu.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 font-heading text-sm transition-colors ${
                    active
                      ? "bg-accent-100 text-accent-700"
                      : "text-primary-700 hover:bg-primary-50 hover:text-accent-600"
                  }`}
                >
                  {Icon && (
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        active ? "text-accent-600" : "text-primary-400"
                      }`}
                    />
                  )}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
