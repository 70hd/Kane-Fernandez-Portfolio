"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Navbar from "./navbar";
import StickySlogan from "./StickySlogan";
import CaseCard from "./CaseCard";

/* ================= Utils ================= */
const SPRING = { stiffness: 120, damping: 20, mass: 0.9 };

function useReducedMotion() {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefers(m.matches);
    onChange();
    m.addEventListener?.("change", onChange);
    return () => m.removeEventListener?.("change", onChange);
  }, []);
  return prefers;
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

/* ================= Small Components ================= */
function FramedImage({
  src,
  alt = "",
  className = "",
  ratio = 1248 / 492,
  fit = "cover",
  position = "50% 50%",
  priority = false,
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ width: "100%", aspectRatio: String(ratio) }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        className={fit === "contain" ? "object-contain" : "object-cover"}
        style={{ objectPosition: position, backgroundColor: fit === "contain" ? "#fff" : "transparent" }}
        priority={priority}
      />
    </div>
  );
}

function InlineImg({ src, alt = "" }) {
  return (
    <span className="inline-block align-middle mx-1">
      <Image
        src={src}
        alt={alt}
        width={48}
        height={32}
        className="object-cover rounded-2xl ring-2 ring-white shadow align-middle"
      />
    </span>
  );
}

function ImageTestimonial({ text = "", images = [], author = "" }) {
  const parts = useMemo(
    () =>
      String(text)
        .split(/(\[img\d+\])/g)
        .map((part, i) => {
          const m = part.match(/\[img(\d+)\]/);
          if (!m) return <span key={i}>{part}</span>;
          const idx = Number(m[1]);
          const src = images?.[idx];
          if (!src) return null;
          return <InlineImg key={i} src={src} alt={`testimonial image ${idx + 1}`} />;
        }),
    [text, images]
  );

  return (
    <section className="w-full flex justify-center py-12 md:py-20">
      <figure className="max-w-[820px] text-center">
        <blockquote
          className="italic tracking-wide text-[#121212] inline-block leading-[1.5]"
          style={{ fontFamily: "Trivia Serif, serif", fontWeight: 400, fontSize: "clamp(20px,3.2vw,40px)" }}
        >
          {parts}
        </blockquote>
        {author && <figcaption className="mt-3 text-[#121212]/70">— {author}</figcaption>}
      </figure>
    </section>
  );
}

