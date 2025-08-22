// app/work/[...slug]/page.js
"use client";

import { useRef, useState, useEffect, useLayoutEffect } from "react";
import NoPageFound from "@/app/not-found";
import websiteCaseStudyProps from "@/app/props/website-case-study-props";
import brandingCaseStudyProps from "@/app/props/branding-case-study-props";
import CaseStudy from "@/app/components/CaseStudy";
import { motion, useSpring, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

/* ---------------- Utils ---------------- */
function lastSegment(path = "") {
  try {
    return path.split("/").filter(Boolean).pop()?.toLowerCase() ?? "";
  } catch {
    return "";
  }
}

export default function WorkPage({ params }) {
  /* ---------- Hooks (always top-level & unconditional) ---------- */
  const pathname = usePathname();
  const reduce = useReducedMotion();

  // Pointer-follow CTA
  const [cursorOn, setCursorOn] = useState(false);
  const videoRef = useRef(null);
  const [rect, setRect] = useState(null);
  const cursorX = useSpring(0, { stiffness: 300, damping: 28, mass: 0.2 });
  const cursorY = useSpring(0, { stiffness: 300, damping: 28, mass: 0.2 });

  /* ---------- Scroll-to-top on route changes ---------- */
  useLayoutEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
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

  /* ---------- Params & matches (no hooks needed) ---------- */
  const rawSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug || "";
  const slug = String(rawSlug).toLowerCase();

  const websiteMatch =
    websiteCaseStudyProps.find((item) => lastSegment(item.page) === slug) || null;

  const brandingMatch =
    brandingCaseStudyProps.find((item) => lastSegment(item.page) === slug) || null;

  const match = websiteMatch || brandingMatch;

  /* ---------- Early return AFTER hooks are declared ---------- */
  if (!match) return <NoPageFound slug={slug} />;

  // Optional fallback columns if needed by <CaseStudy />
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

  /* ---------- Pointer handlers (on the overlay so they fire) ---------- */
  const handleEnter = () => {
    const el = videoRef.current;
    if (el) setRect(el.getBoundingClientRect());
    setCursorOn(true);
  };
  const handleLeave = () => setCursorOn(false);
  const handleMove = (e) => {
    const el = videoRef.current;
    const r = rect || el?.getBoundingClientRect();
    if (!r) return;
    cursorX.set(e.clientX - r.left);
    cursorY.set(e.clientY - r.top);
  };

  return (
    <div className="flex flex-col bg-white min-h-screen isolate">
      {/* Sticky hero video */}
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
        >
          <video
            src={match.src}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          {/* Full-cover link (tabbable). We attach pointer handlers here. */}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={match.projectLink}
            className="absolute inset-0 z-[1500] block outline-none"
            aria-label={`View ${match.ctaText ?? "project"} (opens in new tab)`}
            onPointerEnter={handleEnter}
            onPointerLeave={handleLeave}
            onPointerMove={handleMove}
          >
            {/* CTA text: h2, white, no background. */}
            {reduce ? (
              <div className="absolute left-4 bottom-4">
                <h2 className="text-white text-2xl md:text-3xl font-medium">
                  {`View ${match.ctaText ?? "project"}`}
                </h2>
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
                <h2 className="text-white text-2xl md:text-3xl font-medium">
                  {`View ${match.ctaText ?? "project"}`}
                </h2>
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
        leftColumns={leftColumns}
        rightColumns={rightColumns}
      />
    </div>
  );
}