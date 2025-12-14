// components/funnel/sections/PricingSection.jsx
import React from "react";
import Container from "../ui/Container";
import Button from "../ui/Button";

const plans = [
  {
    name: "Basic",
    price: "$750",
    subtitle: "For businesses that need a clean, professional site that actually converts",
    bullets: [
      "Conversion-focused website (up to 5 pages)",
      "Built on Shopify / Squarespace / Webflow",
      "Simple e-commerce or lead capture setup",
      "Clear messaging + calls to action",
      "Fast turnaround (2–3 weeks)",
    ],
    cta: { label: "Start Basic", variant: "primary", link: "https://calendar.app.google/LkkKqyNdjLWFhPmHA" },
  },
  {
    name: "Standard",
    price: "$1–3k",
    subtitle: "For businesses that want more leads and booked calls",
    bullets: [
      "Custom-designed website (5–10 pages)",
      "Conversion-first layout & user flow",
      "Light custom code where it actually matters",
      "Lead capture optimized for your offer",
      "2 rounds of revisions",
      "Basic site support included (first month)",
    ],
    cta: { label: "Start Standard", variant: "secondary",  link: "https://calendar.app.google/LkkKqyNdjLWFhPmHA" },
  },
  {
    name: "Growth",
    price: "Custom Pricing",
    subtitle: "Custom projects typically start at $3,000",
    bullets: [
      "Conversion strategy baked into every page",
      "Advanced features & integrations",
      "Priority communication & support",
      "Free premium monthly support (first month)",
    ],
    cta: { label: "Apply for a project", variant: "secondary", link: "https://form.typeform.com/to/GU0zn5RM" },
  },
];

function PlanCard({ plan }) {
  return (
    <div className="p-6 flex flex-col items-center justify-between min-w-[192px] w-full border border-[#319BF3]">
      <div className="flex flex-col gap-6 text-center text-[#151515]">
        <div className="flex flex-col gap-2">
          <h3>{plan.name}</h3>
          <h3>{plan.price}</h3>
          <p>{plan.subtitle}</p>
        </div>

        <div className="flex flex-col gap-3">
          {plan.bullets.map((b) => (
            <p key={b}>- {b}</p>
          ))}
        </div>
      </div>

      <Button variant={plan.cta.variant} target="_blank" href={plan.cta.link} className="mt-6">
        {plan.cta.label}
      </Button>
    </div>
  );
}

export default function PricingSection() {
  return (
    <section className="bg-white">
      <Container className="py-9">
        <div className="flex flex-col gap-9">
          <div className="text-[#151515]">
            <h2>My Pricing</h2>
            <p>Currently accepting 2 new projects per month to keep quality high.</p>
          </div>

          <div className="flex sm:flex-row flex-col w-full gap-9">
            {plans.map((p) => (
              <PlanCard key={p.name} plan={p} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}