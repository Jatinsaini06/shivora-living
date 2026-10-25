import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import { SITE } from "@/data/site";
import { PRODUCTS } from "@/data/products";
import { Figure } from "@/components/primitives/Figure";
import { Eyebrow } from "@/components/primitives/ui";
import { Wordmark } from "./Header";

const CONTACT = [
  { Icon: Phone, label: SITE.phone, href: `tel:${SITE.phoneHref}`, external: false },
  { Icon: Mail, label: SITE.email, href: `mailto:${SITE.email}`, external: false },
  { Icon: Instagram, label: SITE.instagram, href: SITE.instagramUrl, external: true },
];

export function Footer() {
  return (
    <footer className="bg-ivory-deep border-line border-t">
      <div className="grid lg:grid-cols-[0.8fr_1fr_0.85fr_0.75fr]">
        {/* Editorial plate anchors the left edge. */}
        <Figure
          slot="signature-room"
          alt="A Shivora Living carpet in a sunlit sitting room"
          className="hidden min-h-[24rem] lg:block"
          sizes="22vw"
        />

        <div className="px-[var(--gutter)] py-16">
          <Eyebrow>About Shivora Living</Eyebrow>
          <p className="text-ink-soft mt-6 max-w-sm text-[0.85rem] leading-[1.9]">
            At Shivora Living, we believe a carpet is not just a decor; it is the canvas of a
            room&rsquo;s luxury. We curate and craft premium carpets for ultra-luxury hotels,
            commercial spaces and premium residences.
          </p>
          <p className="font-script text-gold mt-9 text-4xl leading-none">{SITE.tagline}</p>
        </div>

        <div className="border-line px-[var(--gutter)] py-16 lg:border-l">
          <Eyebrow>Get in touch</Eyebrow>
          <ul className="mt-6 space-y-4">
            {CONTACT.map(({ Icon, label, href, external }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                  className="text-ink-soft hover:text-gold group flex items-center gap-3.5 text-[0.85rem] transition-colors duration-500"
                >
                  <Icon className="text-gold h-3.5 w-3.5 shrink-0" strokeWidth={1.4} />
                  <span className="link-rule">{label}</span>
                </a>
              </li>
            ))}
            <li className="text-ink-soft flex items-center gap-3.5 text-[0.85rem]">
              <MapPin className="text-gold h-3.5 w-3.5 shrink-0" strokeWidth={1.4} />
              {SITE.location}
            </li>
          </ul>

          <nav aria-label="Collections" className="mt-11">
            <Eyebrow>Collections</Eyebrow>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5">
              {PRODUCTS.map((p) => (
                <li key={p.slug}>
                  <Link
                    to="/collections/$slug"
                    params={{ slug: p.slug }}
                    className="text-muted hover:text-gold link-rule text-[0.78rem] transition-colors duration-500"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-line flex flex-col items-center justify-center gap-5 px-[var(--gutter)] py-16 text-center lg:border-l">
          <Wordmark className="text-ink" />
          <span className="rule-gold w-20" />
          <p className="text-gold text-[0.55rem] tracking-[0.42em] uppercase">{SITE.tagline}</p>
          <a
            href={SITE.url}
            className="text-muted hover:text-gold link-rule mt-1 text-[0.72rem] transition-colors duration-500"
            target="_blank"
            rel="noreferrer noopener"
          >
            {SITE.domain}
          </a>
        </div>
      </div>

      <div className="border-line text-muted border-t px-[var(--gutter)] py-6 text-center text-[0.66rem] tracking-[0.12em]">
        &copy; {SITE.copyrightYear} {SITE.name}. All Rights Reserved.
      </div>
    </footer>
  );
}
