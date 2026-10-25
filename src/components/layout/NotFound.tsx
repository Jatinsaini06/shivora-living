import { Link } from "@tanstack/react-router";
import { GoldLink } from "@/components/primitives/ui";

/**
 * Shared by the router's client-side notFoundComponent and the prerendered
 * /404 route that static hosts serve as their ErrorDocument.
 */
export function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="display-lg mt-5">This page has wandered off</h1>
      <p className="text-muted mt-4 max-w-md text-sm leading-relaxed">
        The page you are looking for does not exist. Browse the collections instead, or get in touch
        and we will point you the right way.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <GoldLink to="/collections">View collections</GoldLink>
        <Link
          to="/"
          className="border-line text-ink hover:border-gold hover:text-gold inline-flex items-center border px-7 py-3.5 text-[0.7rem] tracking-[0.2em] uppercase transition-colors"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
