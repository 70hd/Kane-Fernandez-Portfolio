// components/funnel/FunnelPage.jsx
import React from "react";
import HeroSection from "./HeroSection"
import WhyHireMeSection from "./WhyHireMeSection";
import PricingSection from "./PricingSection";
import { features, metricsBottom, metricsTop } from "../data";

export default function FunnelPage() {
  return (
    <div className="flex flex-col gap-9 bg-white">
      <HeroSection metricsTop={metricsTop} metricsBottom={metricsBottom} />
      <WhyHireMeSection features={features} />
      <PricingSection />
    </div>
  );
}