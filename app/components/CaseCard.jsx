import {
  useMotionTemplate,
  useMotionValueEvent,
  motion,
  useScroll,
  useSpring,
  useTransform,
  useInView,
} from "framer-motion";
import Image from "next/image";
import React, { memo, useCallback, useMemo, useRef, useState, useEffect } from "react";
import TextCursor from "./TextCursor";

/* ---- tiny helper (not a hook) ---- */
function getVideoSrc(info) {
  return info?.src || info?.video || "";
}

function useReducedMotionPref() {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setPrefers(!!m.matches);
    on();
    m.addEventListener?.("change", on);
    return () => m.removeEventListener?.("change", on);
  }, []);
  return prefers;
}

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
  /* ====== refs / simple derived booleans that DO NOT affect hook calls ====== */
  const ref = useRef(null);
  const imgAlt = info.companyName ? `${info.companyName} case study` : "Case study image";
  const titleId = `casecard-title-${idx}`;
  const descId = `casecard-desc-${idx}`;
  const href = info.page || info.link || "";
  const isVideo = Boolean(info.video || info.src?.endsWith?.(".mp4"));
  const videoSrcRaw = getVideoSrc(info);
  const isEdge = info.firstIndex || info.lastIndex;
  const showCursorForThisCard = linkAll || isEdge;

  /* ====== hooks (always called, same order, no early returns) ====== */
  const reduce = useReducedMotionPref();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.7", "end 0.3"],
  });

  // avoid ternaries inside useTransform args to keep linter happy
  const fadeEnd = reduce ? 1 : 0;
  const scaleEnd = reduce ? 1 : 0.98;
  const blurEnd = reduce ? 0 : 8;

  const opacityT = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, fadeEnd]);
  const scaleT = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, scaleEnd]);
  const blurT = useTransform(scrollYProgress, [0, 0.8, 1], [0, 0, blurEnd]);

  const opacity = useSpring(opacityT, SPRING);
  const scale = useSpring(scaleT, SPRING);
  const blurPx = useSpring(blurT, SPRING);
  const filter = useMotionTemplate`blur(${blurPx}px)`;

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v > 0.35 && v < 0.65 && info.color) setActiveColor?.(info.color);
  });

  const inView = useInView(ref, { margin: "200px 0px 200px 0px", amount: 0.1 });
  const [wantsVideo, setWantsVideo] = useState(false);
  const shouldLoadVideo = isVideo && (inView || wantsVideo);

  useEffect(() => {
    if (!isVideo) return;
    const el = ref.current?.querySelector("video");
    if (!el) return;
    if (inView) {
      if (shouldLoadVideo) el.play?.();
    } else {
      el.pause?.();
    }
  }, [isVideo, inView, shouldLoadVideo]);

  /* ====== stable handlers (created after hooks) ====== */
  const onEnter = useCallback(() => {
    setCursorVisible?.(showCursorForThisCard);
    if (isVideo) setWantsVideo(true);
  }, [setCursorVisible, showCursorForThisCard, isVideo]);

  const onLeave = useCallback(() => setCursorVisible?.(false), [setCursorVisible]);

  const onMove = useCallback(
    (e) => showCursorForThisCard && setCursorPos?.({ x: e.clientX, y: e.clientY }),
    [showCursorForThisCard, setCursorPos]
  );

  const onClickExpand = useCallback(() => {
    if (isVideo) {
      setWantsVideo(true);
      onExpand?.(idx);
    }
  }, [isVideo, idx, onExpand]);

  const cursorActive = cursorVisible && expandedIndex === null && showCursorForThisCard;

  /* ====== render (no early returns before hooks) ====== */
  return (
    <motion.article
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={isVideo ? descId : undefined}
      style={{ opacity, scale, filter, willChange: reduce ? "auto" : "opacity, transform, filter" }}
      className="w-full dynamic-padding flex flex-col gap-4"
      onFocus={onEnter}
      onBlur={onLeave}
    >
      {href ? (
        <a
          href={cursorActive ? href : undefined}
          target={noBlank && "_blank"}
          rel={noBlank ? "noopener noreferrer" : undefined}
          className={`relative block w-full ${cursorActive ? "cursor-pointer" : "cursor-default"}`}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          onMouseMove={onMove}
          onPointerDown={() => isVideo && setWantsVideo(true)}
          aria-label={info.companyName ? `Open ${info.companyName} case study` : "Open case study"}
        >
          {isVideo ? (
            <motion.video
              src={shouldLoadVideo ? videoSrcRaw : undefined}
              data-src={videoSrcRaw}
              className="w-full h-auto block"
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              style={{ willChange: reduce ? "auto" : "transform, opacity" }}
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
              loading="lazy"
              decoding="async"
            />
          )}
        </a>
      ) : (
        <button
          type="button"
          onClick={onClickExpand}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          onMouseMove={onMove}
          onPointerDown={() => isVideo && setWantsVideo(true)}
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
              src={shouldLoadVideo ? videoSrcRaw : undefined}
              data-src={videoSrcRaw}
              className="w-full h-auto block"
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              style={{ willChange: reduce ? "auto" : "transform, opacity" }}
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
              loading="lazy"
              decoding="async"
            />
          )}
        </button>
      )}

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

      <TextCursor text={info.cursorText || "View Case Study"} pos={cursorPos} visible={cursorActive} />
    </motion.article>
  );
});

export default CaseCard;