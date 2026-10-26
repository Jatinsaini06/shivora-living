import { Icon } from "@/components/primitives/Icon";
import { SectionHeading } from "@/components/primitives/ui";
import { Reveal } from "@/components/primitives/motion";
import { WHY_CHOOSE_US } from "@/data/site";

/**
 * The six promises, set as an editorial grid divided by hairlines rather than
 * boxed into cards. Each cell fills with a champagne wash on hover.
 */
export function WhyChooseUs() {
  return (
    <section className="bg-shell band" aria-labelledby="why-title">
      <div className="shell">
        <Reveal variant="bare" className="max-w-2xl">
          <SectionHeading
            id="why-title"
            eyebrow="Why Choose Us"
            lines={["Six reasons the", "difference shows"]}
            accent={[1]}
          />
        </Reveal>

        <ul className="border-line/70 mt-16 grid border-t sm:grid-cols-2 lg:grid-cols-3">
          {WHY_CHOOSE_US.map((item, i) => (
            <li
              key={item.title}
              className="border-line/70 group relative overflow-hidden border-b sm:max-lg:[&:nth-child(2n)]:border-l lg:[&:not(:nth-child(3n+1))]:border-l"
            >
              <Reveal delay={(i % 3) * 90} className="h-full">
                <article className="relative flex h-full flex-col px-1 py-10 sm:px-9">
                  {/* Champagne wash rises through the cell on hover. */}
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
  );
}
