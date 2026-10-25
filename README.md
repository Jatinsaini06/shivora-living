# Shivora Living — carpets & rugs

A fully static marketing site for Shivora Living (Panipat, Haryana). React 19 +
TanStack Start, prerendered to plain HTML. **No backend, no database, nothing to
run in production** — the build output is a folder of files you upload.

```bash
npm install
npm run dev            # http://localhost:5173
npm run build          # -> dist/client   (this is the whole site)
npm run serve:static   # preview the built output exactly as it will ship
```

---

## What ships

`npm run build` prerenders **18 pages** to real HTML — search engines and social
scrapers see the full copy without running JavaScript:

| Route | Page |
| --- | --- |
| `/` | Home |
| `/collections` | All ten collections |
| `/collections/<slug>` | Ten detail pages (hand-woven … custom-theme) |
| `/custom-solutions` | Custom Carpet Solutions |
| `/about` | About Shivora Living |
| `/process` | Manufacturing Process |
| `/contact` | Contact + enquiry composer |
| `/404` | Not found (copied to `404.html` for the host) |

Also emitted: `sitemap.xml`, `robots.txt`, `favicon.svg`, `.htaccess`.

Total upload is about **7 MB**, most of it photography.

### Deploying

Upload the **contents of `dist/client`** to the web root (`public_html` on
cPanel). Nothing else is needed — no Node, no PM2, no database.

The included `.htaccess` sets long cache lifetimes on hashed assets, revalidates
HTML on every request, and points Apache's 404 at `404.html`. On Netlify,
Vercel, Cloudflare Pages or S3, set the publish directory to `dist/client` and
the 404 document to `404.html`; the `.htaccess` is simply ignored.

Every route is its own `index.html`, so clean URLs work without rewrite rules.

---

## Where the content comes from

Everything is sourced from the catalogue PDF (`Shivora living.pdf`, 18 pages).
Copy is transcribed **verbatim** into `src/data/`:

- `src/data/site.ts` — brand, contact details, About copy (p2), Why Choose Us (p3)
- `src/data/products.ts` — the ten collections and their descriptions (p5–13)
- `src/data/capabilities.ts` — Custom Carpet Solutions (p14), Manufacturing Process (p15–16)

To change wording, edit these files. Nothing is hard-coded in components.

### ⚠️ Two things deliberately left blank

**1. Product specifications are not filled in.** The catalogue contains no
material composition, pile height, sizes, colourways, backing, care
instructions, MOQ or lead times, and **none of it has been invented**. Every
spec renders as `On request`, which is accurate for made-to-order work.

To publish real values, edit `pendingSpecs()` per product in
`src/data/products.ts`:

```ts
specs: [
  { label: "Material composition", value: "100% New Zealand wool" },
  { label: "Pile height", value: null },   // still shows "On request"
  …
]
```

**2. Five of the six manufacturing stages have no description.** The PDF prints
only the stage names; only "Packaging & Delivery" carries body copy. Those five
stages render as a heading and photo with no paragraph — deliberately, rather
than inventing copy or showing a visible "to be confirmed" placeholder. Fill in
`body` in `src/data/capabilities.ts` and the paragraph appears.

---

## Photography — read this before going live

**The current images are extracted from the catalogue PDF and are not cleared
for production.** They are placeholders so the layout is real while you source
final photography.

Known problems in the source material:

| Slot | Issue | What was done |
| --- | --- | --- |
| `shaggy-a` | "House Velix" watermark along the bottom | Bottom 11% cropped away |
| `cotton-tufted-b` | "ZoZa Rugs" watermark tiled across the frame | Centre crop; **watermark may still be faintly visible** |
| everything else | Third-party/stock imagery of unknown licence | Used as-is, pending replacement |

Most source files are only 600–900 px wide, so the pipeline can only emit one or
two renditions for them. Real photography at 2000 px+ will noticeably sharpen
the site.

