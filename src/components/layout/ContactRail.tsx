import { Mail, MessageCircle, Phone } from "lucide-react";
import { SITE } from "@/data/site";

/**
 * Fixed champagne rail on the right edge, as in the design reference.
 * Hidden on small screens where it would sit over the content.
 */
export function ContactRail() {
  const items = [
    {
      label: "Chat on WhatsApp",
      href: `https://wa.me/${SITE.whatsapp}`,
      Icon: MessageCircle,
      external: true,
    },
    { label: `Call ${SITE.phone}`, href: `tel:${SITE.phoneHref}`, Icon: Phone, external: false },
    { label: `Email ${SITE.email}`, href: `mailto:${SITE.email}`, Icon: Mail, external: false },
  ];

  return (
    <div className="fixed top-1/2 right-0 z-40 hidden -translate-y-1/2 flex-col overflow-hidden rounded-l-xl shadow-[0_18px_50px_-24px_rgba(38,36,31,0.5)] md:flex">
      {items.map(({ label, href, Icon, external }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          title={label}
          {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
          className="bg-gold hover:bg-gold-deep flex h-12 w-11 items-center justify-center text-white transition-colors duration-300"
        >
          <Icon className="h-4 w-4" strokeWidth={1.5} />
        </a>
      ))}
    </div>
  );
}
