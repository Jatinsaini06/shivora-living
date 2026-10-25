import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { media } from "@/lib/media";

interface FigureProps {
  slot: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Passed straight to the img `sizes` attribute. */
  sizes?: string;
  /** The hero image should not be lazy-loaded. */
  priority?: boolean;
}

/**
 * Responsive image bound to a media-manifest slot.
 *
 * The blurred LQIP sits behind the real file and fades out on load, so a slow
 * connection sees the right colour field rather than an empty box. An unknown
 * slot degrades to a woven-texture placeholder instead of a broken image.
 */
export function Figure({
  slot,
  alt,
  className,
  imgClassName,
  sizes = "100vw",
  priority = false,
}: FigureProps) {
  const resolved = media(slot);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // The markup is server-rendered, so a cached or already-decoded image can
  // finish before React attaches onLoad - in which case that event never
  // fires and the photo would stay hidden behind the blur forever.
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  if (!resolved) {
    return (
      <div
        className={cn("bg-sand relative overflow-hidden", className)}
        role="img"
        aria-label={`${alt} (photography pending)`}
      >
        <WeavePlaceholder />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <img
        src={resolved.lqip}
        alt=""
        aria-hidden="true"
        className={cn(
          "absolute inset-0 h-full w-full scale-105 object-cover blur-xl transition-opacity duration-700",
          loaded ? "opacity-0" : "opacity-100",
        )}
      />
      <img
        ref={imgRef}
        src={resolved.src}
        srcSet={resolved.srcSet}
        sizes={sizes}
        alt={alt}
        width={resolved.width}
        height={resolved.height}
        loading={priority ? "eager" : "lazy"}
        // fetchPriority is React 19 native.
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={cn(
          "relative h-full w-full object-cover transition-opacity duration-700",
          loaded ? "opacity-100" : "opacity-0",
          imgClassName,
        )}
      />
    </div>
  );
}

/** Procedural woven texture, used where a real photograph is not yet available. */
export function WeavePlaceholder({ className }: { className?: string }) {
  return (
    <svg
      className={cn("absolute inset-0 h-full w-full", className)}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="weave" width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="12" height="12" fill="var(--color-sand)" />
          <rect width="6" height="6" fill="var(--color-ivory-deep)" />
          <rect x="6" y="6" width="6" height="6" fill="var(--color-ivory-deep)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#weave)" />
    </svg>
  );
}
