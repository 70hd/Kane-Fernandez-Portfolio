// components/funnel/ui/FeatureRow.jsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "./cn";
import Button from "./Button";

// Load lottie-react only when this component needs it (separate chunk)
const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <div className="w-full aspect-[606/341]" />,
});

/**
 * Performance behavior:
 * - No lottie JS in the main bundle (code-split)
 * - Only fetch animation JSON when in view
 * - Plays once, then freezes on last frame
 */
export default function FeatureRow({
  reverse,
  imageSrc,
  imageAlt,
  title,
  body,
  cta,
  lottieData, // optional: pass imported JSON object instead of imageSrc
}) {
  const containerRef = useRef(null);
  const lottieRef = useRef(null);

  const [inView, setInView] = useState(false);
  const [animData, setAnimData] = useState(lottieData || null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [started, setStarted] = useState(false);

  const shouldLoadFromPath = useMemo(() => {
    if (lottieData) return false;
    if (!imageSrc) return false;
    return /\.json(\?.*)?$/i.test(imageSrc);
  }, [imageSrc, lottieData]);

  // Observe visibility
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15, rootMargin: "0px 0px -20% 0px" }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Fetch ONLY when in view (and only once)
  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!inView) return;
      if (!shouldLoadFromPath) return;
      if (animData) return;

      try {
        const res = await fetch(imageSrc, { cache: "force-cache" });
        const json = await res.json();
        if (!cancelled) setAnimData(json);
      } catch {
        // silent fail
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [inView, shouldLoadFromPath, animData, imageSrc]);

  // Play/pause behavior
  useEffect(() => {
    const inst = lottieRef.current;
    if (!inst || hasPlayed || !animData) return;

    if (inView) {
      if (!started) {
        inst.goToAndPlay?.(0, true);
        setStarted(true);
      } else {
        inst.play?.();
      }
    } else {
      if (started) inst.pause?.();
    }
  }, [inView, started, hasPlayed, animData]);

  // Freeze on last frame after completion
  useEffect(() => {
    const inst = lottieRef.current;
    if (!inst || hasPlayed || !animData) return;

    const onComplete = () => {
      setHasPlayed(true);
      const totalFrames = inst.getDuration?.(true);
      const last = Math.max(0, Math.floor((totalFrames ?? 1) - 1));
      inst.goToAndStop?.(last, true);
    };

    inst.addEventListener?.("complete", onComplete);
    return () => inst.removeEventListener?.("complete", onComplete);
  }, [hasPlayed, animData]);

  return (
    <div
      className={cn(
        "flex w-full items-center",
        "flex-col md:flex-row",
        "gap-6 md:gap-9",
        reverse && "md:flex-row-reverse"
      )}
    >
      {/* Media */}
      <div
        ref={containerRef}
        className={cn(
          "w-full md:w-auto",
          "flex justify-center md:justify-start",
          "shrink-0"
        )}
        aria-label={imageAlt}
      >
        <div className="w-full max-w-[606px]">
          {animData ? (
            <Lottie
              lottieRef={lottieRef}
              animationData={animData}
              autoplay={false}
              loop={false}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          ) : (
            <div className="w-full aspect-[606/341]" />
          )}
        </div>
      </div>

      {/* Copy */}
      <div className="w-full flex-1 flex flex-col gap-3">
        <div>
          <p className="strong-inter">{title}</p>
          <p>{body}</p>

          {cta ? (
            <Button
              variant="link"
              href={cta.href}
              className="inline-block py-3 px-0"
            >
              {cta.label}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}