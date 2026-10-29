# CLAUDE.md: media kit (EN / FR / Algerian Darja)

Read this first: it replaces exploring the repo. Keep it updated when the layout, the styles or the data
sources change. The owner commits and pushes when they decide; never commit or push unless asked.

## Map
This folder lives in the portfolio repo (`~/Desktop/my-portfolio`, PUBLIC on GitHub) since Oct 21, 2026; it is not part
of the Next.js app (excluded in tsconfig). Paths below are relative to `media-kit/`. The old private repo
`~/Desktop/Social Media/Media Kit` (Abdelouadoud8/media-kit) is no longer updated.
```
build.mjs          EVERYTHING: data at the top (history, fbHistory, reels, ages, gender, icons, socials), texts per language in L,
                   then page(t) = the print HTML + CSS template. Writes Media-Kit-{EN,FR,Darja}.html here (git-ignored)
                   and the web pages ../public/media-kit/{fr,en,darja}.html (+ copies img/*.jpg to ../public/media-kit/img/)
render.sh          node build.mjs + headless Chrome/Chromium → ../public/media-kit/pdf/Media-Kit-{EN,FR,Darja}-MAHDAOUI.pdf
web.mjs            web version, served at /media-kit (FR), /media-kit/en, /media-kit/darja (rewrites in ../next.config.ts);
                   same data + L, web-only labels (nav, buttons, PDF link) in W[t.lang]; the nav's FR / EN / عربي switch
                   links the three URLs; RTL overrides are the `[dir=rtl]` rules at the end of the CSS; Umami script +
                   `media-kit-pdf-download` / `media-kit-email-click` events
img/               me.jpg (profile), <reel shortcode>.jpg covers (600 px wide JPEG)
assets/            analytics screenshots the numbers come from (git-ignored: private, the repo is public)
setup.sh           installs Playwright's Chromium on a new Mac
```
Public files: the PDFs are served only from the portfolio, `https://abdelouadoud-portfolio.vercel.app/media-kit/pdf/…`
(always the deployed version). Both the web pages' PDF buttons and the app's `MediaKit` table (outreach DMs; rows
fr→FR, en→EN, ar→Darja) link there, so commit + deploy is the whole publish step. The old Drive copies are no longer used.
curl gets a 429 bot challenge from Vercel on these URLs; check them in a browser instead.

## Data sources
- Main source since Oct 19, 2026: the owner's app `~/Desktop/content-creation-management` (Neon project
  `fragrant-wildflower-48644029`, db `ccm`, Prisma client in its root node_modules). Meta syncs nightly:
  `SocialSnapshot` (followers per reading; last one per Paris day = `history`), `IgDaily`/`FbDaily` (views per day),
  `IgDemographic`/`FbDemographic` (age, gender, country, city), `IgMedia` + latest `IgMediaInsight` (reel views,
  likes, comments, saves, shares, reach; `thumbnailUrl` = full-res cover).
  Since the Oct 21 re-sync, `IgDaily` sums match per-post totals (the ~2× gap seen on Oct 19 is gone);
  `FbDaily` views match per-post views. Same method at every update: 30-day views = `IgDaily` + `FbDaily` views
  over the last 30 complete days; interactions, saves, shares = sums of the latest `IgMediaInsight` per post,
  engagement rate = Σ totalInteractions / Σ reach; "98% don't follow me" = unique 30-day reach (`IgDemographic`
  audience `reached`, ~1.85M) vs IG followers; countries = IG followers % and FB % weighted by each platform's
  followers; age/gender = IG followers (`IgDemographic` audience `followers`; it covers ~all followers again since Oct 25,
  after being frozen at ~6.6K from Oct 16).
  Follower `history`: the nightly ~01:00 Paris snapshot counts for the previous day; the newest day = latest reading.
- Old: Neon project `winter-forest-95717998`, `social_stats.instagram_daily` / `facebook_daily`.
- Views, reach, engagement, age, gender, countries, top city: screenshots in `assets/` or given by the owner.
- Reel views/likes/comments: from the owner (Instagram only shows likes/comments publicly, and they lag).
  Public likes/comments: `curl -A 'facebookexternalhit/1.1' https://www.instagram.com/p/<id>/` → og:description;
  cover: og:image (360 px, low-res).

