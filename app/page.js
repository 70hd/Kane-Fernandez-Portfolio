"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import Image from "next/image";
import { useRef, useState, useEffect, useMemo } from "react";
import CaseStudyPreview from "./components/CaseStudyPreview";
import WebsiteCaseStudyProps from "./props/website-case-study-props";
import BrandingCaseStudyProps from "./props/branding-case-study-props";

/* ---------------- Tunables ---------------- */
const START_TOP = 144;
const BOTTOM_MARGIN = 96;
const ARROW_HEIGHT = 36;
const SPRING = { stiffness: 220, damping: 18, mass: 0.9 };

/* ---------------- HoverWord (button for a11y, same visuals) ---------------- */
function HoverWord({ text, active, setHover }) {
  const reduce = useReducedMotion();

  const handleClick = () => {
    setHover(text);
    if (text === "Branding") {
      if (reduce) {
        window.scrollBy({ top: 6000, left: 0, behavior: "auto" });
      } else {
        // Keep the same multi-step smooth scroll feel
        const step = () =>
          window.scrollBy({ top: 2000, left: 0, behavior: "smooth" });
        step();
        setTimeout(step, 400);
        setTimeout(step, 800);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active === text}
      className={active === text ? "underline" : ""}
      style={{
        filter: active === text ? "none" : "blur(2px)",
        cursor: "pointer",
        transition: "filter 0.3s ease",
        background: "none",
        border: 0,
        padding: 0,
        margin: 0,
        color: "inherit",
        font: "inherit",
      }}
    >
      {text}
      <span className="sr-only">{active === text ? " (selected)" : ""}</span>
    </button>
  );
}

/* ---------------- PinnedIntro ---------------- */
function PinnedIntro({ hover, setHover }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const heroOpacity = useSpring(
    useTransform(scrollYProgress, [0.0, 0.16, 0.24], [1, 1, 0]),
    SPRING
  );
  const heroY = useSpring(
    useTransform(scrollYProgress, [0.0, 0.24], [0, -40]),
    SPRING
  );

  const aboutOpacity = useSpring(
    useTransform(scrollYProgress, [0.18, 0.28, 0.46, 0.62], [0, 1, 1, 0]),
    SPRING
  );
  const aboutY = useSpring(
    useTransform(scrollYProgress, [0.18, 0.62], [16, -36]),
    SPRING
  );

  const servicesOpacity = useSpring(
    useTransform(scrollYProgress, [0.5, 0.64, 0.86, 1.0], [0, 1, 1, 1]),
    SPRING
  );
  const servicesY = useSpring(
    useTransform(scrollYProgress, [0.5, 2], [14, -20]),
    SPRING
  );

  const aboutPE = useTransform(aboutOpacity, (v) =>
    v > 0.35 ? "auto" : "none"
  );
  const servicesPE = useTransform(servicesOpacity, (v) =>
    v > 0.35 ? "auto" : "none"
  );
  const heroZ = useTransform(heroOpacity, (v) => Math.round(v * 100));
  const aboutZ = useTransform(aboutOpacity, (v) => Math.round(v * 100));
  const servicesZ = useTransform(servicesOpacity, (v) => Math.round(v * 100));

  return (
    <section ref={ref} className="relative z-0 h-[600vh]" aria-label="Intro">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-visible [isolation:isolate]">
        {/* Hero */}
        <motion.div
          style={{
            opacity: heroOpacity,
            y: heroY,
            pointerEvents: "none",
            zIndex: heroZ,
          }}
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden={false}
        >
          <h1 className="text-center">Kane Fernandez</h1>
        </motion.div>

        {/* About */}
        <motion.div
          style={{
            opacity: aboutOpacity,
            y: aboutY,
            pointerEvents: aboutPE,
            zIndex: aboutZ,
          }}
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden={false}
        >
<article className="max-w-[630px] px-3 text-center w-full flex flex-col dynamic-gap-3">
  <p>
    Kane Fernandez is a 15-year-old web designer and developer who
    creates high-end sites for small businesses. He’s been mentored by{" "}
    <a
      href="https://www.linkedin.com/in/ryandavidholmes"
      target="_blank"
      rel="noopener noreferrer"
      className="underline decoration-[.1px]"
    >
      Ryan Holmes (Postscript)
    </a>
    , <br />
    <a
      href="https://www.linkedin.com/in/asjohnson"
      target="_blank"
      rel="noopener noreferrer"
      className="underline decoration-[.1px]"
    >
      Andy Johnson (Uniteddsn)
    </a>
    , and{" "}
    <a
      href="https://www.linkedin.com/in/wittmer/"
      target="_blank"
      rel="noopener noreferrer"
      className="underline decoration-[.1px]"
    >
      Dan Wittmer (YouTube)
    </a>
    .<br />
    Have an idea?{" "}
    <a
      href="mailto:kanehfernandez@gmail.com"
      className="underline decoration-[.1px]"
    >
      Get in touch
    </a>
  </p>
</article>
        </motion.div>

        {/* Services */}
        <motion.div
          style={{
            opacity: servicesOpacity,
            y: servicesY,
            pointerEvents: servicesPE,
            zIndex: servicesZ,
          }}
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden={false}
        >
          <h2 className="text-center">
            <HoverWord text="Website" active={hover} setHover={setHover} />
            <br />{" "}
            <span className="px-4" aria-hidden="true">
              &
            </span>
            <HoverWord text="Branding" active={hover} setHover={setHover} />
            <br />
            Design
          </h2>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- DownArrows (decorative) ---------------- */
function DownArrows() {
  const { scrollYProgress } = useScroll();
  const [vh, setVh] = useState(0);

  useEffect(() => {
    const setSize = () => setVh(window.innerHeight || 0);
    setSize();
    window.addEventListener("resize", setSize);
    return () => window.removeEventListener("resize", setSize);
  }, []);

  const travel = useMemo(() => {
    if (!vh) return 0;
    const targetTop = vh - BOTTOM_MARGIN - ARROW_HEIGHT;
    return Math.max(targetTop - START_TOP, 0);
  }, [vh]);

  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, travel]),
    SPRING
  );

  return (
    <motion.div
      className="fixed left-0 right-0 w-full flex justify-between x-dynamic-padding z-[-10]"
      style={{ top: START_TOP, y, pointerEvents: "none" }}
      aria-hidden="true"
    >
      <Image src="/downward-arrow.svg" width={55} height={36} alt="" />
      <Image src="/downward-arrow.svg" width={55} height={36} alt="" />
    </motion.div>
  );
}

/* ---------------- Page ---------------- */
export default function Page() {
  const [hover, setHover] = useState("Website");

  return (
    <main className="relative h-fit overflow-visible">
      <DownArrows />
      <PinnedIntro hover={hover} setHover={setHover} />
      <CaseStudyPreview
        items={
          hover === "Website" ? WebsiteCaseStudyProps : BrandingCaseStudyProps
        }
        aria-label={`${hover} case studies`}
      />
    </main>
  );
}
