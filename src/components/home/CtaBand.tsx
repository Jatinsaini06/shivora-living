import { Figure } from "@/components/primitives/Figure";
import { Divider, GhostLink, GoldLink } from "@/components/primitives/ui";
import { MaskedHeading, Parallax, Reveal } from "@/components/primitives/motion";
import { SITE } from "@/data/site";

/** Closing call to action, set over a parallaxed room photograph. */
export function CtaBand() {
  return (
    <section className="relative isolate overflow-hidden" aria-labelledby="cta-title">
      <Parallax speed={0.26} className="absolute inset-0 -z-20 scale-[1.15]">
        <Figure slot="hero-room" alt="" className="h-full w-full" sizes="100vw" />
      </Parallax>

      {/* Ivory veil keeps the type readable and the mood light. */}
      <div aria-hidden="true" className="bg-ivory/[0.9] absolute inset-0 -z-10 backdrop-blur-[3px]" />

      <div className="shell max-w-3xl! band text-center">
        <Reveal variant="bare">
          <Divider className="mb-9 justify-center" />
          <MaskedHeading
            id="cta-title"
            lines={["Let's weave something", "made only for you"]}
            accent={[1]}
            className="display-lg"
          />
        </Reveal>

        <Reveal delay={280}>
          <p className="prose-lux mx-auto mt-7 text-center">
            Share your colour palette, design and dimensions. We will take it from blueprint to
            handover.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <GoldLink to="/contact">Request a quote</GoldLink>
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
  );
}
