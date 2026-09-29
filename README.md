# Kelly Robertson — spec site (private pitch)

A custom, cinematic homepage plus two supporting pages for **Kelly Robertson, Coldwell Banker Elite (Downtown Fredericksburg office)**, built as a spec pitch. It is meant to replace the stock Coldwell Banker/Moxi template at [kellyknowshomes.sites.cbmoxi.com](https://kellyknowshomes.sites.cbmoxi.com/) with a place-driven, editorial design.

> **Private pitch — not for public launch.**
> - Every page carries `<meta name="robots" content="noindex, nofollow">`, and the Netlify and Vercel configs also send an `X-Robots-Tag: noindex, nofollow` header.
> - Listing photos, the headshot and the logo are used for this presentation only. See [Image rights](#image-rights).

**Stack**

- Astro 7 (static output) and vanilla CSS (custom properties, no Tailwind).
- GSAP (ScrollTrigger, SplitText) and Lenis for motion.
- Fonts: Instrument Serif and Hanken Grotesk. These are the Google Fonts families, served from the site itself through Astro's Fonts API. There are no third-party font requests, and the fallback fonts are metric-matched.

**Pages**

- `/` — homepage
- `/listing/37-serene-hills-dr/` — the listing "chapter"
- `/about/`
- `/thanks/` — form confirmation
- `/credits/` — photo and film credits
- a 404 page

---

## Pitch summary (for Kelly)

Your current site is Coldwell Banker's standard template: the same layout thousands of agents use, with nothing on it that says Fredericksburg.

This version is built around the place you know by heart:
- It opens on film of downtown's steeples across the Rappahannock.
- It presents 37 Serene Hills as a story told in photographs.
- It introduces downtown, Stafford, Spotsylvania and King George as real places, not search filters.

It loads fast, reads beautifully on a phone, and scores 97–100 on Google's Lighthouse performance and accessibility audits. It keeps every Coldwell Banker compliance element (your license, the brokerage, Equal Housing) and links straight into your existing CB search and listings.

It also fixes two things the template hides:
- Your active listing isn't on your Featured Properties page today.
- The office number in your current site header doesn't match the one on your bio page and Coldwell Banker's records.

---

## Run it locally

Requires **Node 22.12+**. The `.nvmrc` file pins Node 22.

```bash
npm install
npm run dev       # http://localhost:4321 — live-reloading dev server
npm run build     # static site → dist/  (first build ~4–5 min while images are optimized; cached after)
npm run preview   # serve dist/ at http://localhost:4321
npm run check     # TypeScript / Astro diagnostics
```

The contact form only delivers on Netlify (see below). Locally it posts to `/thanks/`, and the local server answers with an error; that's expected.

---

## Deploy to Netlify

All settings live in `netlify.toml`:
- build command `npm run build`
- publish directory `dist`
- Node 22
- noindex and caching headers

**From Git (recommended)**

1. Push this repo to GitHub.
2. In Netlify, choose **Add new site → Import an existing project** and pick the repo. Netlify reads `netlify.toml`, so there are no settings to change.
3. Deploy. The first build takes a few minutes while Astro generates the AVIF/WebP images.

**Or with the CLI**

```bash
npm i -g netlify-cli
netlify login
netlify init                  # link or create the site
netlify deploy --build --prod
```

**Turn on the contact form.** This build uses Netlify Forms.

1. Go to Site → **Forms** → **Enable form detection**, then redeploy once. Netlify detects the `contact` form in the static HTML.
2. Go to Site → **Forms → Form notifications** and add an email notification to `krobertson@coldwellbankerelite.com`.
3. Spam: the form has a honeypot field (`bot-field`), and Netlify's own spam filtering also applies.

**Vercel** also works (`vercel.json` is included), but Netlify Forms won't. On Vercel the form is a visual mockup until it points at a form service such as Formspree or Basin.

**Link previews.** `site` in `astro.config.mjs` picks up Netlify's `URL` (or Vercel's production URL) automatically. Set a `SITE_URL` environment variable once there's a real domain.

---

## Where to swap content

Content lives in data files, so swapping it never touches layout code.

| What | Where |
| --- | --- |
| Agent, office, license, phones, social links, disclaimers | `src/data/site.ts` |
| Featured listing (facts, story, chapters, photos) and "more listings" | `src/data/listings.ts` |
| Hero film, poster, "Now showing" captions, neighborhoods, local-life strip, About letterbox | `src/data/places.ts` |
| Photo credits | `src/data/place-credits.json`; the film credit is in `src/data/credits.ts` |
| Colors, type scale, spacing, the shared warm photo grade | `src/styles/global.css` (`:root` tokens, `--grade`) |

### Hero video

**Files** (1280×720, 14.5 s loop, no audio):

| File | Size | Served to |
| --- | --- | --- |
| `public/video/hero.webm` | 2.8 MB (VP9) | Chrome, Firefox and Edge on desktop |
| `public/video/hero.mp4` | 4.4 MB (H.264) | Safari on desktop |
| `public/video/hero-720.mp4` | 2.2 MB | Phones |

**Poster:** `src/assets/places/hero-poster.jpg`. It's the first frame, shown immediately, and it's what reduced-motion and Save-Data visitors see.

**How it loads.** The film only starts downloading *after* the page has loaded, so it never slows the first paint. It pauses when scrolled off-screen, and there's a visible **Pause** control.

**How to configure it.** In `src/data/places.ts`:
- `hero.video` — the list of sources.
- `hero.nowShowing` — the caption for the poster / first shot.
- `hero.captions` — the caption follows the film's cuts, given in seconds.
- To use a still photo instead, set `hero.video` to `null`. The poster then gets a slow Ken Burns zoom.

**Recommended for launch.** License 4K golden-hour footage of the Rappahannock and Caroline Street, or commission a local drone videographer. Export 1920×1080, around 4–5 MB, in both WebM (VP9) and MP4 (H.264), and replace the files. Then re-run `qa/hero-contrast.*` (see QA) to confirm the text stays legible over the new footage.

### Photos

- **Listing photos:** `src/assets/listings/<listing>/`, referenced from `src/data/listings.ts`.
- **Place photos** (neighborhoods, local life, About): `src/assets/places/`, referenced from `src/data/places.ts`. When you swap one, update `place-credits.json`.
- **Portrait:** `src/assets/kelly/kelly-robertson-portrait.jpg`, a 4:5 crop of the current 720×480 headshot.
- **Logos:** `src/assets/brand/` (Coldwell Banker Elite in white and navy, from Kelly's current site).
- **Adding images:** drop in large originals (2400 px wide or more). Astro generates responsive AVIF/WebP automatically. The layout fixes each image's aspect ratio, so use the `focus` value in the data files (e.g. `'50% 30%'`) to steer the crop.

---

## Placeholders & TODOs for real content

Every visible placeholder appears on the page as a dashed, brick-red **[BRACKETED]** tag.

| # | Where | What's needed |
| --- | --- | --- |
| 1 | Home › intro statement | **[Draft — written from Kelly's bio, for her approval]**. The paragraph is drafted in her voice from her real bio; she should approve or rewrite it. |
| 2 | Home › About, and `/about` hero | **[High-resolution portrait needed]**. The only headshot on her current site is 720×480 and landscape; a tall, high-res portrait is needed. |
| 3 | Home › local-life strip | **[Placeholder photos — swap in posts from @lifeinfredericksburg]**. Nothing was scraped from Instagram. Use her own posts, or a feed or embed service she approves. |
| 4 | `/about` › "In her words" | **[Kelly's current bio, lightly edited — for her approval]**. Split into paragraphs, with grammar fixes only. |
| 5 | `/about` › military families | **[Draft — confirm the military-relocation copy with Kelly]**. It paraphrases her bio; the Quantico/Dahlgren line is regional context for her to confirm. |
| 6 | `/about` › reviews | **[Client reviews — add two or three real, approved reviews with client permission]**. None were added, and nothing is invented. |
| 7 | `/listing/37-serene-hills-dr` | **[Confirm photo usage rights]**. See Image rights. |
| 8 | `src/data/site.ts` | **Office phone.** CB's office record and Kelly's bio page list **(540) 373-0100**. Her current site header (and the original brief) show (540) 373-1000. The site uses 373-0100; confirm with Kelly, since her current header likely has a typo. |
| 9 | Nav › "Book a call" | Points to the contact section. If Kelly uses a scheduling link (Calendly etc.), set it in `src/components/SiteHeader.astro`. |
| 10 | Netlify | Enable form detection and set the notification email (see Deploy). |
| 11 | Home › neighborhoods | The place descriptions are short factual drafts (geography and landmarks, nothing claimed about Kelly). Let Kelly adjust the emphasis. |
| 12 | Listings | See the notes below the table. |
| 13 | Launch | Remove `noindex` (in `src/layouts/Base.astro`, `netlify.toml` and `vercel.json`) and confirm every item above. |

**Notes on the listings (#12):**
- **Featured** is Kelly's own active listing; her Featured Properties page was empty.
- **"More listings"** are active **Coldwell Banker Elite** listings from her site's "My Company's Active Listings" page, each credited to its listing agents. Swap them for Kelly's own listings as her inventory changes.
- **The Rectory** has conflicting data. Its MLS fields say 3 bd / 4 ba / 3,600 sq ft, but its remarks describe Residence 301 as 3,982 sq ft with 3 full and 2 half baths. The site shows the MLS fields, as her CB site does.

---

## Image rights

Nothing here is cleared for public use yet.

- **37 Serene Hills Dr.** Professional listing photography; the tour is hosted by Pearce Property Media. Confirm the photographer's license covers use on Kelly's own site. It usually does for the listing agent, but check.
- **1304 Washington Ave.** Photos from the listing's unbranded tour on Aryeo; the listing agents are Robin Marine and Magnolia Martin. This needs the agents' and photographer's permission, or swap it for one of Kelly's own listings.
- **1111 Prince Edward St and 301 Hanover St.** Bright MLS IDX images, shown uncropped with the Bright watermark intact and IDX attribution. IDX display rules apply; replace them with Kelly's own listings for launch.
- **Headshot and Coldwell Banker Elite logo.** Taken from Kelly's current site. She should confirm use, and it should follow CB brand guidelines.
- **Homepage film.** National Park Service, Olmsted Center for Landscape Preservation: [*The Cultural Landscape at Chatham Manor*](https://www.nps.gov/media/video/view.htm?id=1C284F91-6AA9-4C5C-A68A-0B5B031BE767) (2018).
  - *Status:* NPS credits it to itself with no copyright symbol, which makes it public domain under NPS's stated policy.
  - *What's used:* only the live-action shots, re-edited and color-graded. Archival images, drone footage and the music were all left out.
  - *One caveat:* it was filmed by an intern placed through a partner program. For certainty, a one-line email to the Olmsted Center (OCLP) confirming reuse would settle it.
  - *Endorsement:* don't imply NPS endorsement.
- **Place photos** (11 images). Public domain (NPS) or Creative Commons (CC BY / CC BY-SA), each credited with its author, license and source on `/credits/`. Keep that page, or equivalent attribution, for as long as these photos are used.

---

## QA

These checks were run against the production build (`npm run build && npm run preview`).

**Lighthouse** (local, simulated mobile throttling / desktop preset):

| Page | Performance (mobile / desktop) | Accessibility | Best Practices | Agentic browsing |
| --- | --- | --- | --- | --- |
| Home | 97 / 100 | 100 | 100 | 100 |
| Listing | 99 / 100 | 100 | 100 | 100 |
| About | 99 / 100 | 100 | 100 | 100 |

- Mobile LCP is 2.0–2.6 s, CLS is 0–0.006, and TBT is 60 ms or less.
- **SEO scores 63 by design.** Lighthouse penalizes the required `noindex`; the score returns to 100 once `noindex` is removed at launch.

**Other checks:**
- **axe-core** (WCAG 2.2 AA + best practices): 0 violations on every page, at 1440 px and 390 px.
- **Text over the film:** `qa/hero-contrast.mjs` + `.py` measures real text contrast against sampled frames. Every hero label is at least 6:1, and the headline is at least 5.3:1.
- **Text over the listing photo:** `qa/listing-contrast.mjs` does the same for the listing hero.
- **Interaction:** `qa/motion.mjs` checks that every reveal completes, the tab order, the menu dialog (focus goes in, Escape closes, focus returns) and the pause control.
- **Film:** `qa/video.mjs` checks that the film loads after page load, that the captions follow the cuts, and that reduced motion means no video download.
- **Screenshots:** `qa/shoot.mjs` takes full-page screenshots at desktop and mobile widths.
- The QA scripts need Playwright installed globally (`npm i -g playwright`) and write their output to `qa/out/` (git-ignored).

## Accessibility

**Contrast** (WCAG 2.x):

| Text | On | Ratio |
| --- | --- | --- |
| Ink `#1C1B19` | Ivory `#F7F3EC` | 15.6:1 |
| Muted `#5E574D` | Ivory | 6.4:1 |
| Brick accent `#8E3B2B` | Ivory | 6.8:1 |
| Ivory | Dark ink sections | 15.6:1 |
| Lighter brick `#D4917B` | Dark ink sections | 6.7:1 |
| Muted `#A69C8D` | Dark ink sections | 6.4:1 |

Text over the film sits on a functional scrim, tuned against the film's brightest frames.

**Structure and controls:**
- Real links and buttons, and visible focus rings (brick on light backgrounds, ivory on dark).
- A skip link, labelled form fields, landmarks and a heading structure.
- Alt text on every photograph.
- A native `<dialog>` menu, which traps focus and closes on Escape.

**Motion:**
- There are three ideas only: text rising into place, image wipes, and a slow Ken Burns zoom.
- With `prefers-reduced-motion`, there's no smooth scroll, no animation, no autoplay and no video download.
- Content is visible without JavaScript.
- Anything a keyboard user focuses is revealed immediately.

## Coldwell Banker / fair-housing compliance

- **Brokerage:** Coldwell Banker Elite's name appears in the header, and its logo and name in the footer, along with the office address and phone.
- **License:** Kelly's Virginia license number (#0225231616) is in the footer.
- **Fair housing:** the Equal Housing Opportunity logo and statement, and a link to the Fair Housing Notice.
- **CB disclaimer:** the standard text (offices independently owned and operated), word for word from her current site.
- **Listings:** IDX attribution on every listing (listing brokerage and agent, "deemed reliable but not guaranteed").

---

## Project structure

```
src/
  assets/            images (processed at build time)
  components/        Hero, Intro, ListingChapter, MoreListings, Neighborhoods,
                     AboutKelly, LocalLife, Contact, SiteHeader, SiteFooter, Photo…
  data/              site.ts · listings.ts · places.ts · place-credits.json · credits.ts
  layouts/Base.astro head, noindex, fonts, header/footer, scripts
  pages/             index · about · listing/[slug] · thanks · credits · 404
  scripts/           motion.ts (Lenis + GSAP) · header.ts · hero.ts · site.ts
  styles/global.css  tokens, grid, type, controls, motion states
public/              favicon, video/
qa/                  QA scripts (screenshots, motion, film, contrast)
```
