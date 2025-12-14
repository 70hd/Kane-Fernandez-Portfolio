// components/funnel/sections/HeroSection.jsx
"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
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

function BackgroundGraphic() {
  return (
    <Image
      src="/webite-funnel-background.svg"
      width={1644}
      height={391}
      alt=""
      priority
      sizes="100vw"
      className="absolute z-0 top-[36px] left-1/2 -translate-x-1/2 w-screen max-w-none h-full md:h-auto"
    />
  );
}

export default function HeroSection({ metricsTop, metricsBottom }) {
  const reduceMotion = useReducedMotion();

  const item = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.26, // 200–300ms
        ease: "easeOut", // no bounce/elastic
      },
    },
  };

  const group = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.07,
      },
    },
  };

  return (
    <section className="relative h-[492px] md:h-[680px] overflow-hidden bg-white text-[#151515] border-b border-[#151515]/10">
      <BackgroundGraphic />

      <motion.div
        variants={group}
        initial="hidden"
        animate="show"
        className="relative z-10 flex h-full flex-col items-center justify-between md:pt-[52px] pt-[0px]"
      >
        <Container className="py-6 text-center flex flex-col">
          <motion.h1 variants={item} className="h1">
            Websites that turn visitors into paying customers
          </motion.h1>

          <motion.div
            variants={item}
            className="mt-6 flex justify-center gap-6"
          >
            <Button
              variant="primary"
              target="_blank"
              href={"https://calendar.app.google/LkkKqyNdjLWFhPmHA"}
            >
              Quick intro call
            </Button>
            <Button variant="link" href="/portfolio">
              View Work
            </Button>
          </motion.div>
        </Container>

        <Container className="pb-9">
          <motion.div variants={item}>
            <MetricRow>
              {metricsTop.map((m) => (
                <MetricCard key={m.value} value={m.value} text={m.text} />
              ))}
            </MetricRow>

            <MetricRow className="mt-12 md:visible hidden">
              {metricsBottom.map((m) => (
                <MetricCard key={m.title} title={m.title} text={m.text} />
              ))}
            </MetricRow>
          </motion.div>
        </Container>
      </motion.div>
    </section>
  );
}
