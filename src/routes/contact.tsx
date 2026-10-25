import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionMark } from "@/components/primitives/ui";
import { Reveal } from "@/components/primitives/motion";
import { PRODUCTS } from "@/data/products";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact | ${SITE.name}` },
      {
        name: "description",
        content: `Contact Shivora Living in Panipat, Haryana. Call ${SITE.phone} or email ${SITE.email} for bespoke carpets, hotel projects and bulk orders.`,
      },
    ],
  }),
  component: Contact,
});

const CHANNELS = [
  { label: "Phone", value: SITE.phone, href: `tel:${SITE.phoneHref}`, Icon: Phone, external: false },
  { label: "Email", value: SITE.email, href: `mailto:${SITE.email}`, Icon: Mail, external: false },
  {
    label: "WhatsApp",
    value: SITE.phone,
    href: `https://wa.me/${SITE.whatsapp}`,
    Icon: MessageCircle,
    external: true,
  },
  {
    label: "Instagram",
    value: SITE.instagram,
    href: SITE.instagramUrl,
    Icon: Instagram,
    external: true,
  },
];

function Contact() {
  return (
    <>
      <PageHeader
        eyebrow="Contact Us"
        lines={["Let's talk about", "your project"]}
        accent={[1]}
        lead="Tell us what you are making and we will come back with a specification and quotation. We handle bespoke residential pieces, hotel projects and high-volume commercial orders."
        slot="signature-room"
        crumbs={[{ label: "Home", to: "/" }, { label: "Contact" }]}
      />

      <section className="band-b" aria-label="Contact details and enquiry">
        <div className="shell grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          {/* ---- Channels ---- */}
          <Reveal>
            <SectionMark>Get in touch</SectionMark>
            <ul className="border-line/70 mt-8 border-t">
              {CHANNELS.map(({ label, value, href, Icon, external }) => (
                <li key={label} className="border-line/70 border-b">
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                    className="group flex items-center gap-5 py-5"
                  >
                    <Icon
                      className="text-gold h-4 w-4 shrink-0 transition-transform duration-600 group-hover:scale-110"
                      strokeWidth={1.4}
                    />
                    <span className="flex-1">
                      <span className="micro block">{label}</span>
                      <span className="text-ink group-hover:text-gold mt-1.5 block text-[0.95rem] transition-colors duration-500">
                        {value}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
              <li className="border-line/70 flex items-center gap-5 border-b py-5">
                <MapPin className="text-gold h-4 w-4 shrink-0" strokeWidth={1.4} />
                <span>
                  <span className="micro block">Address</span>
                  <span className="text-ink mt-1.5 block text-[0.95rem]">{SITE.location}</span>
                </span>
              </li>
            </ul>

            <p className="font-script text-gold mt-11 text-[2.6rem] leading-none">{SITE.tagline}</p>
          </Reveal>

          {/* ---- Enquiry composer ---- */}
          <Reveal delay={140}>
            <EnquiryForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}

/** Underlined field — quieter and more editorial than a boxed input. */
const FIELD =
  "w-full border-0 border-b border-line bg-transparent px-0 py-3 text-[0.92rem] text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-gold focus-visible:outline-none";
const LABEL = "block text-[0.58rem] uppercase tracking-[0.28em] text-muted mb-1";

/**
 * There is no backend, so the form composes the enquiry and hands it to the
 * visitor's own WhatsApp or mail client. Nothing is submitted anywhere, which
 * keeps the site fully static and means no data ever passes through a server.
 */
function EnquiryForm() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    collection: "",
    size: "",
    quantity: "",
    message: "",
  });

  const set = (key: keyof typeof form) => (event: { target: { value: string } }) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const summary = [
    form.name && `Name: ${form.name}`,
    form.company && `Company: ${form.company}`,
    form.phone && `Phone: ${form.phone}`,
    form.collection && `Collection: ${form.collection}`,
    form.size && `Size required: ${form.size}`,
    form.quantity && `Quantity: ${form.quantity}`,
    form.message && `\n${form.message}`,
  ]
    .filter(Boolean)
    .join("\n");

  const body = `Hello Shivora Living,\n\nI would like to enquire about your carpets.\n\n${summary}`;
  const waHref = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(body)}`;
  const mailHref = `mailto:${SITE.email}?subject=${encodeURIComponent("Carpet enquiry")}&body=${encodeURIComponent(body)}`;

  return (
    <form
      className="border-line/70 bg-shell/60 border p-8 backdrop-blur-sm sm:p-12"
      onSubmit={(e) => e.preventDefault()}
    >
      <SectionMark>Send an enquiry</SectionMark>
      <h2 className="display-md mt-5">Tell us what you need</h2>
      <p className="text-muted mt-4 max-w-md text-[0.82rem] leading-relaxed">
        Fill this in and choose how to send it — it opens in your own WhatsApp or email, so nothing
        is stored on this site.
      </p>

      <div className="mt-10 grid gap-7 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="name">
            Your name
          </label>
          <input id="name" className={FIELD} value={form.name} onChange={set("name")} />
        </div>
        <div>
          <label className={LABEL} htmlFor="company">
            Company <span className="normal-case">(optional)</span>
          </label>
          <input id="company" className={FIELD} value={form.company} onChange={set("company")} />
        </div>
        <div>
          <label className={LABEL} htmlFor="phone">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            className={FIELD}
            value={form.phone}
            onChange={set("phone")}
          />
        </div>
        <div>
          <label className={LABEL} htmlFor="collection">
            Collection
          </label>
          <select
            id="collection"
            className={FIELD}
            value={form.collection}
            onChange={set("collection")}
          >
            <option value="">Select a collection</option>
            {PRODUCTS.map((p) => (
              <option key={p.slug} value={p.displayName}>
                {p.displayName}
              </option>
            ))}
            <option value="Not sure yet">Not sure yet</option>
          </select>
        </div>
        <div>
          <label className={LABEL} htmlFor="size">
            Size required
          </label>
          <input
            id="size"
            className={FIELD}
            placeholder="e.g. 8 x 10 ft"
            value={form.size}
            onChange={set("size")}
          />
        </div>
        <div>
          <label className={LABEL} htmlFor="quantity">
            Quantity
          </label>
          <input
            id="quantity"
            className={FIELD}
            placeholder="e.g. 24 pieces"
            value={form.quantity}
            onChange={set("quantity")}
          />
        </div>
      </div>

      <div className="mt-7">
        <label className={LABEL} htmlFor="message">
          Your requirement
        </label>
        <textarea
          id="message"
          rows={4}
          className={FIELD}
          placeholder="Colour palette, design references, timeline…"
          value={form.message}
          onChange={set("message")}
        />
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <a
          href={waHref}
          target="_blank"
          rel="noreferrer noopener"
          className="bg-gold hover:bg-gold-deep inline-flex items-center gap-3 px-8 py-4 text-[0.62rem] tracking-[0.26em] text-white uppercase transition-colors duration-600"
        >
          <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
          Send on WhatsApp
        </a>
        <a
          href={mailHref}
          className="border-line text-ink hover:border-gold-soft hover:bg-gold-tint inline-flex items-center gap-3 border px-8 py-4 text-[0.62rem] tracking-[0.26em] uppercase transition-all duration-600"
        >
          <Mail className="h-3.5 w-3.5" strokeWidth={1.5} />
          Send by email
        </a>
      </div>
    </form>
  );
}
