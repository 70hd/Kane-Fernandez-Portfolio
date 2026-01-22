"use client";

import {
  motion,
  MotionConfig,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useRef, useState, useEffect, useMemo, memo } from "react";

/* ---------------- Tunables ---------------- */
const START_TOP = 144;
const BOTTOM_MARGIN = 96;
const ARROW_HEIGHT = 36;
const SPRING = { stiffness: 220, damping: 18, mass: 0.9 };

/* ---------------- Lazy-load heavy components ---------------- */
const CaseStudyPreview = dynamic(
  () => import("../components/CaseStudyPreview"),
  {
    ssr: false,
    loading: () => <div aria-hidden="true" style={{ height: 1 }} />,
  }
);

/* ---------------- HoverWord (memoized) ---------------- */
const HoverWord = memo(function HoverWord({ text, active, setHover }) {
  const reduce = useReducedMotion();

  const handleClick = () => {
    setHover(text);
    if (text === "Website" || text === "Branding" || text === "Blog") {
      if (reduce) {
        window.scrollBy({ top: 4000, left: 0, behavior: "auto" });
      } else {
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
});

/* ---------------- PinnedIntro ---------------- */
function PinnedIntro({ hover, setHover }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Base transforms
  const heroOpacityT = useTransform(
    scrollYProgress,
    [0.0, 0.16, 0.24],
    [1, 1, 0]
  );
  const heroYT = useTransform(scrollYProgress, [0.0, 0.24], [0, -40]);

  const aboutOpacityT = useTransform(
    scrollYProgress,
    [0.18, 0.28, 0.46, 0.62],
    [0, 1, 1, 0]
  );
  const aboutYT = useTransform(scrollYProgress, [0.18, 0.62], [16, -36]);

  const servicesOpacityT = useTransform(
    scrollYProgress,
    [0.5, 0.64, 0.86, 1.0],
    [0, 1, 1, 1]
  );
  const servicesYT = useTransform(scrollYProgress, [0.5, 2], [14, -20]);

  // Reduced-motion aware mappings
  const heroOpacity = useSpring(
    useTransform(heroOpacityT, (v) => (reduce ? 1 : v)),
    SPRING
  );
  const heroY = useSpring(
    useTransform(heroYT, (v) => (reduce ? 0 : v)),
    SPRING
  );

  const aboutOpacity = useSpring(
    useTransform(aboutOpacityT, (v) => (reduce ? 1 : v)),
    SPRING
  );
  const aboutY = useSpring(
    useTransform(aboutYT, (v) => (reduce ? 0 : v)),
    SPRING
  );

  const servicesOpacity = useSpring(
    useTransform(servicesOpacityT, (v) => (reduce ? 1 : v)),
    SPRING
  );
  const servicesY = useSpring(
    useTransform(servicesYT, (v) => (reduce ? 0 : v)),
    SPRING
  );

  // Pointer-events
  const aboutPE = useTransform(aboutOpacity, (v) =>
    reduce ? "auto" : v > 0.35 ? "auto" : "none"
  );
  const servicesPE = useTransform(servicesOpacity, (v) =>
    reduce ? "auto" : v > 0.35 ? "auto" : "none"
  );

  // z-indexes
  const heroZ = useTransform(heroOpacity, (v) =>
    Math.round((Number(v) || 0) * 100)
  );
  const aboutZ = useTransform(aboutOpacity, (v) =>
    Math.round((Number(v) || 0) * 100)
  );
  const servicesZ = useTransform(servicesOpacity, (v) =>
    Math.round((Number(v) || 0) * 100)
  );

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
          className="absolute inset-0 flex items-center justify-center will-change-transform transform-gpu"
        >
          <h1 className="text-center">
            Branding and Website Design for Small Businesses in San Francisco
          </h1>
        </motion.div>

        {/* About */}
        <motion.div
          style={{
            opacity: aboutOpacity,
            y: aboutY,
            pointerEvents: aboutPE,
            zIndex: aboutZ,
          }}
          className="absolute inset-0 flex items-center justify-center will-change-transform transform-gpu"
        >
          <article className="max-w-[630px] px-3 text-center w-full flex flex-col dynamic-gap-3">
            <p>
              Kane Fernandez is a 16-year-old web designer and developer who
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
          className="absolute inset-0 flex items-center justify-center will-change-transform transform-gpu"
        >
          <h2 className="text-start">
              <div className="pl-2">
            <HoverWord text="Website" active={hover} setHover={setHover} />
            </div>
       
            <span className="px-4" aria-hidden="true">
              —
            </span>
            <HoverWord text="Branding" active={hover} setHover={setHover} />
     
            <div className="pl-2">
            <HoverWord text="Blog" active={hover} setHover={setHover} />
            </div>
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
    window.addEventListener("resize", setSize, { passive: true });
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
      className="fixed left-0 right-0 w-full flex justify-between x-dynamic-padding z-[-10] will-change-transform transform-gpu"
      style={{ top: START_TOP, y, pointerEvents: "none" }}
      aria-hidden="true"
    >
      <Image
        src="/downward-arrow.svg"
        width={55}
        height={36}
        alt=""
        loading="lazy"
        decoding="async"
      />
      <Image
        src="/downward-arrow.svg"
        width={55}
        height={36}
        alt=""
        loading="lazy"
        decoding="async"
      />
    </motion.div>
  );
}

/* ---------------- Page (DEFAULT EXPORT) ---------------- */
export default function Page() {
  const [hover, setHover] = useState("Website");
  const [items, setItems] = useState(null);

  // Load selected dataset
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const mod =
        hover === "Website"
          ? await import("../props/website-case-study-props")
          : await import("../props/branding-case-study-props");
      if (!cancelled) setItems(mod.default || mod);
    })();
    return () => {
      cancelled = true;
    };
  }, [hover]);
    useEffect(() => {
    let cancelled = false;
    (async () => {
      const mod =
        hover === "Blog" && await import("../props/blog-props")
      if (!cancelled) setItems(mod.default || mod);
    })();
    return () => {
      cancelled = true;
    };
  }, [hover]);

  // Preload the other dataset on idle
  useEffect(() => {
    const other =
      hover === "Website"
        ? () => import("../props/branding-case-study-props")
        : () => import("../props/website-case-study-props");

    const preload = () => {
      try {
        other();
      } catch {}
    };

    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(preload, { timeout: 1500 });
      return () => {
        cancelIdleCallback && cancelIdleCallback(id);
      };
    } else {
      const t = setTimeout(preload, 600);
      return () => clearTimeout(t);
    }
  }, [hover]);
