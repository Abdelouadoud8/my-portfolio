# AGENTS.md — Project context for AI assistants

Read this first. It maps the whole repo so you don't need to re-explore it.
Keep it updated when you add routes, data files, or dependencies.

## What this is
Personal portfolio of **Mahdaoui Abdelouadoud** (Software Engineer + freelance UI/UX / Product Designer).
Live at `https://abdelouadoud-portfolio.vercel.app`, deployed on **Vercel (Hobby/free plan)** from `main`.
Mostly static content, no database, no CMS. All content lives in TypeScript files in `data/`.

## Stack
- **Next.js 15.3 (App Router)**, React 19, TypeScript 5 (strict), `--turbopack` in dev
- **Tailwind CSS v4** (CSS-first config in `app/index.css` via `@theme`; there is no `tailwind.config.*`)
- **shadcn/ui** (style `new-york`, base `zinc`, `components.json`), only `button`, `input`, `label`, `textarea` installed
- `lucide-react` icons (plus custom SVG icon components in `components/icons/`)
- **Umami** analytics (primary, see Analytics section) + `@vercel/analytics` (`<Analytics />`, legacy, kept during transition)
- `nodemailer` (Gmail SMTP) for the contact form
- Font: **Plus Jakarta Sans** via `next/font/google` (the variable is misleadingly named `poppins` / `--font-poppins`)
- Both `package-lock.json` and `yarn.lock` exist; npm scripts: `dev`, `build`, `start`, `lint`

## Directory map
```
app/
  layout.tsx                 Root layout: html/body, metadata/SEO/OpenGraph, font, <Analytics/>, <UmamiAnalytics/>
  index.css                  Tailwind v4 theme tokens (colors, shadows) + shadcn CSS vars
  (site)/                    Route group = portfolio pages WITH header/footer (group name not in URL)
    layout.tsx               <Header/>, <main container>, <Footer/>
    page.tsx                 "/" Home (client component): Heading, Projects grid, Clients, Testimonials, ContactCTA
    about/page.tsx           "/about": GeneralDetails, topics grid (from data/topics.ts), Trailing
    contact/page.tsx         "/contact": contact info + <ContactForm/>
    testimonials/page.tsx    "/testimonials": testimonial carousel
    projects/[slug]/page.tsx "/projects/:slug": case study, SSG via generateStaticParams from data/projects.ts
  links/page.tsx             "/links": link-in-bio page (no portfolio header, keeps <Footer/>), content from data/links.ts
  api/send-email/route.ts    POST, the only backend: sends contact form via Gmail SMTP (nodemailer)
components/
  analytics/umami-analytics.tsx  Loads Umami script + global link-click & scroll-depth tracking
  header.tsx, footer.tsx     Global nav (navItems array) / footer with social links (hardcoded)
  section-header.tsx         Reusable subtitle (red, uppercase) + title block
  home/                      heading, projects (grid), project-card, clients (logo grid), client-box, ContactCTA
  project/                   project-header, project-section (numbered section + images), quote
  about/                     general-details, topic (used on about AND project pages), trailing
  links/                     links-profile, social-link-button (platform→icon map), reel-card
  contact/contact-form.tsx   Client form, POSTs JSON to /api/send-email, uses alert() for feedback
  testimonials/              testimonial-caroussel, caroussel-image
  icons/                     SVG React components (Icon*), icons/logos/ = client logos
  ui/                        shadcn primitives (button, input w/ label+leftIcon, label, textarea w/ label)
data/
  types.ts                   Project, ProjectSectionType, QuoteType, Testimonial, TopicType
  projects.ts                Array of Project (the main content, ~800 lines)
  testimonials.ts            Array of Testimonial
  topics.ts                  About page sections (experience, education, etc.)
  links.ts                   /links content: linksProfile, linksSocials, featuredReels
  general.ts                 socialLinks + contacts (NOT currently used by header/footer, which hardcode them)
lib/utils.ts                 cn() = clsx + tailwind-merge
lib/analytics.ts             EVENTS (all event names), trackEvent(), eventAttributes()
public/
  img/projects/<slug>/       Project images (1.png = cover by convention), gifs, mp4s
  img/testimonials/          Testimonial avatars
  files/CV_MAHDAOUI_ABDELOUADOUD.pdf
  homepicture.jpg, mypicture2.jpeg, logo.svg
```

## Common tasks
### Add a project
1. Put images in `public/img/projects/<slug>/` (`1.png` = cover).
2. Append an object to `data/projects.ts` matching `Project` in `data/types.ts`:
   `id, slug, title, subtitle, role, description, coverUrl, link?, topics[{title,content}], sections[{id,title,subtitle,description,images[]}], quote?`
   - Section `id` is rendered as the big number ("01", "02"…), so use "1", "2", …
   - `topics` usually: Dates, Role, Client, Deliverables.
