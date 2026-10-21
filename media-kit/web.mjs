// Web version of the media kit: build.mjs calls web(t, data) and writes public/media-kit/{fr,en,darja}.html,
// served at /media-kit, /media-kit/en, /media-kit/darja (rewrites in next.config.ts). Numbers and texts come from
// build.mjs (data + L); only web-only labels live here.

const EMAIL = "abdelouadoud.mahdaoui.pro@gmail.com";
const LINKS = "https://abdelouadoud-portfolio.vercel.app/links";
const DAY0 = Date.UTC(2026, 8, 16); // history[0] is Sept 16, 2026
const SITE = "https://abdelouadoud-portfolio.vercel.app";
const BASE = "/media-kit"; // public/media-kit: images in img/, PDFs in pdf/
// Same Umami website as the rest of the portfolio; data-domains keeps localhost out of the stats
const UMAMI = { src: "https://umami-mcp-three.vercel.app/script.js", id: "8e6e63fa-9627-4598-af83-35f1933fc1c5",
  domains: "abdelouadoud-portfolio.vercel.app,abdelouadoud-mahdaoui.vercel.app" };

// Phosphor duotone paths (@phosphor-icons/react 2.1.10 in the app's node_modules), same style as ICONS in build.mjs
const ICO = {
  robot: `<svg viewBox="0 0 256 256"><path opacity=".25" fill="currentColor" d="M200,56H56A24,24,0,0,0,32,80V192a24,24,0,0,0,24,24H200a24,24,0,0,0,24-24V80A24,24,0,0,0,200,56ZM164,184H92a20,20,0,0,1,0-40h72a20,20,0,0,1,0,40Z"/><path fill="currentColor" d="M200,48H136V16a8,8,0,0,0-16,0V48H56A32,32,0,0,0,24,80V192a32,32,0,0,0,32,32H200a32,32,0,0,0,32-32V80A32,32,0,0,0,200,48Zm16,144a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V80A16,16,0,0,1,56,64H200a16,16,0,0,1,16,16ZM72,108a12,12,0,1,1,12,12A12,12,0,0,1,72,108Zm88,0a12,12,0,1,1,12,12A12,12,0,0,1,160,108Zm4,28H92a28,28,0,0,0,0,56h72a28,28,0,0,0,0-56Zm-24,16v24H116V152ZM80,164a12,12,0,0,1,12-12h8v24H92A12,12,0,0,1,80,164Zm84,12h-8V152h8a12,12,0,0,1,0,24Z"/></svg>`,
  cap: `<svg viewBox="0 0 256 256"><path opacity=".25" fill="currentColor" d="M216,113.07v53.22a8,8,0,0,1-2,5.31c-11.3,12.59-38.9,36.4-86,36.4s-74.68-23.81-86-36.4a8,8,0,0,1-2-5.31V113.07L128,160Z"/><path fill="currentColor" d="M251.76,88.94l-120-64a8,8,0,0,0-7.52,0l-120,64a8,8,0,0,0,0,14.12L32,117.87v48.42a15.91,15.91,0,0,0,4.06,10.65C49.16,191.53,78.51,216,128,216a130,130,0,0,0,48-8.76V240a8,8,0,0,0,16,0V199.51a115.63,115.63,0,0,0,27.94-22.57A15.91,15.91,0,0,0,224,166.29V117.87l27.76-14.81a8,8,0,0,0,0-14.12ZM128,200c-43.27,0-68.72-21.14-80-33.71V126.4l76.24,40.66a8,8,0,0,0,7.52,0L176,143.47v46.34C163.4,195.69,147.52,200,128,200Zm80-33.75a97.83,97.83,0,0,1-16,14.25V134.93l16-8.53ZM188,118.94l-.22-.13-56-29.87a8,8,0,0,0-7.52,14.12L171,128l-43,22.93L25,96,128,41.07,231,96Z"/></svg>`,
  path: `<svg viewBox="0 0 256 256"><path opacity=".25" fill="currentColor" d="M224,200a24,24,0,1,1-24-24A24,24,0,0,1,224,200Z"/><path fill="currentColor" d="M200,168a32.06,32.06,0,0,0-31,24H72a32,32,0,0,1,0-64h96a40,40,0,0,0,0-80H72a8,8,0,0,0,0,16h96a24,24,0,0,1,0,48H72a48,48,0,0,0,0,96h97a32,32,0,1,0,31-40Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,200,216Z"/></svg>`,
  laptop: `<svg viewBox="0 0 256 256"><path opacity=".25" fill="currentColor" d="M216,72V176H40V72A16,16,0,0,1,56,56H200A16,16,0,0,1,216,72Z"/><path fill="currentColor" d="M232,168h-8V72a24,24,0,0,0-24-24H56A24,24,0,0,0,32,72v96H24a8,8,0,0,0-8,8v16a24,24,0,0,0,24,24H216a24,24,0,0,0,24-24V176A8,8,0,0,0,232,168ZM48,72a8,8,0,0,1,8-8H200a8,8,0,0,1,8,8v96H48ZM224,192a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8v-8H224ZM152,88a8,8,0,0,1-8,8H112a8,8,0,0,1,0-16h32A8,8,0,0,1,152,88Z"/></svg>`,
  heart: `<svg viewBox="0 0 256 256"><path opacity=".25" fill="currentColor" d="M232,102c0,66-104,122-104,122S24,168,24,102A54,54,0,0,1,78,48c22.59,0,41.94,12.31,50,32,8.06-19.69,27.41-32,50-32A54,54,0,0,1,232,102Z"/><path fill="currentColor" d="M178,40c-20.65,0-38.73,8.88-50,23.89C116.73,48.88,98.65,40,78,40a62.07,62.07,0,0,0-62,62c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,228.66,240,172,240,102A62.07,62.07,0,0,0,178,40ZM128,214.8C109.74,204.16,32,155.69,32,102A46.06,46.06,0,0,1,78,56c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,155.61,146.24,204.15,128,214.8Z"/></svg>`,
  chat: `<svg viewBox="0 0 256 256"><path opacity=".25" fill="currentColor" d="M224,128A96,96,0,0,1,79.93,211.11h0L42.54,223.58a8,8,0,0,1-10.12-10.12l12.47-37.39h0A96,96,0,1,1,224,128Z"/><path fill="currentColor" d="M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z"/></svg>`,
  pin: `<svg viewBox="0 0 256 256"><path opacity=".25" fill="currentColor" d="M128,24a80,80,0,0,0-80,80c0,72,80,128,80,128s80-56,80-128A80,80,0,0,0,128,24Zm0,112a32,32,0,1,1,32-32A32,32,0,0,1,128,136Z"/><path fill="currentColor" d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z"/></svg>`,
  download: `<svg viewBox="0 0 256 256"><path opacity=".25" fill="currentColor" d="M216,48V208H40V48A16,16,0,0,1,56,32H200A16,16,0,0,1,216,48Z"/><path fill="currentColor" d="M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,124.69V32a8,8,0,0,0-16,0v92.69L93.66,98.34a8,8,0,0,0-11.32,11.32Z"/></svg>`,
  arrow: `<svg viewBox="0 0 256 256"><path opacity=".25" fill="currentColor" d="M192,64V168L88,64Z"/><path fill="currentColor" d="M192,56H88a8,8,0,0,0-5.66,13.66L128.69,116,58.34,186.34a8,8,0,0,0,11.32,11.32L140,127.31l46.34,46.35A8,8,0,0,0,200,168V64A8,8,0,0,0,192,56Zm-8,92.69-38.34-38.34h0L107.31,72H184Z"/></svg>`,
};

