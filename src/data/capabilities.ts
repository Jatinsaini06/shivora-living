/**
 * Custom Carpet Solutions (PDF page 14) and the Manufacturing Process
 * (PDF pages 15-16).
 *
 * The catalogue prints the solution tiles and five of the six process stages as
 * bare labels with no supporting copy. Only the packaging stage carries a
 * description. Rather than invent the missing text, `body: null` marks it as
 * pending and the UI shows the stage without a paragraph.
 */

export interface Capability {
  icon: string;
  title: string;
}

/** Headline printed across the top of page 14. */
export const CUSTOM_HEADLINE = "We can manufacture any carpet according to your requirements";

/** The seven tiles exactly as the PDF lists them. */
export const CUSTOM_SOLUTIONS: Capability[] = [
  { icon: "ruler", title: "Custom Sizes" },
  { icon: "palette", title: "Custom Colors" },
  { icon: "hotel", title: "Hotel Projects" },
  { icon: "grid", title: "Custom Patterns" },
  { icon: "pen", title: "Designer Rugs" },
  { icon: "drafting", title: "CAD Design" },
  { icon: "boxes", title: "Bulk Orders" },
];

export interface ProcessStage {
  step: string;
  title: string;
  /** null where the catalogue prints no description. Do not invent one. */
  body: string | null;
  slot: string;
  alt: string;
}

/** Intro paragraph, PDF page 15, unedited. */
export const PROCESS_INTRO =
  "Our manufacturing process blends advanced technology with skilled craftsmanship, ensuring every carpet meets the highest standards of quality, precision, and durability. From premium raw materials to meticulous finishing, excellence is achieved at every stage.";

export const PROCESS_STAGES: ProcessStage[] = [
  {
    step: "01",
    title: "Material Selection",
    body: null,
    slot: "process-yarn",
    alt: "Dyed yarn being tested for colourfastness before production",
  },
  {
    step: "02",
    title: "Design Development",
    body: null,
    slot: "process-colourway",
    alt: "Colour poms and pattern samples laid out during design development",
  },
  {
    step: "03",
    title: "Weaving Process",
    body: null,
    slot: "process-loom",
    alt: "A carpet being woven on the loom",
  },
  {
    step: "04",
    title: "Finishing",
    body: null,
    slot: "process-shearing",
    alt: "The pile being sheared and finished by hand",
  },
  {
    step: "05",
    title: "Quality Inspection",
    body: null,
    slot: "process-inspection",
    alt: "A finished carpet checked by hand during quality inspection",
  },
  {
    step: "06",
    title: "Packaging & Delivery",
    body: "Our packaging process is designed to protect every carpet from handling and transit damage. Combined with efficient worldwide delivery, we ensure each product arrives in pristine condition, ready to transform your space.",
    slot: "process-packing",
    alt: "Finished carpets boxed and prepared for delivery",
  },
];

/**
 * Two further claims the catalogue prints as standalone callouts on pages
 * 15-16, kept because they are part of the source content.
 */
export const PROCESS_CALLOUTS = [{ label: "In Your Feet" }, { label: "Bleedless Colors" }] as const;