function scrollToWork() {
  if (typeof window === "undefined") return;

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    // No fancy smooth scroll for reduced-motion users
    window.scrollBy({ top: 3500, left: 0, behavior: "auto" });
  } else {
    const step = () =>
      window.scrollBy({ top: 1500, left: 0, behavior: "smooth" });

    step();
    setTimeout(step, 400);
    setTimeout(step, 800);
  }
}
  return (
    <MotionConfig reducedMotion="user" transition={SPRING}>
    <div className="sticky top-0 z-50 border-[#121212]/25 border-b-[.5px] w-full justify-between h-fit flex x-dynamic-padding py-6 items-center">
 <Link
  href="./"
  className="cursor-pointer text-sm sm:text-base underline-offset-4 hover:underline"
>
  <h3>Home</h3>
</Link>
  <button
    type="button"
    onClick={scrollToWork}
    className="cursor-pointer text-sm sm:text-base underline-offset-4 hover:underline"
  >
   <h3>View Work</h3> 
  </button>

</div>
      {/* JSON-LD: LocalBusiness */}
      <Script
        id="ld-local-business"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Kane Fernandez — Branding & Web Design",
            url: "https://kanehfernandez.com",
            image: "https://kanehfernandez.com/og-image.jpg",
            description:
              "Branding and website design for small businesses in San Francisco and the Bay Area.",
            areaServed: { "@type": "City", name: "San Francisco" },
            address: {
              "@type": "PostalAddress",
              streetAddress: "4123 24th St",
              addressLocality: "San Francisco",
              addressRegion: "CA",
              postalCode: "94114",
              addressCountry: "US",
            },
            sameAs: ["https://www.linkedin.com/in/kanehfernandez"],
            telephone: "+1-650-289-8581",
          }),
        }}
      />

      {/* JSON-LD: Service */}
      <Script
        id="ld-service"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: "Branding and Website Design",
            areaServed: "San Francisco Bay Area",
            provider: {
              "@type": "Person",
              name: "Kane Fernandez",
              url: "https://kanehfernandez.com",
            },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Branding & Web Design Packages",
              itemListElement: [
                { "@type": "Offer", name: "Brand Identity" },
                { "@type": "Offer", name: "Website Design & Development" },
                { "@type": "Offer", name: "E-commerce (Shopify/Squarespace)" },
              ],
            },
          }),
        }}
      />

      <main className="relative h-fit overflow-visible">
        <DownArrows />
        <PinnedIntro hover={hover} setHover={setHover} />
        {items && (
          <CaseStudyPreview
            noBlank={false}
            items={items}
            aria-label={`${hover} case studies`}
            hover={hover}
          />
        )}
      </main>
    </MotionConfig>
  );
}
