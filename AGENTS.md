# AGENTS.md — Project context for AI assistants

Read this first. It maps the whole repo so you don't need to re-explore it.
Keep it updated when you add routes, data files, or dependencies.

## What this is
Personal portfolio of **Mahdaoui Abdelouadoud** (Software Engineer + freelance UI/UX / Product Designer).
Live at `https://abdelouadoud-portfolio.vercel.app`, deployed on **Vercel (Hobby/free plan)** from `main`.
Mostly static content, no database, no CMS. All content lives in TypeScript files in `data/`.

## Stack
- **Next.js 15.5 (App Router)**, React 19, TypeScript 5 (strict), `--turbopack` in dev
- **Tailwind CSS v4** (CSS-first config in `app/index.css` via `@theme`; there is no `tailwind.config.*`)
- **shadcn/ui** (style `new-york`, base `zinc`, `components.json`), only `button`, `input`, `label`, `textarea` installed
- `lucide-react` icons (plus custom SVG icon components in `components/shared/icons/`)
- **Umami** analytics (see Analytics section); `@vercel/analytics` was removed 2026-10-23 (duplicate, saves requests)
- `nodemailer` (Gmail SMTP) for the contact form
- Font: **Plus Jakarta Sans** via `next/font/google` (the variable is misleadingly named `poppins` / `--font-poppins`)
- **npm only** (`package-lock.json`; `yarn.lock` removed). `overrides.postcss` forces Next's bundled PostCSS to the
  patched top-level version. Check `npm audit --omit=dev` after dependency changes. Scripts: `dev`, `build`, `start`, `lint`

## Directory map
The site has five areas, kept apart at every level (route, components, data, public files):

| Area | URL | app/ | components/ | data/ | public/ |
|---|---|---|---|---|---|
| Portfolio (UI/UX work) | `/`, `/about`, `/contact`, `/testimonials`, `/projects/:slug` | `(portfolio)/` | `portfolio/` | `portfolio/` | `portfolio/` |
| Blog | `/blog…` | `blog/` | `blog/` | `blog/` (+ `content/blog/`) | `blog/` |
| Links (link in bio) | `/links` | `links/` | `links/` | `links/` | `links/` |
| Trainings | `/trainings/:id` | `trainings/` | `trainings/` (+ `links/training-card`) | `trainings/` | (none) |
| Services (1:1, companies) | `/services/:id` | `services/` | `links/start-paths` | `services/` | (none) |
| Media kit | `/media-kit`, `/media-kit/en`, `/media-kit/darja` | (none: static files + rewrites) | (none) | `media-kit/build.mjs` | `media-kit/` |