/* ================= Timeline (click / keys / buttons) ================= */
function ProcessTimeline({ slides = [] }) {
  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isRightSide, setIsRightSide] = useState(true);
  const containerRef = useRef(null);

  const safeSlides =
    Array.isArray(slides) && slides.length
      ? slides
      : [{ title: "", description: "" }];
  const len = safeSlides.length;
  const current = safeSlides[((index % len) + len) % len];
  const isImageSlide = Array.isArray(current.image) && current.image.length > 0;
  const isIntroSlide =
    !isImageSlide && (!!current.title || !!current.description);

  const next = () => setIndex((i) => i + 1);
  const prev = () => setIndex((i) => i - 1);

  useEffect(() => {
    const onKey = (e) => {
      if (["ArrowRight", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" && !isIntroSlide) {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isIntroSlide]);

  const handleMouseMove = (e) => {
    setPos({ x: e.clientX, y: e.clientY });
    if (isIntroSlide) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) setIsRightSide(e.clientX >= rect.left + rect.width / 2);
  };

  const handleClick = () => {
    isIntroSlide ? next() : isRightSide ? next() : prev();
  };

  return (
    <div
      ref={containerRef}
      className="flex w-full dynamic-padding text-[#121212] items-center justify-center relative z-0"
      style={{ cursor: "none" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      {isIntroSlide && (
        <div className="flex text-[#121212] flex-col h-full w-full gap-6 items-center">
          {current.title && <h3>{current.title}</h3>}
          {current.description && (
            <p className="max-w-[606px] w-full text-center">
              {current.description}
            </p>
          )}
        </div>
      )}
      {isImageSlide && current.image.length === 1 && (
        <div className="flex flex-col items-start w-full gap-3 overflow-hidden">
          <FramedImage
            src={current.image[0]}
            ratio={current.ratio?.[0] ?? 1248 / 492}
            fit={current.fit?.[0] || "cover"}
            position={current.position?.[0] || "50% 50%"}
            className="w-full"
          />
          {current.text && <p className="max-w-[720px]">{current.text}</p>}
        </div>
      )}
      {isImageSlide && current.image.length === 2 && (
        <div className="flex flex-col gap-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <FramedImage
              src={current.image[0]}
              ratio={current.ratio?.[0] ?? 392 / 492}
              fit={current.fit?.[0] || "cover"}
              position={current.position?.[0] || "50% 50%"}
              className="w-full"
            />
            <FramedImage
              src={current.image[1]}
              ratio={current.ratio?.[1] ?? 392 / 492}
              fit={current.fit?.[1] || "cover"}
              position={current.position?.[1] || "50% 50%"}
              className="hidden md:block w-full"
            />
          </div>
          {current.text && <p className="max-w-[720px]">{current.text}</p>}
        </div>
      )}

      {!isIntroSlide && !isImageSlide && (
        <p className="text-center text-black/60">No process content yet.</p>
      )}

      {hover && (
        <div
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            transform: `translate(${pos.x}px, ${pos.y}px)`,
            pointerEvents: "none",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              transform: `translate(12px,16px) rotate(${
                isIntroSlide ? -90 : isRightSide ? -90 : 90
              }deg)`,
            }}
          >
            <Image
              src="/black-downward-arrow.svg"
              alt="downward-arrow"
              width={32}
              height={32}
              className="opacity-90"
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= Page ================= */
export default function CaseStudy({ websiteMatch, match, alt }) {
  const reduce = useReducedMotion();
  const [bg, setBg] = useState("transparent");

  useEffect(() => {
    setBg("transparent");
    const r = requestAnimationFrame(() => setBg(match.color));
    return () => cancelAnimationFrame(r);
  }, [match.color]);

  const presentation = match.presentation ?? [];
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [expandedIndex, setExpandedIndex] = useState(null);

  return (
    <div className="relative flex flex-col bg-white min-h-screen">
      <Navbar />

      {websiteMatch ? (
        <div className="flex flex-col">
          {/* Intro */}
          <header className="relative z-20 my-24 md:my-48 flex flex-col gap-6 items-center w-full dynamic-padding text-center">
            <Image src={match.companyLogo} width={285} height={285} alt={alt || `${match.companyName} logo`} />
            <p className="max-w-[606px] text-[#121212]">{match.projectDescription}</p>
          </header>

          {/* Timeline */}
          <section
            className="y-dynamic-padding w-full my-24 h-[820px] flex justify-center items-center"
            style={{
              minHeight: "min(684px, 90vh)",
              backgroundColor: bg,
              transition: reduce ? "none" : "background-color 450ms ease",
            }}
            aria-label="Project process"
          >
            <div className="w-full max-w-[1248px] flex justify-center px-4 md:px-8 mx-auto">
              <ProcessTimeline slides={match.timeLineImages} />
            </div>
          </section>

          {/* Testimonial */}
          <ImageTestimonial
            text={
              match.testimonialText ||
              "Kane is warm and friendly [img0], with passion [img1] and proven dedication [img2]."
            }
            images={
              Array.isArray(match.testimonialImages)
                ? match.testimonialImages
                : ["/image.png", "/image.png", "/image.png"]
            }
            author={match.testimonialAuthor || ""}
          />
        </div>
      ) : (
        <main>
          <StickySlogan match={match} slogan={match.slogan} images={match.animationImages || []} />
          {presentation.map((info, idx) => (
            <CaseCard
            noBlank={true}
              key={idx}
              SPRING={SPRING}
              linkAll={false}
              idx={idx}
              info={info}
              cursorVisible={cursorVisible}
              cursorPos={cursorPos}
              setActiveColor={setBg}
              setCursorVisible={setCursorVisible}
              setCursorPos={setCursorPos}
              expandedIndex={expandedIndex}
              onExpand={(i) => {
                setCursorVisible(false);
                setExpandedIndex(i);
              }}
            />
          ))}
        </main>
      )}
    </div>
  );
}