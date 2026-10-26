import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Figure } from "@/components/primitives/Figure";
import { Icon } from "@/components/primitives/Icon";
import { GhostLink, GoldLink, SectionHeading, SectionMark } from "@/components/primitives/ui";
import { MaskedHeading, Reveal } from "@/components/primitives/motion";
import { CUSTOM_HEADLINE, CUSTOM_SOLUTIONS } from "@/data/capabilities";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/custom-solutions")({
  head: () => ({
    meta: [
      { title: `Custom Carpet Solutions | ${SITE.name}` },
      {
        name: "description",
        content:
          "Custom sizes, custom colours, custom patterns, designer rugs, hotel projects, CAD design and bulk orders. We can manufacture any carpet according to your requirements.",
      },
    ],
  }),
  component: CustomSolutionsPage,
});

/** Bespoke work in progress, shown at four different scales. */
const SHOWCASE = [
  { slot: "custom-a", alt: "Yarn poms and material swatches laid out for a bespoke selection" },
  { slot: "custom-d", alt: "A custom carpet being tufted by hand" },
  { slot: "custom-b", alt: "Custom carpet samples in warm earth tones" },
  { slot: "custom-c", alt: "Bespoke carpet sample detail" },
];

function CustomSolutionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Custom Carpet Solutions"
        lines={["Your Vision,", "Our Craftsmanship"]}
        accent={[1]}
        lead={`${CUSTOM_HEADLINE}. We collaborate closely with you to transform a unique vision into a tailored masterpiece — working through your colour palette, desired design and required dimensions.`}
        slot="custom-a"
        crumbs={[{ label: "Home", to: "/" }, { label: "Custom Solutions" }]}
      />

      <section className="band-b pt-[clamp(3.5rem,6vw,6rem)]" aria-label="What we can customise">
        <div className="shell">
          <ul className="border-line/70 grid border-t sm:grid-cols-2 lg:grid-cols-4">
            {CUSTOM_SOLUTIONS.map((item, i) => (
              <li
                key={item.title}
                className="border-line/70 group relative overflow-hidden border-b sm:max-lg:[&:nth-child(2n)]:border-l lg:[&:not(:nth-child(4n+1))]:border-l"
              >
                <Reveal delay={(i % 4) * 80} className="h-full">
                  <article className="relative flex h-full flex-col gap-6 px-1 py-10 sm:px-8">
                    <span className="from-gold-tint pointer-events-none absolute inset-x-0 bottom-0 h-0 bg-gradient-to-t to-transparent transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:h-full" />
                    <div className="relative flex items-center justify-between">
                      <Icon name={item.icon} className="text-gold h-6 w-6" />
                      <span className="text-gold-soft/45 font-display text-3xl leading-none">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h2 className="display-md group-hover:text-gold relative text-[1.4rem] transition-colors duration-600">
                      {item.title}
                    </h2>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-shell band" aria-labelledby="bespoke-gallery">
        <div className="shell">
          <Reveal variant="bare" className="max-w-2xl">
            <SectionHeading
              id="bespoke-gallery"
              eyebrow="In the workshop"
              lines={["From blueprint", "to handover"]}
              accent={[1]}
            />
            <p className="prose-lux mt-7">
              Our team works closely with you from initial blueprints to final handover for seamless
              execution.
            </p>
          </Reveal>

          <ul className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {SHOWCASE.map((image, i) => (
              <li key={image.slot} className={i % 2 === 1 ? "lg:mt-14" : undefined}>
                <Reveal variant="veil" delay={i * 100}>
                  <div className="group bg-sand overflow-hidden">
                    <Figure
                      slot={image.slot}
                      alt={image.alt}
                      className="aspect-[3/4] w-full"
                      imgClassName="kenburns"
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 23vw"
                    />
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band" aria-label="Start a custom project">
        <div className="shell max-w-3xl! text-center">
          <Reveal variant="bare">
            <SectionMark className="mb-7 justify-center">Start a project</SectionMark>
            <MaskedHeading
              lines={["Tell us the palette,", "design and dimensions"]}
              accent={[1]}
              className="display-lg"
            />
          </Reveal>
          <Reveal delay={260}>
            <p className="prose-lux mx-auto mt-7 text-center">
              Send us your requirement and we will come back with a specification and quotation for
              your project.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <GoldLink to="/contact">Start your custom project</GoldLink>
              <GhostLink
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                WhatsApp us
              </GhostLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
