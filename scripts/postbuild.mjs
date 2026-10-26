/**
 * Static-host finishing touches.
 *
 * 1. The prerenderer writes the not-found page to /404/index.html; GitHub Pages
 *    and most static hosts want it at /404.html.
 * 2. SEO pass over every prerendered page: a canonical URL, and Open Graph /
 *    Twitter tags that match the page itself rather than the homepage.
 * 3. Sitemap clean-up: the correct schema namespace, and no 404 entry.
 * 4. A 1200x630 JPEG share image, since WhatsApp and Facebook previews do not
 *    reliably render WebP.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const OUT = path.resolve("dist/client");
const HOST = "https://shivoraliving.in";
const OG_IMAGE = "/media/og-image.jpg";

// ---- 1. 404 ---------------------------------------------------------------
const from = path.join(OUT, "404", "index.html");
const to = path.join(OUT, "404.html");
if (fs.existsSync(from)) {
  fs.copyFileSync(from, to);
  console.log("[postbuild] 404/index.html -> 404.html");
} else {
  console.warn("[postbuild] no prerendered 404 page found; skipping 404.html");
}

// ---- 2. Per-page head tags --------------------------------------------------
const escapeAttr = (s) => s.replace(/"/g, "&quot;");
const pick = (html, re) => html.match(re)?.[1];

function* htmlFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(full);
    else if (entry.name === "index.html") yield full;
  }
}

const urls = [];
for (const file of htmlFiles(OUT)) {
  const rel = path.relative(OUT, path.dirname(file)).split(path.sep).join("/");
  if (rel === "404") continue;
  // Trailing slash: every page is a folder with an index.html, and GitHub
  // Pages 301s /about to /about/. The canonical must be the URL that answers 200.
  const url = rel ? `${HOST}/${rel}/` : `${HOST}/`;
  urls.push(url);

  let html = fs.readFileSync(file, "utf8");
  const title = pick(html, /<title>([^<]*)<\/title>/);
  const description = pick(html, /<meta name="description" content="([^"]*)"\/>/);

  // Drop the root's site-wide og/twitter values; they are re-emitted per page.
  html = html.replace(
    /<meta (?:property="og:(?:url|title|description|image)"|name="twitter:(?:title|description|image)") content="[^"]*"\/>/g,
    "",
  );

  const tags = [
    `<link rel="canonical" href="${url}"/>`,
    `<meta property="og:url" content="${url}"/>`,
    `<meta property="og:locale" content="en_IN"/>`,
    `<meta property="og:image" content="${HOST}${OG_IMAGE}"/>`,
    `<meta property="og:image:width" content="1200"/>`,
    `<meta property="og:image:height" content="630"/>`,
    `<meta name="twitter:image" content="${HOST}${OG_IMAGE}"/>`,
  ];
  if (title) {
    tags.push(`<meta property="og:title" content="${title}"/>`);
    tags.push(`<meta name="twitter:title" content="${title}"/>`);
  }
  if (description) {
    tags.push(`<meta property="og:description" content="${escapeAttr(description)}"/>`);
    tags.push(`<meta name="twitter:description" content="${escapeAttr(description)}"/>`);
  }

  html = html.replace("</head>", `${tags.join("")}</head>`);
  fs.writeFileSync(file, html);
}
console.log(`[postbuild] canonical + social tags written to ${urls.length} pages`);

// ---- 3. Sitemap ---------------------------------------------------------------
// Rebuilt from the pages actually on disk so it always matches the canonicals.
// (The generated one used an https:// namespace, which Google rejects, and
// listed /collections twice.)
const today = new Date().toISOString().slice(0, 10);
const priority = (u) => (u === `${HOST}/` ? "1.0" : u.split("/").length > 5 ? "0.7" : "0.8");
const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .sort((a, b) => a.length - b.length || a.localeCompare(b))
    .map(
      (u) =>
        `  <url><loc>${u}</loc><lastmod>${today}</lastmod><priority>${priority(u)}</priority></url>`,
    )
    .join("\n") +
  `\n</urlset>\n`;
fs.writeFileSync(path.join(OUT, "sitemap.xml"), xml);
fs.rmSync(path.join(OUT, "pages.json"), { force: true });
console.log(`[postbuild] sitemap.xml written with ${urls.length} URLs`);

// ---- 4. Share image --------------------------------------------------------------
const heroSrc = path.join(OUT, "media", "out", "hero-room-1600.webp");
if (fs.existsSync(heroSrc)) {
  await sharp(heroSrc)
    .resize(1200, 630, { fit: "cover", position: "attention" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(OUT, OG_IMAGE));
  console.log(`[postbuild] ${OG_IMAGE} written`);
}