Code used by more than one area lives in `components/shared/`, `public/shared/`, `data/types.ts` and `lib/`.
Old public URLs (`/img/…`, `/files/…`, `/homepicture.jpg`) redirect to the new folders (`redirects()` in next.config.ts).
```
app/
  layout.tsx                 Root layout: html/body, metadata/SEO (no OpenGraph: only the home page, the blog and /links have a link preview, all with `sitePreviewImage` from lib/link-preview.ts = static `public/shared/preview.jpg`, profile photo at 256px, 11 KB; pages without og:image let Meta pick a random image from the page), font, <UmamiAnalytics/>
  index.css                  Tailwind v4 theme tokens (colors, shadows) + shadcn CSS vars
  (portfolio)/               Route group = portfolio pages WITH header/footer (group name not in URL)
    layout.tsx               <Header/>, <main container>, <Footer/>
    page.tsx                 "/" Home (client component): Heading, Projects grid, Clients, Testimonials, ContactCTA
    about/page.tsx           "/about": GeneralDetails, topics grid (from data/portfolio/topics.ts), Trailing
    contact/page.tsx         "/contact": contact info + <ContactForm/>
    testimonials/page.tsx    "/testimonials": testimonial carousel
    projects/[slug]/page.tsx "/projects/:slug": case study, SSG via generateStaticParams from data/portfolio/projects.ts
    api/send-email/route.ts  POST /api/send-email, the only backend: validated + HTML-escaped contact form via Gmail
                             SMTP (nodemailer 9); anti-spam: honeypot `website` field, `startedAt` min 3s,
                             3 msgs/10 min per IP (in-memory)
  blog/                      "/blog": Markdown blog (own layout: BlogHeader + <Footer/>, IBM Plex Sans Arabic as --font-arabic)
    page.tsx                 home: one list of all articles (compact numbered light-red rows, no covers);
                             filtering is done with the category menu (no Featured section)
    category/[category]/     one page per category (data/blog/categories.ts), dynamicParams=false
    [slug]/page.tsx          article: RTL Arabic prose, "Watch the reel" button, related posts
                             All blog pages use <BlogShell>, which is dir="rtl" (most readers are Arabic speakers;
                             header/footer stay LTR): first column (on the right) = categories + compact Follow me (links,
                             collaborate, up to 3 reels as horizontal RTL cards, cover on the right, comments hidden: ReelCard `layout="horizontal"
                             hideComments`). English text inside RTL: use dir="auto" + text-right so punctuation
                             stays at the end; direction-aware styles (border-s, text-start, rtl:) keep /links unchanged.); on mobile categories are chips on top and Follow me
                             goes below.
  trainings/[id]/page.tsx    "/trainings/:id": training details page (RTL Darja, IBM Plex Sans Arabic loaded in
                             trainings/layout.tsx, no header, shared footer), SSG from data/trainings/trainings.ts,
                             dynamicParams=false; every block (facts, outcomes, program, audience, requirements, FAQ)
                             hidden when its field is empty; reviews show an empty-state line until the first session
  services/[id]/page.tsx     "/services/one-to-one" (1:1 call, modelled on withrssle's /consultation) and "/services/business"
                             (AI audit + automation for companies): RTL Darja like the training page, content in
                             data/services/services.ts (each list hidden when empty), one request button = Telegram
                             username link (`service-request-click` {service, location}), SSG, dynamicParams=false
                             Same look as the training page: Phosphor duotone icons only (components/shared/icons, no
                             lucide here), fact cards with an icon (`facts[].icon`), steps = primary number on a
                             primary-50 circle.
  [lang]/                    English + French copies of /links and its pages: /en|fr/links, /en|fr/trainings/:id,
                             /en|fr/services/:id (dynamicParams=false, only "en"/"fr"; Darja keeps the plain URLs).
                             Every route file is thin: the page itself is components/links/links-page.tsx,
                             components/trainings/training-page.tsx, components/services/service-page.tsx ({id, locale}).
  links/page.tsx             "/links": link-in-bio page (no portfolio header, keeps <Footer/>), content from data/links/links.ts
components/
  portfolio/
    header.tsx               Portfolio nav (navItems array)
    section-header.tsx       Reusable subtitle (red, uppercase) + title block
    home/                    heading, projects (grid), project-card, clients (logo grid), client-box, ContactCTA
    project/                 project-header, project-section (numbered section + images), quote
    about/                   general-details, topic (used on about AND project pages), trailing
    contact/contact-form.tsx Client form, POSTs JSON to /api/send-email, uses alert() for feedback
    testimonials/            testimonial-caroussel, caroussel-image
  blog/                      blog-shell, blog-header, category-nav, post-list + post-card (numbered rows, dir=rtl:
                             number right, arrow ← left), post-meta (each English item wrapped LTR via <bdi>/dir so
                             dates stay "3 Oct 2026" inside RTL rows),
                             section-title, follow-section (uses SocialLinkButton `compact`)
  links/                     links-profile, total-followers
  shared/
    footer.tsx               Footer with social links (hardcoded), used by portfolio, blog and links
    analytics/umami-analytics.tsx  Loads Umami script + global link-click tracking
    social/                  social-link-button (platform→icon map), reel-card, collaborate-button: used by /links
                             and the blog; all take a `location` prop for analytics ("links" default, "blog" in the blog)
    icons/                   SVG React components (Icon*), icons/logos/ = client logos
    ui/                      shadcn primitives (button, input w/ label+leftIcon, label, textarea w/ label)
data/
  types.ts                   Project, ProjectSectionType, QuoteType, Testimonial, TopicType, SocialPlatform…
  portfolio/projects.ts      Array of Project (the main content, ~800 lines)
  portfolio/testimonials.ts  Array of Testimonial
  portfolio/topics.ts        About page sections (experience, education, etc.)
  portfolio/general.ts       socialLinks + contacts (NOT currently used by header/footer, which hardcode them)
  blog/categories.ts         blog categories (slug, Darija label + description), sidebar order
  links/links.ts             /links content: linksProfile, linksSocials, featuredReels, collaboration
content/blog/                blog articles as Markdown (<slug>.md); _template.md documents the front matter
content/*.md                 research notes used to write articles (not published: only content/blog/ is read)
lib/utils.ts                 cn() = clsx + tailwind-merge
lib/analytics.ts             EVENTS (all event names), trackEvent(), eventAttributes()
lib/blog.ts                  reads content/blog (gray-matter), validates front matter, Markdown→HTML (unified/remark/rehype)
lib/instagram-followers.ts   live follower counts (Instagram from igstats, Facebook from fbstats, fetched
                             independently) + getVisibleSocials() (shared by /links and /blog)
media-kit/                   media kit generator (NOT part of the Next.js app; excluded in tsconfig): see
                             media-kit/CLAUDE.md. build.mjs + web.mjs → public/media-kit/*.html, render.sh → PDFs
public/
  portfolio/projects/<slug>/ Project images (1.png = cover by convention), gifs, mp4s
  portfolio/testimonials/    Testimonial avatars
  portfolio/files/CV_MAHDAOUI_ABDELOUADOUD.pdf, portfolio/about-picture.jpg, contactctabg.png, mypicture2.jpeg
  blog/<slug>/               Article covers and images
  links/reels/               Reel thumbnails for /links and the blog (9:16)
  media-kit/                 GENERATED by media-kit/ (don't edit by hand): fr.html, en.html, darja.html, img/, pdf/
  shared/homepicture.jpg     Profile photo (home, /links), shared/preview.jpg (256px OpenGraph image), shared/logo.svg
```