Media slots are named for what the photograph actually shows, not for where the
PDF printed it — several catalogue process images were captioned with the wrong
stage, so `capabilities.ts` points each stage at the photo that genuinely
depicts it (`process-yarn`, `process-colourway`, `process-loom`,
`process-shearing`, `process-inspection`, `process-packing`).

Two collections have **no photograph of their own** in the PDF and currently
borrow one:

- **Hand Tufted** — its two catalogue images could not be extracted (they are
  not JPEG streams). It uses a cotton-tufted photo.
- **Abstract** — the PDF prints Shaggy and Abstract on one page and only one
  image was recoverable. It borrows two rugs from the Hotel page that are
  visually abstract.

### Replacing images

1. Drop new files into `media-src/` (this folder sits **outside** `public/` on
   purpose — originals must never ship).
2. Point the slot at the new filename in `scripts/build-media.mjs` (`SLOTS`),
   and delete its `crop` and `watermark` entries.
3. `npm run media` — regenerates WebP at 480/960/1600 plus a blurred LQIP for
   each slot, and rewrites `src/data/media-manifest.json`.
4. `npm run build`.

No component changes are needed: everything reads slots through
`src/lib/media.ts`.

---

## The 3D

Each rug renders in WebGL (Three.js + React Three Fiber). The product
photograph is used as both the colour map and the displacement map, so the pile
physically stands off the plane and catches the key light — no per-product 3D
assets to author.

The code is split in two on purpose:

- `RugViewer.tsx` — light wrapper. Decides whether to go 3D at all.
- `RugScene.tsx` — the Three.js scene, behind a `lazy()` import.

That keeps the ~865 KB renderer out of the initial page load: the homepage ships
**416 KB of JS**, and the 3D chunk is only fetched once a viewer scrolls into
range on a device that can draw it.

Each product's `render` block in `products.ts` controls the preview:

```ts
render: {
  base: "#ece3d2",              // dominant colour (reference only)
  pile: 0.62,                   // 0–1 displacement strength
  roughness: 0.86,              // surface roughness
  textureSlot: "hand-woven-a",  // which photo to map — pick the most macro one
  textureCrop: [0.02, 0.22, 0.96, 0.74],  // optional [x, y, w, h] in UV space
}
```

`textureCrop` exists because several catalogue shots are room scenes: without it
a sofa or a hand ends up mapped onto the rug. UV origin is **bottom-left**.

**These values are rendering parameters, not product specifications** — `pile`
is a shader input, not a claim about pile height.

The viewer degrades safely: it shows the photograph on the server, before the
scene loads, wherever WebGL is unavailable, and on any connection that never
reaches the section. It holds still under `prefers-reduced-motion`.

Everything else — parallax, scroll reveals, card tilt, the exploded sample
stack, the process timeline — is CSS transforms, no WebGL.

---

## Layout of the source

```
media-src/                    original photos (never shipped)
public/media/out/             generated WebP + LQIP  ← from npm run media
scripts/build-media.mjs       image pipeline
scripts/postbuild.mjs         404/index.html -> 404.html
src/data/                     all copy and content
src/lib/media.ts              slot -> responsive sources
src/components/primitives/    Figure, motion (Reveal/Parallax/Tilt), buttons, icons
src/components/layout/        Header, Footer, ContactRail, PageHeader, NotFound
src/components/home/          homepage sections
src/components/three/         RugViewer (wrapper) + RugScene (lazy Three.js)
src/routes/                   file-based routes
```

## Accessibility & performance notes

- Prerendered HTML means content is readable with JavaScript disabled; a
  `<noscript>` rule forces scroll-reveal elements visible in that case.
- All motion is suppressed under `prefers-reduced-motion: reduce`.
- Images ship as responsive WebP with width/height set, so nothing shifts as the
  page loads.
- The WebGL canvas is `aria-hidden` — the same rug is described by the
  photograph and alt text beside it.
