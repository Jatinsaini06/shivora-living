import { createFileRoute } from "@tanstack/react-router";
import { NotFound } from "@/components/layout/NotFound";
import { SITE } from "@/data/site";

/**
 * A real, prerenderable route so the build emits static HTML for the not-found
 * page. `scripts/postbuild.mjs` copies it to /404.html, which .htaccess serves
 * as the ErrorDocument. Client-side misses are handled by the router's own
 * notFoundComponent in __root.
 */
export const Route = createFileRoute("/404")({
  head: () => ({
    meta: [{ title: `Page not found | ${SITE.name}` }, { name: "robots", content: "noindex" }],
  }),
  component: NotFound,
});