## Common tasks
### Add a project
1. Put images in `public/portfolio/projects/<slug>/` (`1.png` = cover).
2. Append an object to `data/portfolio/projects.ts` matching `Project` in `data/types.ts`:
   `id, slug, title, subtitle, role, description, coverUrl, link?, topics[{title,content}], sections[{id,title,subtitle,description,images[]}], quote?`
   - Section `id` is rendered as the big number ("01", "02"…), so use "1", "2", …
   - `topics` usually: Dates, Role, Client, Deliverables.
3. The route `/projects/<slug>` and the home grid card are generated automatically. Order in the array = order on the home page.

### Add a testimonial
Append to `data/portfolio/testimonials.ts`, avatar in `public/portfolio/testimonials/`.

### Add a page / nav item
Create `app/(portfolio)/<route>/page.tsx` (gets header/footer), then add to `navItems` in `components/portfolio/header.tsx`.
Standalone pages without portfolio chrome go directly in `app/<route>/`.

### Write a blog article
1. Copy `content/blog/_template.md` to `content/blog/<slug>.md` (file name = URL `/blog/<slug>`, lowercase + dashes).
2. Front matter: `title`, `description` (Arabic), `category` (slug from `data/blog/categories.ts`, build fails with
   the valid list otherwise), `date` (YYYY-MM-DD, newest first),
   `cover` (image in `public/blog/<slug>/`), `reel` (Instagram URL → "Watch the reel"), `keyword`, `draft: true`.
3. Drafts show in `npm run dev` (or `BLOG_SHOW_DRAFTS=1`), never in production builds. Remove `draft` to publish.
4. Body: Markdown + GFM, rendered RTL with the Arabic font; code blocks keep the Arabic font (prompts) and pick
   each line's direction (`.blog-article` rules in app/index.css). A paragraph that is only a bold link
   (`**[text](url)**`) renders as a red call-to-action button (e.g. a link to another reel). Category names, sidebar titles and empty states are in Darija (font-arabic); the rest of the UI (meta, buttons) stays English.
- Links for Instagram auto-DMs: `/blog/<slug>?utm_source=instagram&utm_campaign=<keyword>` (visit source tracking).
- Blog pages use `revalidate = 43200` (12 h: live follower counts in the Follow me section, twice a day).

### Update the /links page (link in bio)
Everything is in `data/links/links.ts`:
- `linksSocials`: order = display order; no `href` → hidden; `comingSoon: true` → greyed "Soon" item.
  `followers` (number, optional) is shown compact on the right (6606 → 6.6K); updated by hand, EXCEPT Instagram and
  Facebook (live from igstats / fbstats, the data/links/links.ts value is only the fallback):
  `/links` fetches the latest daily count from igstats' public `GET /public/instagram` (`lib/instagram-followers.ts`,
  12-hour cache: `revalidate = 43200` on the fetch and the page, 5 s timeout) and falls back to the value in
  `data/links/links.ts` on failure. New 23:59 counts show up within 12 hours (refreshed only on visits; kept low to save Vercel usage); no secret
  or webhook involved. The fetch URL carries
  `?deploy=<VERCEL_GIT_COMMIT_SHA>` because Next's data cache survives deployments: each deploy gets the current count.
  To force a fresh count: `automations/instagram-stats/run.sh --save` (shows on /links within 12 hours, or right after a deploy).
  Public counts readable without API: Instagram (og:description with a link-preview user agent), TikTok
  (`followerCount` in page JSON). Snapchat count is hidden (0) and LinkedIn blocks bots (HTTP 999).
  New platform: add it to `SocialPlatform` (data/types.ts) and to `platformIcons` in
  `components/shared/social/social-link-button.tsx` (icons are Phosphor duotone, viewBox 256).
- `featuredReels`: newest first; thumbnail in `public/links/reels/` (9:16 portrait, JPEG 720px wide, under 100 KB); section hidden when empty.
  Vertical cards (single reel = centered half-width). Optional `stats` {views, likes, comments, shares},
  each hidden when missing; views overlay the image, the others show under the title (lucide icons).
  Only likes/comments are public on Instagram; views/shares come from the owner's insights.
  `formatCompact()` in `lib/utils.ts` formats all counts (6606 → 6.6K).
