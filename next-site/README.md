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
The picker icons in `public/atari/icons` depict Bo and Steve using the ROMs'
sprite silhouettes and Simon Says using its blue/yellow/red/green sequence.
Browsers with customizable native selects also show the art in each menu row;
platform-owned menus retain the game names and normal keyboard controls.
The three original 4 KiB
cartridges in `public/atari/roms` and their DASM sources in `content/atari`
come from the author's [2015 archive](https://www.old.taylorchasewhite.com/wp-content/uploads/Atari-2600-Roms-Source-Code.zip).
Original credits are preserved; the other students' projects are not included.
The **Revamped editions** group contains three new NTSC 4 KiB cartridges.
Their source is separate, under `content/atari/revamped`. Originals are not
inputs to the new builds and are never overwritten.
`public/atari/javatari` contains the unmodified [Javatari 5.0.4 embedded
release](https://github.com/ppeccin/javatari.js/tree/f954960ddfbd8b8645de447bc7dc7a1eda066877/release/stable/5.0/embedded)
and its AGPLv3 license. The player serves the emulator and ROMs locally.

For a standalone player or a WordPress Custom HTML block, link or embed
`https://taylorchasewhite.com/atari/play.html?game=super-step-bros`.
The other original cartridge IDs are `skateboard-steve` and `simon-says`.
Append `-revamped` to any of the three IDs for the new edition.

**Super Step Bros.: Switchback Rescue** keeps Bo and Jo's canyon rescue.
Walk with Left/Right and jump with Up or Space. Call for a rock with Down
when playing alone, or have a partner steer Jo with F/H and drop with A.
Dodge the falling rocks and use the piers to reach the flag in three canyons:
**Sunset Stair** climbs east, **Split Saddle** dips between two rises, and
**Westward Crown** starts from a high camp and climbs west with stones
delivered out of climbing order. The HUD shows RIM 1–3. Reaching a flag
carries remaining hearts to the next canyon automatically. Fire after OUT
retries that canyon; fire after HOME or Game Reset starts the campaign over.

**Skateboard Steve: Gramps' Backyard** takes place in Gramps' suburban
backyard. Steve skates below the deck while Gramps tries to chase him out.
Steer with Left/Right and hold Space to push faster. Four clean dodges move
Steve from the **Picket-Fence Yard** (apples), to the **Greenhouse Garden**
(flowerpots), to the **Poolside Patio** (tennis balls), then back to the
first yard. Hearts and score carry across settings. The marks under the
score show the yard; the marks under the hearts count dodges in that yard.
A partner can steer Gramps with F/H and throw with G or A; after three idle
seconds the computer takes over. After three hits, P1 fire starts a new run;
Game Reset starts over at any time.

**Simon Says: Echo** keeps the original right, left, down, up opening.
The four arrow-shaped pads flash and sound a note; release the stick between
answers. Player 1 fire (Space) starts a solo ladder from four to eight notes.
Player 2 fire (A) starts a duel: both repeat the same sequence, first with
the arrows, then with T/F/G/H. Fewest mistakes wins, then quickest response;
equal scores and times tie. Either fire button starts a fresh game from the
result screen. Game Reset returns to the lobby.

To rebuild the three new ROMs, install
[DASM v2.20.18](https://github.com/dasm-assembler/dasm/releases/tag/v2.20.18).
Run the following from `next-site` in PowerShell with `dasm` on your PATH
(or pass `-Assembler` with its executable path). Use `-Check` to assemble
into a temporary file and compare each ROM byte-for-byte without replacing it:

```powershell
.\content\atari\revamped\build.ps1 -Check
```

The vendored `vcs.h` and `macro.h` come from that release's
[`machines/atari2600`](https://github.com/dasm-assembler/dasm/tree/v2.20.18/machines/atari2600)
directory; its license is included alongside them.

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
