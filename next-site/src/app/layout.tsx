import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SideNav } from "@/components/side-nav";
import { ThemeModeScript } from "@/components/theme-mode";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  alternates: {
    types: {
      "application/rss+xml": [{ url: "/rss.xml", title: siteConfig.title }],
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeModeScript />
      </head>
      <body className="flex min-h-screen flex-col">
        <Header />
        <SideNav />
        <main className="mt-[40px] min-h-[calc(100vh-120px)] flex-1 md:mt-[70px] md:ml-[220px]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