- /links funnel (2026-11-07, modelled on withrssle.com's structure, Arabic, IBM Plex Sans Arabic loaded in the page):
  profile → total followers (its platform icons ARE the social links now: no list of social buttons on /links) →
  "الدورات" offer card (`components/links/training-card.tsx`: badges, next session date +
  time, platform, places left, price + struck old price, "تفاصيل الدورة" → `/trainings/<id>`, `training-details-click`
  {training, location: links | links-path}) → "منين تحب تبدا؟" (`components/links/start-paths.tsx`:
  training page / free content anchor `#free` / Telegram question) → (2026-11-08) no free content section any more:
  "الدورات" = training card only (no note under it); the services are only rows of "منين تحب تبدا؟" (training, 1:1,
  companies; `service-details-click` {service, location: links-path}). A service with `unlisted: true`
  (data/services/services.ts) is left out of these rows and of the header menu (companies = unlisted since 2026-11-08;
  its page still works by URL). No Telegram "question" row on /links (spam); the training page keeps its question block. Booking rules shared in `lib/trainings.ts` (withLiveSeats, sessionSignupHref, nextSession,
  discountPercent) by the card, the details page's price box (`components/trainings/booking-box.tsx`: price, places,
  next session, "سجّل في الحصة" = `training-signup-click` location hero, reassurance line, total followers) and the
  session cards. Empty trainings array hides the /links section. Google Meet free accounts cut group calls at 60 min.
  "آراء المشاركين" (after the trainer card, like withrssle's feedback wall): `feedbackImages` = cropped screenshots of
  participants' messages in `public/links/ai-session/` (WebP, ~900px wide), masonry `columns-1 sm:columns-2`. Crop
  out profile photos and reaction avatars before publishing; the originals live in the git-ignored `private/` folder.
  Details page sections after the sessions: "كيفاش تسجل" (`registrationSteps`, a "coming soon" line while empty),
  "طرق الدفع" (`paymentMethods` {kind: baridimob | post-office, title, description}). Refund rule lives in the
  FAQ. Trainer card links to Instagram (`training-instagram-click`) with the live follower count (igstats, page
  `revalidate = 43200`). "عندك سؤال؟" block after the FAQ opens `questionsHref` (Telegram username link
  t.me/abdelouadoud_mahdaoui; never use a t.me/+<phone> link, it publishes the number; event `training-question-click`
  {training}).
  `components/trainings/sticky-register-bar.tsx`: bottom bar (phones + desktop) with the next open session's
  date, time and price; "تسجيل" scrolls to the sessions; hidden near the top and while the sessions are on screen.
  Details page: `sessions` [{date, time?, seats, seatsLeft, price, oldPrice?, signupHref?}], keep them sorted by date
  (shown in data order) = cards in "الحصص" (`components/trainings/session-cards.tsx`). `variant` "horizontal": date
  + details (participants, places left, duration = the training's `time`, price; icons; 2×2, one row with fixed
  columns from md up) and a fixed-width button zone from sm up; "vertical": side by side / swipe on phones. Badges on
  the top edge: "-N%" (from oldPrice/price), grey "مكتملة" (seatsLeft 0) or
  outlined "التسجيل يتفتح قريبا" (no link). The "تسجيل" button only shows when booking is open (the session's
  signupHref, else the Telegram bot for `bookingOpen` sessions when the training has `telegramBot`, else the training's
  signupHref; sessions need a stable `id`); phones also show a greyed "تسجيل" before it opens; click event
  `training-signup-click` {training, location: session-N}.
  `components/trainings/section-nav.tsx` = sticky section links on the right (lg+) / sticky chip row on phones,
  highlights the section being read; a new section needs an `id` + an entry in the page's `sections` list.
- Total followers block under the profile (`components/links/total-followers.tsx`): sum of every visible link's
  `followers` (Instagram = live count): big number, red "Total followers" label, then the counted platforms'
  icons in a row, each a link to the profile (`links-<platform>-click`, so the Umami Links tab keeps counting them);
  hidden when no counts. /links only.
- `collaboration` {email, label, subject}: red "Collaborate with me" button under the profile
  (`components/shared/social/collaborate-button.tsx`), hidden while `email` is empty. Opens `mailto:` with the subject; the
  address is passed base64-encoded and decoded on click, so it never appears in the HTML (anti-scraping).
- Clicks are tracked as `links-<platform>-click`, `reel-<id>` and `collaborate-click` (see Analytics).

### Update the media kit (/media-kit + PDFs)
Everything is generated by `media-kit/` (rules, data sources and checks in `media-kit/CLAUDE.md`): edit the numbers and
texts in `media-kit/build.mjs`, run `./media-kit/render.sh`, commit `public/media-kit/`. The web pages are plain HTML
(no React, no shared layout): Umami is loaded by a script tag in `media-kit/web.mjs` (same website ID,
`data-domains` keeps localhost out) and the PDF/email buttons fire `media-kit-pdf-download` / `media-kit-email-click`
{lang}. `/media-kit*` are `rewrites()` in next.config.ts to `public/media-kit/{fr,en,darja}.html`.

### Languages of /links, /trainings and /services (2026-11-08)
- Darja (`ar`, default, RTL, IBM Plex Sans Arabic) at the plain URLs; English and French (LTR, site font) under
  `/en/…` and `/fr/…` (`app/[lang]/`). Helpers in `lib/i18n.ts`: `localePath()`, `localePaths()`,
  `languageAlternates()` (hreflang), `formatDay()`, and `ui[locale]` = every interface string (buttons, section
  titles, badges, seat counts). Components take a `locale` prop (default "ar").
- Content: Darja stays in `data/trainings/trainings.ts` and `data/services/services.ts`; English/French text in
  `data/trainings/translations.ts` and `data/services/translations.ts` (merged by `lib/localize.ts`; a missing field
  falls back to Darja). **When you change a text in the Darja data, change it in the translations too.**
- Session dates in English/French come from each session's `day` (YYYY-MM-DD): when a session moves, change `date`
  AND `day`.
- Header on all these pages (`components/links/site-header.tsx`): name → /links, menu (training, 1:1, companies),
  language switcher (same page in the other language). Not sticky (the pages' section bar is sticky on phones).
- The Telegram bot and its messages stay in Darja. The Umami Links tab only counts path `/links`, not `/en|fr/links`.
- Dev server gotcha: a route folder created while `npm run dev` runs can 404 until its file is touched/saved again.

## Analytics (Umami)
- Page views (incl. client-side navigation) are automatic once the script loads.
- `components/shared/analytics/umami-analytics.tsx` auto-tracks, for ANY link without `data-umami-event`:
  `outbound-link-click` {url, domain, text}, `email-click`, `phone-click`, `file-download` {file};
  (`scroll-depth` was removed 2026-10-23 to cut Umami function calls.)
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
  `cv-download` {location}, `contact-form-start`, `contact-form-submit` {status}, `testimonial-navigate` {direction},
  `collaborate-click` {location}, `training-details-click` / `training-signup-click` {training, location}, `training-question-click` {training} (deliberately NOT `links-…-click`, which the Umami Links tab counts as a social link).
  (Before 2026-09-25 social/reel clicks were logged as `social-click` / `reel-click` with the same props.)
- Event data keys must be lowercase kebab-case (they become `data-umami-event-<key>`).
- Renders nothing if env vars are missing, or on Vercel preview deployments.
- **Tracking is paused on `/links`, `/en/links` and `/fr/links`** (2026-11-01, `DISABLE_ON_LINKS` in `umami-analytics.tsx`): Umami's Neon DB hit its free
  compute-hours cap because the steady event trickle (almost all from /links) kept the compute awake 24/7. The Umami "Links page"
  tab shows nothing new until it is set back to `false`.
  Exception (2026-11-09): clicks on the offer card and the "منين تحب تبدا؟" rows (`training-details-click`,
  `service-details-click`, list `LINKS_CLICK_EVENTS`) are POSTed straight to Umami's `/api/send` (no script, no page
  view; props from the link's data-umami-event-* + `source`). Only those clicks wake the Neon DB; country/device/browser
  are still recorded. Add an event name to `LINKS_CLICK_EVENTS` to track another /links link this way.
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
  update `linkPageQueries.ts` in the fork too. All its click queries filter on path `/links` (the blog fires the
  same events with location "blog"). When syncing the fork with upstream Umami, keep that folder and
  the Instagram tab/API folders and the menu entries in `src/components/hooks/useWebsiteNavItems.tsx` (the only edited core file).
- Saved goals: Contact form sent, CV downloaded, Book a call clicked, Live project site opened, Contact page visited,
  Collaborate clicked. The Links tab also shows a "Collaborate clicks" card and a Collaboration chart.
- Saved funnels (60 min window): Contact conversion, Home to contact, Project engagement.

## Automations: Instagram daily stats (`automations/instagram-stats/`)
- Neon Function **`igstats`** hosted in the Frankfurt project **`portfolio-automations`** (`young-wildflower-73641515`,
  branch `br-steep-resonance-b1bwn48v`) because Neon Functions aren't offered in eu-west-2 (London), where the
  stats DB (`my-portfolio` / `winter-forest-95717998`, the Umami DB) lives. It writes to the London DB through the
  `STATS_DATABASE_URL` env var, which deploy.sh fills with `.env.local`'s `STATS_AUTOMATION_DATABASE_URL` (the
  least-privilege role `stats_automation`, see "Automations: security"). Not part of the Next.js app (excluded in `tsconfig.json`; own `package.json`, esbuild).
- Schedule: **23:59 Europe/Paris**, records `stat_date` = that day. Neon cron is UTC only, so two triggers fire at
  21:59 and 22:59 UTC; the handler only works when it's 23:xx in Paris (handles DST).
- Data: Instagram API with Instagram Login (graph.instagram.com v25.0): `/me?fields=followers_count` +
  `/me/insights?metric=follower_demographics&breakdown=gender` (counts F/M/U, can lag up to 48h, needs a
  professional account and `instagram_business_manage_insights`). Meta app in development mode, own account only.
- Tables (London DB, schema `social_stats`, separate from Umami's `public` tables):
  `instagram_daily` (stat_date PK, followers_count, new_followers = net change, male/female_percentage = share of
  known genders, new_male/female_followers = net change, raw male/female/unknown counts) and `instagram_token`
  (single row, token stored **encrypted**; the function refreshes the 60-day token when < 20 days remain and fails the
  run, so the alert goes out, if refreshing still fails with < 5 days left). Upsert per day: the 23:59 run wins.
- Scripts (read `NEON_API_KEY`, `IGSTATS_RUN_SECRET`, `STATS_AUTOMATION_DATABASE_URL`, `TOKEN_ENCRYPTION_KEY`, `SMTP_EMAIL`, `SMTP_PASSWORD` from
  `.env.local`, never print them; shared IDs in `neon-api.sh`): `./deploy.sh` bundles + deploys; `./run.sh` = dry run
  for today, `./run.sh --save`, `./run.sh --test-alert` (sample failure email, no Instagram/DB access).
- Failure alerts: if the scheduled 23:59 run fails, the function emails SMTP_EMAIL (same Gmail app password as the
  contact form). 2026-09-27 was missed: Meta returned `API access blocked` (OAuthException 200, app restricted),
  lifted the next day; that row was added by hand (no gender counts).
- Endpoints: `POST /` (trigger only, requires `x-neon-trigger-invocation-id`), `POST /run?dryRun=1&date=YYYY-MM-DD`
  (Bearer RUN_SECRET), `GET /public/instagram` (public, read-only: `{ followers, date }` of the latest row).
- Displayed in the Umami fork's **"Instagram" tab** (`src/app/(main)/websites/[websiteId]/instagram/`, API route
  `src/app/api/websites/[websiteId]/instagram-stats/route.ts` querying `social_stats.instagram_daily`): doughnut +
  horizontal bar of women/men % (latest row with gender) and a table of all days. Renaming table columns breaks it.
- History before 2026-09-26 was entered by hand (followers only, dated as noted: counts taken ~00:01 that day).

## Automations: Facebook daily stats (`automations/facebook-stats/`)
- Neon Function **`fbstats`**, same Frankfurt project/branch as igstats but fully independent (own code folder,
  token, table, trigger, failure alert): one platform failing never stops the other.
- Facebook link is a Page (new Pages experience; public fb://profile/61593759236599, but the Graph API Page ID is
  **1191205224085834**). Graph API v25.0 with a
  **Page access token** (permissions `pages_show_list`, `pages_read_engagement`, `read_insights`); Page tokens from a
  long-lived user token don't expire, so no refresh logic. Stored (encrypted) with the Page ID in `social_stats.facebook_token`.
- Data: `/{page-id}?fields=followers_count` + Page Insights `page_daily_follows_unique` /
  `page_daily_unfollows_unique` (latest complete day; Facebook days end at midnight Pacific → `insights_date`) +
  best-effort countries (`page_follows_country`, fallback `page_fans_country`). Insights/countries failures don't
  fail the row. **Gender/age are not available**: Meta removed Page follower demographics from the API in 03/2024.
- Table `social_stats.facebook_daily` (stat_date PK, followers_count, new_followers = net change, follows,
  unfollows, insights_date, top_countries jsonb). Upsert per day: the 23:59 run wins.
- Scripts like igstats but with `FBSTATS_RUN_SECRET`: `./deploy.sh`, `./run.sh`, `./run.sh --save`,
  `./run.sh --test-alert`. Endpoints: `POST /` (trigger only), `POST /run`, `GET /public/facebook` (public
  `{ followers, date }`; feeds the Facebook count on /links and /blog via `lib/instagram-followers.ts`).
- Trigger `fbstats-daily-2359-paris` (`59 21,22 * * *`, created 2026-10-10 once the token worked).
- New Page token: put a long-lived USER token (permissions pages_show_list, pages_read_engagement, read_insights,
  business_management; Page ticked in the login dialog) in `.env.local` as `FB_USER_TOKEN`, run `./setup-token.sh`
  (prints permissions/Pages, never tokens; saves the Page token encrypted; needs `TOKEN_ENCRYPTION_KEY` and the owner
  `STATS_DATABASE_URL`), then remove FB_USER_TOKEN.
- Insights lag ~3 days (follows/unfollows of the latest complete Facebook day). Countries still available (2026-10).

## Automations: training registration bot (`automations/training-bot/`, 2026-11-01)
- Neon Function **`trainbot`** (Frankfurt project `portfolio-automations`, same branch as igstats/fbstats) = webhook of a
  Telegram bot that handles paid sessions with no email: `/start <trainingId>_<sessionId>` (the page's "تسجيل" button links
  to `t.me/<telegramBot>?start=...` for sessions with `bookingOpen`) → name → phone via Telegram's share-contact button
  (own number only) → payment details (`PAYMENT_DETAILS`) → receipt photo forwarded to the admin with
  قبول / رفض buttons → accepted: invite link of the session's private group. The group link needs approval and the bot
  approves join requests only for Telegram accounts that paid that session (declines and DMs everyone else).
  Admin (TELEGRAM_ADMIN_CHAT_ID only): `/list [session]`, `/remind <session> <text>`, `/sendlinks <session>`,
  `/setgroup <session>` (inside the group; bot must be admin with "invite users"; sends the link to already-paid people).
- Participant messages (steps 1-3, payment confirmed) are sent as Telegram HTML (`sendHtml`): bold dates/prices,
  emojis, RIP in `<code>` (tap to copy). Escape anything from people or the DB with `esc()`. `PAYMENT_DETAILS` in
  .env.local is HTML too (name in <b>, RIP in <code>, `\n` for new lines); redeploy (`./deploy.sh`) after editing it.
- Data: its own database (Frankfurt `neondb`, schema `training_bot`: `sessions`, `registrations`), NOT the London Umami
  DB (near its compute cap). Least-privilege role `training_bot` (SELECT/INSERT/UPDATE on that schema only).
  `GET /public/seats/<trainingId>` → `{ seatsLeft: { "<trainingId>_<sessionId>": n } }` (sold outside the bot via
  `reservedSeats`, paid, under review, held); a session's `displaySeatsLeft` overrides it on the website only (display
  number, e.g. 12 on 21 Nov; the bot keeps its real count); the training page uses it once `telegramBot` is set (`lib/training-seats.ts`,
  5-min cache), else the data file's `seatsLeft`.
