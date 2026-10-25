import { Link } from "@tanstack/react-router";
import { Figure } from "@/components/primitives/Figure";
import { MaskedHeading, Parallax, Reveal } from "@/components/primitives/motion";
import { SectionMark } from "@/components/primitives/ui";

interface Crumb {
  label: string;
  to?: string;
  params?: Record<string, string>;
}

/**
 * Shared masthead for every page below the homepage.
 *
 * A very pale parallaxed photograph sits behind the type — enough to give the
 * band depth and colour without ever competing with the heading.
 */
export function PageHeader({
  eyebrow,
  title,
  lines,
  accent,
  lead,
  slot,
  crumbs = [],
}: {
  eyebrow: string;
  /** Single-line title. Use `lines` instead for a masked multi-line heading. */
  title?: string;
  lines?: string[];
  accent?: number[];
  lead?: string;
  slot?: string;
  crumbs?: Crumb[];
}) {
  const headingLines = lines ?? (title ? [title] : []);

  return (
    <section className="grain relative isolate overflow-hidden pt-[clamp(9rem,15vw,13rem)] pb-[clamp(3.5rem,7vw,6rem)]">
      {slot ? (
        <>
          <Parallax speed={0.22} className="absolute inset-0 -z-20 scale-110">
            <Figure slot={slot} alt="" className="h-full w-full" sizes="100vw" priority />
          </Parallax>
          <div aria-hidden="true" className="bg-ivory/[0.93] absolute inset-0 -z-10" />
        </>
      ) : null}

      <div className="shell">
        {crumbs.length ? (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="text-muted flex flex-wrap items-center gap-2 text-[0.6rem] tracking-[0.24em] uppercase">
              {crumbs.map((crumb, i) => (
                <li key={crumb.label} className="flex items-center gap-2">
                  {i > 0 ? <span className="text-line">&mdash;</span> : null}
                  {crumb.to ? (
                    <Link
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      to={crumb.to as any}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      params={crumb.params as any}
                      className="hover:text-gold transition-colors duration-500"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-ink">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <Reveal variant="bare">
          <SectionMark className="mb-6">{eyebrow}</SectionMark>
          <MaskedHeading
            as="h1"
            lines={headingLines}
            accent={accent}
            className="display-lg max-w-4xl"
          />
        </Reveal>

        {lead ? (
          <Reveal delay={260}>
            <p className="prose-lux mt-8 max-w-2xl">{lead}</p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