// Web-only labels per language, keyed by t.lang
const W = {
  fr: {
    locale: "fr-FR",
    skip: "Aller au contenu",
    nav: [["abonnes", "Abonnés"], ["vues", "Vues"], ["audience", "Audience"]],
    navCta: "Collaborer",
    contact: "Me contacter",
    subject: "Collaboration",
    pdf: "Télécharger les données en PDF",
    links: "Tous mes liens",
    mail: "Envoyer un e-mail",
    pdfUrl: `${BASE}/pdf/Media-Kit-FR-MAHDAOUI.pdf`,
    photoAlt: "Photo d'Abdelouadoud Mahdaoui",
    shareIcons: ["robot", "cap", "path", "laptop"],
    unit: "abonnés",
    chartAria: (from, to, a, b) => `Abonnés Instagram du ${from} au ${to} : de ${a} à ${b}`,
    topReel: "Top reel",
    reelLink: (v) => `Voir le reel sur Instagram (${v} vues)`,
    colon: "\u00a0: ",
  },
  en: {
    locale: "en-GB",
    skip: "Skip to content",
    nav: [["abonnes", "Followers"], ["vues", "Views"], ["audience", "Audience"]],
    navCta: "Collaborate",
    contact: "Contact me",
    subject: "Collaboration",
    pdf: "Download the data as PDF",
    links: "All my links",
    mail: "Send an email",
    pdfUrl: `${BASE}/pdf/Media-Kit-EN-MAHDAOUI.pdf`,
    photoAlt: "Photo of Abdelouadoud Mahdaoui",
    shareIcons: ["robot", "cap", "path", "laptop"],
    unit: "followers",
    colon: ": ",
    chartAria: (from, to, a, b) => `Instagram followers from ${from} to ${to}: from ${a} to ${b}`,
    topReel: "Top reel",
    reelLink: (v) => `Watch the reel on Instagram (${v} views)`,
  },
  "ar-DZ": {
    locale: "ar-DZ-u-nu-latn",
    skip: "روح للمحتوى",
    nav: [["abonnes", "المتابعين"], ["vues", "المشاهدات"], ["audience", "الجمهور"]],
    navCta: "نتعاونو",
    contact: "تواصل معايا",
    subject: "Collaboration",
    pdf: "حمّل الأرقام في PDF",
    links: "كامل الروابط تاعي",
    mail: "ابعثلي إيميل",
    pdfUrl: `${BASE}/pdf/Media-Kit-Darja-MAHDAOUI.pdf`,
    photoAlt: "صورة عبد الودود مهداوي",
    shareIcons: ["robot", "cap", "path", "laptop"],
    unit: "متابع",
    colon: ": ",
    chartAria: (from, to, a, b) => `المتابعين على Instagram من ${from} حتى ${to}: من ${a} إلى ${b}`,
    topReel: "أحسن ريل",
    reelLink: (v) => `شوف الريل على Instagram (${v} مشاهدة)`,
  },
};