- Scripts (read `.env.local`, never print secrets): `node setup-db.mjs` (tables + role, writes TRAINING_BOT_DATABASE_URL and
  TELEGRAM_WEBHOOK_SECRET), `node sync-sessions.mjs` (copies sessions from data/trainings/trainings.ts: run after editing
  them), `./deploy.sh` (env: token, webhook secret, admin id, payment details, DB URL), `node telegram-setup.mjs admin |
  webhook | info`. Session ids are stable keys, not dates: when a session moves, change only `date` (2026-11-28 is now on 21 Nov, 2026-12-12 on 5 Dec).

## Automations: security (igstats + fbstats, 2026-10-17)
- **Least-privilege DB role `stats_automation`** (London DB): the functions log in with it, never as `neondb_owner`.
  Grants: `SELECT (id, access_token, expires_at)` + `UPDATE (access_token, expires_at, updated_at)` on
  `social_stats.instagram_token`, `SELECT (id, page_id, access_token)` on `social_stats.facebook_token`,
  `SELECT, INSERT, UPDATE` on `instagram_daily` / `facebook_daily`; nothing else (no Umami tables, no DELETE/DDL);
  `statement_timeout` 30s. A new table the functions need must be granted explicitly. The owner URL
  (`STATS_DATABASE_URL` in `.env.local`) stays for one-off admin scripts only (setup-token, migrations).
