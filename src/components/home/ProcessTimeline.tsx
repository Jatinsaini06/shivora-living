import { Figure } from "@/components/primitives/Figure";
import { SectionHeading } from "@/components/primitives/ui";
import { Reveal, useScrollProgress } from "@/components/primitives/motion";
import { PROCESS_CALLOUTS, PROCESS_INTRO, PROCESS_STAGES } from "@/data/capabilities";

/**
 * The six manufacturing stages as numbered discs on a hairline that draws
 * itself in as the band travels up the viewport. Each disc lights in turn as
 * the line reaches it.
 */
export function ProcessTimeline() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();

  // The line starts drawing once the band is properly in view.
  const fill = Math.min(1, Math.max(0, (progress - 0.2) / 0.46));

  return (
    <section
      ref={ref}
      className="bg-ivory grain relative isolate overflow-hidden band"
      aria-labelledby="process-title"
    >
      <div className="shell">
        <Reveal variant="bare" className="max-w-2xl">
          <SectionHeading
            id="process-title"
            eyebrow="Manufacturing Process"
            lines={["From Concept", "To Creation"]}
            accent={[1]}
          />
          <p className="prose-lux mt-7">{PROCESS_INTRO}</p>
        </Reveal>

        <div className="relative mt-20">
          {/* Track + progress fill, behind the discs. */}
          <div
            aria-hidden="true"
            className="bg-line absolute top-[2.3rem] right-10 left-10 hidden h-px lg:block"
          >
            <div
              className="bg-gold h-px origin-left transition-transform duration-300 ease-out"
              style={{ transform: `scaleX(${fill})` }}
            />
          </div>

          <ol className="relative grid gap-14 sm:grid-cols-2 lg:grid-cols-6 lg:gap-6">
            {PROCESS_STAGES.map((stage, i) => {
              const reached = fill >= i / (PROCESS_STAGES.length - 1) - 0.02;
              return (
                <li key={stage.step} className="flex flex-col items-center text-center">
                  <Reveal delay={i * 80} className="flex w-full flex-col items-center">
                    <StageDisc step={stage.step} active={reached} />

                    <Figure
                      slot={stage.slot}
                      alt={stage.alt}
                      className="ring-line/60 mt-8 aspect-square w-[6.5rem] rounded-full ring-1"
                      imgClassName="rounded-full"
                      sizes="7rem"
                    />

                    <h3 className="text-ink mt-6 text-[0.64rem] tracking-[0.24em] uppercase">
                      {stage.title}
                    </h3>

                    {stage.body ? (
                      <p className="text-muted mt-3 text-[0.76rem] leading-relaxed">{stage.body}</p>
                    ) : null}
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Two standalone claims the catalogue prints alongside the stages. */}
        <Reveal className="mt-20 flex flex-wrap items-center justify-center gap-4">
          <span className="rule-gold hidden w-20 sm:block" />
          {PROCESS_CALLOUTS.map((callout) => (
            <span
              key={callout.label}
              className="border-gold-soft/50 text-gold-deep rounded-full border bg-white/60 px-7 py-3 text-[0.6rem] tracking-[0.3em] uppercase backdrop-blur-sm"
            >
              {callout.label}
            </span>
          ))}
          <span className="rule-gold hidden w-20 sm:block" />
        </Reveal>
      </div>
    </section>
  );
}

/** Numbered disc sitting on a soft cast shadow. */
function StageDisc({ step, active }: { step: string; active: boolean }) {
  return (
    <span className="relative flex flex-col items-center" aria-hidden="true">
      <span
        className={[
          "font-display relative z-10 flex h-[4.6rem] w-[4.6rem] items-center justify-center rounded-full border text-[1.6rem] transition-all duration-[900ms]",
          active
            ? "border-gold-soft text-gold bg-white shadow-[0_18px_38px_-20px_rgba(171,133,82,0.75)]"
            : "border-line text-muted bg-white/60",
        ].join(" ")}
      >
        {step}
      </span>
      {/* A single soft ellipse grounds the disc without the crude pedestal. */}
      <span
        className={[
          "-mt-2 h-2 w-[3rem] rounded-[100%] blur-[3px] transition-all duration-[900ms]",
          active ? "bg-gold-soft/55" : "bg-line/70",
        ].join(" ")}
      />
    </span>
  );
}
