/**
 * The ten collections, taken from the detail pages of the Shivora Living
 * catalogue PDF (pages 5-13).
 *
 * IMPORTANT - `blurb` is the PDF's own copy, unedited. `specs` are deliberately
 * left as nulls: the catalogue contains no material composition, pile height,
 * size, MOQ, care or lead-time information, and none has been invented. The UI
 * renders a null spec as "On request" so the gaps stay visible until real
 * values are supplied.
 *
 * `render` drives the WebGL rug viewer only. Those numbers describe how the
 * on-screen preview should look - they are NOT product specifications.
 */

export type SpecValue = string | null;

export interface Product {
  slug: string;
  name: string;
  /** Heading as printed in the PDF. */
  displayName: string;
  /** Short line used on cards and the collections rail. */
  short: string;
  /** Verbatim PDF description, one entry per printed paragraph. */
  blurb: string[];
  images: { slot: string; alt: string }[];
  specs: { label: string; value: SpecValue }[];
  render: {
    /** Dominant colour, sampled from the catalogue photography. */
    base: string;
    /** 0-1 displacement strength for the pile in the 3D preview. */
    pile: number;
    /** Texture repeat across the preview plane. */
    repeat: number;
    /** Surface roughness in the preview. */
    roughness: number;
    /**
     * Which photo to use as the weave texture. This is deliberately the most
     * macro shot available, not the hero: a room scene mapped onto the plane
     * would put furniture in the pile.
     */
    textureSlot: string;
    /**
     * Optional sub-region of that photo to sample, as [offsetX, offsetY,
     * spanX, spanY] in 0-1 texture space. Used when only a room shot exists
     * and the carpet occupies part of the frame.
     */
    textureCrop?: [number, number, number, number];
  };
}

/** Every product carries the same spec sheet, all pending real data. */
const pendingSpecs = (): { label: string; value: SpecValue }[] => [
  { label: "Material composition", value: null },
  { label: "Pile height", value: null },
  { label: "Available sizes", value: null },
  { label: "Standard colourways", value: null },
  { label: "Backing", value: null },
  { label: "Care instructions", value: null },
  { label: "Minimum order quantity", value: null },
  { label: "Lead time", value: null },
];