- **Tokens encrypted at rest**: AES-256-GCM in `automations/shared/token-crypto.mjs`, format `v1:<iv>:<tag>:<data>`,
  the table name bound as additional data. Key `TOKEN_ENCRYPTION_KEY` (32 bytes base64) only in `.env.local` and the
  functions' env, never in the DB; losing it means generating new tokens. Plain-text values are refused.
- **Tokens never in URLs**: Graph calls send `Authorization: Bearer <token>`. Only exception: Instagram's
  `/refresh_access_token`, which accepts the token in the query string only (header and POST body refused, tested);
  it runs about once every 40 days and that URL is never logged or returned (errors only contain the path).
- **Read-only role `ccm_reader`** (2026-10-17): used by the Social Media Manager app (content-creation-management)
  to import the daily numbers. `SELECT` on `social_stats.instagram_daily` and `facebook_daily` only (no token tables,
  no Umami tables), `default_transaction_read_only = on`, `statement_timeout` 15s. Its URL lives only in that app's
  `apps/api/.env` (`STATS_READONLY_DATABASE_URL`). Renaming those tables' columns breaks that import too.
- Umami fork **"Facebook" tab** (`src/app/(main)/websites/[websiteId]/facebook/`, API route
  `src/app/api/websites/[websiteId]/facebook-stats/route.ts`): followers chart, follows vs unfollows, top countries
  (if any), daily table.

