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

## Atari homebrew

The [Atari homebrew article](https://taylorchasewhite.com/atari-2600-homebrew-programming)
opens the cartridge picker by default and loads the emulator only when a reader
presses **Play game**. The picker uses the same `public/atari/arcade.css` on
both versions of the blog; the project video is at the end of the WordPress post.
The three 4 KiB
cartridges in `public/atari/roms` and their DASM sources in `content/atari`
come from the author's [2015 archive](https://www.old.taylorchasewhite.com/wp-content/uploads/Atari-2600-Roms-Source-Code.zip).
Original credits are preserved; the other students' projects are not included.
`public/atari/javatari` contains the unmodified [Javatari 5.0.4 embedded
release](https://github.com/ppeccin/javatari.js/tree/f954960ddfbd8b8645de447bc7dc7a1eda066877/release/stable/5.0/embedded)
and its AGPLv3 license. The player serves the emulator and ROMs locally.

For a standalone player or a WordPress Custom HTML block, link or embed
`https://taylorchasewhite.com/atari/play.html?game=super-step-bros`.
The other cartridge IDs are `skateboard-steve` and `simon-says`.

To run the player directly on the legacy WordPress site, including when the
Next.js site is unavailable, build a plugin ZIP from the repository root:
`.\wordpress\package.ps1 -OutputPath .\atari-homebrew.zip`.
In WordPress use **Plugins > Add New > Upload Plugin**, then activate it.
It adds a cartridge picker only to the homebrew post, without changing its
stored content or REST output. Deactivate the plugin to remove it.

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
