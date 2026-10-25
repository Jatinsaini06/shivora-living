import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";
import { SITE } from "@/data/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactRail } from "@/components/layout/ContactRail";
import { NotFound } from "@/components/layout/NotFound";

const DESCRIPTION =
  "Shivora Living crafts premium hand woven, hand tufted, jute, woolen and custom carpets for ultra-luxury hotels, commercial spaces and premium residential interiors. Based in Panipat, Haryana.";

/** Organization schema so search engines get the manufacturer details directly. */
const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  email: SITE.email,
  telephone: SITE.phone,
  slogan: SITE.tagline,
  description: DESCRIPTION,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Panipat",
    addressRegion: "Haryana",
    addressCountry: "IN",
  },
  sameAs: [SITE.instagramUrl],
};

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#fbf8f3" },
      { title: `${SITE.name} — Premium Carpets & Rugs | ${SITE.tagline}` },
      { name: "description", content: DESCRIPTION },
      { property: "og:site_name", content: SITE.name },
      { property: "og:type", content: "website" },
      { property: "og:title", content: `${SITE.name} — Premium Carpets & Rugs` },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: SITE.url },
      { property: "og:image", content: `${SITE.url}/media/out/hero-room-1600.webp` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@200;300;400;500&family=Parisienne&display=swap",
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(ORGANIZATION_SCHEMA),
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
});

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <HeadContent />
        {/* Scroll choreography starts hidden or clipped; without JS none of it
            must ever stay that way. */}
        <noscript>
          <style>
            {`.reveal{opacity:1 !important;transform:none !important}` +
              `.reveal-veil>.veil-inner{clip-path:none !important;transform:none !important}` +
              `.line-mask>span{transform:none !important}` +
              `.rule-draw{transform:none !important}`}
          </style>
        </noscript>
      </head>
      <body>
        <a
          href="#main"
          className="focus:bg-gold sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-5 focus:py-3 focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <ContactRail />
        <main id="main">{children}</main>
        <Footer />
        <Scripts />
      </body>
    </html>
  );
}

export { Outlet };
