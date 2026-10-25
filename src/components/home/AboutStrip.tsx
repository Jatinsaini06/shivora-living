import { Figure } from "@/components/primitives/Figure";
import { SectionHeading, TextLink } from "@/components/primitives/ui";
import { Parallax, Reveal } from "@/components/primitives/motion";
import { ABOUT_PARAGRAPHS, SITE } from "@/data/site";

export function AboutStrip() {
  return (
    <section className="bg-shell band" aria-labelledby="about-title">
      <div className="shell grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
        {/* Two offset planes give the image block real depth. Each plate
            uncovers itself; the wrapper stays unclipped so the smaller plate
            can overhang the larger one. */}
        <div className="relative">
          <Reveal variant="veil">
            <Parallax speed={0.1}>
              <Figure
                slot="about-room"
                alt="A sunlit living room with a soft carpet underfoot"
                className="aspect-[4/5] w-full"
                sizes="(max-width: 1024px) 90vw, 42vw"
              />
            </Parallax>
          </Reveal>

          {/* The white mat sits outside the veil so the curtain never crops it. */}
          <Parallax
            speed={-0.18}
            className="lift absolute -right-3 -bottom-12 w-[44%] bg-white p-2.5 sm:-right-8 lg:-right-12"
          >
            <Reveal variant="veil" delay={260}>
              <Figure
                slot="woolen-c"
                alt="Woolen carpet swatches in ochre, ivory and grey"
                className="aspect-square w-full"
                sizes="(max-width: 1024px) 40vw, 18vw"
              />
            </Reveal>
          </Parallax>

          {/* Thin champagne frame, offset behind the main plate. */}
          <span
            aria-hidden="true"
            className="border-gold-soft/50 pointer-events-none absolute -top-5 -left-5 hidden h-[70%] w-[45%] border-t border-l lg:block"
          />
        </div>

        <div>
          <Reveal variant="bare">
            <SectionHeading
              id="about-title"
              eyebrow="About Shivora Living"
              lines={["The canvas of", "a room's luxury"]}
              accent={[1]}
            />
          </Reveal>

          <Reveal delay={220}>
            <div className="prose-lux mt-8 space-y-6">
              {ABOUT_PARAGRAPHS.slice(0, 2).map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>

            <p className="font-script text-gold mt-10 text-[2.6rem] leading-none">{SITE.tagline}</p>

            <TextLink to="/about" className="mt-9 inline-block">
              Our story
            </TextLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
