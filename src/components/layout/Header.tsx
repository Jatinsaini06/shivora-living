import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUpRight, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { NAV, SITE } from "@/data/site";

export function Wordmark({ className, stacked = true }: { className?: string; stacked?: boolean }) {
  return (
    <span className={cn("block leading-none select-none", className)}>
      <span className="font-display block text-[1.45rem] tracking-[0.34em] sm:text-[1.6rem]">
        {SITE.wordmark.top}
      </span>
      {stacked ? (
        <span className="text-gold-deep mt-1.5 block text-[0.58rem] tracking-[0.7em]">
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
      <header className="fixed inset-x-0 top-0 z-50">
        {/* Utility bar: direct contact, pinned with the header the whole way down. */}
        <div className="bg-ink text-ivory/80 hidden md:block">
          <div className="shell flex h-10 items-center justify-between text-[0.68rem] tracking-[0.12em]">
            <p className="flex items-center gap-2">
              <MapPin className="text-gold-soft h-3.5 w-3.5" />
              {SITE.location}
            </p>
            <div className="flex items-center gap-7">
              <a
                href={`tel:${SITE.phoneHref}`}
                className="hover:text-gold-soft flex items-center gap-2 transition-colors"
              >
                <Phone className="text-gold-soft h-3.5 w-3.5" />
                {SITE.phone}
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="hover:text-gold-soft flex items-center gap-2 transition-colors"
              >
                <Mail className="text-gold-soft h-3.5 w-3.5" />
                {SITE.email}
              </a>
            </div>
          </div>
        </div>

        {/* Main bar: always solid so the nav never sits on top of the hero photograph. */}
        <div
          className={cn(
            "border-line/70 bg-ivory/95 border-b backdrop-blur-xl transition-shadow duration-700",
            scrolled && "shadow-[0_8px_30px_-12px_rgba(31,29,26,0.18)]",
          )}
        >
          <div
            className={cn(
              "shell flex items-center justify-between gap-6 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
              scrolled ? "h-[4.25rem]" : "h-20",
            )}
          >
            <Link to="/" aria-label={`${SITE.name} home`} className="shrink-0">
              <Wordmark />
            </Link>

            <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex xl:gap-10">
              {NAV.map((item) => {
                const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    data-active={active}
                    className={cn(
                      "link-rule py-1 text-[0.72rem] font-normal tracking-[0.18em] uppercase transition-colors duration-500",
                      active ? "text-gold-deep" : "text-ink hover:text-gold-deep",
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
                className="bg-ink text-ivory hover:bg-gold-deep group hidden items-center gap-2.5 px-6 py-3.5 text-[0.68rem] font-normal tracking-[0.2em] uppercase transition-colors duration-500 sm:inline-flex"
              >
                Get a quote
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
