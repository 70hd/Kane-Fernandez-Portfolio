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

/* One layer per image so hooks aren't in a loop */
function SloganLayer({
  index,
  src,
  scrollYProgress,
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
          <Image
            src={src}
            alt=""
            fill
            className="object-contain"
            sizes="392px"
            priority={index === 0}
          />
        </div>
      </div>
    );
  }

  const localT = useTransform(scrollYProgress, (t) => {
    const clamped = Math.max(0, Math.min(0.999999, t));
    const start = index * segLen;
    const lt = (clamped - start) / segLen;
    return Math.max(0, Math.min(1, lt));
  });

  const opacityMV = useTransform(localT, [0, IN_START, IN_END, 1], [0, 0, 1, 1]);
  const yMV = useTransform(localT, [0, IN_START, IN_END, 1], [startY, startY, finalY, finalY]);
  const scaleMV = useTransform(localT, [0, IN_START, IN_END, 1], [0.94, 0.94, 1, 1]);

  const opacity = useSpring(opacityMV, springCfg);
  const y = useSpring(yMV, springCfg);
  const scale = useSpring(scaleMV, springCfg);

  return (
    <motion.div
      style={{ opacity, y, scale, zIndex: z, willChange: "transform, opacity" }}
      className="absolute flex items-center justify-center max-w-[82vw]"
      aria-hidden="true"
    >
      <div className="relative w-[392px] h-[225px]">
        <Image
          src={src}
          alt=""
          fill
          className="object-contain"
          sizes="392px"
          priority={index === 0}
        />
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

  // Use pixel-based section height to avoid iOS/URL-bar vh bugs
  const [vhPx, setVhPx] = useState(0);
  useEffect(() => {
    const set = () => setVhPx(window.innerHeight || 0);
    set();
    window.addEventListener("resize", set, { passive: true });
    return () => window.removeEventListener("resize", set);
  }, []);

  const perImageVH = 140; // same visual pacing as before
  const sectionPx = Math.max(200, count * perImageVH) * (vhPx / 100);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const segLen = 1 / count;
  const SPR = { stiffness: 220, damping: 22, mass: 0.9 };
  const startY = Math.max(vhPx, 480); // start just off-screen bottom
  const finalY = -40;

  const [l1, l2] = splitTwoLines(slogan);

  return (
    <section ref={ref} className="relative" style={{ height: `${sectionPx}px` }}>
      {/* Use 100svh for mobile-safe sticky */}
      <div className="sticky top-0 h-[100svh] flex items-center justify-center">
        <div className="relative flex items-center justify-center w-full h-full scale-50 sm:scale-75 md:scale-100 origin-center">
          {/* Single semantic H1; visual lines are aria-hidden to avoid dup reading */}
          <h1 className="sr-only">{slogan}</h1>

          {/* Visual line 1 (single line) */}
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
                scrollYProgress={scrollYProgress}
                segLen={segLen}
                startY={startY}
                finalY={finalY}
                springCfg={SPR}
                reduce={reduce}
              />
            ))}
          </div>

          {/* Visual line 2 (single line) */}
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