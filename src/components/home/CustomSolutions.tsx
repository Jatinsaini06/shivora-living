import { Figure } from "@/components/primitives/Figure";
import { Icon } from "@/components/primitives/Icon";
import { GoldLink, SectionHeading } from "@/components/primitives/ui";
import { Reveal, useScrollProgress } from "@/components/primitives/motion";
import { CUSTOM_HEADLINE, CUSTOM_SOLUTIONS } from "@/data/capabilities";

/** The four samples that make up the fanned stack, back to front. */
const LAYERS = [
  { slot: "custom-c", alt: "Bespoke carpet sample detail" },
  { slot: "custom-d", alt: "Custom themed carpet in production" },
  { slot: "custom-b", alt: "Custom carpet sample in warm earth tones" },
  { slot: "custom-a", alt: "Yarn poms and swatches laid out for a bespoke selection" },
];

export function CustomSolutions() {
  return (
    <section
      className="bg-ivory-deep band relative isolate overflow-hidden"
      aria-labelledby="custom-title"
    >
      <div className="shell">
        <div className="grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* ---- Copy ---- */}
          <div>
            <Reveal variant="bare">
              <SectionHeading
                id="custom-title"
                eyebrow="Custom Carpet Solutions"
                lines={["Your Vision,", "Our Craftsmanship"]}
                accent={[1]}
              />
            </Reveal>

            <Reveal delay={220}>
              <p className="prose-lux mt-7">
                Bring your unique ideas to life with custom carpets tailored in size, colour,
                pattern and texture.
              </p>
              <p className="text-gold-deep font-display mt-7 max-w-sm text-[1.2rem] leading-snug italic">
                {CUSTOM_HEADLINE}.
              </p>
              <GoldLink to="/custom-solutions" className="mt-9">
                Start your custom project
              </GoldLink>
            </Reveal>
          </div>

          {/* ---- Fanned samples ---- */}
          <SampleStack />
        </div>

        {/* ---- Capabilities ------------------------------------------------
            A centred hairline band rather than a grid: seven items never
            divide evenly into a column count, and a part-empty last row reads
            as a mistake. Flowing them keeps every breakpoint clean. */}
        <Reveal className="border-line/70 mt-24 border-y py-9">
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
            {CUSTOM_SOLUTIONS.map((item) => (
              <li key={item.title} className="group flex items-center gap-3">
                <Icon
                  name={item.icon}
                  className="text-gold h-4 w-4 shrink-0 transition-transform duration-600 group-hover:scale-115"
                />
                <span className="text-ink-soft group-hover:text-gold text-[0.72rem] tracking-[0.16em] uppercase transition-colors duration-500">
                  {item.title}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * Four carpet samples fanned in 3D, spreading a little further apart as the
 * section travels through the viewport — swatches laid out on a designer's
 * table. The tilt is deliberately shallow: a steep angle turns each plate into
 * a parallelogram and the set reads as a pile rather than a sequence.
 */
function SampleStack() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();

  // Ease the separation so the layers settle rather than track linearly.
  const spread = Math.sin(Math.min(1, Math.max(0, progress)) * Math.PI);

  return (
    <div ref={ref} className="flex justify-center py-4" aria-hidden="true">
      <div
        className="relative h-[21rem] w-full max-w-[27rem] sm:h-[25rem]"
        style={{ perspective: "1600px", perspectiveOrigin: "50% 50%" }}
      >
        {LAYERS.map((layer, i) => {
          // 0 for the backmost plate, 3 for the one nearest the viewer.
          const rise = i * (26 + spread * 20);
          const shift = i * (14 + spread * 10);
          return (
            <div
              key={layer.slot}
              className="absolute inset-x-0 top-1/2"
              style={{
                transform: `translate(-50%, -50%) translate3d(${shift - 20}px, ${-rise + 40}px, ${i * 34}px) rotateX(15deg) rotateZ(${-7 + i * 2}deg)`,
                left: "50%",
                width: "88%",
                transformStyle: "preserve-3d",
                transition: "transform 320ms linear",
                zIndex: i + 1,
              }}
            >
              <div className="bg-white p-2 shadow-[0_34px_60px_-32px_rgba(31,29,26,0.5)]">
                <Figure
                  slot={layer.slot}
                  alt={layer.alt}
                  className="aspect-[7/5] w-full"
                  sizes="(max-width: 640px) 80vw, 27rem"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
