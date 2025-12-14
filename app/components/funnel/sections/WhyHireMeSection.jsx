// components/funnel/sections/WhyHireMeSection.jsx
import React from "react";
import Container from "../ui/Container";
import FeatureRow from "../ui/FeatureRow";

export default function WhyHireMeSection({ features }) {
  return (
    <section className="text-[#151515]">
      <Container className="py-6">
        <div className="flex flex-col gap-9">
          <h2 className="h2">Why businesses hire me</h2>
          {features.map((f) => (
            <FeatureRow key={`${f.title}-${f.body}`} {...f} />
          ))}
        </div>
      </Container>
    </section>
  );
}