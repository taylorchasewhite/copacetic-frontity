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

## Deployment

This project deploys to Vercel as-is. Set `WP_API_URL` and
`NEXT_PUBLIC_SITE_URL` in the Vercel project settings.

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
