/**
 * Brand + contact facts. Every value here is taken verbatim from the
 * Shivora Living catalogue PDF (pages 1, 17, 18). Nothing is invented.
 */
export const SITE = {
  name: "Shivora Living",
  wordmark: { top: "SHIVORA", bottom: "LIVING" },
  tagline: "Beyond Expectations",
  catalogueTitle: "Carpet & Rugs Catalogue",
  strapline: "Shivora delivers premium floor décor",
  url: "https://www.shivoraliving.in",
  domain: "www.shivoraliving.in",
  email: "reachus@shivoraliving.in",
  phone: "+91 9034363568",
  phoneHref: "+919034363568",
  whatsapp: "919034363568",
  instagram: "@shivoraliving",
  instagramUrl: "https://instagram.com/shivoraliving",
  location: "Panipat, Haryana, India",
  copyrightYear: 2025,
} as const;

export const NAV = [
  { label: "Home", to: "/" },
  { label: "Collections", to: "/collections" },
  { label: "Custom Solutions", to: "/custom-solutions" },
  { label: "About Us", to: "/about" },
  { label: "Process", to: "/process" },
  { label: "Contact", to: "/contact" },
] as const;

/** About copy — PDF page 2, unedited. */
export const ABOUT_PARAGRAPHS = [
  "At Shivora Living, we believe a carpet is not just a decor; it is the canvas of a room's luxury. We specialize in curating an elite range of bespoke carpets, meticulously crafted for ultra-luxury hotels, grand commercial spaces, and premium residential interiors.",
  "Quality is our cornerstone. Our textures, designs, and patterns are all built on a foundation of uncompromising quality and durability. Every thread we weave reflects unmatched craftsmanship and sophistication, designed to meet the highest standards while exuding pure elegance.",
  "Understanding that true luxury lies in exclusivity, we also offer bespoke customization services. We collaborate closely with our clients to transform their unique visions into tailored masterpieces — working through their colour palettes, desired designs and required dimensions, and crafting carpets that perfectly complement their aesthetic and space.",
] as const;

/** "Why Choose Us" — PDF page 3, all six points, unedited. */
export const WHY_CHOOSE_US = [
  {
    icon: "gem",
    title: "Uncompromising Quality",
    body: "Every thread is crafted with premium materials to ensure exceptional durability and luxury texture.",
  },
  {
    icon: "palette",
    title: "Flawless Customization",
    body: "We precisely match your unique color palettes, custom designs, and exact required dimensions. Our team works closely with you from initial blueprints to final handover for seamless execution.",
  },
  {
    icon: "crown",
    title: "Designed for Elite Spaces",
    body: "Engineered specifically to meet the aesthetic and high-traffic demands of luxury hotels and premium interiors.",
  },
  {
    icon: "tag",
    title: "Competitive Pricing",
    body: "We deliver top-tier craftsmanship and premium quality at highly competitive market rates. This ensures you get maximum value and luxury aesthetics while staying comfortably within your budget.",
  },
  {
    icon: "boxes",
    title: "Bulk Orders Accepted",
    body: "Equipped with a large production capacity, we can seamlessly handle high-volume orders for commercial projects.",
  },
  {
    icon: "clock",
    title: "Timely Delivery",
    body: "We prioritize strict project timelines to ensure your carpets arrive exactly when needed.",
  },
] as const;

/** Hero USP panel — the four the reference mockup surfaces, each drawn from page 3. */
export const HERO_USPS = [
  { icon: "gem", title: "Premium Quality", body: "Uncompromising quality in every thread." },
  { icon: "palette", title: "Bespoke Designs", body: "Custom made to match your vision." },
  { icon: "clock", title: "Timely Delivery", body: "On-time, every time." },
  {
    icon: "boxes",
    title: "Bulk Order Experts",
    body: "High capacity production for large projects.",
  },
] as const;