export const PRODUCTS: Product[] = [
  {
    slug: "hand-woven",
    name: "Hand Woven",
    displayName: "Hand Woven Carpet",
    short: "Superior craftsmanship, luxurious texture.",
    blurb: [
      "Expertly hand woven with precision and care, our carpets showcase superior craftsmanship and luxurious texture.",
      "Designed to enhance modern interiors, they deliver lasting comfort, refined aesthetics, and exceptional quality for every home.",
    ],
    images: [
      { slot: "hand-woven-a", alt: "Cream hand-woven wool carpet with a dense looped pile" },
      { slot: "hand-woven-b", alt: "Hand-woven natural fibre rug being laid in a living room" },
    ],
    specs: pendingSpecs(),
    render: {
      base: "#ece3d2",
      pile: 0.62,
      repeat: 3.0,
      roughness: 0.86,
      textureSlot: "hand-woven-a",
      textureCrop: [0.02, 0.22, 0.96, 0.74],
    },
  },
  {
    slug: "hand-tufted",
    name: "Hand Tufted",
    displayName: "Hand Tufted Carpet",
    short: "Craftsmanship, durability and design in balance.",
    blurb: [
      "Hand Tufted Carpets offer the perfect balance of craftsmanship, durability, and design.",
      "Made with precision using premium yarns, they provide luxurious comfort, striking aesthetics, and timeless appeal for modern living spaces.",
    ],
    images: [
      {
        slot: "hand-tufted-a",
        alt: "Hand-tufted wool rugs in ivory and terracotta with a raised block pattern",
      },
    ],
    specs: pendingSpecs(),
    render: {
      base: "#e8ddca",
      pile: 0.72,
      repeat: 2.4,
      roughness: 0.8,
      textureSlot: "hand-tufted-a",
    },
  },
  {
    slug: "cotton-tufted",
    name: "Cotton Tufted",
    displayName: "Cotton Tufted",
    short: "Vibrant patterns, ultra-soft plush comfort.",
    blurb: [
      "Redefine your space with our high-precision Cotton-Tufted Rugs - offering vibrant patterns, ultra-soft plush comfort, and durable everyday luxury engineered for modern homes.",
    ],
    images: [
      {
        slot: "cotton-tufted-a",
        alt: "Close view of a sand-coloured cotton tufted rug with a carved ribbed pattern",
      },
      {
        slot: "cotton-tufted-b",
        alt: "Cotton tufted rug with concentric carved lines beside a walnut table",
      },
    ],
    specs: pendingSpecs(),
    render: {
      base: "#d9c5a8",
      pile: 0.78,
      repeat: 2.8,
      roughness: 0.78,
      textureSlot: "cotton-tufted-a",
    },
  },
  {
    slug: "braided",
    name: "Braided",
    displayName: "Braided Carpet",
    short: "Rustic charm, effortless natural style.",
    blurb: [
      "Bring authentic warmth and rich texture to your space with our beautifully Braided Rugs - thoughtfully crafted for everyday durability, rustic charm, and effortless natural style.",
    ],
    images: [
      { slot: "braided-a", alt: "Round braided rug in oatmeal and taupe on a walnut floor" },
      { slot: "braided-b", alt: "Braided rug detail showing the plaited rope construction" },
      { slot: "braided-c", alt: "Braided rug edge detail in natural undyed fibre" },
    ],
    specs: pendingSpecs(),
    render: {
      base: "#cdb79c",
      pile: 0.55,
      repeat: 3.4,
      roughness: 0.9,
      textureSlot: "braided-a",
      textureCrop: [0, 0.28, 0.82, 0.7],
    },
  },
  {
    slug: "jute",
    name: "Jute",
    displayName: "Jute Carpets",
    short: "Eco-friendly flooring with organic warmth.",
    blurb: [
      "Our premium Jute Carpets offer an eco-friendly flooring solution that brings organic warmth, rich texture, and sophisticated style to any living space.",
      "Transform your home interiors with our ethically woven and braided jute carpets.",
    ],
    images: [
      { slot: "jute-a", alt: "Large braided jute rug anchoring a linen sofa and oak floor" },
      { slot: "jute-b", alt: "Jute rug weave shown in close detail" },
      { slot: "jute-c", alt: "Natural jute carpet in a sunlit interior" },
    ],
    specs: pendingSpecs(),
    render: {
      base: "#c8a97e",
      pile: 0.5,
      repeat: 3.8,
      roughness: 0.94,
      textureSlot: "jute-b",
    },
  },
  {
    slug: "woolen",
    name: "Woolen",
    displayName: "Woolen Carpets",
    short: "Matchless luxury and softness underfoot.",
    blurb: [
      "Experience matchless luxury and softness underfoot with our premium Woolen Carpets.",
      "Exceptionally durable and naturally stain-resistant, these high-quality woolen carpets offer superior comfort for your living area.",
    ],
    images: [
      { slot: "woolen-a", alt: "Chunky looped woolen carpet in soft taupe beside a linen daybed" },
      { slot: "woolen-b", alt: "Woolen carpet pile shown at close range" },
      { slot: "woolen-c", alt: "Four woolen carpet swatches in ochre, ivory and grey on oak" },
    ],
    specs: pendingSpecs(),
    render: {
      base: "#bda893",
      pile: 0.66,
      repeat: 3.2,
      roughness: 0.88,
      textureSlot: "woolen-b",
      textureCrop: [0.35, 0.5, 0.62, 0.47],
    },
  },
  {
    slug: "shaggy",
    name: "Shaggy",
    displayName: "Shaggy Carpet",
    short: "Luxurious depth and cozy drama.",
    blurb: [
      "Transform your living space with luxurious depth and cozy drama - our Shaggy Carpets blend bold tactile comfort with effortless, contemporary style.",
    ],
    images: [
      { slot: "shaggy-a", alt: "Deep ivory shaggy rug with a long, soft pile in a living room" },
    ],
    specs: pendingSpecs(),
    render: {
      base: "#f1ebe1",
      pile: 1.0,
      repeat: 2.0,
      roughness: 0.72,
      textureSlot: "shaggy-a",
      textureCrop: [0.27, 0.06, 0.64, 0.36],
    },
  },
  {
    slug: "abstract",
    name: "Abstract",
    displayName: "Abstract Carpet",
    short: "Free-form patterns, contemporary luxury.",
    blurb: [
      "Make a captivating style statement with our Abstract Carpets - where creative free-form patterns and rich textures meet contemporary high-end luxury.",
    ],
    images: [
      { slot: "abstract-a", alt: "Free-form abstract rug in layered greens beneath a curved sofa" },
      {
        slot: "abstract-b",
        alt: "Abstract navy and ivory rug with arched geometric motifs in a bedroom",
      },
    ],
    specs: pendingSpecs(),
    render: {
      base: "#8f9b74",
      pile: 0.6,
      repeat: 1.6,
      roughness: 0.75,
      textureSlot: "abstract-a",
      textureCrop: [0.12, 0.16, 0.76, 0.46],
    },
  },
  {
    slug: "hotel",
    name: "Hotel",
    displayName: "Hotel Carpet",
    short: "Opulent appeal and acoustic comfort for hospitality.",
    blurb: [
      "Create unforgettable first impressions with our grand hotel carpets - delivering opulent visual appeal, whisper-quiet acoustic comfort, and world-class elegance designed for luxury hospitality.",
    ],
    images: [{ slot: "hotel-a", alt: "Patterned hotel corridor carpet in muted blues and sand" }],
    specs: pendingSpecs(),
    render: {
      base: "#a9b2b0",
      pile: 0.42,
      repeat: 2.2,
      roughness: 0.7,
      textureSlot: "hotel-a",
      textureCrop: [0.06, 0.03, 0.88, 0.42],
    },
  },
  {
    slug: "custom-theme",
    name: "Custom Theme",
    displayName: "Custom Theme Carpet",
    short: "Tailored in size, colour, pattern and texture.",
    blurb: [
      "Bring your unique vision to life with custom carpets - tailored precisely in size, color, pattern, and texture to match your exact interior style.",
    ],
    images: [
      {
        slot: "custom-a",
        alt: "Yarn poms and material swatches laid out for a bespoke carpet selection",
      },
      { slot: "custom-b", alt: "Custom carpet samples in warm earth tones" },
      { slot: "custom-c", alt: "Bespoke carpet sample detail" },
      { slot: "custom-d", alt: "Custom themed carpet in production" },
    ],
    specs: pendingSpecs(),
    render: {
      base: "#c9a97f",
      pile: 0.68,
      repeat: 2.0,
      roughness: 0.8,
      textureSlot: "custom-a",
    },
  },
];

export const PRODUCT_SLUGS = PRODUCTS.map((p) => p.slug);

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function adjacentProducts(slug: string) {
  const i = PRODUCTS.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: undefined, next: undefined };
  return {
    prev: PRODUCTS[(i - 1 + PRODUCTS.length) % PRODUCTS.length],
    next: PRODUCTS[(i + 1) % PRODUCTS.length],
  };
}
