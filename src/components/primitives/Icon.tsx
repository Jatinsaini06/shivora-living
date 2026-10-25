import {
  Boxes,
  Clock,
  Crown,
  DraftingCompass,
  Gem,
  Grid3x3,
  Hotel,
  Palette,
  PenTool,
  Ruler,
  Tag,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps the icon keys used in `src/data` to Lucide glyphs, so the data files
 * stay free of component imports.
 */
const ICONS: Record<string, LucideIcon> = {
  gem: Gem,
  palette: Palette,
  crown: Crown,
  tag: Tag,
  boxes: Boxes,
  clock: Clock,
  ruler: Ruler,
  hotel: Hotel,
  grid: Grid3x3,
  pen: PenTool,
  drafting: DraftingCompass,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const Glyph = ICONS[name] ?? Gem;
  return <Glyph className={className} strokeWidth={1.15} aria-hidden="true" />;
}
