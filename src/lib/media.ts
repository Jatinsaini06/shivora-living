import manifest from "@/data/media-manifest.json";

export interface MediaEntry {
  slot: string;
  source: string;
  intrinsic: { width: number; height: number };
  widths: number[];
  watermark: string | null;
  lqip: string;
}

const BY_SLOT = new Map<string, MediaEntry>(
  (manifest as MediaEntry[]).map((entry) => [entry.slot, entry]),
);

export interface ResolvedMedia {
  src: string;
  srcSet: string;
  width: number;
  height: number;
  lqip: string;
  /** Set when the source photo carries a third-party watermark. */
  watermark: string | null;
}

/**
 * Resolve a media slot to the responsive sources emitted by
 * `scripts/build-media.mjs`. Returns null for an unknown slot so callers can
 * fall back to a texture placeholder rather than render a broken image.
 */
export function media(slot: string): ResolvedMedia | null {
  const entry = BY_SLOT.get(slot);
  if (!entry) return null;
  return {
    src: `/media/out/${entry.slot}.webp`,
    srcSet: entry.widths.map((w) => `/media/out/${entry.slot}-${w}.webp ${w}w`).join(", "),
    width: entry.intrinsic.width,
    height: entry.intrinsic.height,
    lqip: entry.lqip,
    watermark: entry.watermark,
  };
}

export function hasMedia(slot: string) {
  return BY_SLOT.has(slot);
}

/** Every slot whose source photo is still a watermarked catalogue image. */
export function watermarkedSlots() {
  return (manifest as MediaEntry[]).filter((e) => e.watermark).map((e) => e.slot);
}
