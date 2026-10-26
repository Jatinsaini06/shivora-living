import { Link } from "@tanstack/react-router";
import { ArrowUp, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { NAV, SITE } from "@/data/site";
import { PRODUCTS } from "@/data/products";

const CONTACT = [
  { Icon: Phone, label: SITE.phone, href: `tel:${SITE.phoneHref}`, external: false },
  { Icon: Mail, label: SITE.email, href: `mailto:${SITE.email}`, external: false },
  { Icon: MapPin, label: SITE.location, href: null, external: false },
];

const SOCIAL = [
  { Icon: Instagram, label: "Instagram", href: SITE.instagramUrl },
  { Icon: MessageCircle, label: "WhatsApp", href: `https://wa.me/${SITE.whatsapp}` },
  { Icon: Mail, label: "Email", href: `mailto:${SITE.email}` },
];

const heading = "text-gold-soft text-[0.68rem] font-normal tracking-[0.3em] uppercase";
const link =
  "text-ivory/65 hover:text-ivory inline-block text-[0.9rem] transition-all duration-500 hover:translate-x-1";

/**
 * Dark ink footer: a deliberate change of key at the end of an ivory page, so
 * the site closes with weight. Everything sits on the shell grid, so its left
 * edge lines up with every section above it.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-ivory relative isolate overflow-hidden">
      {/* Soft champagne glow keeps the dark field from reading as flat black. */}
      <span
        aria-hidden="true"
        className="bg-gold/10 pointer-events-none absolute -top-40 left-1/2 -z-10 h-80 w-[60rem] -translate-x-1/2 rounded-full blur-[120px]"
      />

      {/* ---- Link columns ---- */}
      <div className="shell grid gap-12 pt-20 pb-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1.2fr_1.2fr] lg:gap-10">
        <div>
          <Link to="/" aria-label={`${SITE.name} home`} className="inline-block">
            <span className="font-display block text-[1.6rem] leading-none tracking-[0.34em]">
              {SITE.wordmark.top}
            </span>
            <span className="text-gold-soft mt-2 block text-[0.6rem] tracking-[0.7em]">
              {SITE.wordmark.bottom}
            </span>
          </Link>
          <p className="text-ivory/60 mt-7 max-w-xs text-[0.9rem] leading-[1.8]">
            Premium carpets and rugs for ultra-luxury hotels, commercial spaces and premium
            residences &mdash; crafted in Panipat.
          </p>
          <ul className="mt-8 flex gap-3">
            {SOCIAL.map(({ Icon, label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  aria-label={label}
                  {...(href.startsWith("http")
                    ? { target: "_blank", rel: "noreferrer noopener" }
                    : {})}
                  className="border-ivory/15 text-ivory/70 hover:border-gold hover:bg-gold flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-500 hover:-translate-y-0.5 hover:text-white"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer">
          <p className={heading}>Explore</p>
          <ul className="mt-6 space-y-3">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Collections">
          <p className={heading}>Collections</p>
          <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3">
            {PRODUCTS.map((p) => (
              <li key={p.slug}>
                <Link to="/collections/$slug" params={{ slug: p.slug }} className={link}>
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className={heading}>Get in touch</p>
          <ul className="mt-6 space-y-4">
            {CONTACT.map(({ Icon, label, href }) => (
              <li key={label} className="flex items-start gap-3.5">
                <Icon className="text-gold-soft mt-1 h-4 w-4 shrink-0" strokeWidth={1.5} />
                {href ? (
                  <a
                    href={href}
                    className="text-ivory/65 hover:text-ivory text-[0.9rem] transition-colors duration-500"
                  >
                    {label}
                  </a>
                ) : (
                  <span className="text-ivory/65 text-[0.9rem]">{label}</span>
                )}
              </li>
            ))}
          </ul>
          <p className="font-script text-gold-soft mt-8 text-3xl leading-none">{SITE.tagline}</p>
        </div>
      </div>

      {/* ---- Legal bar ---- */}
      <div className="border-ivory/10 border-t">
        <div className="shell text-ivory/45 flex flex-col items-center justify-between gap-4 py-6 text-[0.75rem] tracking-[0.06em] sm:flex-row">
          <p>
            &copy; {year} {SITE.name}. All rights reserved.
          </p>
          <a
            href="#main"
            className="hover:text-ivory group inline-flex items-center gap-2 transition-colors duration-500"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
