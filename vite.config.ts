import { defineConfig, type PluginOption } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

/**
 * Shivora Living is a fully static site: no backend, no database.
 *
 * `vite build` runs the prerenderer over every route and writes plain HTML into
 * `.output/public`, which can be uploaded to any static host. The nitro plugin
 * is only needed for that build step - during `vite dev` it would fight with
 * Vite's own dev server.
 */
export default defineConfig(async ({ command }) => {
  const plugins: PluginOption[] = [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart({
      prerender: { enabled: true, crawlLinks: true, failOnError: false },
      // Seed the crawler with every static page so nothing depends on a link
      // being reachable from the homepage. The ten collection detail pages are
      // then discovered from /collections.
      pages: [
        { path: "/" },
        { path: "/collections" },
        { path: "/custom-solutions" },
        { path: "/about" },
        { path: "/process" },
        { path: "/contact" },
        // Renders the root notFoundComponent; postbuild copies it to
        // /404.html for the host's ErrorDocument.
        { path: "/404" },
      ],
      sitemap: { enabled: true, host: "https://shivoraliving.in" },
    }),
  ];

  // No nitro: the site ships as static files, so Vite's own client + server
  // environments are all the prerenderer needs. Adding nitro here only builds a
  // runtime server we would never deploy.
  void command;

  plugins.push(viteReact());

  return {
    plugins,
    build: { chunkSizeWarningLimit: 1400 },
  };
});
