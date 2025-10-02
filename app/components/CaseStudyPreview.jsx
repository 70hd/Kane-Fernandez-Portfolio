"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

/* ---------- Lazy chunks (reduce JS on first paint) ---------- */
const Navbar = dynamic(() => import("./navbar"), {
  ssr: false,
  loading: () => null,
});
const CaseCardLazy = dynamic(() => import("./CaseCard"), {
  ssr: false,
  loading: () => null,
});

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

/** Mounts children only when close to viewport (saves hydration) */
function ViewMount({ rootMargin = "200px", children }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || visible) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { root: null, rootMargin, threshold: 0.01 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [visible, rootMargin]);

  return <div ref={ref}>{visible ? children : null}</div>;
}

/* ---------- Component ---------- */
export default function CaseStudyPreview({ items = [], noBlank = false }) {
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

  /* Idle prefetch destination pages (won’t rush critical path) */
  useEffect(() => {
    if (!items?.length) return;
    const idle = window.requestIdleCallback?.bind(window) || ((cb) => setTimeout(cb, 1500));
    const cancel = window.cancelIdleCallback?.bind(window) || clearTimeout;

    const id = idle(() => {
      items.forEach((i) => {
        if (i?.page) {
          try {
            router.prefetch?.(i.page);
          } catch {}
        }
      });
    });

    return () => cancel(id);
  }, [items, router]);

  /* Stable callbacks to reduce child re-renders */
  const handleExpand = useCallback((i) => {
    setCursorVisible(false);
    setExpandedIndex(i);
  }, []);

  const bgStyle = useMemo(
    () => ({
      backgroundColor: bg,
      transition: "background-color 300ms ease",
      cursor: "auto",
    }),
    [bg]
  );

  /* Only set video src when overlay is open (preload=none) */
  const activeVideoSrc = expandedIndex !== null ? items[expandedIndex]?.src : undefined;

  return (
    <section
      className="relative isolate z-[200] overflow-visible"
      aria-labelledby="case-studies-title"
      style={{ minHeight: "0px" }}
    >
      {/* Content layer */}
      <div className="relative -mt-[60vh]">
        <div className="w-full h-fit gap-9 pointer-events-auto" style={bgStyle}>
          {/* Navbar lazily hydrated */}
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>

          {/* Cards: mount only when near viewport, and hydrate lazily */}
          {items.map((info, idx) => (
            <ViewMount key={idx} rootMargin="400px">
              <Suspense fallback={null}>
                <CaseCardLazy
                  noBlank={noBlank}
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
                  onExpand={handleExpand}
                />
              </Suspense>
            </ViewMount>
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
            transition={{ duration: reduceMotion ? 0 : OVERLAY_MS / 1000 }}
            style={{ background: "rgba(0,0,0,0.6)" }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setExpandedIndex(null);
            }}
            onAnimationComplete={() => {
              if (!enteredRef.current) {
                enteredRef.current = true;
                const link = items[expandedIndex]?.page;
                if (!navigatedRef.current && link) {
                  navigatedRef.current = true;
                  // navigation happens after fade-in completes (feels instant to user)
                  // if you prefer to wait a tick, wrap in requestAnimationFrame
                  // requestAnimationFrame(() => router.push(link));
                  router.push(link);
                }
              }
            }}
          >
            <motion.video
              /* Delay network request until overlay opens */
              src={activeVideoSrc}
              preload="none"
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
              transition={{ duration: reduceMotion ? 0 : OVERLAY_MS / 1000, ease: "easeOut" }}
              /* keep CPU/GPU cooler on low-power devices */
              disablePictureInPicture
              controls={false}
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