3. The route `/projects/<slug>` and the home grid card are generated automatically. Order in the array = order on the home page.

### Add a testimonial
Append to `data/testimonials.ts`, avatar in `public/img/testimonials/`.

### Add a page / nav item
Create `app/(site)/<route>/page.tsx` (gets header/footer), then add to `navItems` in `components/header.tsx`.
Standalone pages without portfolio chrome go directly in `app/<route>/`.

### Update the /links page (link in bio)
Everything is in `data/links.ts`:
- `linksSocials`: order = display order; no `href` → hidden; `comingSoon: true` → greyed "Soon" item.
  `followers` (number, optional) is shown compact on the right (6606 → 6.6K); updated by hand.
  Public counts readable without API: Instagram (og:description with a link-preview user agent), TikTok
  (`followerCount` in page JSON). Snapchat count is hidden (0) and LinkedIn blocks bots (HTTP 999).
  New platform: add it to `SocialPlatform` (data/types.ts) and to `platformIcons` in
  `components/links/social-link-button.tsx` (icons are Phosphor duotone, viewBox 256).
- `featuredReels`: newest first; thumbnail in `public/img/reels/` (9:16 portrait); section hidden when empty.
  Vertical cards (single reel = centered half-width). Optional `stats` {views, likes, comments, shares},
  each hidden when missing; views overlay the image, the others show under the title (lucide icons).
  Only likes/comments are public on Instagram; views/shares come from the owner's insights.
  `formatCompact()` in `lib/utils.ts` formats all counts (6606 → 6.6K).
- Clicks are tracked as `links-<platform>-click` and `reel-<id>` (see Analytics).

## Analytics (Umami)
- Page views (incl. client-side navigation) are automatic once the script loads.
- `components/analytics/umami-analytics.tsx` auto-tracks, for ANY link without `data-umami-event`:
  `outbound-link-click` {url, domain, text}, `email-click`, `phone-click`, `file-download` {file};
  plus `scroll-depth` {depth: 50|100} per page.
- Per-item events (built by `DYNAMIC_EVENTS` in `lib/analytics.ts`, names max 50 chars):
  - `<location>-<platform>-click` for social links, e.g. `links-instagram-click`, `footer-x-click`,
    `about-github-click` (props: platform, location)
  - `reel-<id>` for reel cards, e.g. `reel-Dde4utyo5Jd` (props: reel, location)
  - `visit-from-<source>` once per browser session (sessionStorage), e.g. `visit-from-instagram`,
    `visit-from-google`, `visit-from-direct` (props: source, via = utm | in-app-browser | referrer | direct,
    landing). Priority: `utm_source` > in-app browser user agent (Instagram/TikTok/Snapchat/LinkedIn/
    Facebook/X send no referrer) > referrer domain > direct.
- Named events: add the name to `EVENTS` in `lib/analytics.ts`, then either
  - declaratively: `<a {...eventAttributes(EVENTS.x, { key: "value" })}>` (Umami handles the click), or
  - imperatively: `trackEvent(EVENTS.x, { ... })` (forms, state changes).
- Current named events: `nav-click` {item, location}, `project-card-click` {project, location},
  `project-live-site-click` {project}, `cta-click` {name, location},
  `cv-download` {location}, `contact-form-start`, `contact-form-submit` {status}, `testimonial-navigate` {direction}.
  (Before 2026-09-25 social/reel clicks were logged as `social-click` / `reel-click` with the same props.)
- Event data keys must be lowercase kebab-case (they become `data-umami-event-<key>`).
- Renders nothing if env vars are missing, or on Vercel preview deployments.
- Umami records the hostname per visit: `/metrics?type=hostname` compares the portfolio's aliases.

### Umami instance & API
- Self-hosted Umami: `https://umami-mcp-three.vercel.app` (separate Vercel project, Neon Postgres).
  Vercel project settings that must stay: Root Directory = repo root (NOT `packages/mcp`),
  Framework = Next.js, Node 22.x, `APP_SECRET` set.
- Website "Portfolio" ID: `8e6e63fa-9627-4598-af83-35f1933fc1c5` (domain `abdelouadoud-portfolio.vercel.app`).
- API auth: `Authorization: Bearer $UMAMI_API_KEY`, base `$UMAMI_API_URL` (both in `.env.local`, never print them).
  Do NOT call `GET /api/me`: its response echoes the API key.
- Useful endpoints (dates are ms timestamps `startAt`/`endAt`):
  `/api/websites/{id}/stats`, `/metrics?type=path|referrer|country|device|browser|os|event|utm_source`,
  `/pageviews`, `/events`, `/export`, `/goals`, `/funnels`, `POST /reset` (wipes data, keeps goals/funnels).
