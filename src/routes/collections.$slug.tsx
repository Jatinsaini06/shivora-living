import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Mail, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Figure } from "@/components/primitives/Figure";
import { RugViewer } from "@/components/three/RugViewer";
import { GhostLink, GoldLink, SectionMark } from "@/components/primitives/ui";
import { Reveal } from "@/components/primitives/motion";
import { adjacentProducts, getProduct, PRODUCTS } from "@/data/products";
import { CUSTOM_SOLUTIONS } from "@/data/capabilities";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/collections/$slug")({
  // Only the slug crosses the SSR boundary. The product is looked up from the
  // local catalogue on both sides, which keeps the payload small and preserves
  // object identity — a deserialised copy would make `indexOf` return -1 on
  // the client and break hydration.
  loader: ({ params }) => {
    if (!getProduct(params.slug)) throw notFound();
    return { slug: params.slug };
  },
  head: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) return {};
    return {
      meta: [
        { title: `${product.displayName} | ${SITE.name}` },
        { name: "description", content: product.blurb.join(" ") },
        { property: "og:title", content: `${product.displayName} | ${SITE.name}` },
        { property: "og:description", content: product.blurb[0] },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.displayName,
            description: product.blurb.join(" "),
            brand: { "@type": "Brand", name: SITE.name },
            category: "Carpets & Rugs",
            url: `${SITE.url}/collections/${product.slug}`,
          }),
        },
      ],
    };
  },
  component: CollectionDetail,
});

function CollectionDetail() {
  const { slug } = Route.useLoaderData();
  const product = getProduct(slug)!;
  const { prev, next } = adjacentProducts(slug);
  const position = PRODUCTS.findIndex((p) => p.slug === slug) + 1;

  const enquiry = encodeURIComponent(
    `Hello Shivora Living, I would like to enquire about your ${product.displayName}.`,
  );

  return (
    <>
      <PageHeader
        eyebrow={`Collection ${String(position).padStart(2, "0")} of ${PRODUCTS.length}`}
        lines={[product.displayName]}
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Collections", to: "/collections" },
          { label: product.name },
        ]}
      />

      {/* ---- Viewer + copy ---- */}
      <section className="pb-[clamp(4rem,8vw,7rem)]" aria-label={`${product.displayName} overview`}>
        <div className="shell grid items-start gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <Reveal className="relative">
            {/* Champagne bloom anchors the rug on the ivory ground. */}
            <div
              aria-hidden="true"
              className="bg-gold-tint absolute inset-10 -z-10 rounded-full opacity-80 blur-[110px]"
            />
            <RugViewer product={product} className="aspect-[5/4] w-full" />
            <p className="micro mt-1 text-center">Interactive preview — move your cursor</p>
          </Reveal>

          <Reveal delay={140}>
            <div className="prose-lux space-y-6">
              {product.blurb.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>

            <SectionMark className="mt-12">Specifications</SectionMark>

            <dl className="border-line/70 mt-6 border-t">
              {product.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="border-line/70 flex items-baseline justify-between gap-6 border-b py-3.5"
                >
                  <dt className="text-ink-soft text-[0.82rem]">{spec.label}</dt>
                  <dd
                    className={
                      spec.value
                        ? "text-ink text-right text-[0.85rem]"
                        : "text-muted text-right text-[0.6rem] tracking-[0.24em] uppercase"
                    }
                  >
                    {/* Every carpet is made to order, so unlisted values are
                        quoted per project rather than published. */}
                    {spec.value ?? "On request"}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="text-muted mt-5 max-w-md text-[0.78rem] leading-relaxed">
              Made to order. Share your palette, design and dimensions and we will confirm the full
              specification with your quotation.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <GoldLink
                href={`https://wa.me/${SITE.whatsapp}?text=${enquiry}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                <span className="flex items-center gap-2.5">
                  <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Enquire on WhatsApp
                </span>
              </GoldLink>
              <GhostLink
                href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Enquiry — ${product.displayName}`)}`}
              >
                <span className="flex items-center gap-2.5">
                  <Mail className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Email us
                </span>
              </GhostLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- Gallery ---- */}
      {product.images.length > 1 ? (
        <section className="bg-shell band" aria-label={`${product.displayName} gallery`}>
          <div className="shell">
            <Reveal variant="bare">
              <SectionMark className="mb-6">Gallery</SectionMark>
              <h2 className="display-lg">Seen in place</h2>
            </Reveal>

            <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {product.images.map((image, i) => (
                <li key={image.slot} className={i % 3 === 1 ? "lg:mt-14" : undefined}>
                  <Reveal variant="veil" delay={i * 110}>
                    <div className="group bg-sand overflow-hidden">
                      <Figure
                        slot={image.slot}
                        alt={image.alt}
                        className="aspect-[4/5] w-full"
                        imgClassName="kenburns"
                        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                      />
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ---- Customisation reminder ---- */}
      <section className="band" aria-label="Customisation options">
        <div className="shell">
          <Reveal variant="bare" className="max-w-2xl">
            <SectionMark className="mb-6">Made your way</SectionMark>
            <h2 className="display-lg">
              Every collection can be <span className="text-gold italic">customised</span>
            </h2>
            <p className="prose-lux mt-7">
              We can manufacture any carpet according to your requirements — matching your colour
              palette, desired design and exact dimensions.
            </p>
          </Reveal>

          <Reveal className="border-line/70 mt-12 border-y py-8">
            <ul className="flex flex-wrap items-center gap-x-10 gap-y-4 sm:gap-x-14">
              {CUSTOM_SOLUTIONS.map((item) => (
                <li
                  key={item.title}
                  className="text-ink-soft hover:text-gold text-[0.7rem] tracking-[0.18em] uppercase transition-colors duration-500"
                >
                  {item.title}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="mt-10">
            <GhostLink to="/custom-solutions">Custom solutions</GhostLink>
          </Reveal>
        </div>
      </section>

      {/* ---- Prev / next ---- */}
      <nav aria-label="More collections" className="border-line border-t">
        <div className="grid sm:grid-cols-2">
          {prev ? (
            <Link
              to="/collections/$slug"
              params={{ slug: prev.slug }}
              className="group hover:bg-ivory-deep border-line flex items-center gap-5 px-[var(--gutter)] py-11 transition-colors duration-600 sm:border-r"
            >
              <ArrowLeft className="text-gold h-4 w-4 shrink-0 transition-transform duration-600 group-hover:-translate-x-2" />
              <span>
                <span className="micro block">Previous</span>
                <span className="font-display group-hover:text-gold mt-1.5 block text-2xl transition-colors duration-600">
                  {prev.displayName}
                </span>
              </span>
            </Link>
          ) : null}
          {next ? (
            <Link
              to="/collections/$slug"
              params={{ slug: next.slug }}
              className="group hover:bg-ivory-deep flex items-center justify-end gap-5 px-[var(--gutter)] py-11 text-right transition-colors duration-600"
            >
              <span>
                <span className="micro block">Next</span>
                <span className="font-display group-hover:text-gold mt-1.5 block text-2xl transition-colors duration-600">
                  {next.displayName}
                </span>
              </span>
              <ArrowRight className="text-gold h-4 w-4 shrink-0 transition-transform duration-600 group-hover:translate-x-2" />
            </Link>
          ) : null}
        </div>
      </nav>
    </>
  );
}
