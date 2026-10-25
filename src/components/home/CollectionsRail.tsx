import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { PRODUCTS } from "@/data/products";
import { Figure } from "@/components/primitives/Figure";
import { SectionHeading, TextLink } from "@/components/primitives/ui";
import { Reveal } from "@/components/primitives/motion";

/**
 * The ten collections as a horizontal editorial rail.
 *
 * Cards are unboxed on purpose — a photograph, an index and a name, separated
 * by air rather than borders. It is a plain scroll container underneath, so
 * touch and trackpad gestures work natively and the arrows only drive
 * `scrollBy`.
 */
export function CollectionsRail() {
  const rail = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    sync();
    const el = rail.current;
    if (!el) return;
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const nudge = (direction: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 28 : 320;
    el.scrollBy({ left: step * direction * 2, behavior: "smooth" });
  };

  return (
    <section className="bg-shell band" aria-labelledby="collections-title">
      <div className="shell">
        <Reveal
          variant="bare"
          className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between"
        >
          <SectionHeading
            id="collections-title"
            eyebrow="Our Collections"
            lines={["Crafted for", "Every Space"]}
            accent={[1]}
          />

          <div className="flex flex-col gap-6 sm:max-w-md">
            <p className="prose-lux text-[0.9rem]">
              Discover our exclusive range of handcrafted carpets &amp; rugs, designed to transform
              your interiors with elegance.
            </p>
            <div className="flex items-center gap-8">
              <TextLink to="/collections">View all ten</TextLink>
              <RailControls
                atStart={atStart}
                atEnd={atEnd}
                onPrev={() => nudge(-1)}
                onNext={() => nudge(1)}
              />
            </div>
          </div>
        </Reveal>
      </div>

      {/* One reveal for the whole rail, not one per card: a card scrolled out
          of the rail horizontally never intersects the viewport, so per-card
          observers would leave those cards invisible until swiped to. */}
      <Reveal className="mt-16">
        <ul
          ref={rail}
          className="rail flex gap-7 overflow-x-auto pb-2"
          // First card lines up with the page gutter; the last can scroll clear.
          style={{
            paddingInline: "var(--gutter)",
            scrollPaddingInline: "var(--gutter)",
          }}
        >
          {PRODUCTS.map((product, i) => (
            <li key={product.slug} className="w-[15rem] shrink-0 sm:w-[17rem] lg:w-[19rem]">
              <Link to="/collections/$slug" params={{ slug: product.slug }} className="group block">
                <div className="bg-sand relative overflow-hidden">
                  <Figure
                    slot={product.images[0]?.slot ?? ""}
                    alt={product.images[0]?.alt ?? product.displayName}
                    className="aspect-[3/4] w-full"
                    imgClassName="kenburns"
                    sizes="(max-width: 640px) 62vw, (max-width: 1024px) 34vw, 19rem"
                  />
                  {/* Champagne veil lifts off the photograph on hover. */}
                  <span className="bg-gold-tint/0 group-hover:bg-gold-tint/12 pointer-events-none absolute inset-0 transition-colors duration-700" />
                  <span className="text-gold-deep absolute top-4 left-4 bg-white/90 px-2.5 py-1 text-[0.55rem] tracking-[0.28em] backdrop-blur-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="mt-5">
                  <h3 className="display-md group-hover:text-gold text-[1.4rem] transition-colors duration-600">
                    <span className="link-rule inline">{product.displayName}</span>
                  </h3>
                  <p className="text-muted mt-2 text-[0.8rem] leading-relaxed">{product.short}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

function RailControls({
  atStart,
  atEnd,
  onPrev,
  onNext,
}: {
  atStart: boolean;
  atEnd: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="hidden items-center gap-2 sm:flex">
      <RailButton label="Previous collections" disabled={atStart} onClick={onPrev}>
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.4} />
      </RailButton>
      <RailButton label="Next collections" disabled={atEnd} onClick={onNext}>
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.4} />
      </RailButton>
    </div>
  );
}

function RailButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "border-line text-ink-soft flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-500",
        disabled
          ? "text-muted/40 border-line-soft cursor-default"
          : "hover:border-gold hover:bg-gold hover:text-white",
      )}
    >
      {children}
    </button>
  );
}
