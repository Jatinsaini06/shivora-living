import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { media } from "@/lib/media";
import { Figure } from "@/components/primitives/Figure";
import { useMounted, useScrollProgress } from "@/components/primitives/motion";
import type { Product } from "@/data/products";

/**
 * Decides whether a rug should be shown in WebGL, and falls back to the
 * photograph when it should not.
 *
 * Three.js lives behind this lazy import, so the renderer is only fetched once
 * a viewer is scrolled into range on a device that can actually draw it. On the
 * server, on first paint, without WebGL, or on a connection that never reaches
 * the section, visitors simply get the photo.
 */
const RugScene = lazy(() => import("./RugScene"));

/** Cheap capability probe — some low-end devices report no WebGL context. */
function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Phones and low-core machines get a lighter mesh. `deviceMemory` and
 * `hardwareConcurrency` are both optional, so absence is treated as capable.
 */
function isLowPower() {
  if (window.matchMedia("(max-width: 768px)").matches) return true;
  const nav = navigator as Navigator & { deviceMemory?: number };
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4) return true;
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) return true;
  return false;
}

export function RugViewer({ product, className }: { product: Product; className?: string }) {
  const mounted = useMounted();
  const { ref: progressRef, progress } = useScrollProgress<HTMLDivElement>();
  const wrapper = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [capable, setCapable] = useState(false);
  const [coarse, setCoarse] = useState(false);

  const firstSlot = product.images[0]?.slot;
  // The weave texture is chosen per product; fall back to the hero photo only
  // if that slot is somehow missing from the manifest.
  const textureUrl =
    media(product.render.textureSlot)?.src ?? (firstSlot ? (media(firstSlot)?.src ?? null) : null);

  useEffect(() => {
    setCapable(supportsWebGL());
    setCoarse(isLowPower());
  }, []);

  // Only fetch the renderer once the viewer is actually near the viewport.
  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "260px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const showCanvas = mounted && capable && inView && textureUrl;

  // Shown on the server, before the scene loads, and wherever WebGL is out.
  const still = (
    <Figure
      slot={firstSlot ?? ""}
      alt={product.images[0]?.alt ?? product.displayName}
      className="h-full w-full"
      sizes="(max-width: 1024px) 90vw, 46vw"
    />
  );

  return (
    <div
      ref={wrapper}
      className={cn("relative", className)}
      // The canvas is decorative; the same rug is described by the photograph
      // and its alt text alongside.
      aria-hidden={showCanvas ? "true" : undefined}
    >
      <div ref={progressRef} className="h-full w-full">
        {showCanvas ? (
          <Suspense fallback={still}>
            <RugScene
              product={product}
              textureUrl={textureUrl}
              progress={progress}
              coarse={coarse}
            />
          </Suspense>
        ) : (
          still
        )}
      </div>
    </div>
  );
}
