import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Figure } from "@/components/primitives/Figure";
import { SectionMark } from "@/components/primitives/ui";
import { Reveal } from "@/components/primitives/motion";
import { CtaBand } from "@/components/home/CtaBand";
import { PROCESS_CALLOUTS, PROCESS_INTRO, PROCESS_STAGES } from "@/data/capabilities";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/process")({
  head: () => ({
    meta: [
      { title: `Manufacturing Process | ${SITE.name}` },
      { name: "description", content: PROCESS_INTRO },
    ],
  }),
  component: Process,
});

function Process() {
  return (
    <>
      <PageHeader
        eyebrow="Manufacturing Process"
        lines={["From Concept", "To Creation"]}
        accent={[1]}
        lead={PROCESS_INTRO}
        slot="room-scene"
        crumbs={[{ label: "Home", to: "/" }, { label: "Process" }]}
      />

      <section className="band-b pt-[clamp(3.5rem,6vw,6rem)]" aria-label="Manufacturing stages">
        <div className="shell">
          <ol>
            {PROCESS_STAGES.map((stage, i) => (
              <li key={stage.step} className="border-line/70 border-t last:border-b">
                <Reveal>
                  {/* Two equal columns that trade places each row. Ordering
                      must not change which grid *track* each child lands in,
                      so the columns stay uniform and only `order` flips. */}
                  <div className="grid items-center gap-10 py-14 lg:grid-cols-2 lg:gap-20">
                    <div className={i % 2 === 1 ? "lg:order-2" : undefined}>
                      <div className="flex items-baseline gap-6">
                        <span className="font-display text-gold-soft/70 text-[3.4rem] leading-none">
                          {stage.step}
                        </span>
                        <h2 className="display-md">{stage.title}</h2>
                      </div>
                      {/* Five of the six stages carry no description in the
                          catalogue. Rather than invent copy or print a visible
                          placeholder, the paragraph is simply omitted. */}
                      {stage.body ? <p className="prose-lux mt-6">{stage.body}</p> : null}
                    </div>

                    <figure
                      className={`group bg-sand overflow-hidden ${i % 2 === 1 ? "lg:order-1" : ""}`}
                    >
                      <Figure
                        slot={stage.slot}
                        alt={stage.alt}
                        className="aspect-[5/4] w-full"
                        imgClassName="kenburns"
                        sizes="(max-width: 1024px) 92vw, 44vw"
                      />
                    </figure>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-ivory-deep band-tight" aria-label="Quality commitments">
        <div className="shell text-center">
          <Reveal>
            <SectionMark className="justify-center">Our commitments</SectionMark>
            <ul className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <span aria-hidden="true" className="rule-gold hidden w-20 sm:block" />
              {PROCESS_CALLOUTS.map((callout) => (
                <li
                  key={callout.label}
                  className="border-gold-soft/50 text-gold-deep rounded-full border bg-white px-8 py-3.5 text-[0.6rem] tracking-[0.3em] uppercase"
                >
                  {callout.label}
                </li>
              ))}
              <span aria-hidden="true" className="rule-gold hidden w-20 sm:block" />
            </ul>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
