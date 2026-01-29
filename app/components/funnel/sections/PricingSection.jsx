// components/funnel/sections/PricingSection.jsx
import React from "react";
import Container from "../ui/Container";
import Button from "../ui/Button";

const plans = [
  {
    name: "Essential",
    price: "$749",
    primary: true,
    subtitle:
      "For businesses that need a clean, professional site that actually converts",
    bullets: [
      "- Conversion-focused website (up to 5 pages)",
      "- Built on Shopify / Squarespace / Webflow",
      "- Simple e-commerce or lead capture setup",
      "- Clear messaging + calls to action",
      "- Fast turnaround (3-7 days)",
    ],
    cta: {
      label: "Start Essential",
      variant: "primary",
      link: "https://calendar.app.google/LkkKqyNdjLWFhPmHA",
    },
  },
  {
    name: "Customized",
    price: "$999–2999",
    subtitle: "For businesses that want more leads and booked calls",
    bullets: [
     "- Custom-designed website (5–10 pages)",
     "- Conversion-first layout & user flow",
     "- Light custom code where it actually matters",
     "- Lead capture optimized for your offer",
     "- 2 rounds of revisions",
     "- Essential site support included (first month)",
    ],
    cta: {
      label: "Start Customized",
      variant: "secondary",
      link: "https://calendar.app.google/LkkKqyNdjLWFhPmHA",
    },
  },
{
  name: "Brand Growth",
  price: "Custom Pricing",
  subtitle: "Strategic branding projects typically start at $3,000",
  bullets: [
    "- Brand strategy built to scale with your business",
    "- Visual identity design (logos, style guides, brand assets)",
    "- Messaging & voice development",
    "- Priority communication & creative direction",
  ],
  cta: {
    label: "Redefine Your Brand",
    variant: "secondary",
    link: "mailto:kanehfernandez@gmail.com",
  },
}
];

function PlanCard({ plan }) {
  return (
    <div
      className={[
        "p-6 flex flex-col items-center justify-between min-w-[192px] w-full border",
        plan.primary ? "border-[#319BF3]" : "border-[#151515]/10",
      ].join(" ")}
    >
      <div className="flex flex-col gap-6 text-center text-[#151515]">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">{plan.name}</h3>
          <h3 className="text-xl font-semibold">{plan.price}</h3>
          <p>{plan.subtitle}</p>
        </div>

        <ul className="flex flex-col gap-3 text-center mx-auto max-w-[32ch]">
          {plan.bullets.map((b) => (
            <p key={b} className="leading-snug">
              {b}
            </p>
          ))}
        </ul>
      </div>

      <Button
        variant={plan.cta.variant}
        target="_blank"
        rel="noopener noreferrer"
        href={plan.cta.link}
        className="mt-6"
      >
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
           <h2 className="text-2xl font-semibold">Web Design Pricing</h2>
<p>Currently accepting 2 new Bay Area projects per month to keep quality high.</p>
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