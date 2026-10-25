import { useState } from "react";
import { cn } from "@/lib/cn";
import { PRODUCTS } from "@/data/products";
import { RugViewer } from "@/components/three/RugViewer";
import { SectionHeading, TextLink } from "@/components/primitives/ui";
import { Reveal } from "@/components/primitives/motion";

/** The weaves with the most pronounced pile — the ones worth showing in 3D. */
const FEATURED = ["cotton-tufted", "hand-woven", "woolen", "jute", "braided", "shaggy"];

/**
 * The WebGL moment of the homepage.
 *
 * Pick a weave and watch its pile stand up and catch the light. The rug
 * surface is driven by the product's own photograph, so it stays truthful to
 * the real material rather than a generic shader.
 */
export function TextureShowcase() {
  const products = FEATURED.map((slug) => PRODUCTS.find((p) => p.slug === slug)!).filter(Boolean);
  const [active, setActive] = useState(0);
  const product = products[active];

  return (
    <section className="bg-ivory grain relative isolate overflow-hidden band" aria-labelledby="texture-title">
      {/* Champagne bloom sits behind the rug and anchors it on the page. */}
      <div
        aria-hidden="true"
        className="bg-gold-tint pointer-events-none absolute top-1/2 right-[-10%] -z-10 h-[38rem] w-[38rem] -translate-y-1/2 rounded-full opacity-70 blur-[130px]"
      />

      <div className="shell grid items-center gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
        {/* ---- Copy + weave selector ---- */}
        <div>
          <Reveal variant="bare">
            <SectionHeading
              id="texture-title"
              eyebrow="Feel the Weave"
              lines={["Texture you", "can almost touch"]}
              accent={[1]}
            />
          </Reveal>

          <Reveal delay={220}>
            <p className="prose-lux mt-7">
              Every thread we weave reflects unmatched craftsmanship and sophistication. Choose a
              weave to see its pile lift, catch the light, and settle.
            </p>
          </Reveal>

          <Reveal delay={320}>
            <ul
              className="border-line/80 mt-10 border-t"
              role="tablist"
              aria-label="Choose a weave"
            >
              {products.map((p, i) => {
                const isActive = i === active;
                return (
                  <li key={p.slug} className="border-line/80 border-b">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActive(i)}
                      className="group flex w-full items-baseline gap-5 py-3.5 text-left"
                    >
                      <span
                        className={cn(
                          "micro w-6 shrink-0 transition-colors duration-500",
                          isActive && "text-gold",
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "font-display flex-1 text-[1.35rem] leading-tight transition-all duration-600",
                          isActive
                            ? "text-gold translate-x-1 italic"
                            : "text-ink-soft group-hover:text-ink group-hover:translate-x-1",
                        )}
                      >
                        {p.name}
                      </span>
                      <span
                        aria-hidden="true"
                        className={cn(
                          "bg-gold h-px origin-right transition-all duration-700",
                          isActive ? "w-10 origin-left" : "w-0 group-hover:w-5 group-hover:origin-left",
                        )}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <Reveal delay={400} className="mt-9">
            <p className="text-muted max-w-md text-[0.85rem] leading-relaxed">{product.blurb[0]}</p>
            <TextLink
              to="/collections/$slug"
              params={{ slug: product.slug }}
              className="mt-6 inline-block"
            >
              {`View ${product.name}`}
            </TextLink>
          </Reveal>
        </div>

        {/* ---- The rug ---- */}
        <Reveal delay={160} className="relative">
          <RugViewer
            key={product.slug}
            product={product}
            className="aspect-[5/4] w-full lg:aspect-[6/5]"
          />
          <p className="micro mt-2 text-center lg:mt-0">Move your cursor across the rug</p>
        </Reveal>
      </div>
    </section>
  );
}
