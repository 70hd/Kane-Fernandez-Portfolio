"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

function splitTwoLines(text = "") {
  const words = String(text).trim().split(/\s+/);
  if (words.length < 2) return [text, ""];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

/* Measure section top/height + viewport px for robust iOS progress */
function useSectionMetrics(ref) {
  const [m, setM] = useState({ top: 0, height: 0, vh: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset || 0;
      setM({
        top: rect.top + scrollY,
        height: el.offsetHeight || rect.height || 0,
        vh: window.innerHeight || 0,
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("orientationchange", measure, { passive: true });
    // Slight defer helps after fonts/images load
    const tm = setTimeout(measure, 0);

    return () => {
      clearTimeout(tm);
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, [ref]);

  return m;
}

/* One layer per image */
function SloganLayer({
  index,
  src,
  progress,   // 0..1 for whole section
  segLen,
  startY,
  finalY,
  springCfg,
  reduce,
}) {
  const IN_START = 0.1;
  const IN_END = 0.36;
  const z = 20 + index;

  if (reduce) {
    return (
      <div
        style={{ zIndex: z, willChange: "transform, opacity" }}
        className="absolute flex items-center justify-center max-w-[82vw]"
        aria-hidden="true"
      >
        <div className="relative w-[392px] h-[225px]">
          <Image src={src} alt="" fill className="object-contain" sizes="392px" priority={index===0} />
        </div>
      </div>
    );
  }

  // Map global 0..1 -> this image’s local 0..1 window
  const localT = useTransform(progress, (t) => {
    const start = index * segLen;
    const lt = (t - start) / segLen;
    return Math.max(0, Math.min(1, lt));
  });

  const opacityMV = useTransform(localT, [0, IN_START, IN_END, 1], [0, 0, 1, 1]);
  const yMV       = useTransform(localT, [0, IN_START, IN_END, 1], [startY, startY, finalY, finalY]);
  const scaleMV   = useTransform(localT, [0, IN_START, IN_END, 1], [0.94, 0.94, 1, 1]);

  const opacity = useSpring(opacityMV, springCfg);
  const y       = useSpring(yMV, springCfg);
  const scale   = useSpring(scaleMV, springCfg);

  return (
    <motion.div
      style={{ opacity, y, scale, zIndex: z, willChange: "transform, opacity" }}
      className="absolute flex items-center justify-center max-w-[82vw]"
      aria-hidden="true"
    >
      <div className="relative w-[392px] h-[225px]">
        <Image src={src} alt="" fill className="object-contain" sizes="392px" priority={index===0} />
      </div>
    </motion.div>
  );
}

export default function StickySlogan({ slogan = "", images = [], match }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  // pick images: prop first, then match.animationImages
  const imgs = useMemo(
    () => ((Array.isArray(images) && images.length ? images : match?.animationImages) || []),
    [images, match]
  );
  const count = Math.max(1, imgs.length);

  // Section height in pixels (avoid vh quirks)
  const perImageVH = 140;
  const [vhPx, setVhPx] = useState(0);
  useEffect(() => {
    const set = () => setVhPx(window.innerHeight || 0);
    set();
    window.addEventListener("resize", set, { passive: true });
    window.addEventListener("orientationchange", set, { passive: true });
    return () => {
      window.removeEventListener("resize", set);
      window.removeEventListener("orientationchange", set);
    };
  }, []);
  const sectionPx = Math.max(200, count * perImageVH) * (vhPx / 100);

  // Global progress from window scrollY against the section’s top/bottom
  const { scrollY } = useScroll();
  const { top, height, vh } = useSectionMetrics(ref);
  // Start when section top meets viewport top; end when section bottom meets viewport bottom
  const start = top;
  const end   = Math.max(top + height - vh, start + 1); // avoid identical range
  const progress = useTransform(scrollY, [start, end], [0, 1], { clamp: true });

  const segLen = 1 / count;
  const SPR = { stiffness: 220, damping: 22, mass: 0.9 };
  const startY = Math.max(vhPx || vh || 0, 480); // off-screen bottom
  const finalY = -40;

  const [l1, l2] = splitTwoLines(slogan);

  return (
    <section ref={ref} className="relative" style={{ height: `${sectionPx}px` }}>
      {/* Use 100svh so iOS won’t expand with URL bar */}
      <div className="sticky top-0 h-[100svh] flex items-center justify-center">
        <div className="relative flex items-center justify-center w-full h-full scale-50 sm:scale-75 md:scale-100 origin-center">
          {/* Single semantic H1; visual lines are aria-hidden to avoid dup reading */}
          <h1 className="sr-only">{slogan}</h1>

          {/* Visual line 1 — force single line */}
          <div
            className="absolute inset-0 z-10 flex items-center justify-center text-center text-[#121212]"
            style={{ transform: "translateY(-32px)" }}
            aria-hidden="true"
          >
            <h1 className="w-[606px] min-w-[606px] leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
              {l1}
            </h1>
          </div>

          {/* Image stack */}
          <div
            className="absolute z-20 inset-0 flex items-center justify-center pointer-events-none"
            aria-hidden="true"
          >
            {imgs.map((src, i) => (
              <SloganLayer
                key={i}
                index={i}
                src={src}
                progress={progress}
                segLen={segLen}
                startY={startY}
                finalY={finalY}
                springCfg={SPR}
                reduce={reduce}
              />
            ))}
          </div>

          {/* Visual line 2 — force single line */}
          <div
            className="absolute inset-0 z-[999] flex items-center justify-center text-center text-[#121212]"
            style={{ transform: "translateY(32px)" }}
            aria-hidden="true"
          >
            <h1 className="w-[606px] min-w-[606px] leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
              {l2}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}