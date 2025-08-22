import {
  useMotionTemplate,
  useMotionValueEvent,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import React, { memo, useRef } from "react";
import TextCursor from "./TextCursor";

const CaseCard = memo(function CaseCard({
  info = {},
  noBlank,
  idx = 0,
  setActiveColor,
  setCursorVisible,
  setCursorPos,
  cursorPos,
  cursorVisible,
  onExpand,
  SPRING,
  expandedIndex,
  linkAll = false,
}) {
  const ref = useRef(null);

  /* ---- Scroll-driven polish ---- */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.7", "end 0.3"],
  });

  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0]), SPRING);
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0.98]), SPRING);
  const blurPx = useSpring(useTransform(scrollYProgress, [0, 0.8, 1], [0, 0, 8]), SPRING);
  const filter = useMotionTemplate`blur(${blurPx}px)`;

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v > 0.35 && v < 0.65 && info.color) setActiveColor?.(info.color);
  });

  /* ---- Derive state ---- */
  const isVideo = Boolean(info.video || info.src?.endsWith?.(".mp4"));
  const href = info.page || info.link || "";
  const isEdge = info.firstIndex || info.lastIndex;
  const showCursorForThisCard = linkAll || isEdge;
  const cursorActive = cursorVisible && expandedIndex === null && showCursorForThisCard;

  /* ---- Common handlers ---- */
  const onEnter = () => setCursorVisible?.(showCursorForThisCard);
  const onLeave = () => setCursorVisible?.(false);
  const onMove = (e) =>
    showCursorForThisCard && setCursorPos?.({ x: e.clientX, y: e.clientY });

  const imgAlt = info.companyName ? `${info.companyName} case study` : "Case study image";
  const titleId = `casecard-title-${idx}`;
  const descId = `casecard-desc-${idx}`;

  return (
    <motion.article
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={isVideo ? descId : undefined}
      style={{ opacity, scale, filter, willChange: "opacity, transform, filter" }}
      className="w-full dynamic-padding flex flex-col gap-4"
    >
      {/* Media + Link/Action */}
      {href ? (
        <a
          href={cursorActive ? href : undefined}
          target={noBlank && "_blank"}
          className={`relative block w-full ${cursorActive ? "cursor-pointer" : "cursor-default"}`}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          onMouseMove={onMove}
          aria-label={info.companyName ? `Open ${info.companyName} case study` : "Open case study"}
        >
          {isVideo ? (
            <motion.video
              src={info.src || info.video}
              className="w-full h-auto block"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <Image
              src={info.image}
              width={1247}
              height={669}
              className="w-full h-auto"
              alt={imgAlt}
              sizes="(min-width:1024px) 80vw, 100vw"
              priority={false}
            />
          )}
        </a>
      ) : (
        <button
          type="button"
          onClick={(e) => {
            // Only expand when this card actually shows a video
            if (isVideo) onExpand?.(idx);
          }}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          onMouseMove={onMove}
          className="relative block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-black/50 rounded-lg"
          aria-label={
            isVideo
              ? info.companyName
                ? `Preview ${info.companyName} video`
                : "Preview case study video"
              : imgAlt
          }
        >
          {isVideo ? (
            <motion.video
              src={info.src || info.video}
              className="w-full h-auto block"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <Image
              src={info.image}
              width={1247}
              height={669}
              className="w-full h-auto"
              alt={imgAlt}
              sizes="(min-width:1024px) 80vw, 100vw"
              priority={false}
            />
          )}
        </button>
      )}

      {/* Text meta (always render for semantics; hide if empty) */}
      <div className="flex flex-col text-[#121212]">
        {!!info.companyName && (
          <h3 id={titleId} className="text-xl md:text-2xl font-medium">
            {info.companyName}
          </h3>
        )}
        {!!info.desc && (
          <p id={descId} className="text-[#121212]/80">
            {info.desc}
          </p>
        )}
      </div>

      {/* Custom cursor */}
      <TextCursor text={info.cursorText || "View Case Study"} pos={cursorPos} visible={cursorActive} />
    </motion.article>
  );
});

export default CaseCard;