## When a number changes, update everything that depends on it (all 3 languages)
- Total followers = Instagram + Facebook (`followers`, `platforms`).
- `history` (Instagram per day from Sept 16 = 1,554), `fbHistory` (Facebook, same days; web chart's Facebook tab) + chart `max` / grid lines + `chartTo` label.
- Growth stats: +(IG − 1,554) in N days since Sept 16, per-day average, ×(IG / 1,554).
- Top-reel ratio "×N" = top reel views / Instagram followers.
- Footer `note` date.
- Audience: `ages`, `gender` (women/men %), `countries` (the big Algeria % is `countries[0]`; second row is
  Morocco & Tunisia only, Libya goes in "Other countries").
- Number formats: EN `31.9K`, `~1,070`; FR `31,9K`, `~1 070`, `16 sept.`; Darja like EN.

## Page structure (one A4 page, keep this order)
Header (photo, name, role, tagline, logo pills IG/FB (no TikTok), clickable) → "What I share" (4 short points) →
01 Followers & growth (total + platform boxes | growth stats | IG chart) → 02 Views (big 30-day views = IG + FB with `views2` platform pills, 2×2 tiles,
3 reel covers: top reel first with red border) → 03 Audience (71% Algeria + top city, country bars, women/men,
age stacked bar) → dark footer band (Looking for collaborations + pitch + formats | email + /links buttons) → data note.

## Styles
- Colours: red `#e63946` (accents, big numbers), red-soft `#fdecee`, ink `#312e43` (text, dark band),
  muted `#6e6b7d`, lines `#ebe9f0`, light bg `#faf9fb`. Fonts: Plus Jakarta Sans (Latin, all numbers),
  IBM Plex Sans Arabic (Darja), Google Fonts.
- Cards: 1px line border, 4 mm radius. Big numbers 32 pt extra-bold; stat numbers red.
- Icons: Phosphor duotone paths (same as the portfolio's components/icons), in red.
- Collaboration formats: product presentation comes first and is the only solid red chip (brands want their
  product presented); band title "Looking for collaborations", pitch "After studying your brand, I see many ways to collaborate where we both win.", formats label "How we can collaborate".
- Footer is ONE dark band (title, pitch, formats on one side, buttons on the other), never two different blocks.

## Language rules
- Darja (always spelled "Darja", never "Darija") = Algerian, Arabic script: تاع، بزاف، نهار، واش، فرانسا، ضرك. Never Moroccan (ديال، دابا، واخا، بغيت).
- RTL page (`dir="rtl"`): wrap numbers/Latin inside Arabic sentences with `ltr("…")` (<bdi dir=ltr>); stat
  numbers, age labels and % already get `direction:ltr; unicode-bidi:isolate`. Check ×N, ~N, N%, 18–24, 35+.
- French: proper accents, a space before ":" (`1re ville : Alger`), comma decimals.

## Verify after every change
1. `./media-kit/render.sh`, then check each PDF is 1 page (in `public/media-kit/pdf/`):
   `python3 -c "import re,sys;print(len(re.findall(rb'/Type\s*/Page(?!s)',open(sys.argv[1],'rb').read())))" public/media-kit/pdf/Media-Kit-EN-MAHDAOUI.pdf`
2. The page auto-shrinks (script at the end of the HTML) if content is too long; if text gets small, shorten
   texts instead. `.page > *` must keep `flex-shrink:0` or blocks get squeezed instead of shrinking the page.
3. Look at ONE small image per changed version: `sips -s format png -Z 1400 public/media-kit/pdf/Media-Kit-FR-MAHDAOUI.pdf --out /tmp/fr.png`
   (FR is the longest text, Darja catches RTL bugs).
4. Web version: `npm run dev` (or `npm run build && npx next start`) in the portfolio, then open /media-kit,
   /media-kit/en and /media-kit/darja (a server started from the shell can read ~/Desktop; the app's preview server can't).

## Token rules
- Don't read build.mjs whole: grep for the key (`followers:`, `s1stats`, `chartTo`, `.band`…) and read those lines.
- Edit with exact string replacements (assert each match count), all 3 languages in one pass.
- One 1400 px PNG to check a version; crop only if a detail is unreadable. No screenshots of the HTML.