## Styling conventions
- Design tokens (in `app/index.css` `@theme`): `primary` (#e63946 red) with `primary-50…900`,
  `neutral-5…100` (neutral-100 = #312e43 main text), `secondary-light/medium/dark`, `shadow-top-light`.
  Use these classes (`text-neutral-100`, `bg-primary`, `text-neutral-70`), not raw hex.
- **/links and /trainings are violet** (`#7F5DE1`): their root wrappers have the `theme-links` class, which
  redefines `--color-primary` and `primary-50…900` (app/index.css). Shared components there (social links, footer,
  reel cards) turn violet automatically; the blog and portfolio stay red. Accent glows use
  `color-mix(in_srgb,var(--color-primary)_N%,transparent)`, never a hardcoded red rgba, so they follow the theme.
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
- `NEON_API_KEY`, `IGSTATS_RUN_SECRET`, `FBSTATS_RUN_SECRET`, `STATS_DATABASE_URL` (owner, admin scripts only),
  `STATS_AUTOMATION_DATABASE_URL` (stats_automation role, sent to the functions), `TOKEN_ENCRYPTION_KEY`: used only by `automations/*/*.sh`
  (not the website);
  the deploy script also forwards `SMTP_EMAIL`/`SMTP_PASSWORD` to the igstats function for failure alerts

## Known gaps / gotchas
- No `sitemap.ts`, `robots.ts`, `not-found.tsx`; the unknown project slug renders a bare `<div>` instead of `notFound()`.
- Per-project `generateMetadata` is missing (every project page has the default title).
- `openGraph.url` / `authors.url` lack the `https://` protocol; the OG image points at a 256px `_next/image` URL.
- Social links are duplicated in `components/shared/footer.tsx`, `data/portfolio/general.ts`, and contact page.
- Large mp4 files in `public/` count against the repo and Vercel deploy size; prefer external hosting for video.
- Vercel Hobby limits are per 30 days and shared by all 3 projects (portfolio, umami-mcp, content-creation-management):
  100 GB Fast Data Transfer, 1M CDN requests, 4 h Active CPU, 1M invocations, 5,000 image transformations.
  Keep media light (2026-10-24: Meta's link-preview bot `facebookexternalhit` fetched one 2 MB reel PNG ~1,000×/hour = 27 GB in 12 h; any image that may appear in a link preview must be small): project images are WebP (max 2000px wide), animations are MP4 (rendered as looping <video>), `app/favicon.ico` is a real 16/32/48 px ICO (8 KB; it was a 1.25 MB
  2400px PNG), `headers()` in next.config.ts caches public media 7 days and PDFs 1 day (default is max-age=0),
  section images lazy-load, and every `fill` <Image> needs a `sizes` prop. Firewall (2026-10-23): managed rules
  AI bots = deny, Bot protection = challenge.
- **Image Optimization / traffic hardening (2026-11-08)** — read before adding images or links:
  - `images` in next.config.ts: `qualities: [75]` only (Next 15 otherwise accepts any q=1..100 = 100× the
    transformations a script can mint), `deviceSizes` [640, 828, 1080, 1920] + `imageSizes` [64, 96, 128, 256, 384]
    (any other w → 400), `localPatterns` = only /portfolio, /blog, /links, /shared and no query strings (media-kit,
    files and remote URLs → 400), `minimumCacheTTL` 31 days. Worst case if someone crawls every variant:
    ~126 images × 9 widths ≈ 1.1K transformations/month (limit 5K). Don't add `quality=` props or widths without
    adding them here.
  - /links, /trainings, /services (+ /en, /fr) use **no** optimized images: the avatar is `public/shared/avatar-256.webp`
    (5 KB, `linksProfile.imageUrl`) and the feedback screenshots are pre-compressed WebP, all `unoptimized` (plain
    static files, browser-cached 7 days by `headers()`: the regex covers portfolio|shared|blog|links). New images on
    these pages: export a small WebP (≤ ~900px, < 100 KB) and use `unoptimized`.
  - `prefetch={false}` on every `<Link>` of those pages (header, language switcher, start paths, training card, back
    links): otherwise each visit preloads up to ~8 other pages.
  - Live seats refresh every 6 h (`SEATS_CACHE_SECONDS` = 21600 in lib/training-seats.ts); the lowest fetch revalidate
    sets the page's ISR interval, so /links + the training page (3 languages) rebuild at most every 6 h on traffic.
  - og:image stays the 11 KB `sitePreviewImage` on every page (link-preview bots fetch it on every share).
- `next` / `eslint-config-next` are pinned to exactly `15.5.27`: 15.5.28 returns 404 (`NoFallbackError`) for every
  page with `revalidate` + `dynamicParams = false` (all `/blog/<slug>` and `/blog/category/<category>` pages).
  Before upgrading, run `npm run build && npx next start` and check a blog article returns 200.

## Planned direction (from owner, Sept 2026)
- ~~Long-retention analytics~~: Umami integrated (code done; hosting = self-hosted Umami on Vercel + free Postgres recommended). `@vercel/analytics` removed 2026-10-23.
- ~~Blog~~: done at `/blog` (Markdown in content/blog). Not linked from the portfolio header yet (Arabic audience).
- ~~Link-in-bio page~~: done at `/links` (data/links/links.ts).
- ~~Media kit~~: done at `/media-kit` (generated by media-kit/, Oct 2026).
- Preferred approach: keep everything in this one Next.js app under different routes (`/blog`, `/links`), with MDX content in the repo.
