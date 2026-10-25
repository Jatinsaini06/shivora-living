import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Figure } from "@/components/primitives/Figure";
import { Icon } from "@/components/primitives/Icon";
import { SectionHeading } from "@/components/primitives/ui";
import { Parallax, Reveal } from "@/components/primitives/motion";
import { CtaBand } from "@/components/home/CtaBand";
import { ABOUT_PARAGRAPHS, SITE, WHY_CHOOSE_US } from "@/data/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About — Bespoke Carpet Manufacturer in Panipat | ${SITE.name}` },
      {
        name: "description",
        content:
          "Shivora Living curates an elite range of bespoke carpets for ultra-luxury hotels, grand commercial spaces and premium residential interiors, crafted in Panipat, Haryana.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHeader
        eyebrow="About Shivora Living"
        lines={["A carpet is not just a decor —", "it is the canvas of a room's luxury"]}
        accent={[1]}
        slot="about-room"
        crumbs={[{ label: "Home", to: "/" }, { label: "About Us" }]}
      />

      <section className="band-b" aria-label="Our story">
        <div className="shell grid items-start gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-24">
          <Reveal>
            <div className="prose-lux space-y-7">
              {ABOUT_PARAGRAPHS.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
            <p className="font-script text-gold mt-11 text-[2.8rem] leading-none">{SITE.tagline}</p>
          </Reveal>

          <div className="relative">
            <Reveal variant="veil">
              <Parallax speed={0.12}>
                <Figure
                  slot="custom-a"
                  alt="Yarn poms and material swatches laid out for a bespoke carpet selection"
                  className="aspect-[4/5] w-full"
                  sizes="(max-width: 1024px) 90vw, 42vw"
                />
              </Parallax>
            </Reveal>

            <Parallax
              speed={-0.16}
              className="lift absolute -bottom-12 -left-3 w-[46%] bg-white p-2.5 sm:-left-8 lg:-left-12"
            >
              <Reveal variant="veil" delay={260}>
                <Figure
                  slot="hand-woven-a"
                  alt="Close view of a cream hand-woven carpet"
                  className="aspect-square w-full"
                  sizes="(max-width: 1024px) 42vw, 19vw"
                />
              </Reveal>
            </Parallax>

            <span
              aria-hidden="true"
              className="border-gold-soft/50 pointer-events-none absolute -top-5 -right-5 hidden h-[65%] w-[45%] border-t border-r lg:block"
            />
          </div>
        </div>
      </section>

      <section className="bg-shell band" aria-labelledby="why-about">
        <div className="shell">
          <Reveal variant="bare" className="max-w-2xl">
            <SectionHeading
              id="why-about"
              eyebrow="Why Choose Us"
              lines={["What sets", "our work apart"]}
              accent={[1]}
            />
          </Reveal>

          <ul className="border-line/70 mt-16 grid border-t sm:grid-cols-2 lg:grid-cols-3">
            {WHY_CHOOSE_US.map((item, i) => (
              <li
                key={item.title}
                className="border-line/70 group relative overflow-hidden border-b sm:[&:nth-child(2n)]:border-l lg:[&:nth-child(2n)]:border-l-0 lg:[&:not(:nth-child(3n+1))]:border-l"
              >
                <Reveal delay={(i % 3) * 90} className="h-full">
                  <article className="relative flex h-full flex-col px-1 py-10 sm:px-9">
                    <span className="from-gold-tint pointer-events-none absolute inset-x-0 bottom-0 h-0 bg-gradient-to-t to-transparent transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:h-full" />
                    <div className="relative flex items-center justify-between">
                      <Icon name={item.icon} className="text-gold h-6 w-6" />
                      <span className="text-gold-soft/45 font-display text-3xl leading-none">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="display-md relative mt-7 text-[1.5rem]">{item.title}</h3>
                    <p className="text-muted relative mt-4 text-[0.85rem] leading-relaxed">
                      {item.body}
                    </p>
                  </article>
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
