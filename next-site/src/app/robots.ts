import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://taylorchasewhite.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}

// Touch siteConfig so unused-import warnings don't show up if the file
// later gets edited to reference it.
void siteConfig;
