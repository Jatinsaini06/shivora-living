/**
 * Static-host finishing touches.
 *
 * The prerenderer writes the not-found page to /404/index.html; Apache and most
 * static hosts want it at /404.html, which is what .htaccess points at.
 */
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("dist/client");
const from = path.join(OUT, "404", "index.html");
const to = path.join(OUT, "404.html");

if (fs.existsSync(from)) {
  fs.copyFileSync(from, to);
  console.log("[postbuild] 404/index.html -> 404.html");
} else {
  console.warn("[postbuild] no prerendered 404 page found; skipping 404.html");
}
