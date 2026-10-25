import { useEffect, useState } from "react";
import { Figure } from "@/components/primitives/Figure";
import { Icon } from "@/components/primitives/Icon";
import { GhostLink, GoldLink } from "@/components/primitives/ui";
import { MaskedHeading, Parallax, Reveal } from "@/components/primitives/motion";
import { HERO_USPS, SITE } from "@/data/site";

/**
 * Full-height opening frame.
 *
 * The photograph runs to the right and bottom edges of the viewport while the
 * type sits on the ivory ground beside it, overlapping the image slightly so
 * the two planes read as layered rather than tiled. Everything above the fold
 * is prerendered; only the drift and the line reveals are scripted.
 */
export function Hero() {
  return (
    <section
      className="grain relative isolate overflow-hidden"
      aria-labelledby="hero-title"
    >
      <div className="relative grid min-h-[46rem] lg:min-h-[94vh] lg:grid-cols-[minmax(0,0.98fr)_minmax(0,1.02fr)]">
        {/* ---- Photograph ---- */}
        <div className="relative order-1 min-h-[22rem] lg:order-2 lg:min-h-full">
          <Parallax speed={0.22} className="absolute inset-0">
            <Figure
              slot="hero-room"
              alt="A light-filled living room furnished with a Shivora Living carpet"
              className="h-full w-full rounded-bl-[7rem] lg:rounded-bl-[11rem]"
              sizes="(max-width: 1024px) 100vw, 56vw"
              priority
            />
          </Parallax>

          {/* Ivory falloff where the image meets the type, so the headline
              always has a quiet ground to sit on. */}
          <div
            aria-hidden="true"
            className="from-ivory via-ivory/45 pointer-events-none absolute inset-y-0 -left-px hidden w-56 bg-gradient-to-r to-transparent lg:block"
          />
          <div
            aria-hidden="true"
            className="from-ivory pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t to-transparent lg:hidden"
          />
        </div>

        {/* ---- Type ---- */}
        <div className="relative z-10 order-2 flex flex-col justify-center py-14 lg:order-1 lg:py-0">
          <div className="shell lg:ml-auto lg:mr-0 lg:max-w-none lg:pr-0 lg:pl-[max(var(--gutter),calc((100vw-var(--shell-max))/2+var(--gutter)))]">
            <Reveal variant="bare" className="lg:-mr-24">
              <div className="mb-7 flex items-center gap-4">
                <span className="bg-gold-soft rule-draw h-px w-14 origin-left" />
                <p className="eyebrow">{SITE.name}</p>
              </div>

              <MaskedHeading
                as="h1"
                id="hero-title"
                lines={["Beyond", "Expectations"]}
                accent={[1]}
                className="display-xl"
              />
            </Reveal>

            <Reveal delay={420} className="mt-9">
              <p className="prose-lux max-w-md">{SITE.strapline} crafted for luxurious spaces.</p>

              {/* Sits outside the measure so the two buttons stay on one line. */}
              <div className="mt-10 flex flex-wrap gap-3">
                <GoldLink to="/collections">Explore Collections</GoldLink>
                <GhostLink to="/custom-solutions">Custom Solutions</GhostLink>
              </div>
            </Reveal>
          </div>

          {/* Soft ivory bloom behind the headline adds depth without a box. */}
          <div
            aria-hidden="true"
            className="bg-ivory-deep/60 pointer-events-none absolute -top-32 -left-52 -z-10 h-[38rem] w-[38rem] rounded-full blur-[110px]"
          />
        </div>

        <ScrollCue />
      </div>

      {/* ---- Promises ---- */}
      <UspStrip />
    </section>
  );
}

/**
 * The four promises, as a hairline-divided strip rather than a floating card.
 * It reads as part of the page's architecture instead of a sticker on top of
 * the photograph.
 */
function UspStrip() {
  return (
    <div className="border-line/80 bg-shell/70 relative z-10 border-y backdrop-blur-sm">
      {/* Dividers are declared per breakpoint rather than with `divide-x`,
          which in a wrapping grid also rules the first cell of each new row. */}
      <ul className="shell grid sm:grid-cols-2 lg:grid-cols-4">
        {HERO_USPS.map((usp, i) => (
          <li
            key={usp.title}
            className="border-line/70 border-b last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0 sm:[&:nth-child(2n)]:border-l lg:border-b-0 lg:[&:nth-child(2n)]:border-l-0 lg:[&:not(:first-child)]:border-l"
          >
            <Reveal delay={i * 90} className="flex h-full gap-4 px-1 py-7 sm:px-7">
              <Icon name={usp.icon} className="text-gold mt-1 h-5 w-5 shrink-0" />
              <div>
                <p className="text-ink text-[0.66rem] tracking-[0.2em] uppercase">{usp.title}</p>
                <p className="text-muted mt-2 text-[0.8rem] leading-relaxed">{usp.body}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Fades out as soon as the visitor starts scrolling — it has done its job. */
function ScrollCue() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const onScroll = () => setGone(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`absolute bottom-10 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-3 transition-opacity duration-700 lg:flex ${
        gone ? "opacity-0" : "opacity-100"
      }`}
    >
      <span className="flex h-10 w-[1.35rem] justify-center rounded-full border border-white/70 pt-2 backdrop-blur-sm">
        <span
          className="h-1.5 w-[2px] rounded-full bg-white"
          style={{ animation: "scroll-nudge 2.2s var(--ease-lux) infinite" }}
        />
      </span>
      <span className="text-[0.55rem] tracking-[0.4em] text-white/90 uppercase drop-shadow">
        Scroll
      </span>
    </div>
  );
}