export function web(t, { history, fbHistory, reels, ages, gender, ICONS, MAIL, LINK, socials, langs }) {
  const w = W[t.lang];
  const num = (s) => (t.lang === "fr" ? s.replace(".", ",") : s);
  // French typography: no line break before ":;!?" or between a number and the word after it
  const fr = (s) => (t.lang === "fr" ? s.replace(/ ([:;!?])/g, "&nbsp;$1").replace(/(\d) (?=\p{L})/gu, "$1&nbsp;") : s);
  const attr = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  const nf = new Intl.NumberFormat(w.locale);
  const date = (i, o) => new Intl.DateTimeFormat(w.locale, { timeZone: "UTC", ...o }).format(DAY0 + i * 864e5);
  const last = history.length - 1;
  const x = (i) => ((100 * i) / last).toFixed(2);
  const months = history.map((_, i) => i).filter((i) => i > 3 && i < last - 3 && new Date(DAY0 + i * 864e5).getUTCDate() === 1);
  // 1,554 → "1.5K" (rounded down, like the PDF), 820 → "820"
  const kfmt = (v) => (v < 1000 ? nf.format(v) : num(`${Math.floor(v / 100) / 10}K`));
  const bdi = (s) => (t.dir === "rtl" ? `<bdi dir="ltr">${s}</bdi>` : s);
  const short = (i) => date(i, { day: "numeric", month: "short" });
  const series = [["instagram", "Instagram", history], ["facebook", "Facebook", fbHistory]];
  // One followers chart per platform; the tabs above it show one at a time.
  // The plot is a 1000×300 box stretched to its container; non-scaling strokes keep the line 2px wide
  const panel = ([id, name, H], on) => {
    const max = Math.ceil(Math.max(...H) / 10000) * 10000;
    const ticks = Array.from({ length: max / 10000 + 1 }, (_, k) => k * 10000);
    const y = (v) => (100 * (1 - v / max)).toFixed(2);
    const line = H.map((v, i) => `${((1000 * i) / last).toFixed(1)},${(3 * y(v)).toFixed(1)}`).join(" ");
    const area = `M0,300 L${line.replace(/ /g, " L")} L1000,300 Z`;
    const aria = w.chartAria(date(0, { day: "numeric", month: "long" }), date(last, { day: "numeric", month: "long", year: "numeric" }), nf.format(H[0]), nf.format(H[last])).replace("Instagram", name);
    return `<div class="cpanel" id="cp-${id}" role="tabpanel" aria-labelledby="ct-${id}"${on ? "" : " hidden"}>
          <div class="plot" tabindex="0" role="img" data-h="${JSON.stringify(H)}" data-max="${max}" aria-label="${attr(aria)}">
            ${ticks.map((v) => `<span class="yt" style="top:${y(v)}%">${v ? v / 1000 + "K" : "0"}</span>`).join("")}
            <svg viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true">
              <defs><linearGradient id="wash-${id}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#e63946" stop-opacity=".14"/><stop offset="1" stop-color="#e63946" stop-opacity=".02"/></linearGradient></defs>
              ${ticks.slice(1).map((v) => `<line class="gl" x1="0" x2="1000" y1="${(3 * y(v)).toFixed(1)}" y2="${(3 * y(v)).toFixed(1)}"/>`).join("")}
              <line class="gl" x1="0" x2="1000" y1="300" y2="300"/>
              <path d="${area}" fill="url(#wash-${id})"/>
              <polyline class="ln" points="${line}"/>
            </svg>
            <span class="xhair"></span><span class="dot end" style="left:100%;top:${y(H[last])}%"></span><span class="dot hover"></span>
            <div class="tip" aria-hidden="true"><b></b> <small>${w.unit}</small><span class="d"></span></div>
          </div>
          <div class="xaxis" aria-hidden="true"><span>${short(0)} · ${bdi(kfmt(H[0]))}</span>${months.map((i) => `<span class="mid" style="left:${x(i)}%">${short(i)}</span>`).join("")}<span>${short(last)} · ${bdi(kfmt(H[last]))}</span></div>
        </div>`;
  };
  const [dzText, dzCity] = t.dzLabel.split("<br>");
  const ext = `target="_blank" rel="noopener"`;
  const mail = `mailto:${EMAIL}?subject=${encodeURIComponent(w.subject)}`;
  // Umami click events (same naming as lib/analytics.ts: kebab-case name, lang as event data)
  const track = (name) => `data-umami-event="${name}" data-umami-event-lang="${t.lang}"`;
  const desc = attr(`${t.role} · ${t.followers} ${w.unit} · ${t.big2} ${t.big2Label}`);
  return `<!doctype html>
<html lang="${t.lang}" dir="${t.dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>Abdelouadoud Mahdaoui · Media Kit</title>
<meta name="description" content="${desc}">
<meta property="og:type" content="website">
<meta property="og:title" content="Abdelouadoud Mahdaoui · Media Kit">
<meta property="og:description" content="${desc}">
<link rel="icon" href="${BASE}/img/me.jpg">
<link rel="canonical" href="${SITE}${langs.find((l) => l.lang === t.lang).href}">
${langs.map((l) => `<link rel="alternate" hreflang="${l.lang}" href="${SITE}${l.href}">`).join("\n")}
<script defer src="${UMAMI.src}" data-website-id="${UMAMI.id}" data-domains="${UMAMI.domains}"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet">
<script>document.documentElement.classList.add("js");</script>
<style>
  :root { --red:#e63946; --red-ink:#c92a37; --red-soft:#fdecee; --ink:#312e43; --muted:#6e6b7d; --line:#ebe9f0; --bg:#faf9fb;
          --a0:#f29ca3; --a1:#e63946; --a2:#b52532; --a3:#7a1a22; }
  * { box-sizing:border-box; margin:0; padding:0; }
  html { scroll-behavior:smooth; scroll-padding-top:84px; -webkit-text-size-adjust:100%; }
  body { font-family:'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',sans-serif; color:var(--ink); background:#fff; font-size:16px;
         line-height:1.55; -webkit-font-smoothing:antialiased; position:relative; overflow-x:clip; }
  body::before { content:""; position:absolute; top:0; right:0; width:min(640px, 100%); height:640px; z-index:-1; pointer-events:none;
                 background:radial-gradient(circle at 100% 0, var(--red-soft), rgba(253,236,238,0) 70%); }
  img { display:block; max-width:100%; }
  a { color:inherit; text-decoration:none; }
  :where(a, summary, .plot):focus-visible { outline:2px solid var(--red-ink); outline-offset:3px; }
  .wrap { width:min(1120px, 100% - 32px); margin-inline:auto; }
  @media (min-width:720px) { .wrap { width:min(1120px, 100% - 64px); } }
  .ico { width:1.15em; height:1.15em; display:inline-block; flex:none; }
  .ico svg { width:100%; height:100%; display:block; }
  .sr { position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; }
  .skip { position:absolute; left:16px; top:-60px; z-index:20; background:var(--ink); color:#fff; padding:10px 16px; border-radius:10px; font-weight:700; }
  .skip:focus { top:12px; }

  .nav { position:sticky; top:0; z-index:10; background:rgba(255,255,255,.86); border-bottom:1px solid transparent; transition:border-color .2s;
         -webkit-backdrop-filter:saturate(1.6) blur(14px); backdrop-filter:saturate(1.6) blur(14px); }
  .nav.scrolled { border-bottom-color:var(--line); }
  .navin { display:flex; align-items:center; gap:28px; height:64px; }
  .brand { display:flex; align-items:center; gap:10px; font-weight:800; font-size:15px; letter-spacing:-.01em; min-width:0; }
  .brand img { width:32px; height:32px; border-radius:50%; object-fit:cover; box-shadow:0 0 0 1.5px var(--red); flex:none; }
  .brand span { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .nav nav { display:flex; gap:24px; margin-inline-start:auto; font-size:14.5px; font-weight:600; color:var(--muted); }
  .nav nav a { padding:6px 0; transition:color .15s; }
  .nav nav a:hover { color:var(--ink); }
  @media (max-width:767px) { .navin { gap:12px; } .nav nav { display:none; } .navin .btn { margin-inline-start:auto; } .brand { font-size:14px; } }

  .btn { display:inline-flex; align-items:center; justify-content:center; gap:9px; min-height:48px; padding:10px 22px; border-radius:99px;
         border:1px solid var(--line); background:#fff; color:var(--ink); font-weight:700; font-size:15px; line-height:1.2;
         transition:transform .15s, box-shadow .15s, background-color .15s, border-color .15s; max-width:100%; }
  .btn:hover { transform:translateY(-1px); box-shadow:0 10px 24px -12px rgba(49,46,67,.4); border-color:#dcd9e3; }
  .btn .ico { width:19px; height:19px; color:var(--red); }
  .btn .lb { min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .btn.red { background:var(--red-ink); border-color:var(--red-ink); color:#fff; }
  .btn.red .ico { color:#fff; }
  .btn.red:hover { background:#b82431; border-color:#b82431; }
  .btn.sm { min-height:40px; padding:8px 18px; font-size:14px; flex:none; }
  .pill { display:inline-flex; align-items:center; gap:8px; font-size:14px; font-weight:600; padding:7px 15px 7px 11px; border-radius:99px;
          background:var(--bg); border:1px solid var(--line); transition:background-color .15s, border-color .15s; }
  .pill:hover { background:#fff; border-color:#d9d6e0; }
  .pill .ico { color:var(--red); width:18px; height:18px; }
  .pill.dark { background:var(--ink); color:#fff; border-color:var(--ink); }
  .pill.dark .ico { color:#ff8a94; }
  .pill.dark:hover { background:#45405c; }

  .hero { display:grid; grid-template-columns:auto minmax(0,1fr); gap:36px; align-items:center; padding:64px 0 44px; }
  .photo { width:156px; height:156px; border-radius:50%; object-fit:cover; border:4px solid #fff; box-shadow:0 0 0 2px var(--red), 0 24px 48px -24px rgba(49,46,67,.55); }
  .kicker { font-size:13px; font-weight:800; letter-spacing:.16em; text-transform:uppercase; color:var(--red-ink); }
  h1 { font-size:clamp(36px, 5.4vw, 60px); font-weight:800; line-height:1.04; letter-spacing:-.03em; margin:8px 0 10px; }
  .role { font-size:clamp(17px, 2.1vw, 21px); font-weight:700; }
  .tagline { color:var(--muted); margin-top:4px; max-width:640px; font-size:clamp(15px, 1.6vw, 17px); }
  .handles { display:flex; flex-wrap:wrap; gap:8px; margin-top:20px; }
  .cta { display:flex; flex-wrap:wrap; gap:10px; margin-top:16px; }
  @media (max-width:639px) { .hero { grid-template-columns:minmax(0,1fr); gap:20px; padding:32px 0 28px; } .photo { width:108px; height:108px; } .cta .btn { flex:1 1 auto; } }

  .sharet { font-size:clamp(20px, 2.4vw, 24px); font-weight:800; letter-spacing:-.015em; margin-bottom:16px; }
  .sgrid { display:grid; grid-template-columns:repeat(4, minmax(0,1fr)); gap:14px; }
  .si { background:var(--bg); border:1px solid var(--line); border-radius:20px; padding:20px; }
  .ib { width:46px; height:46px; border-radius:14px; background:var(--red-soft); color:var(--red); display:grid; place-items:center; margin-bottom:14px; }
  .ib .ico { width:26px; height:26px; }
  .si h3 { font-size:16.5px; font-weight:800; margin-bottom:4px; }
  .si p { font-size:14.5px; color:var(--muted); line-height:1.5; }
  @media (max-width:1023px) { .sgrid { grid-template-columns:repeat(2, minmax(0,1fr)); } }
  @media (max-width:599px) { .sgrid { grid-template-columns:minmax(0,1fr); gap:10px; } .si { display:grid; grid-template-columns:46px minmax(0,1fr); gap:14px; padding:16px; } .ib { margin:0; } }

  .card { border:1px solid var(--line); border-radius:28px; padding:36px; background:#fff; margin-top:20px; }
  .shead { display:flex; align-items:baseline; gap:12px; margin-bottom:28px; }
  .sidx { font-weight:800; color:var(--red-ink); font-size:clamp(17px, 2vw, 20px); }
  .card h2 { font-size:clamp(21px, 2.6vw, 28px); font-weight:800; letter-spacing:-.02em; line-height:1.2; }
  @media (max-width:639px) { .card { padding:24px 18px; border-radius:22px; margin-top:14px; } .shead { margin-bottom:20px; } }
  .big { font-size:clamp(50px, 7vw, 80px); font-weight:800; line-height:.95; letter-spacing:-.035em; white-space:nowrap; }
  .big.red { color:var(--red); }
  .biglabel { font-weight:600; color:var(--muted); margin-top:10px; }
  .plats { display:flex; flex-wrap:wrap; gap:10px; margin-top:16px; }
  .plat { display:inline-flex; align-items:center; gap:8px; padding:9px 15px; border-radius:14px; background:var(--bg); border:1px solid var(--line); font-size:17px; }
  .plat .ico { color:var(--red); width:20px; height:20px; }
  .plat b { font-weight:800; white-space:nowrap; }

  .s1 { display:grid; grid-template-columns:minmax(0,5fr) minmax(0,7fr); gap:44px; align-items:center; }
  .stats { margin-top:28px; display:grid; gap:14px; }
  .stat { display:grid; grid-template-columns:104px minmax(0,1fr); gap:14px; align-items:baseline; }
  .stat b { font-size:24px; font-weight:800; color:var(--red); white-space:nowrap; line-height:1.1; }
  .stat span { font-size:15px; }
  .chartbox { background:var(--bg); border-radius:22px; padding:22px 22px 16px; min-width:0; }
  .ctitle { font-size:14px; font-weight:700; color:var(--muted); margin-bottom:16px; }
  .plot { position:relative; height:250px; margin-inline:42px 8px; touch-action:pan-y; cursor:crosshair; border-radius:4px; }
  .plot svg { position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
  .plot .gl { stroke:#e3e0ea; stroke-width:1; vector-effect:non-scaling-stroke; }
  .plot .ln { fill:none; stroke:var(--red); stroke-width:2; vector-effect:non-scaling-stroke; stroke-linejoin:round; stroke-linecap:round; }
  .yt { position:absolute; left:-42px; width:32px; text-align:right; transform:translateY(-50%); font-size:12px; font-weight:600; color:var(--muted); font-variant-numeric:tabular-nums; }
  .chead { display:flex; align-items:center; justify-content:space-between; gap:10px 14px; flex-wrap:wrap; margin-bottom:14px; }
  .chead .ctitle { margin:0; }
  .ctabs { display:flex; gap:2px; padding:3px; border:1px solid var(--line); border-radius:99px; background:#fff; }
  .ctabs button { all:unset; cursor:pointer; display:inline-flex; align-items:center; gap:6px; padding:6px 12px; border-radius:99px; font-size:13px; font-weight:700; color:var(--muted); }
  .ctabs button:hover { color:var(--ink); }
  .ctabs button:focus-visible { outline:2px solid var(--red); outline-offset:1px; }
  .ctabs button[aria-selected=true] { background:var(--ink); color:#fff; }
  .ctabs .ico { width:15px; height:15px; display:inline-flex; color:var(--red); }
  .ctabs [aria-selected=true] .ico { color:#fff; }
  .ctabs .ico svg { width:100%; height:100%; }
  .xhair { position:absolute; top:0; bottom:0; width:1px; margin-left:-.5px; background:rgba(49,46,67,.28); display:none; pointer-events:none; }
  .dot { position:absolute; width:12px; height:12px; margin:-6px 0 0 -6px; border-radius:50%; background:var(--red); box-shadow:0 0 0 2px var(--bg); pointer-events:none; }
  .dot.hover { display:none; }
  .tip { position:absolute; top:0; left:0; transform:translateX(-50%); display:none; z-index:2; pointer-events:none; white-space:nowrap;
         background:#fff; border:1px solid var(--line); border-radius:12px; box-shadow:0 14px 30px -14px rgba(49,46,67,.4); padding:8px 12px 9px; }
  .plot.hov .xhair, .plot.hov .dot.hover, .plot.hov .tip { display:block; }
  .tip b { font-size:17px; font-weight:800; }
  .tip small { font-size:13px; font-weight:600; color:var(--muted); }
  .tip .d { display:flex; align-items:center; gap:7px; font-size:12.5px; font-weight:600; color:var(--muted); margin-top:1px; }
  .tip .d::before { content:""; width:12px; height:2px; border-radius:1px; background:var(--red); }
  .xaxis { position:relative; height:30px; margin-inline:42px 8px; font-size:12.5px; font-weight:600; color:var(--muted); }
  .xaxis span { position:absolute; top:9px; white-space:nowrap; }
  .xaxis span:first-child { left:0; }
  .xaxis .mid { transform:translateX(-50%); }
  .xaxis span:last-child { right:0; color:var(--red-ink); font-weight:700; }
  @media (max-width:899px) { .s1 { grid-template-columns:minmax(0,1fr); gap:30px; } }
  @media (max-width:539px) {
    .chartbox { padding:16px 14px 12px; border-radius:18px; }
    .plot { height:200px; margin-inline:34px 4px; } .yt { left:-34px; width:26px; font-size:11px; }
    .xaxis { margin-inline:34px 4px; font-size:12px; } .xaxis .mid { display:none; }
    .stat { grid-template-columns:92px minmax(0,1fr); } .stat b { font-size:22px; }
  }

  .s2 { display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); gap:44px; align-items:center; }
  .bigrow { display:flex; align-items:center; gap:22px; flex-wrap:wrap; }
  .bigrow .biglabel { margin-top:0; }
  .bigrow .plats { margin-top:10px; }
  .tiles { display:grid; grid-template-columns:repeat(2, minmax(0,1fr)); gap:12px; margin-top:26px; }
  .tile { background:var(--bg); border-radius:18px; padding:16px 18px 17px; }
  .tile b { display:block; font-size:26px; font-weight:800; color:var(--red); line-height:1.1; margin-bottom:4px; white-space:nowrap; }
  .tile span { display:block; font-size:14.5px; line-height:1.42; }
  .reels { display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:14px; }
  .reel { position:relative; display:block; border-radius:18px; overflow:hidden; aspect-ratio:9/16; background:#1d1b29; transition:transform .2s, box-shadow .2s; }
  .reel:hover { transform:translateY(-4px); box-shadow:0 22px 40px -22px rgba(49,46,67,.7); }
  .reel.top { box-shadow:0 0 0 3px var(--red); }
  .reel.top:hover { box-shadow:0 0 0 3px var(--red), 0 22px 40px -22px rgba(49,46,67,.7); }
  .reel img { width:100%; height:100%; object-fit:cover; object-position:top; }
  .badge { position:absolute; top:10px; left:10px; background:var(--red-ink); color:#fff; font-size:12px; font-weight:800; padding:4px 10px; border-radius:99px; }
  .open { position:absolute; top:10px; right:10px; width:32px; height:32px; border-radius:50%; background:rgba(255,255,255,.92); color:var(--ink);
          display:grid; place-items:center; opacity:0; transition:opacity .2s; }
  .open .ico { width:16px; height:16px; }
  .reel:hover .open, .reel:focus-visible .open { opacity:1; }
  @media (hover:none) { .open { opacity:1; } }
  .ov { position:absolute; inset:auto 0 0 0; padding:56px 12px 12px; display:flex; flex-direction:column; color:#fff;
        background:linear-gradient(rgba(20,18,30,0), rgba(20,18,30,.88) 52%); }
  .ov .v { font-size:28px; font-weight:800; line-height:1; letter-spacing:-.02em; }
  .ov .vl { font-size:12.5px; font-weight:600; opacity:.85; }
  .ov .meta { display:flex; gap:12px; margin-top:8px; font-size:13px; font-weight:600; }
  .ov .meta > span { display:inline-flex; align-items:center; gap:4px; }
  .ov .meta .ico { width:15px; height:15px; opacity:.9; }
  @media (max-width:899px) { .s2 { grid-template-columns:minmax(0,1fr); gap:30px; } }
  @media (max-width:539px) {
    .reels { gap:8px; } .reel { border-radius:14px; } .ov { padding:40px 8px 8px; } .ov .v { font-size:20px; } .ov .vl { font-size:11px; }
    .ov .meta { font-size:11px; gap:6px; margin-top:5px; } .ov .meta .ico { width:12px; height:12px; }
    .badge { top:6px; left:6px; font-size:10.5px; padding:3px 7px; } .open { display:none; }
    .tile { padding:14px; } .tile b { font-size:22px; } .tile span { font-size:13.5px; }
  }

  .s3 { display:grid; grid-template-columns:minmax(0,1fr) 320px; gap:28px 48px; align-items:center; }
  .dz { display:flex; align-items:center; gap:18px; margin-bottom:18px; }
  .dz .lbl { font-weight:600; color:var(--muted); line-height:1.4; }
  .city { display:flex; align-items:center; gap:6px; color:var(--ink); font-weight:700; margin-top:2px; }
  .city .ico { color:var(--red); width:18px; height:18px; }
  .crow { display:grid; grid-template-columns:minmax(0,200px) minmax(0,1fr) 52px; gap:16px; align-items:center; padding:7px 0; }
  .cname { font-weight:600; }
  .bar { height:14px; border-radius:4px; background:var(--red-soft); overflow:hidden; }
  .bar span { display:block; height:100%; background:var(--red); border-radius:0 4px 4px 0; transform-origin:left; }
  .cpct { font-weight:800; text-align:right; font-size:17px; font-variant-numeric:tabular-nums; }
  .gender { background:var(--bg); border-radius:22px; padding:22px; }
  .gtitle { font-weight:700; color:var(--muted); font-size:14.5px; }
  .gsplit { display:flex; gap:2px; height:16px; margin:16px 0 14px; }
  .gsplit .w { background:var(--red); } .gsplit .m { background:var(--ink); }
  .glegend { display:flex; justify-content:space-between; font-weight:600; font-size:14.5px; }
  .glegend b { display:block; font-size:32px; font-weight:800; line-height:1.1; }
  .glegend .w b { color:var(--red); }
  .glegend .m { text-align:right; }
  .age { grid-column:1 / -1; border-top:1px solid var(--line); padding-top:24px; }
  .ah { color:var(--red-ink); }
  .astack { display:flex; gap:2px; height:18px; margin:16px 0; }
  .astack span:first-child, .gsplit span:first-child { border-radius:4px 0 0 4px; }
  .astack span:last-child, .gsplit span:last-child { border-radius:0 4px 4px 0; }
  .alegend { display:flex; flex-wrap:wrap; gap:10px 30px; }
  .alegend div { display:flex; align-items:center; gap:8px; }
  .alegend i { width:12px; height:12px; border-radius:3px; flex:none; }
  .alegend b { font-size:18px; font-weight:800; }
  .alegend span { color:var(--muted); font-weight:600; font-size:14.5px; }
  @media (max-width:899px) { .s3 { grid-template-columns:minmax(0,1fr); } }
  @media (max-width:539px) {
    .dz { gap:14px; } .crow { grid-template-columns:minmax(0,1fr) auto; row-gap:6px; } .crow .bar { grid-column:1 / -1; grid-row:2; }
    .alegend { display:grid; grid-template-columns:1fr 1fr; }
  }

  .band { margin-top:20px; background:var(--ink); color:#fff; border-radius:28px; padding:40px; display:grid; grid-template-columns:minmax(0,1fr) auto;
          gap:40px; align-items:center; position:relative; overflow:hidden; }
  .band::after { content:""; position:absolute; right:-90px; top:-90px; width:300px; height:300px; border-radius:50%; pointer-events:none;
                 background:radial-gradient(circle, rgba(230,57,70,.38), rgba(230,57,70,0) 70%); }
  .bt { font-size:clamp(25px, 3.4vw, 36px); font-weight:800; line-height:1.12; letter-spacing:-.02em; }
  .bpitch { color:#dedbe8; margin-top:10px; max-width:580px; }
  .bsub { font-size:12.5px; font-weight:700; color:#b9b6c8; letter-spacing:.12em; text-transform:uppercase; margin:24px 0 12px; }
  .chips { display:flex; flex-wrap:wrap; gap:8px; }
  .chip { display:inline-flex; align-items:center; gap:8px; padding:8px 15px; border-radius:99px; background:rgba(255,255,255,.08);
          border:1px solid rgba(255,255,255,.16); font-weight:600; font-size:14px; }
  .chip::before { content:""; width:6px; height:6px; border-radius:50%; background:var(--red); flex:none; }
  .chip.main { background:var(--red-ink); border-color:var(--red-ink); font-weight:700; }
  .chip.main::before { background:#fff; }
  .br { display:flex; flex-direction:column; gap:10px; padding-inline-start:40px; border-inline-start:1px solid rgba(255,255,255,.14); position:relative; z-index:1; }
  .band .btn { background:transparent; color:#fff; border-color:rgba(255,255,255,.26); justify-content:flex-start; }
  .band .btn:hover { background:rgba(255,255,255,.08); box-shadow:none; }
  .band .btn .ico { color:#ff8a94; }
  .band .btn.solid { background:#fff; color:var(--ink); border-color:#fff; }
  .band .btn.solid .ico { color:var(--red); }
  .band .btn.solid:hover { background:#f4f2f7; }
  .band .short, .maddr { display:none; }
  @media (max-width:899px) {
    .band { grid-template-columns:minmax(0,1fr); padding:30px 22px; gap:26px; border-radius:22px; }
    .br { padding-inline-start:0; border-inline-start:0; padding-top:24px; border-top:1px solid rgba(255,255,255,.14); } .band .btn { justify-content:center; }
  }
  @media (max-width:539px) {
    .band { padding:26px 18px; } .band .btn { font-size:14px; padding-inline:16px; }
    .band .full { display:none; } .band .short { display:inline; }
    .maddr { display:block; text-align:center; font-size:13.5px; font-weight:600; color:#dedbe8; user-select:all; overflow-wrap:anywhere; margin-top:2px; }
  }
  .note { text-align:center; font-size:13px; color:var(--muted); margin-block:24px 48px; }

  .js .reveal { opacity:0; transform:translateY(16px); transition:opacity .7s ease, transform .7s ease; }
  .js .reveal.in { opacity:1; transform:none; }
  .js .reveal .plot svg { clip-path:inset(0 100% 0 0); transition:clip-path 1.3s cubic-bezier(.3,.6,.2,1) .2s; }
  .js .reveal .dot.end { opacity:0; transition:opacity .3s 1.3s; }
  .js .reveal .bar span { transform:scaleX(0); transition:transform 1s cubic-bezier(.3,.6,.2,1) .25s; }
  .js .reveal :is(.astack, .gsplit) { clip-path:inset(0 100% 0 0); transition:clip-path 1.1s cubic-bezier(.3,.6,.2,1) .3s; }
  .js .reveal.in .plot svg, .js .reveal.in :is(.astack, .gsplit) { clip-path:inset(0 0 0 0); }
  .js .reveal.in .dot.end { opacity:1; }
  .js .reveal.in .bar span { transform:none; }
  @media (prefers-reduced-motion:reduce) {
    html { scroll-behavior:auto; }
    .js .reveal, .js .reveal * { transition:none !important; }
    .js .reveal { opacity:1; transform:none; }
    .js .reveal .plot svg, .js .reveal :is(.astack, .gsplit) { clip-path:none; }
    .js .reveal .dot.end { opacity:1; } .js .reveal .bar span { transform:none; }
  }
  @media print { .nav, .skip, .ctabs { display:none; } .js .reveal { opacity:1; transform:none; } }
  .langs { display:flex; gap:2px; padding:3px; border:1px solid var(--line); border-radius:99px; background:var(--bg); font-size:13px; font-weight:700; flex:none; }
  .langs a, .langs span { padding:5px 10px; border-radius:99px; color:var(--muted); line-height:1; }
  .langs a:hover { color:var(--ink); }
  .langs span { background:#fff; color:var(--ink); box-shadow:0 1px 3px rgba(49,46,67,.15); }
  @media (max-width:767px) { .langs { margin-inline-start:auto; } .navin .btn { margin-inline-start:0; } }
  @media (max-width:399px) { .brand span { display:none; } }
  .chartbox { direction:ltr; }
  .chartbox .chead { direction:${t.dir}; }
  .big, .stat b, .tile b, .plat b, .cpct, .glegend b, .alegend b, .alegend span, .ov .v, .ov .meta, .tip b { direction:ltr; unicode-bidi:isolate; }
  [dir=rtl] body { font-family:'IBM Plex Sans Arabic','Plus Jakarta Sans',system-ui,sans-serif; }
  [dir=rtl] h1, [dir=rtl] .big, [dir=rtl] .kicker { font-family:'Plus Jakarta Sans',system-ui,sans-serif; }
  [dir=rtl] .kicker { letter-spacing:.08em; } [dir=rtl] .bsub { letter-spacing:0; text-transform:none; }
  [dir=rtl] body::before { right:auto; left:0; background:radial-gradient(circle at 0 0, var(--red-soft), rgba(253,236,238,0) 70%); }
  [dir=rtl] .skip { left:auto; right:16px; }
  [dir=rtl] .badge { left:auto; right:10px; } [dir=rtl] .open { right:auto; left:10px; }
  [dir=rtl] .band::after { right:auto; left:-90px; }
  [dir=rtl] .bar span { border-radius:4px 0 0 4px; transform-origin:right; }
  [dir=rtl] .cpct, [dir=rtl] .glegend .m { text-align:left; }
  [dir=rtl] .astack span:first-child, [dir=rtl] .gsplit span:first-child { border-radius:0 4px 4px 0; }
  [dir=rtl] .astack span:last-child, [dir=rtl] .gsplit span:last-child { border-radius:4px 0 0 4px; }
  @media (max-width:539px) { [dir=rtl] .badge { right:6px; left:auto; } }
  [dir=rtl].js .reveal :is(.astack, .gsplit) { clip-path:inset(0 0 0 100%); }
  .js .reveal.in :is(.astack, .gsplit) { clip-path:inset(0 0 0 0) !important; }
</style>
</head>
<body>
<a class="skip" href="#main">${w.skip}</a>
<header class="nav">
  <div class="wrap navin">
    <a class="brand" href="#top"><img src="${BASE}/img/me.jpg" alt="" width="32" height="32"><span>Abdelouadoud Mahdaoui</span></a>
    <nav aria-label="Sections">${w.nav.map(([id, label]) => `<a href="#${id}">${label}</a>`).join("")}</nav>
    <div class="langs" role="navigation" aria-label="Language">${langs.map((l) => l.lang === t.lang ? `<span aria-current="page" lang="${l.lang}">${l.label}</span>` : `<a href="${l.href}" hreflang="${l.lang}" lang="${l.lang}">${l.label}</a>`).join("")}</div>
    <a class="btn sm red" href="#collaborer">${w.navCta}</a>
  </div>
</header>

<main id="main">
  <section class="wrap hero" id="top">
    <img class="photo" src="${BASE}/img/me.jpg" alt="${w.photoAlt}" width="156" height="156">
    <div>
      <div class="kicker">Media Kit · 2026</div>
      <h1>Abdelouadoud Mahdaoui</h1>
      <p class="role">${t.role}</p>
      <p class="tagline">${t.tagline}</p>
      <div class="handles">${socials.map((s) => `<a class="pill${s.dark ? " dark" : ""}" href="${s.href}" ${ext}><span class="ico">${ICONS[s.icon]}</span><bdi dir="ltr">${s.handle}</bdi></a>`).join("")}</div>
      <div class="cta">
        <a class="btn red" href="${mail}" ${track("media-kit-email-click")}><span class="ico">${MAIL}</span>${w.contact}</a>
        <a class="btn" href="${w.pdfUrl}" ${ext} ${track("media-kit-pdf-download")}><span class="ico">${ICO.download}</span><span class="lb">${w.pdf}</span></a>
      </div>
    </div>
  </section>

  <section class="wrap reveal" aria-labelledby="share-t">
    <h2 class="sharet" id="share-t">${t.shareTitle}</h2>
    <div class="sgrid">${t.share.map(([h, d], i) => `
      <div class="si"><span class="ib"><span class="ico">${ICO[w.shareIcons[i]]}</span></span><div><h3>${h}</h3><p>${fr(d[0].toUpperCase() + d.slice(1))}</p></div></div>`).join("")}
    </div>
  </section>

  <section class="wrap card reveal" id="abonnes" aria-labelledby="s1-t">
    <div class="shead"><span class="sidx">01</span><h2 id="s1-t">${t.s1}</h2></div>
    <div class="s1">
      <div>
        <div class="big">${t.followers}</div>
        <div class="biglabel">${fr(t.followersLabel)}</div>
        <div class="plats">${t.platforms.map(([p, v]) => `<span class="plat"><span class="ico">${ICONS[p]}</span><b>${v}</b></span>`).join("")}</div>
        <div class="stats">${t.s1stats.map(([a, b]) => `<div class="stat"><b>${a}</b><span>${fr(b)}</span></div>`).join("")}</div>
      </div>
      <figure class="chartbox">
        <figcaption class="chead"><span class="ctitle">${t.chartTitle}</span>
          <span class="ctabs" role="tablist">${series.map(([id, name], k) => `<button type="button" role="tab" id="ct-${id}" aria-controls="cp-${id}" aria-selected="${!k}" tabindex="${k ? -1 : 0}" data-title="${attr(t.chartTitle.replace("Instagram", name))}"><span class="ico">${ICONS[id]}</span>${name}</button>`).join("")}</span></figcaption>
        ${series.map((s, k) => panel(s, !k)).join("\n        ")}
        <div class="sr" id="live" aria-live="polite"></div>
      </figure>
    </div>
  </section>

  <section class="wrap card reveal" id="vues" aria-labelledby="s2-t">
    <div class="shead"><span class="sidx">02</span><h2 id="s2-t">${t.s2}</h2></div>
    <div class="s2">
      <div>
        <div class="bigrow"><div class="big red">${t.big2}</div><div><div class="biglabel">${fr(t.big2Label)}</div><div class="plats">${t.views2.map(([p, v]) => `<span class="plat"><span class="ico">${ICONS[p]}</span><b>${v}</b></span>`).join("")}</div></div></div>
        <div class="tiles">${t.s2stats.map(([a, b]) => `<div class="tile"><b>${a}</b><span>${fr(b)}</span></div>`).join("")}</div>
      </div>
      <div class="reels">${reels.map((r, i) => `
        <a class="reel${i === 0 ? " top" : ""}" href="https://www.instagram.com/reel/${r.img}/" ${ext} aria-label="${attr(w.reelLink(num(r.views)))}">
          <img src="${BASE}/img/${r.img}.jpg" alt="" width="600" height="1066" loading="lazy" decoding="async">${i === 0 ? `<span class="badge">${w.topReel}</span>` : ""}
          <span class="open"><span class="ico">${ICO.arrow}</span></span>
          <span class="ov"><span class="v">${num(r.views)}</span><span class="vl">${t.views}</span>
            <span class="meta"><span><span class="ico">${ICO.heart}</span>${num(r.likes)}</span><span><span class="ico">${ICO.chat}</span>${num(r.comments)}</span></span></span>
        </a>`).join("")}
      </div>
    </div>
  </section>

  <section class="wrap card reveal" id="audience" aria-labelledby="s3-t">
    <div class="shead"><span class="sidx">03</span><h2 id="s3-t">${t.s3}</h2></div>
    <div class="s3">
      <div>
        <div class="dz"><div class="big red">${t.countries[0][1]}%</div><div class="lbl">${fr(dzText)}<span class="city"><span class="ico">${ICO.pin}</span>${fr(dzCity)}</span></div></div>
        ${t.countries.map(([name, pct]) => `<div class="crow"><span class="cname">${name}</span><span class="bar"><span style="width:${pct}%"></span></span><b class="cpct">${pct}%</b></div>`).join("")}
      </div>
      <div class="gender">
        <div class="gtitle">${t.gender[0]} / ${t.gender[1]}</div>
        <div class="gsplit" aria-hidden="true"><span class="w" style="flex:${gender[0]}"></span><span class="m" style="flex:${gender[1]}"></span></div>
        <div class="glegend"><div class="w"><b>${gender[0]}%</b>${t.gender[0]}</div><div class="m"><b>${gender[1]}%</b>${t.gender[1]}</div></div>
      </div>
      <div class="age">
        <div class="gtitle">${t.ageTitle} · <span class="ah">${fr(t.ageHead)}</span></div>
        <div class="astack" aria-hidden="true">${ages.map(([, v], i) => `<span style="flex:${v};background:var(--a${i})"></span>`).join("")}</div>
        <div class="alegend">${ages.map(([a, v], i) => `<div><i style="background:var(--a${i})"></i><b>${v}%</b><span>${a}</span></div>`).join("")}</div>
      </div>
    </div>
  </section>

  <section class="wrap band reveal" id="collaborer" aria-labelledby="band-t">
    <div>
      <h2 class="bt" id="band-t">${t.cta}</h2>
      <p class="bpitch">${fr(t.pitch)}</p>
      <div class="bsub">${t.formatsTitle}</div>
      <div class="chips">${t.formats.map((f, i) => `<span class="chip${i === 0 ? " main" : ""}">${f}</span>`).join("")}</div>
    </div>
    <div class="br">
      <a class="btn solid" href="${mail}" ${track("media-kit-email-click")}><span class="ico">${MAIL}</span><span class="lb"><span class="full">${EMAIL}</span><span class="short">${w.mail}</span></span></a>
      <a class="btn" href="${LINKS}" ${ext}><span class="ico">${LINK}</span><span class="lb">${w.links}</span></a>
      <a class="btn" href="${w.pdfUrl}" ${ext} ${track("media-kit-pdf-download")}><span class="ico">${ICO.download}</span><span class="lb">${w.pdf}</span></a>
      <p class="maddr">${EMAIL}</p>
    </div>
  </section>
  <p class="wrap note">${t.note}</p>
</main>

<script>
(function () {
  var D0 = ${DAY0}, UNIT = ${JSON.stringify(w.unit)};
  var fd = new Intl.DateTimeFormat(${JSON.stringify(w.locale)}, { day: "numeric", month: "short", timeZone: "UTC" });
  var nf = new Intl.NumberFormat(${JSON.stringify(w.locale)});
  var els = document.querySelectorAll(".reveal");
  try {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach(function (e) { io.observe(e); });
  } catch (err) {
    els.forEach(function (e) { e.classList.add("in"); });
  }

  var nav = document.querySelector(".nav");
  addEventListener("scroll", function () { nav.classList.toggle("scrolled", scrollY > 8); }, { passive: true });

  // Followers chart tabs (Instagram / Facebook): click, or arrow keys inside the tab list
  var tabs = [].slice.call(document.querySelectorAll(".ctabs [role=tab]")), ctitle = document.querySelector(".chead .ctitle");
  function pick(b) {
    tabs.forEach(function (o) {
      var on = o === b;
      o.setAttribute("aria-selected", on);
      o.tabIndex = on ? 0 : -1;
      document.getElementById(o.getAttribute("aria-controls")).hidden = !on;
    });
    ctitle.textContent = b.dataset.title;
  }
  tabs.forEach(function (b, k) {
    b.addEventListener("click", function () { pick(b); });
    b.addEventListener("keydown", function (e) {
      var d = { ArrowLeft: -1, ArrowRight: 1 }[e.key];
      if (!d) return;
      if (document.dir === "rtl") d = -d;
      var n = tabs[(k + d + tabs.length) % tabs.length];
      e.preventDefault(); n.focus(); pick(n);
    });
  });

  // Followers charts: crosshair + tooltip snap to the nearest day (mouse, touch, arrow keys)
  var live = document.getElementById("live");
  [].forEach.call(document.querySelectorAll(".plot"), function (plot) {
  var H = JSON.parse(plot.dataset.h), MAX = +plot.dataset.max;
  var tip = plot.querySelector(".tip"), xh = plot.querySelector(".xhair");
  var hd = plot.querySelector(".dot.hover"), cur = H.length - 1;
  function show(i, announce) {
    cur = i;
    var w = plot.clientWidth, h = plot.clientHeight, x = i / (H.length - 1) * w, y = (1 - H[i] / MAX) * h;
    var day = fd.format(D0 + i * 864e5), d = i ? H[i] - H[i - 1] : null;
    tip.querySelector("b").textContent = nf.format(H[i]);
    tip.querySelector(".d").textContent = day + (d === null ? "" : " · " + (d < 0 ? "−" : "+") + nf.format(Math.abs(d)));
    xh.style.left = hd.style.left = x + "px";
    hd.style.top = y + "px";
    plot.classList.add("hov");
    var tw = tip.offsetWidth, th = tip.offsetHeight;
    tip.style.left = Math.min(Math.max(x, tw / 2), w - tw / 2) + "px";
    tip.style.top = (y < th + 20 ? y + 16 : y - th - 16) + "px";
    if (announce) live.textContent = day + ${JSON.stringify(w.colon)} + nf.format(H[i]) + " " + UNIT;
  }
  function hide() { plot.classList.remove("hov"); }
  function at(e) {
    var r = plot.getBoundingClientRect();
    return Math.max(0, Math.min(H.length - 1, Math.round((e.clientX - r.left) / r.width * (H.length - 1))));
  }
  plot.addEventListener("pointermove", function (e) { show(at(e)); });
  plot.addEventListener("pointerdown", function (e) { show(at(e)); });
  plot.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") hide(); });
  document.addEventListener("pointerdown", function (e) { if (!plot.contains(e.target)) hide(); });
  plot.addEventListener("focus", function () { show(cur, true); });
  plot.addEventListener("blur", hide);
  plot.addEventListener("keydown", function (e) {
    var k = { ArrowLeft: -1, ArrowRight: 1 }[e.key];
    if (k) { e.preventDefault(); show(Math.max(0, Math.min(H.length - 1, cur + k)), true); }
    else if (e.key === "Home" || e.key === "End") { e.preventDefault(); show(e.key === "Home" ? 0 : H.length - 1, true); }
  });
  });
})();
</script>
</body>
</html>`;
}
