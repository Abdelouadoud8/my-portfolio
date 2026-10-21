// Media kit generator: node build.mjs → 3 print HTML files here + the 3 web pages in public/media-kit/,
// then ./render.sh → the 3 PDFs in public/media-kit/pdf/.
// Update the numbers in DATA and the texts in L, then rerun.
import { copyFileSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { web } from "./web.mjs";

// Instagram followers per day (Sept 16 → Oct 21, 2026): social_stats.instagram_daily, then the app's SocialSnapshot
const history = [1554, 1632, 2420, 2580, 4885, 5672, 6446, 7877, 8768, 9994, 11084, 11807, 12915, 13619, 14297, 15146, 15927, 20146, 21178, 22104, 23204, 23973, 24975, 26168, 26665, 27142, 27662, 28148, 28705, 29252, 33421, 35560, 36576, 37293, 37818, 38101];
// Facebook followers per day, same days (app SocialSnapshot; Sept 16 = Sept 17 reading, Oct 17 interpolated)
const fbHistory = [820, 820, 820, 820, 820, 820, 820, 820, 820, 820, 820, 820, 820, 820, 820, 820, 1236, 9930, 10047, 12403, 12855, 14235, 14972, 20111, 23644, 27948, 30019, 33295, 35029, 38465, 40294, 41182, 42070, 43208, 43529, 43902];

const reels = [
  { img: "DeAX6mpotb8", views: "1M", likes: "31K", comments: "4.4K" },
  { img: "DdmqbYyIMbW", views: "675K", likes: "17K", comments: "2K" },
  { img: "Dehq6UyITam", views: "200K", likes: "8.1K", comments: "3.5K" },
];

// Phosphor duotone paths, same icons as components/icons/ on the website
const ICONS = {
  instagram: `<svg viewBox="0 0 25 24"><path opacity=".25" fill="currentColor" d="M16.53 3h-9A4.5 4.5 0 0 0 3.03 7.5v9A4.5 4.5 0 0 0 7.53 21h9a4.5 4.5 0 0 0 4.5-4.5v-9A4.5 4.5 0 0 0 16.53 3Zm-4.5 12.75a3.75 3.75 0 1 1 0-7.5 3.75 3.75 0 0 1 0 7.5Z"/><path fill="currentColor" d="M16.53 2.25h-9A5.26 5.26 0 0 0 2.28 7.5v9a5.26 5.26 0 0 0 5.25 5.25h9a5.26 5.26 0 0 0 5.25-5.25v-9a5.26 5.26 0 0 0-5.25-5.25Zm3.75 14.25a3.75 3.75 0 0 1-3.75 3.75h-9a3.75 3.75 0 0 1-3.75-3.75v-9a3.75 3.75 0 0 1 3.75-3.75h9a3.75 3.75 0 0 1 3.75 3.75v9ZM12.03 7.5a4.5 4.5 0 1 0 4.5 4.5 4.5 4.5 0 0 0-4.5-4.5Zm0 7.5a3 3 0 1 1 3-3 3 3 0 0 1-3 3Zm6-7.88a1.13 1.13 0 1 1-1.13-1.12 1.13 1.13 0 0 1 1.13 1.12Z"/></svg>`,
  facebook: `<svg viewBox="0 0 256 256"><path opacity=".25" fill="currentColor" d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z"/><path fill="currentColor" d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,191.63V152h24a8,8,0,0,0,0-16H136V112a16,16,0,0,1,16-16h16a8,8,0,0,0,0-16H152a32,32,0,0,0-32,32v24H96a8,8,0,0,0,0,16h24v63.63a88,88,0,1,1,16,0Z"/></svg>`,
  tiktok: `<svg viewBox="0 0 256 256"><path opacity=".25" fill="currentColor" d="M224,120a95.55,95.55,0,0,1-56-18v54a68,68,0,0,1-136,0c0-33.46,24.17-62.33,56-68v42.69A28,28,0,1,0,128,156V24h40a56,56,0,0,0,56,56Z"/><path fill="currentColor" d="M224,72a48.05,48.05,0,0,1-48-48,8,8,0,0,0-8-8H128a8,8,0,0,0-8,8V156a20,20,0,1,1-28.57-18.08A8,8,0,0,0,96,130.69V88a8,8,0,0,0-9.4-7.88C50.91,86.48,24,119.1,24,156a76,76,0,0,0,152,0V116.29A103.25,103.25,0,0,0,224,128a8,8,0,0,0,8-8V80A8,8,0,0,0,224,72Zm-8,39.64a87.19,87.19,0,0,1-43.33-16.15A8,8,0,0,0,160,102v54a60,60,0,0,1-120,0c0-25.9,16.64-49.13,40-57.6v27.67A36,36,0,1,0,136,156V32h24.5A64.14,64.14,0,0,0,216,87.5Z"/></svg>`,
};

const MAIL = `<svg viewBox="0 0 256 256"><path fill="currentColor" d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-20.57,16L128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z"/></svg>`;
const LINK = `<svg viewBox="0 0 256 256"><path fill="currentColor" d="M137.54,186.36a8,8,0,0,1,0,11.31l-9.94,10A56,56,0,0,1,48.38,128.4L72.5,104.28A56,56,0,0,1,149.31,102a8,8,0,1,1-10.64,12,40,40,0,0,0-54.85,1.63L59.7,139.72a40,40,0,0,0,56.58,56.58l9.94-9.94A8,8,0,0,1,137.54,186.36Zm70.08-138a56.08,56.08,0,0,0-79.22,0l-9.94,9.95a8,8,0,0,0,11.32,11.31l9.94-9.94a40,40,0,0,1,56.58,56.58L172.18,140.4A40,40,0,0,1,117.33,142,8,8,0,1,0,106.69,154a56,56,0,0,0,76.81-2.26l24.12-24.12A56.08,56.08,0,0,0,207.62,48.38Z"/></svg>`;

const socials = [
  { icon: "instagram", handle: "@abdelouadoud.mahdaoui", href: "https://www.instagram.com/abdelouadoud.mahdaoui/", dark: true },
  { icon: "facebook", handle: "Abdelouadoud Mahdaoui", href: "https://www.facebook.com/abdelouadoud.mahdaoui" },
];

function chart() {
  const W = 330, H = 104, pad = 6, max = 40000;
  const pts = history.map((v, i) => [pad + (i * (W - 2 * pad)) / (history.length - 1), H - pad - (v / max) * (H - 2 * pad)]);
  const line = pts.map((p) => p.map((n) => n.toFixed(1)).join(",")).join(" ");
  const area = `M${pts[0][0]},${H - pad} L${line.replace(/ /g, " L")} L${pts.at(-1)[0]},${H - pad} Z`;
  const grid = [10000, 20000, 30000].map((v) => {
    const y = (H - pad - (v / max) * (H - 2 * pad)).toFixed(1);
    return `<line x1="${pad}" x2="${W - pad}" y1="${y}" y2="${y}" class="grid"/><text x="${pad}" y="${y - 3}" class="gl">${v / 1000}K</text>`;
  });
  const [lx, ly] = pts.at(-1);
  return `<svg viewBox="0 0 ${W} ${H}" class="chart"><defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#e63946" stop-opacity=".28"/><stop offset="1" stop-color="#e63946" stop-opacity="0"/></linearGradient></defs>${grid.join("")}<path d="${area}" fill="url(#g)"/><polyline points="${line}" fill="none" stroke="#e63946" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${lx}" cy="${ly}" r="4.5" fill="#e63946" stroke="#fff" stroke-width="2"/></svg>`;
}

// Age groups of Instagram followers (Meta API, Oct 21, 2026)
const ages = [["13–17", 11], ["18–24", 49], ["25–34", 30], ["35+", 10]];

// Women / men among Instagram followers (Meta API, Oct 21, 2026)
const gender = [60, 40];

const ltr = (s) => `<bdi dir="ltr">${s}</bdi>`;

const L = {
  en: {
    lang: "en", dir: "ltr", file: "Media-Kit-EN",
    role: "AI & Tech Content Creator",
    tagline: "Daily AI & technology tips and tutorials in Algerian Darja, made simple for everyone.",
    shareTitle: "What I share",
    share: [
      ["AI & tech", "apps and tools that save time, boost productivity and make everyday life easier."],
      ["For students", "tips and guides to help students shine and get top grades."],
      ["My journey", "from a 17.12/20 BAC to computer science at ESI, then studying and working in France as a software engineer."],
      ["Engineer life", "my daily life as a software engineer living alone: work, gym, cooking and the discipline behind it all."],
    ],
    s1: "Followers & growth", followers: "82K", followersLabel: "followers on Instagram + Facebook",
    platforms: [["instagram", "38.1K"], ["facebook", "43.9K"]],
    s1stats: [["+36.5K", "new Instagram followers in 35 days"], ["~1,040", "new followers every day"], ["×24.5", "Instagram growth since Sept 16"]],
    chartTitle: "Instagram followers", chartFrom: "Sept 16 · 1.5K", chartTo: "Oct 21 · 38.1K",
    s2: "Views far above my follower count", big2: "10.6M", big2Label: "views in the last 30 days", views2: [["instagram", "5.1M"], ["facebook", "5.5M"]],
    s2stats: [["×26", "views vs followers on my top reel"], ["610K", "interactions in 30 days"], ["98%", "of accounts reached don't follow me yet"], ["14.2%", "engagement rate · 269K saves · 148K shares"]],
    views: "views",
    s3: "Audience", dzLabel: "of my audience is in Algeria<br>Top city: Algiers", ageTitle: "Age", ageHead: "79% are 18–34 years old", countries: [["Algeria", 75], ["Morocco & Tunisia", 9], ["Other countries", 16]],
    gender: ["Women", "Men"],
    formatsTitle: "How we can collaborate",
    formats: ["Product presentation reel", "Step-by-step app tutorial", "Stories with link", "Promo code / affiliate"],
    pitch: "After studying your brand, I see many ways to collaborate where we both win.",
    cta: "Looking for collaborations",
    note: "Data from Instagram & Facebook Insights · October 21, 2026",
  },
  fr: {
    lang: "fr", dir: "ltr", file: "Media-Kit-FR",
    role: "Créateur de contenu IA & Tech",
    tagline: "Astuces et tutos IA & technologie chaque jour en darja algérienne, expliqués simplement.",
    shareTitle: "Ce que je partage",
    share: [
      ["IA & tech", "applis et outils qui font gagner du temps, boostent la productivité et simplifient le quotidien."],
      ["Pour les étudiants", "conseils et guides pour briller et décrocher les meilleures notes."],
      ["Mon parcours", "du bac à 17,12/20 à l'ESI en informatique, puis études et travail en France comme ingénieur logiciel."],
      ["Vie d'ingénieur", "mon quotidien d'ingénieur logiciel qui vit seul : travail, sport, cuisine et la discipline qui va avec."],
    ],
    s1: "Abonnés & croissance", followers: "82K", followersLabel: "abonnés sur Instagram + Facebook",
    platforms: [["instagram", "38,1K"], ["facebook", "43,9K"]],
    s1stats: [["+36,5K", "nouveaux abonnés Instagram en 35 jours"], ["~1 040", "nouveaux abonnés par jour"], ["×24,5", "de croissance depuis le 16 sept."]],
    chartTitle: "Abonnés Instagram", chartFrom: "16 sept. · 1,5K", chartTo: "21 oct. · 38,1K",
    s2: "Des vues bien au-dessus de mon nombre d'abonnés", big2: "10,6M", big2Label: "de vues sur les 30 derniers jours", views2: [["instagram", "5,1M"], ["facebook", "5,5M"]],
    s2stats: [["×26", "vues / abonnés sur mon meilleur reel"], ["610K", "interactions en 30 jours"], ["98%", "des comptes atteints ne me suivent pas encore"], ["14,2%", "d'engagement · 269K enregistrements · 148K partages"]],
    views: "vues",
    s3: "Audience", dzLabel: "de mon audience est en Algérie<br>1re ville : Alger", ageTitle: "Âge", ageHead: "79% ont entre 18 et 34 ans", countries: [["Algérie", 75], ["Maroc & Tunisie", 9], ["Autres pays", 16]],
    gender: ["Femmes", "Hommes"],
    formatsTitle: "Comment collaborer ensemble",
    formats: ["Reel de présentation produit", "Tuto pas à pas de votre appli", "Stories avec lien", "Code promo / affiliation"],
    pitch: "Après avoir étudié votre marque, je vois de nombreuses façons de collaborer où chacun y gagne.",
    cta: "Ouvert aux collaborations",
    note: "Données Instagram & Facebook Insights · 21 octobre 2026",
  },
  dz: {
    lang: "ar-DZ", dir: "rtl", file: "Media-Kit-Darja",
    role: "صانع محتوى في الذكاء الإصطناعي و التكنولوجيا",
    tagline: "نصايح و tutorials تاع الذكاء الإصطناعي و التكنولوجيا كل نهار، بالدارجة الجزائرية و بطريقة ساهلة للجميع.",
    shareTitle: "واش نشارك",
    share: [
      ["AI و تكنولوجيا", "تطبيقات و أدوات يربحوك الوقت، يزيدو في الإنتاجية و يسهلولك حياتك."],
      ["للطلبة", "نصايح و شروحات باش تبرز في القراية و تجيب أحسن النقاط."],
      ["المشوار تاعي", `من الباك بـ ${ltr("17.12")}، للإعلام الآلي في ${ltr("ESI")}، حتى للقراية و الخدمة في فرانسا كمهندس برمجيات.`],
      ["حياة مهندس", "يومياتي كمهندس برمجيات عايش وحدي: الخدمة، الجيم، الطياب و الانضباط اللي يلزم."],
    ],
    s1: "المتابعين و النمو", followers: "82K", followersLabel: "متابع على Instagram و Facebook",
    platforms: [["instagram", "38.1K"], ["facebook", "43.9K"]],
    s1stats: [["+36.5K", "متابع جديد على Instagram في 35 يوم"], ["~1,040", "متابع جديد كل نهار"], ["×24.5", "زادو المتابعين من 16 سبتمبر"]],
    chartTitle: "المتابعين على Instagram",
    chartFrom: `16 سبتمبر · ${ltr("1.5K")}`, chartTo: `21 أكتوبر · ${ltr("38.1K")}`,
    s2: "المشاهدات تاعي فايتين بزاف عدد المتابعين", big2: "10.6M", big2Label: "مشاهدة في آخر 30 يوم", views2: [["instagram", "5.1M"], ["facebook", "5.5M"]],
    s2stats: [["×26", "مشاهدات أحسن ريل مقارنة بعدد المتابعين"], ["610K", "تفاعل في 30 يوم"], ["98%", "من الحسابات لي وصلهم المحتوى مازال ما تابعونيش"], ["14.2%", `نسبة التفاعل · ${ltr("269K")} حفظ · ${ltr("148K")} بارطاج`]],
    views: "مشاهدة",
    s3: "الجمهور", dzLabel: "من الجمهور تاعي ساكن في الجزائر<br>أول مدينة: الجزائر العاصمة", ageTitle: "العمر", ageHead: `${ltr("79%")} عمرهم بين 18 و 34 سنة`, countries: [["الجزائر", 75], ["المغرب و تونس", 9], ["بلدان أخرى", 16]],
    gender: ["نساء", "رجال"],
    formatsTitle: "كيفاش نقدرو نتعاونو",
    formats: ["ريل نقدّم فيه المنتوج تاعكم", "Tutorial خطوة بخطوة على التطبيق تاعكم", "ستوريات مع لينك", "كود برومو / أفلييت"],
    pitch: "بعد ما درست البراند تاعكم، نشوف بلي كاين بزاف طرق باش نتعاونو بطريقة لي تربح الطرفين.",
    cta: "نحوّس على تعاونات",
    note: `الأرقام من ${ltr("Instagram & Facebook Insights")} · 21 أكتوبر 2026`,
  },
};

function page(t) {
  const rtl = t.dir === "rtl";
  const num = (s) => (t.lang === "fr" ? s.replace(".", ",") : s);
  const countryRows = t.countries
    .map(([name, pct], i) => `
      <div class="crow">
        <div class="cname">${name}</div>
        <div class="bar"><span style="width:${pct}%;opacity:${[1, 0.7, 0.3][i]}"></span></div>
        <div class="cpct">${pct}%</div>
      </div>`)
    .join("");
  return `<!doctype html>
<html lang="${t.lang}" dir="${t.dir}">
<head>
<meta charset="utf-8">
<title>Media Kit · Abdelouadoud Mahdaoui</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 0; }
  :root { --red:#e63946; --red-soft:#fdecee; --ink:#312e43; --muted:#6e6b7d; --line:#ebe9f0; --bg:#faf9fb; }
  * { box-sizing:border-box; margin:0; padding:0; }
  html, body { width:210mm; height:297mm; }
  body { font-family:${rtl ? "'IBM Plex Sans Arabic'," : ""}'Plus Jakarta Sans',sans-serif; color:var(--ink); background:#fff;
         -webkit-print-color-adjust:exact; print-color-adjust:exact; font-size:9.5pt; line-height:1.4; }
  a { color:inherit; text-decoration:none; }
  .stat b, .big, .cpct, .glegend b, .plat b { direction:ltr; unicode-bidi:isolate; }
  .big, .plat b { font-family:'Plus Jakarta Sans',sans-serif; }
  .page { width:210mm; height:297mm; padding:9mm 13mm 7mm; display:flex; flex-direction:column; gap:3mm; position:relative; overflow:hidden; }
  .page::before { content:""; position:absolute; top:0; ${rtl ? "left" : "right"}:0; width:70mm; height:70mm;
                  background:radial-gradient(circle at ${rtl ? "0 0" : "100% 0"}, var(--red-soft), rgba(253,236,238,0) 70%); z-index:0; }
  .page > * { position:relative; z-index:1; flex-shrink:0; }
  .ico { width:1.15em; height:1.15em; display:inline-block; flex:none; }
  .ico svg { width:100%; height:100%; display:block; }

  header { display:flex; align-items:center; gap:6mm; }
  .photo { width:23mm; height:23mm; border-radius:50%; object-fit:cover; border:3px solid #fff; box-shadow:0 0 0 2px var(--red); flex:none; }
  .kicker { font-size:8pt; font-weight:700; letter-spacing:${rtl ? "0" : ".14em"}; text-transform:uppercase; color:var(--red); }
  h1 { font-size:${rtl ? "21pt" : "23pt"}; font-weight:800; line-height:1.1; margin:1mm 0 1mm; font-family:'Plus Jakarta Sans',sans-serif; }
  .role { font-weight:600; font-size:10.5pt; }
  .tagline { color:var(--muted); margin-top:.6mm; }
  .handles { display:flex; gap:2mm; margin-top:2mm; flex-wrap:wrap; }
  .pill { display:inline-flex; align-items:center; gap:1.4mm; font-size:8pt; font-weight:600; padding:1mm 2.8mm 1mm 2.2mm; border-radius:99px;
          background:var(--bg); color:var(--ink); border:1px solid var(--line); font-family:'Plus Jakarta Sans',sans-serif; direction:ltr; }
  .pill .ico { color:var(--red); }
  .pill.dark { background:var(--ink); color:#fff; border-color:var(--ink); }
  .pill.dark .ico { color:#ff8a94; }

  section { border:1px solid var(--line); border-radius:4mm; padding:3.5mm 5.5mm; background:#fff; }
  .shead { display:flex; align-items:baseline; gap:3mm; margin-bottom:2mm; }
  .sidx { font-family:'Plus Jakarta Sans',sans-serif; font-weight:800; color:var(--red); font-size:11pt; }
  h2 { font-size:12.5pt; font-weight:700; }
  .grid2 { display:grid; grid-template-columns: 92mm 1fr; gap:6mm; align-items:center; }
  .grid3 { display:grid; grid-template-columns: 44mm 66mm 1fr; gap:5mm; align-items:center; }
  .grid3 .stats { margin-top:0; gap:2mm; }
  .grid3 .stat { font-size:8.8pt; line-height:1.25; }
  .grid3 .stat b { min-width:15mm; }
  .bigrow { display:flex; align-items:center; gap:4mm; }
  .bigrow .plats { margin-top:1.2mm; }
  .bigrow .biglabel { margin-top:0; }
  .tiles { display:grid; grid-template-columns:1fr 1fr; gap:2mm; margin-top:2.5mm; }
  .tiles.one { grid-template-columns:1fr; margin-top:0; }
  .tile { background:var(--bg); border-radius:2.5mm; padding:1.8mm 3mm; line-height:1.25; }
  .tile b { display:block; font-family:'Plus Jakarta Sans',sans-serif; font-weight:800; color:var(--red); font-size:12pt; direction:ltr; unicode-bidi:isolate; text-align:start; }
  .tile span { font-size:8.2pt; color:var(--ink); }
  .big { font-size:32pt; font-weight:800; line-height:.95; letter-spacing:-.02em; color:var(--ink); }
  .big.red { color:var(--red); }
  .biglabel { font-weight:600; color:var(--muted); margin-top:1.5mm; }
  .plats { display:flex; gap:2mm; margin-top:2.5mm; }
  .plat { display:inline-flex; align-items:center; gap:1.5mm; padding:1.2mm 3mm; border-radius:2mm; background:var(--bg); border:1px solid var(--line); font-size:10pt; }
  .plat .ico { color:var(--red); width:4.2mm; height:4.2mm; }
  .plat b { font-weight:800; }
  .stats { margin-top:2.5mm; display:flex; flex-direction:column; gap:1.1mm; }
  .stat { display:flex; gap:2.5mm; align-items:baseline; }
  .stat b { font-family:'Plus Jakarta Sans',sans-serif; font-weight:800; color:var(--red); font-size:11pt; min-width:16mm; }
  [dir=rtl] .stat b { text-align:right; }

  .chartbox { background:var(--bg); border-radius:3mm; padding:3mm 4mm 2.5mm; direction:ltr; }
  .ctitle { font-size:7.5pt; font-weight:700; color:var(--muted); margin-bottom:1mm; text-align:${rtl ? "right" : "left"}; }
  .chart { width:100%; height:auto; display:block; }
  .chart .grid { stroke:#dcd9e3; stroke-width:.6; stroke-dasharray:2 3; }
  .chart .gl { font:600 7px 'Plus Jakarta Sans',sans-serif; fill:#a9a6b5; }
  .axis { display:flex; justify-content:space-between; font-size:7.5pt; color:var(--muted); font-weight:600; margin-top:1mm; }
  .axis span:last-child { color:var(--red); }

  .reels { display:grid; grid-template-columns:repeat(3,1fr); gap:3mm; }
  .reel { border-radius:2.5mm; overflow:hidden; position:relative; aspect-ratio:9/13; background:#000; }
  .reel img { width:100%; height:100%; object-fit:cover; object-position:top; display:block; }
  .reel.top { box-shadow:0 0 0 2px var(--red); }
  .reel .ov { position:absolute; inset:auto 0 0 0; padding:6mm 2mm 2mm; background:linear-gradient(rgba(0,0,0,0), rgba(0,0,0,.85)); color:#fff; direction:ltr; }
  .reel .v { font-family:'Plus Jakarta Sans',sans-serif; font-weight:800; font-size:13pt; line-height:1; }
  .reel.top .ov { padding-top:16mm; background:linear-gradient(rgba(20,18,30,0), rgba(20,18,30,.92) 45%); }
  .reel.top .v { color:#fff; font-size:15pt; }
  .reel .vl { font-size:7pt; opacity:.85; font-weight:600; }
  .reel .meta { font-size:6.8pt; opacity:.85; margin-top:.8mm; font-family:'Plus Jakarta Sans',sans-serif; }

  .aud { display:grid; grid-template-columns: 1fr 50mm; grid-template-areas:"c g" "a a"; column-gap:7mm; row-gap:2.5mm; align-items:center; }
  .aud > :first-child { grid-area:c; } .aud .gender { grid-area:g; } .aud .age { grid-area:a; }
  .age { border-top:1px dashed var(--line); padding-top:2.5mm; }
  .age .ah { color:var(--red); }
  .astack { display:flex; height:5mm; border-radius:99px; overflow:hidden; margin:2mm 0 1.2mm; gap:2px; }
  .astack div { background:var(--red); }
  .alegend { display:flex; gap:2px; font-size:8pt; color:var(--muted); font-weight:600; }
  .alegend div { display:flex; gap:1.2mm; align-items:baseline; white-space:nowrap; min-width:0; }
  .alegend span { direction:ltr; unicode-bidi:isolate; }
  .alegend b { font-family:'Plus Jakarta Sans',sans-serif; color:var(--ink); font-weight:800; font-size:9.5pt; direction:ltr; unicode-bidi:isolate; }
  .share { background:var(--bg); border:1px solid var(--line); border-radius:4mm; padding:3mm 5.5mm; }
  .sharet { font-weight:700; font-size:10.5pt; margin-bottom:1.5mm; }
  .sgrid { display:grid; grid-template-columns:1fr 1fr; column-gap:6mm; row-gap:1.2mm; font-size:8.6pt; line-height:1.35; color:var(--muted); }
  .si { position:relative; padding-${rtl ? "right" : "left"}:3.5mm; }
  .si::before { content:""; position:absolute; ${rtl ? "right" : "left"}:0; top:1.6mm; width:1.6mm; height:1.6mm; border-radius:50%; background:var(--red); }
  .si b { color:var(--ink); font-weight:700; }
  .crow { display:grid; grid-template-columns: 40mm 1fr 13mm; align-items:center; gap:3mm; margin:1.3mm 0; }
  .cname { font-weight:600; }
  .bar { height:4.2mm; border-radius:99px; background:var(--bg); overflow:hidden; border:1px solid var(--line); }
  .bar span { display:block; height:100%; background:var(--red); border-radius:99px; }
  .cpct { font-family:'Plus Jakarta Sans',sans-serif; font-weight:800; text-align:${rtl ? "left" : "right"}; }
  .dz { display:flex; align-items:center; gap:3mm; margin-bottom:1mm; }
  .dz .big { font-size:30pt; color:var(--red); }
  .dz .lbl { font-weight:600; color:var(--muted); line-height:1.25; }
  .gender { background:var(--bg); border-radius:3mm; padding:3mm 4mm; }
  .gsplit { display:flex; height:6mm; border-radius:99px; overflow:hidden; margin:2.5mm 0 2mm; }
  .gsplit .w { background:var(--red); width:${gender[0]}%; } .gsplit .m { background:var(--ink); width:${gender[1]}%; }
  .glegend { display:flex; justify-content:space-between; font-weight:600; font-size:8.5pt; }
  .glegend b { font-family:'Plus Jakarta Sans',sans-serif; font-size:14pt; font-weight:800; display:block; }
  .glegend .w b { color:var(--red); }
  .gtitle { font-weight:700; font-size:8.5pt; color:var(--muted); }

  .band { margin-top:auto; background:var(--ink); color:#fff; border-radius:4mm; padding:4.5mm 6mm; display:grid;
          grid-template-columns:1fr auto; gap:6mm; align-items:center; position:relative; overflow:hidden; }
  .band::after { content:""; position:absolute; ${rtl ? "left" : "right"}:-14mm; top:-14mm; width:40mm; height:40mm; border-radius:50%;
                 background:radial-gradient(circle, rgba(230,57,70,.35), rgba(230,57,70,0) 70%); pointer-events:none; }
  .bt { font-size:14pt; font-weight:800; line-height:1.1; }
  .bsub { font-size:7.8pt; font-weight:600; color:#b9b6c8; margin:1.8mm 0 1.6mm; text-transform:${rtl ? "none" : "uppercase"}; letter-spacing:${rtl ? "0" : ".08em"}; }
  .chips { display:flex; flex-wrap:wrap; gap:1.6mm; }
  .chip { display:inline-flex; align-items:center; gap:1.4mm; padding:1.1mm 2.8mm; border-radius:99px; background:rgba(255,255,255,.08);
          border:1px solid rgba(255,255,255,.16); color:#fff; font-weight:600; font-size:8.2pt; }
  .chip.main { background:var(--red); border-color:var(--red); font-weight:700; }
  .chip.main::before { background:#fff; }
  .bpitch { font-size:8.8pt; color:#dedbe8; margin-top:1.2mm; }
  .chip::before { content:""; width:1.4mm; height:1.4mm; border-radius:50%; background:var(--red); }
  .br { display:flex; flex-direction:column; gap:2mm; padding-${rtl ? "right" : "left"}:6mm; border-${rtl ? "right" : "left"}:1px solid rgba(255,255,255,.14); position:relative; z-index:1; }
  .btn { display:flex; align-items:center; gap:2mm; padding:2mm 3.6mm; border-radius:99px; border:1px solid rgba(255,255,255,.22);
         font-family:'Plus Jakarta Sans',sans-serif; font-size:8.4pt; font-weight:600; direction:ltr; white-space:nowrap; }
  .btn .ico { width:4mm; height:4mm; color:#ff8a94; }
  .btn.solid { background:#fff; color:var(--ink); border-color:#fff; }
  .btn.solid .ico { color:var(--red); }
  .note { font-size:7pt; color:#a9a6b5; text-align:center; }
</style>
</head>
<body>
<div class="page">
  <header>
    <img class="photo" src="img/me.jpg" alt="">
    <div>
      <div class="kicker">Media Kit · 2026</div>
      <h1>Abdelouadoud Mahdaoui</h1>
      <div class="role">${t.role}</div>
      <div class="tagline">${t.tagline}</div>
      <div class="handles">${socials.map((s) => `<a class="pill${s.dark ? " dark" : ""}" href="${s.href}"><span class="ico">${ICONS[s.icon]}</span>${s.handle}</a>`).join("")}</div>
    </div>
  </header>

  <div class="share">
    <div class="sharet">${t.shareTitle}</div>
    <div class="sgrid">${t.share.map(([h, d]) => `<div class="si"><b>${h}${t.lang === "fr" ? "&nbsp;" : ""}:</b> ${d}</div>`).join("")}</div>
  </div>

  <section>
    <div class="shead"><span class="sidx">01</span><h2>${t.s1}</h2></div>
    <div class="grid3">
      <div>
        <div class="big">${t.followers}</div>
        <div class="biglabel">${t.followersLabel}</div>
        <div class="plats">${t.platforms.map(([p, v]) => `<span class="plat"><span class="ico">${ICONS[p]}</span><b>${v}</b></span>`).join("")}</div>
      </div>
      <div class="stats">${t.s1stats.map(([a, b]) => `<div class="stat"><b>${a}</b><span>${b}</span></div>`).join("")}</div>
      <div class="chartbox"><div class="ctitle" dir="${t.dir}">${t.chartTitle}</div>${chart()}<div class="axis"><span dir="${t.dir}">${t.chartFrom}</span><span dir="${t.dir}">${t.chartTo}</span></div></div>
    </div>
  </section>

  <section>
    <div class="shead"><span class="sidx">02</span><h2>${t.s2}</h2></div>
    <div class="grid2">
      <div>
        <div class="bigrow"><div class="big red">${t.big2}</div><div><div class="biglabel">${t.big2Label}</div><div class="plats">${t.views2.map(([p, v]) => `<span class="plat"><span class="ico">${ICONS[p]}</span><b>${v}</b></span>`).join("")}</div></div></div>
        <div class="tiles">${t.s2stats.map(([a, b]) => `<div class="tile"><b>${a}</b><span>${b}</span></div>`).join("")}</div>
      </div>
      <div class="reels">${reels.map((r, i) => `
        <div class="reel${i === 0 ? " top" : ""}"><img src="img/${r.img}.jpg" alt="">
          <div class="ov"><div class="v">${num(r.views)}</div><div class="vl">${t.views}</div><div class="meta">♥ ${num(r.likes)} · 💬 ${num(r.comments)}</div></div>
        </div>`).join("")}
      </div>
    </div>
  </section>

  <section>
    <div class="shead"><span class="sidx">03</span><h2>${t.s3}</h2></div>
    <div class="aud">
      <div><div class="dz"><div class="big">${t.countries[0][1]}%</div><div class="lbl">${t.dzLabel}</div></div>${countryRows}</div>
      <div class="age">
        <div class="gtitle">${t.ageTitle} · <span class="ah">${t.ageHead}</span></div>
        <div class="astack">${ages.map(([a, v], i) => `<div style="flex:${v};opacity:${[0.45, 1, 0.75, 0.25][i]}"></div>`).join("")}</div>
        <div class="alegend">${ages.map(([a, v]) => `<div style="flex:${v}"><b>${v}%</b><span>${a}</span></div>`).join("")}</div>
      </div>
      <div class="gender">
        <div class="gtitle">${t.gender[0]} / ${t.gender[1]}</div>
        <div class="gsplit"><div class="w"></div><div class="m"></div></div>
        <div class="glegend"><div class="w"><b>${gender[0]}%</b>${t.gender[0]}</div><div style="text-align:${rtl ? "left" : "right"}"><b>${gender[1]}%</b>${t.gender[1]}</div></div>
      </div>
    </div>
  </section>

  <footer class="band">
    <div class="bl">
      <div class="bt">${t.cta}</div>
      <div class="bpitch">${t.pitch}</div>
      <div class="bsub">${t.formatsTitle}</div>
      <div class="chips">${t.formats.map((f, i) => `<span class="chip${i === 0 ? " main" : ""}">${f}</span>`).join("")}</div>
    </div>
    <div class="br">
      <a class="btn solid" href="mailto:abdelouadoud.mahdaoui.pro@gmail.com"><span class="ico">${MAIL}</span>abdelouadoud.mahdaoui.pro@gmail.com</a>
      <a class="btn" href="https://abdelouadoud-portfolio.vercel.app/links"><span class="ico">${LINK}</span>abdelouadoud-portfolio.vercel.app/links</a>
    </div>
  </footer>
  <div class="note">${t.note}</div>
</div>
<script>
  const pg = document.querySelector(".page");
  document.fonts.ready.then(() => {
    let z = 1;
    while (pg.scrollHeight > pg.clientHeight + 1 && z > 0.8) {
      z -= 0.01;
      pg.style.zoom = z; pg.style.width = 210 / z + "mm"; pg.style.height = 297 / z + "mm";
    }
    document.title += z < 1 ? " (fit " + z.toFixed(2) + ")" : "";
  });
</script>
</body>
</html>`;
}

for (const t of Object.values(L)) writeFileSync(new URL(`./${t.file}.html`, import.meta.url), page(t));
// Web version: public/media-kit/{fr,en,darja}.html (+ the images they use), linked to each other by the language
// switch. URLs: /media-kit (French, default), /media-kit/en, /media-kit/darja (rewrites in next.config.ts).
const out = new URL("../public/media-kit/", import.meta.url);
mkdirSync(new URL("img/", out), { recursive: true });
for (const f of readdirSync(new URL("./img/", import.meta.url))) if (f.endsWith(".jpg")) copyFileSync(new URL(`./img/${f}`, import.meta.url), new URL(`img/${f}`, out));
const langs = [[L.fr, "FR", "fr", ""], [L.en, "EN", "en", "/en"], [L.dz, "عربي", "darja", "/darja"]].map(([t, label, file, path]) => ({ t, lang: t.lang, label, file, href: `/media-kit${path}` }));
for (const l of langs) writeFileSync(new URL(`${l.file}.html`, out), web(l.t, { history, fbHistory, reels, ages, gender, ICONS, MAIL, LINK, socials, langs }));
console.log("ok");