- Testing on production without polluting stats: visit with `?utm_source=claude-test`, then list
  `/sessions` (note: utm filters are ignored there; identify by browser/os/time) and
  `DELETE /api/websites/{id}/sessions/{sessionId}` (removes the session + its events). Never `POST /reset`
  once real visitors exist. Session ID = hash(IP + user agent), so the same browser on two domains is one session.
- Custom **"Links page" tab** in the Umami fork (github.com/Abdelouadoud8/umami, local clone `~/Desktop/umami`,
  folder `src/app/(main)/websites/[websiteId]/link-page/`): cards for /links visits, top social link, top reel,
  top source (name shown in a tag) + visits chart + one bar chart per social link and per reel + ranking table. It filters on the event names `links-<platform>-click`,
  `reel-<id>`, `visit-from-<source>` and path `/links`: if you rename these events or the /links route,
  update `linkPageQueries.ts` in the fork too. When syncing the fork with upstream Umami, keep that folder and
  the menu entry in `src/components/hooks/useWebsiteNavItems.tsx` (the only edited core file).
- Saved goals: Contact form sent, CV downloaded, Book a call clicked, Live project site opened, Contact page visited.
- Saved funnels (60 min window): Contact conversion, Home to contact, Project engagement.

## Styling conventions
- Design tokens (in `app/index.css` `@theme`): `primary` (#e63946 red) with `primary-50…900`,
  `neutral-5…100` (neutral-100 = #312e43 main text), `secondary-light/medium/dark`, `shadow-top-light`.
  Use these classes (`text-neutral-100`, `bg-primary`, `text-neutral-70`), not raw hex.
- Light mode only (dark scheme forced to light).
- Layout container is in `layout.tsx`: `container mx-auto px-8 sm:px-4 lg:px-16 pt-6 pb-24`.
- Sections on home separated with `flex flex-col gap-32`.
- Components are default-exported function components, one per file, kebab-case filenames
  (exception: `ContactCTA.tsx`). Icons are named exports `IconXxx` taking SVG props.
- Import alias `@/*` → repo root.
- `project-section.tsx` uses a plain `<img>` (eslint rule disabled inline) to support gifs; elsewhere use `next/image`.

## Environment variables
`.env` / `.env.local` (git-ignored; set on Vercel too):
- `SMTP_EMAIL`: Gmail address that sends and receives contact messages
- `SMTP_PASSWORD`: Gmail app password
- `NEXT_PUBLIC_UMAMI_SCRIPT_URL`: Umami tracker URL (e.g. `https://<umami-host>/script.js`)
- `NEXT_PUBLIC_UMAMI_WEBSITE_ID`: website ID from the Umami dashboard
- `NEXT_PUBLIC_UMAMI_DOMAINS` (optional): comma-separated hostname allowlist. Keep it UNSET on Vercel so all
  production aliases (abdelouadoud-portfolio / abdelouadoud-mahdaoui .vercel.app) are tracked; set in `.env.local`
  to keep localhost out. Preview deployments are skipped via Vercel's automatic `NEXT_PUBLIC_VERCEL_ENV`.
- `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `NEON_BRANCH`: written into `.env` by `neon link` / `neon deploy`

## Known gaps / gotchas
- No `sitemap.ts`, `robots.ts`, `not-found.tsx`; the unknown project slug renders a bare `<div>` instead of `notFound()`.
- Per-project `generateMetadata` is missing (every project page has the default title).
- `openGraph.url` / `authors.url` lack the `https://` protocol; the OG image points at a 256px `_next/image` URL.
- `send-email` interpolates user input into HTML without escaping, and `from` uses the visitor's email (Gmail rewrites it; `replyTo` would be correct).
- Social links are duplicated in `footer.tsx`, `data/general.ts`, and contact page.
- Phone input is `type="number"` (drops leading `+`/`0`).
- Large mp4 files in `public/` count against the repo and Vercel deploy size; prefer external hosting for video.
- Vercel Hobby limits: serverless function timeouts, and Vercel Analytics data retention is short with no export.

## Planned direction (from owner, Sept 2026)
- ~~Long-retention analytics~~: Umami integrated (code done; hosting = self-hosted Umami on Vercel + free Postgres recommended). Remove `@vercel/analytics` once Umami is trusted.
- Add a **blog** of AI tips/tutorials for a non-technical Instagram audience (reels → DM → blog link).
- ~~Link-in-bio page~~: done at `/links` (data/links.ts).
- Preferred approach: keep everything in this one Next.js app under different routes (`/blog`, `/links`), with MDX content in the repo.
