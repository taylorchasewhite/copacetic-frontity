# taylorchasewhite.com (Next.js)

Replacement for the Frontity-based site. Pulls content from
`old.taylorchasewhite.com` via the WordPress REST API and renders with
React Server Components on Next.js 15.

## Quick start

```bash
cd next-site
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000.

## Stack

- **Next.js 15 (App Router)** — Server Components + ISR.
- **TypeScript** — strict.
- **Tailwind CSS** — utility-first styling, color palette ported from the
  Frontity theme.
- **react-icons** — same icon set used previously.
- **html-react-parser** — turns WP-rendered HTML into React, rewriting
  `<a>` to `next/link` and `<img>` to `next/image` for internal links.

## Data layer

All WP calls live in [`src/lib/wp.ts`](./src/lib/wp.ts). Responses are
cached by Next.js with a default `revalidate` of 1 hour. Override per
route by exporting `revalidate` from the route file.

## Navigation

The Vercel site's navigation is defined in `src/lib/site.ts`, independently
of the WordPress menus. Its shared menu feeds the desktop sidebar, mobile
drawer, vintage footer, and sitemap page. OurGov is omitted from navigation;
its `/ourgov` page and existing feed filtering remain available unchanged.

## Deployment

This project deploys to Vercel as-is. Set `WP_API_URL` and
`NEXT_PUBLIC_SITE_URL` in the Vercel project settings.

### Images

Next.js image optimization is disabled in `next.config.mjs`. Images load
directly from their source (usually WordPress), avoiding Vercel's
`OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED` (HTTP 402) when its image
optimization allowance is exhausted. `next/image` still provides layout
dimensions and lazy loading, but does not generate optimized variants.
An optimized-first fallback would still make the initial failing request.

## Migration status

| Area               | Status           |
|--------------------|------------------|
| Data layer         | ✅ initial       |
| Layout / Header    | ✅ minimal       |
| Footer             | ✅ minimal       |
| Home (post list)   | ✅               |
| Post / Page route  | ✅               |
| 404                | ✅               |
| Category archive   | ⏳ next          |
| Tag archive        | ⏳ next          |
| Pagination         | ⏳ next          |
| Search             | ⏳               |
| Reading progressbar| ⏳               |
| Author bio         | ⏳               |
| Mobile menu drawer | ⏳               |
| Kelson font        | ⏳ copy from old |
| Background pattern | ⏳               |
