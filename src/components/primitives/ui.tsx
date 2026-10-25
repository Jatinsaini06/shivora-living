import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { MaskedHeading } from "./motion";

const BASE =
  "group relative inline-flex items-center gap-3.5 overflow-hidden px-8 py-4 text-[0.64rem] font-normal uppercase tracking-[0.26em] transition-colors duration-600";

type LinkLike = {
  to?: string;
  params?: Record<string, string>;
  href?: string;
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<"a">, "href">;

/** Filled champagne button — the primary call to action. */
export function GoldLink({ to, params, href, children, className, ...rest }: LinkLike) {
  const inner = (
    <>
      {/* A slow sheen crosses the fill on hover, like light over leaf. */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[240%]" />
      <span className="relative">{children}</span>
      <ArrowRight
        className="relative h-3 w-3 transition-transform duration-600 group-hover:translate-x-1.5"
        strokeWidth={1.5}
      />
    </>
  );

  const cls = cn(BASE, "bg-gold text-white hover:bg-gold-deep", className);

  if (to) {
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Link to={to as any} params={params as any} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <a href={href} className={cls} {...rest}>
      {inner}
    </a>
  );
}

/** Hairline button — the secondary call to action. */
export function GhostLink({ to, params, href, children, className, ...rest }: LinkLike) {
  const inner = (
    <>
      {/* Champagne wash fills from the bottom on hover. */}
      <span className="bg-gold-tint pointer-events-none absolute inset-x-0 bottom-0 h-0 transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:h-full" />
      <span className="relative">{children}</span>
      <ArrowRight
        className="relative h-3 w-3 transition-transform duration-600 group-hover:translate-x-1.5"
        strokeWidth={1.5}
      />
    </>
  );

  const cls = cn(BASE, "border-line text-ink hover:border-gold-soft hover:text-gold-deep border", className);

  if (to) {
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Link to={to as any} params={params as any} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <a href={href} className={cls} {...rest}>
      {inner}
    </a>
  );
}

/** Underlined text link that draws its rule from the left on hover. */
export function TextLink({ to, params, href, children, className, ...rest }: LinkLike) {
  const cls = cn(
    "link-rule text-gold hover:text-gold-deep text-[0.64rem] tracking-[0.26em] uppercase transition-colors duration-500",
    className,
  );
  if (to) {
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Link to={to as any} params={params as any} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={cls} {...rest}>
      {children}
    </a>
  );
}

/** Small circular arrow used on collection cards. */
export function ArrowPill({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "border-line text-gold group-hover:border-gold group-hover:bg-gold flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-600 group-hover:text-white",
        className,
      )}
    >
      <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.4} />
    </span>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("eyebrow", className)}>{children}</p>;
}

/**
 * Eyebrow preceded by a rule that draws itself in — the standard opening
 * gesture for every section on the site.
 */
export function SectionMark({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span className="bg-gold-soft rule-draw h-px w-12 origin-left" />
      <p className="eyebrow">{children}</p>
    </div>
  );
}

/**
 * Section heading pair. Lines are masked and rise in sequence; pass `accent`
 * to set which of them are drawn in the champagne italic.
 */
export function SectionHeading({
  eyebrow,
  lines,
  accent,
  className,
  id,
  align = "left",
}: {
  eyebrow?: string;
  lines: string[];
  accent?: number[];
  className?: string;
  id?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow ? (
        <SectionMark className={cn("mb-6", align === "center" && "justify-center")}>
          {eyebrow}
        </SectionMark>
      ) : null}
      <MaskedHeading id={id} lines={lines} accent={accent} className="display-lg" />
    </div>
  );
}

/** Thin gold rule with a lozenge at its centre. */
export function Divider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)} aria-hidden="true">
      <span className="rule-gold w-16" />
      <span className="bg-gold-soft h-1 w-1 rotate-45" />
      <span className="rule-gold w-16" />
    </div>
  );
}
