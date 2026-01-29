"use client";

import { useMemo, use as usePromise } from "react";
import Image from "next/image";
import Navbar from "../../components/navbar";
import NoPageFound from "../../not-found";
import websiteCaseStudyProps from "../../props/website-case-study-props";
import brandingCaseStudyProps from "../../props/branding-case-study-props";

/* ---------------- Utils ---------------- */
function lastSegment(path = "") {
  try {
    return path.split("/").filter(Boolean).pop()?.toLowerCase() ?? "";
  } catch {
    return "";
  }
}

function hexToRgba(hex, alpha = 0.5) {
  const h = String(hex || "").replace("#", "").trim();
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  if (full.length !== 6) return `rgba(255,255,255,${alpha})`;

  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function safeVideoSrc(info) {
  return info?.src || info?.video || "";
}

export default function WorkPage({ params }) {
  const resolvedParams = usePromise(params);

  const rawSlug = Array.isArray(resolvedParams?.slug)
    ? resolvedParams.slug[0]
    : resolvedParams?.slug || "";

  const slug = String(rawSlug).toLowerCase();

  const match = useMemo(() => {
    const w =
      websiteCaseStudyProps.find((item) => lastSegment(item.page) === slug) || null;

    const b =
      brandingCaseStudyProps.find((item) => lastSegment(item.page) === slug) || null;

    return w || b;
  }, [slug]);

  if (!match) return <NoPageFound slug={slug} />;

  const timeline = Array.isArray(match.timeLineImages) ? match.timeLineImages : [];

  // ✅ Normalize timeline images into [{ src, alt }]
  const timelineImages = useMemo(() => {
    return timeline.flatMap((block) => {
      const images = block?.image;
      if (!images) return [];

      const srcs = Array.isArray(images) ? images : [images];
      const alt = block?.alt || "";

      return srcs.map((src) => ({ src, alt }));
    });
  }, [timeline]);

  const videoSrc = safeVideoSrc(match);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: hexToRgba(match?.color || "#fff", 0.5) }}
    >
      <Navbar />

      {/* HERO */}
      <section className="x-dynamic-padding pt-10 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-[392px_1fr] gap-9 items-stretch">
          {/* Left */}
          <div className="flex flex-col gap-9">
            <h2>{match.companyName ?? match.ctaText ?? "Project"}</h2>

            {match.projectDescription && <p>{match.projectDescription}</p>}

            {match.testimonialText && (
              <p>
                &quot;{match.testimonialText}&quot;
                {match.testimonialAuthor ? ` — ${match.testimonialAuthor}` : ""}
              </p>
            )}

            {match.projectLink && (
              <a
                href={match.projectLink}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 w-fit"
              >
                View project
              </a>
            )}
          </div>

          {/* Right */}
          <div className="w-full overflow-hidden bg-black h-[70vh]">
            {videoSrc ? (
              <video
                src={videoSrc}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                controls={false}
                disablePictureInPicture
                controlsList="nodownload noremoteplayback noplaybackrate"
                tabIndex={-1}
                aria-hidden="true"
                onContextMenu={(e) => e.preventDefault()}
                className="w-full h-full object-cover pointer-events-none select-none"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm opacity-70">
                No preview video available
              </div>
            )}
          </div>
        </div>
      </section>

      {/* IMAGES — NO CROP */}
      {timelineImages.length > 0 && (
        <section className="x-dynamic-padding pb-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-9">
            {timelineImages.map((img, i) => {
              const isLast = i === timelineImages.length - 1;
              const isOdd = timelineImages.length % 2 === 1;
              const makeFullWidth = isOdd && isLast;

              return (
                <div
                  key={`${img.src}-${i}`}
                  className={`overflow-hidden ${
                    makeFullWidth ? "sm:col-span-2 lg:col-span-2" : ""
                  }`}
                >
                  {/* Consistent card shape, but never crop the image */}
                  <div className="relative w-full aspect-[16/10] bg-white">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes={
                        makeFullWidth
                          ? "(min-width: 1024px) 100vw, (min-width: 640px) 100vw, 100vw"
                          : "(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
                      }
                      className="object-contain"
                      priority={i < 3}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}