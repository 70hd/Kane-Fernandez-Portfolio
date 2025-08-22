"use client";
import { useRef, useState, useEffect, useLayoutEffect } from "react";
import NoPageFound from "@/app/not-found";
import websiteCaseStudyProps from "@/app/props/website-case-study-props";
import brandingCaseStudyProps from "@/app/props/branding-case-study-props";
import CaseStudy from "@/app/components/CaseStudy";
import { motion, useSpring, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { use } from "react";

/* ---------------- Utils ---------------- */
function lastSegment(path = "") {
  try {
    return path.split("/").filter(Boolean).pop()?.toLowerCase() ?? "";
  } catch {
    return "";
  }
}

export default function WorkPage({ params }) {
  // App Router already provides params synchronously
const { slug: rawSlug } = use(params);
const slug = (Array.isArray(rawSlug) ? rawSlug[0] : rawSlug || "")
  .toString()
  .toLowerCase();
  const pathname = usePathname();
  const reduce = useReducedMotion();

  /* Scroll-to-top on route change (keeps current look/feel) */
  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    document.documentElement.style.scrollBehavior = prev;
  }, [pathname]);

  useEffect(() => {
    const id = setTimeout(() => window.scrollTo(0, 0), 0);
    return () => clearTimeout(id);
  }, [pathname]);

 

  const websiteMatch =
    websiteCaseStudyProps.find((item) => lastSegment(item.page) === slug) ||
    null;
  const brandingMatch =
    brandingCaseStudyProps.find((item) => lastSegment(item.page) === slug) ||
    null;

  const match = websiteMatch || brandingMatch;
  if (!match) return <NoPageFound slug={slug} />;

  // Fallback image columns if no animationImages provided (unchanged look)
  const leftColumns = match.animationImages?.length
    ? []
    : [
        ["/image.png", "/image.png"],
        ["/image.png", "/image.png"],
      ];
  const rightColumns = match.animationImages?.length
    ? []
    : [
        ["/image.png", "/image.png"],
        ["/image.png", "/image.png"],
      ];

  /* Pointer-follow CTA (same look; now keyboard & reduce-motion friendly) */
  const [cursorOn, setCursorOn] = useState(false);
  const [rect, setRect] = useState(null);
  const videoRef = useRef(null);

  const cursorX = useSpring(0, { stiffness: 300, damping: 28, mass: 0.2 });
  const cursorY = useSpring(0, { stiffness: 300, damping: 28, mass: 0.2 });

  const handleEnter = () => {
    const el = videoRef.current;
    if (el) setRect(el.getBoundingClientRect());
    setCursorOn(true);
  };
  const handleLeave = () => setCursorOn(false);
  const handleMove = (e) => {
    const el = videoRef.current;
    if (!el) return;
    const r = rect || el.getBoundingClientRect();
    if (!r) return;
    cursorX.set(e.clientX - r.left);
    cursorY.set(e.clientY - r.top);
  };

  return (
    <div className="flex flex-col bg-white min-h-screen isolate">
      {/* Sticky hero video section (visuals unchanged) */}
      <section style={{ height: "150vh", position: "relative" }}>
        <div
          ref={videoRef}
          className="relative z-0"
          style={{
            position: "sticky",
            top: 0,
            width: "100vw",
            height: "95vh",
            overflow: "hidden",
            background: "#000",
          }}
          onPointerEnter={handleEnter}
          onPointerLeave={handleLeave}
          onPointerMove={handleMove}
        >
          <video
            src={match.src}
            autoPlay
            muted
            loop
            playsInline
            // Decorative; keeps same look while staying quiet to AT
            aria-hidden="true"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          {/* Full-cover link is always tabbable for keyboard users */}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={match.projectLink}
            className="absolute inset-0 z-[1500] block"
            aria-label={`View ${match.ctaText ?? "project"} (opens in new tab)`}
          >
            {/* Keeps the same floating text look when pointer is inside.
                For reduced motion or keyboard focus, we show a fixed
                corner badge instead so it’s still perceivable without animation. */}
            {reduce ? (
              <div className="absolute left-4 bottom-4">
                <h3>{`View ${match.ctaText ?? "project"}`}</h3>
              </div>
            ) : cursorOn ? (
              <motion.div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  x: cursorX,
                  y: cursorY,
                  translateX: "12px",
                  translateY: "16px",
                }}
              >
                <h3>{`View ${match.ctaText ?? "project"}`}</h3>
              </motion.div>
            ) : null}
            <span className="sr-only">{`View ${match.ctaText ?? "project"}`}</span>
          </a>
        </div>
      </section>

      <CaseStudy
        match={match}
        alt="company logo"
        websiteMatch={websiteMatch}
      />
    </div>
  );
}