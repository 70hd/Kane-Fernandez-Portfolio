"use client"
// components/funnel/sections/HeroSection.jsx
import React from "react";
import Image from "next/image";
import Container from "../ui/Container";
import Button from "../ui/Button";
import MetricCard from "../ui/MetricCard";

function MetricRow({ className = "", children }) {
  return (
    <div className={`flex w-full justify-between gap-12 ${className}`}>
      {children}
    </div>
  );
}

// Decorative background: do NOT priority-load this.
// Let your heading + buttons become LCP, not a huge background asset.
function BackgroundGraphic() {
  return (
    <Image
      src="/website-funnel-background.svg"
      width={1644}
      height={391}
      alt=""
      aria-hidden="true"
      role="presentation"
      // IMPORTANT: do not priority this
      priority={false}
      loading="lazy"
      sizes="100vw"
      className="pointer-events-none absolute z-0 sm:top-[32px] top-[64px] left-1/2 -translate-x-1/2 w-screen min-w-[1248px] max-w-none h-full md:h-auto"
    />
  );
}

export default function HeroSection({ metricsTop, metricsBottom }) {
  return (
    <section className="relative h-[550px] md:h-[720px] overflow-hidden bg-white text-[#151515] border-b border-[#151515]/10">
      <BackgroundGraphic />

      <div className="relative z-10 flex h-full flex-col items-center sm:justify-between gap-9 md:pt-[52px] pt-0">
        <Container className="py-6 text-center flex flex-col">
          {/* CSS-only “fade up” (no JS). Respects reduced motion via Tailwind if you want to add it later */}
          <h1 className="h1 motion-safe:animate-[fadeUp_.26s_ease-out_both]">
            Websites that turn visitors into paying customers
          </h1>

          <div className="mt-6 flex justify-center gap-6 motion-safe:animate-[fadeUp_.26s_ease-out_both] motion-safe:[animation-delay:80ms]">
            <Button
              variant="primary"
              target="_blank"
              rel="noopener noreferrer"
              href="https://calendar.app.google/LkkKqyNdjLWFhPmHA"
            >
              Quick intro call
            </Button>

            <Button variant="link" href="/portfolio">
              View Work
            </Button>
          </div>
        </Container>

        <Container className="pb-9 relative">
          <div className="motion-safe:animate-[fadeUp_.26s_ease-out_both] motion-safe:[animation-delay:140ms]">
            <MetricRow>
              {metricsTop.map((m) => (
                <MetricCard
                  key={`${m.value}-${m.text}`}
                  value={m.value}
                  text={m.text}
                />
              ))}
            </MetricRow>

            <MetricRow className="mt-12 sm:flex hidden">
              {metricsBottom.map((m) => (
                <MetricCard
                  key={`${m.title}-${m.text}`}
                  title={m.title}
                  text={m.text}
                />
              ))}
            </MetricRow>
          </div>
        </Container>
      </div>

      {/* Keyframes (scoped locally). You can move this to globals if you prefer. */}
      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}