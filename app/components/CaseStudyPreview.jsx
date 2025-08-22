"use client";

import Navbar from "./navbar";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import CaseCard from "./CaseCard";

/* ---------- Tunables ---------- */
const SPRING = { stiffness: 120, damping: 20, mass: 0.9 };
const OVERLAY_MS = 200;

/* ---------- Helpers ---------- */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(!!m.matches);
    update();
    m.addEventListener?.("change", update);
    return () => m.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

export default function CaseStudyPreview({ items = [] }) {
  const router = useRouter();
  const [bg, setBg] = useState("#ffffff");
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const navigatedRef = useRef(false);
  const enteredRef = useRef(false);
  const overlayRef = useRef(null);
  const reduceMotion = usePrefersReducedMotion();

  /* Lock page scroll when overlay is open */
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.overflow;
    if (expandedIndex !== null) root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [expandedIndex]);

  /* Reset flags whenever a new item expands */
  useEffect(() => {
    navigatedRef.current = false;
    enteredRef.current = false;
  }, [expandedIndex]);

  /* Close overlay with Escape */
  useEffect(() => {
    if (expandedIndex === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") setExpandedIndex(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expandedIndex]);

  /* Focus the overlay for screen readers */
  useEffect(() => {
    if (expandedIndex !== null) overlayRef.current?.focus();
  }, [expandedIndex]);

  return (
    <section
      className="relative isolate z-[200] overflow-visible"
      aria-labelledby="case-studies-title"
      style={{ minHeight: "0px" }}
    >
      <h2 id="case-studies-title" className="sr-only">
        Case studies
      </h2>

      {/* Content layer */}
      <div className="absolute inset-x-0" style={{ top: "-65vh" }}>
        <div
          ref={null}
          className="w-full h-fit gap-9 pointer-events-auto"
          style={{
            backgroundColor: bg,
            transition: "background-color 400ms ease",
            cursor: "auto",
          }}
        >
          <Navbar />

          {items.map((info, idx) => (
            <CaseCard
              key={idx}
              linkAll
              SPRING={SPRING}
              idx={idx}
              info={info}
              setActiveColor={setBg}
              cursorVisible={cursorVisible}
              cursorPos={cursorPos}
              setCursorVisible={setCursorVisible}
              setCursorPos={setCursorPos}
              expandedIndex={expandedIndex}
              onExpand={(i) => {
                setCursorVisible(false);
                setExpandedIndex(i);
              }}
            />
          ))}
        </div>
      </div>

      {/* Overlay preview */}
      <AnimatePresence>
        {expandedIndex !== null && (
          <motion.div
            key="overlay"
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label="Opening case study preview"
            tabIndex={-1}
            className="fixed inset-0 z-[10000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: reduceMotion ? 0 : OVERLAY_MS / 1000,
            }}
            style={{ background: "rgba(0,0,0,0.6)" }}
            onClick={(e) => {
              // Click outside video closes overlay
              if (e.target === e.currentTarget) setExpandedIndex(null);
            }}
            onAnimationComplete={() => {
              if (!enteredRef.current) {
                enteredRef.current = true;
                const link = items[expandedIndex]?.page;
                if (!navigatedRef.current && link) {
                  navigatedRef.current = true;
                  router.push(link);
                }
              }
            }}
          >
            <motion.video
              src={items[expandedIndex]?.src}
              autoPlay
              muted
              loop
              playsInline
              aria-label="Case study preview video"
              style={{
                position: "absolute",
                inset: 0,
                width: "100vw",
                height: "100vh",
                objectFit: "cover",
              }}
              initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }}
              transition={{
                duration: reduceMotion ? 0 : OVERLAY_MS / 1000,
                ease: "easeOut",
              }}
            />
            <button
              type="button"
              onClick={() => setExpandedIndex(null)}
              className="absolute top-4 right-4 rounded-lg px-3 py-2 text-white/90 bg-black/40 backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Close preview"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}