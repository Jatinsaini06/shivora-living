import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Figure } from "@/components/primitives/Figure";
import { ArrowPill } from "@/components/primitives/ui";
import { Reveal } from "@/components/primitives/motion";
import { CtaBand } from "@/components/home/CtaBand";
import { PRODUCTS } from "@/data/products";
import { SITE } from "@/data/site";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/collections/")({
  head: () => ({
    meta: [
      { title: `Collections — Carpets & Rugs | ${SITE.name}` },
      {
        name: "description",
        content:
          "Ten carpet and rug collections from Shivora Living: hand woven, hand tufted, cotton tufted, braided, jute, woolen, shaggy, abstract, hotel and custom theme carpets.",
      },
    ],
  }),
  component: CollectionsIndex,
});

function CollectionsIndex() {
  return (
    <>
      <PageHeader
        eyebrow="Our Collections"
        lines={["Crafted for", "Every Space"]}
        accent={[1]}
        lead="Discover our exclusive range of handcrafted carpets and rugs, designed to transform your interiors with elegance. Every collection is made to order and can be customised in size, colour and pattern."
        slot="collections-overview"
        crumbs={[{ label: "Home", to: "/" }, { label: "Collections" }]}
      />

      <section className="band-b pt-[clamp(3.5rem,6vw,6rem)]" aria-label="All collections">
        <div className="shell">
          {/* Alternating offsets give the grid an editorial cadence instead of
              a catalogue's uniform rows. */}
          <ul className="grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((product, i) => (
              <li
                key={product.slug}
                className={cn(
                  i % 3 === 1 && "lg:mt-16",
                  // A lone card on the last row sits in the centre column, not
                  // stranded at the left edge.
                  i === PRODUCTS.length - 1 && i % 3 === 0 && "lg:col-start-2",
                  i === PRODUCTS.length - 1 &&
                    i % 2 === 0 &&
                    "sm:max-lg:col-span-2 sm:max-lg:mx-auto sm:max-lg:w-1/2",
                )}
              >
                <Reveal delay={(i % 3) * 90}>
                  <Link
                    to="/collections/$slug"
                    params={{ slug: product.slug }}
                    className="group block"
                  >
                    <div className="bg-sand relative overflow-hidden">
                      <Figure
                        slot={product.images[0]?.slot ?? ""}
                        alt={product.images[0]?.alt ?? product.displayName}
                        className="aspect-[4/5] w-full"
                        imgClassName="kenburns"
                        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                      />
                      <span className="bg-gold-tint/0 group-hover:bg-gold-tint/12 pointer-events-none absolute inset-0 transition-colors duration-700" />
                      <span className="text-gold-deep absolute top-5 left-5 bg-white/90 px-3 py-1.5 text-[0.55rem] tracking-[0.28em] backdrop-blur-sm">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="mt-6 flex items-start justify-between gap-5">
                      <div>
                        <h2 className="display-md group-hover:text-gold text-[1.6rem] transition-colors duration-600">
                          <span className="link-rule inline">{product.displayName}</span>
                        </h2>
                        <p className="text-muted mt-2.5 max-w-xs text-[0.83rem] leading-relaxed">
                          {product.short}
                        </p>
                      </div>
                      <ArrowPill className="mt-1" />
                    </div>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
