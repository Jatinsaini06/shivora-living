/**
 * Asset pipeline for Shivora Living.
 *
 * Source photos live in media-src/ (extracted from the catalogue PDF). That folder sits
 * outside public/ on purpose - the originals are large and must never ship.
 * This script crops away third-party watermarks where a crop still leaves a
 * usable frame, then emits responsive WebP at 480/960/1600 plus a tiny blurred
 * LQIP for each slot into public/media/out.
 *
 * Re-run with `node scripts/build-media.mjs` after dropping in licensed photos.
 */
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const SRC = path.resolve("media-src");
const OUT = path.resolve("public/media/out");
const WIDTHS = [480, 960, 1600];

/**
 * slot -> source file + optional crop.
 * `crop` is a fraction of the source: { top, bottom, left, right } to remove.
 * Watermark notes are recorded so the manifest can flag them.
 */
const SLOTS = [
  // --- brand -------------------------------------------------------------
  { slot: "hero-room", src: "001_2720x1814.jpg" },
  { slot: "about-room", src: "031_1229x1844.jpg" },
  { slot: "signature-room", src: "021_600x737.jpg" },

  // --- products ----------------------------------------------------------
  { slot: "hand-woven-a", src: "004_480x800.jpg" },
  { slot: "hand-woven-b", src: "003_1200x1800.jpg" },
  { slot: "hand-tufted-a", src: "007_720x960.jpg" },
  { slot: "cotton-tufted-a", src: "006_960x960.jpg" },
  {
    slot: "cotton-tufted-b",
    src: "005_720x720.jpg",
    crop: { top: 0.14, bottom: 0.14, left: 0.14, right: 0.14 },
    watermark: "ZoZa Rugs (tiled) — centre crop only partially clears it",
  },
  { slot: "braided-a", src: "008_663x953.jpg" },
  { slot: "braided-b", src: "032_736x1104.jpg" },
  { slot: "braided-c", src: "033_736x1104.jpg" },
  { slot: "jute-a", src: "009_663x994.jpg" },
  { slot: "jute-b", src: "010_780x783.jpg" },
  { slot: "jute-c", src: "011_720x900.jpg" },
  { slot: "woolen-a", src: "012_720x1080.jpg" },
  { slot: "woolen-b", src: "013_720x720.jpg" },
  { slot: "woolen-c", src: "014_683x1024.jpg" },
  {
    slot: "shaggy-a",
    src: "015_756x1344.jpg",
    crop: { bottom: 0.11 },
    watermark: "House Velix — bottom bar cropped away",
  },
  { slot: "abstract-a", src: "017_663x1160.jpg" },
  { slot: "abstract-b", src: "018_820x820.jpg" },
  { slot: "hotel-a", src: "016_840x1261.jpg" },
  { slot: "custom-a", src: "019_589x736.jpg" },
  { slot: "custom-b", src: "020_600x400.jpg" },
  { slot: "custom-c", src: "022_336x448.jpg" },
  { slot: "custom-d", src: "023_442x663.jpg" },

  // --- manufacturing process --------------------------------------------
  { slot: "room-scene", src: "027_560x560.jpg" },
  { slot: "process-loom", src: "024_427x640.jpg" },
  { slot: "process-colourway", src: "026_720x960.jpg" },
  { slot: "process-shearing",   src: "025_720x540.jpg" },
  { slot: "process-packing", src: "028_480x480.jpg" },
  { slot: "process-inspection", src: "029_342x512.jpg" },
  { slot: "process-yarn", src: "030_615x336.jpg" },
];

function cropRect(meta, crop) {
  if (!crop) return null;
  const { width: w, height: h } = meta;
  const left = Math.round(w * (crop.left ?? 0));
  const top = Math.round(h * (crop.top ?? 0));
  const right = Math.round(w * (crop.right ?? 0));
  const bottom = Math.round(h * (crop.bottom ?? 0));
  return { left, top, width: w - left - right, height: h - top - bottom };
}

await fs.mkdir(OUT, { recursive: true });
const manifest = [];

for (const entry of SLOTS) {
  const file = path.join(SRC, entry.src);
  try {
    await fs.access(file);
  } catch {
    console.warn(`  skip ${entry.slot} — missing ${entry.src}`);
    continue;
  }

  const base = sharp(file, { failOn: "none" });
  const meta = await base.metadata();
  const rect = cropRect(meta, entry.crop);

  const record = {
    slot: entry.slot,
    source: entry.src,
    intrinsic: { width: rect?.width ?? meta.width, height: rect?.height ?? meta.height },
    widths: [],
    watermark: entry.watermark ?? null,
  };

  // Never upscale, but always emit at least one rendition even for small sources.
  let targets = WIDTHS.filter((w) => w <= record.intrinsic.width * 1.15);
  if (targets.length === 0) targets = [record.intrinsic.width];

  for (const w of targets) {
    let pipe = sharp(file, { failOn: "none" });
    if (rect) pipe = pipe.extract(rect);
    await pipe
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(path.join(OUT, `${entry.slot}-${w}.webp`));
    record.widths.push(w);
  }

  // Largest available width doubles as the default src.
  const largest = record.widths.at(-1);
  await fs.copyFile(
    path.join(OUT, `${entry.slot}-${largest}.webp`),
    path.join(OUT, `${entry.slot}.webp`),
  );

  // LQIP: 20px wide blurred base64, inlined as the poster while the real
  // image streams in.
  let lq = sharp(file, { failOn: "none" });
  if (rect) lq = lq.extract(rect);
  const buf = await lq.resize({ width: 20 }).blur(1.4).webp({ quality: 40 }).toBuffer();
  record.lqip = `data:image/webp;base64,${buf.toString("base64")}`;

  manifest.push(record);
  console.log(
    `  ${entry.slot.padEnd(20)} ${record.widths.join("/") || "—"}  ${entry.watermark ? "[watermark handled]" : ""}`,
  );
}

await fs.writeFile(
  path.resolve("src/data/media-manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(`\n${manifest.length} slots -> public/media/out + src/data/media-manifest.json`);
