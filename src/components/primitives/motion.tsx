import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** True once mounted in the browser. Keeps WebGL and matchMedia out of SSR. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger in milliseconds. */
  delay?: number;
  /**
   * "lift" fades and rises — the default, for text and cards.
   * "veil" uncovers a photograph with a curtain wipe and settles it back
   * from a slight overscale.
   * "bare" adds no animation of its own; use it as the trigger for children
   * that animate off the `.is-in` class, such as masked headings.
   */
  variant?: "lift" | "veil" | "bare";
}

/**
 * Runs its scroll choreography the first time it comes into view.
 *
 * The markup is present in the prerendered HTML either way; only opacity and
 * transforms are animated, and a <noscript> rule in the document head forces
 * everything visible when JavaScript never runs.
 */
export function Reveal({ children, className, delay = 0, variant = "lift" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Anything already on screen at mount reveals immediately - no flash.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          window.setTimeout(() => entry.target.classList.add("is-in"), delay);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={cn(
        variant === "lift" && "reveal",
        variant === "veil" && "reveal-veil",
        className,
      )}
    >
      {/* The veil's clip sits on this inner wrapper, never on the observed
          element — see the note in styles.css. */}
      {variant === "veil" ? <div className="veil-inner">{children}</div> : children}
    </div>
  );
}

/**
 * A display heading whose lines rise one after another out of a mask.
 *
 * Each line is its own overflow-hidden row, so the type appears to be
 * uncovered rather than to slide across the page. Pass `accent` to set which
 * lines are rendered in the champagne italic.
 */
export function MaskedHeading({
  lines,
  as: Tag = "h2",
  className,
  accent,
  id,
}: {
  lines: string[];
  as?: "h1" | "h2" | "h3";
  className?: string;
  /** Indices rendered in gold italic. */
  accent?: number[];
  id?: string;
}) {
  return (
    <Tag id={id} className={className}>
      {lines.map((line, i) => (
        <span key={line} className="line-mask">
          <span className={accent?.includes(i) ? "text-gold italic" : undefined}>{line}</span>
        </span>
      ))}
    </Tag>
  );
}

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** Positive drifts slower than the page, negative drifts faster. */
  speed?: number;
  style?: CSSProperties;
}

/**
 * Scroll-linked vertical drift. Runs off a single rAF-throttled scroll
 * listener and writes to a CSS custom property, so it never triggers React
 * re-renders while scrolling.
 */
export function Parallax({ children, className, speed = 0.12, style }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    let frame = 0;
    let visible = false;

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) update();
    });
    io.observe(el);

    const update = () => {
      const rect = el.getBoundingClientRect();
      // Distance of the element's centre from the viewport centre, normalised.
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
      el.style.setProperty("--parallax", `${(-offset * speed * 100).toFixed(2)}px`);
      frame = 0;
    };

    const onScroll = () => {
      if (frame || !visible) return;
      frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [speed, reduced]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ ...style, transform: "translate3d(0, var(--parallax, 0px), 0)" }}
    >
      {children}
    </div>
  );
}

interface TiltProps {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees. */
  max?: number;
  /** Lift towards the viewer, in pixels. */
  lift?: number;
}

/**
 * Tilts a card toward the pointer. Pointer-driven only - on touch the card
 * simply sits flat, which is the right call on a phone.
 */
export function Tilt({ children, className, max = 7, lift = 14 }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;

    const onMove = (event: PointerEvent) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `rotateY(${(px * max * 2).toFixed(2)}deg) rotateX(${(-py * max * 2).toFixed(2)}deg) translateZ(${lift}px)`;
        frame = 0;
      });
    };

    const onLeave = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      el.style.transform = "";
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [max, lift, reduced]);

  return (
    <div className="tilt-stage">
      <div ref={ref} className={cn("tilt-card", className)}>
        {children}
      </div>
    </div>
  );
}

/**
 * Reports how far the page has scrolled through the referenced element,
 * as 0 at the moment it enters the viewport and 1 as it leaves.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const total = rect.height + window.innerHeight;
      const seen = window.innerHeight - rect.top;
      setProgress(Math.min(1, Math.max(0, seen / total)));
      frame = 0;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return { ref, progress };
}
