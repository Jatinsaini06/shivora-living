import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { NAV, SITE } from "@/data/site";

export function Wordmark({ className, stacked = true }: { className?: string; stacked?: boolean }) {
  return (
    <span className={cn("block leading-none select-none", className)}>
      <span className="font-display block text-[1.3rem] tracking-[0.38em] sm:text-[1.45rem]">
        {SITE.wordmark.top}
      </span>
      {stacked ? (
        <span className="text-gold mt-1.5 block text-[0.55rem] tracking-[0.72em]">
          {SITE.wordmark.bottom}
        </span>
      ) : null}
    </span>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile sheet on navigation, and lock the body while it is open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          scrolled
            ? "border-line/60 bg-ivory/85 border-b py-3 backdrop-blur-xl"
            : "border-b border-transparent py-6",
        )}
      >
        <div className="shell flex items-center justify-between gap-6">
          <Link to="/" aria-label={`${SITE.name} home`} className="shrink-0">
            <Wordmark />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-10 lg:flex">
            {NAV.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  data-active={active}
                  className={cn(
                    "link-rule py-1 text-[0.62rem] tracking-[0.26em] uppercase transition-colors duration-500",
                    active ? "text-gold" : "text-ink-soft hover:text-gold",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              className="border-line text-ink hover:border-gold-soft hover:bg-gold-tint hidden border px-7 py-3.5 text-[0.6rem] tracking-[0.26em] uppercase transition-all duration-500 sm:inline-block"
            >
              Get in touch
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="border-line text-ink hover:border-gold hover:text-gold relative z-[60] flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-500 lg:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sheet */}
      <div
        id="mobile-nav"
        className={cn(
          "bg-ivory fixed inset-0 z-40 flex flex-col justify-center px-8 transition-all duration-700 lg:hidden",
          open ? "visible opacity-100" : "pointer-events-none invisible opacity-0",
        )}
      >
        <nav aria-label="Mobile" className="flex flex-col">
          {NAV.map((item, i) => (
            <Link
              key={item.to}
              to={item.to}
              className="font-display border-line/70 hover:text-gold flex items-baseline gap-5 border-b py-5 text-[2rem] leading-none transition-colors"
              style={{
                transitionDelay: open ? `${140 + i * 55}ms` : "0ms",
                transform: open ? "none" : "translateY(18px)",
                opacity: open ? 1 : 0,
                transitionProperty: "transform, opacity, color",
                transitionDuration: "800ms",
                transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              <span className="micro text-gold w-6">{String(i + 1).padStart(2, "0")}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="text-muted mt-12 space-y-1.5 text-sm">
          <a href={`tel:${SITE.phoneHref}`} className="hover:text-gold block transition-colors">
            {SITE.phone}
          </a>
          <a href={`mailto:${SITE.email}`} className="hover:text-gold block transition-colors">
            {SITE.email}
          </a>
          <p>{SITE.location}</p>
        </div>
      </div>
    </>
  );
}
