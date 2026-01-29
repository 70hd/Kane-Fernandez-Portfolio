"use client";

import { MotionConfig } from "framer-motion";
import dynamic from "next/dynamic";
import Script from "next/script";
import { useEffect, useState } from "react";

/* ---------------- Tunables ---------------- */
const SPRING = { stiffness: 220, damping: 18, mass: 0.9 };

/* ---------------- Lazy-load heavy components ---------------- */
const CaseStudyPreview = dynamic(() => import("../components/CaseStudyPreview"), {
  ssr: false,
  loading: () => <div aria-hidden="true" style={{ height: 1 }} />,
});

/* ---------------- Page (DEFAULT EXPORT) ---------------- */
export default function Page() {
  const [items, setItems] = useState(null);

  // Load ALL datasets once and merge them (no toggles)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [websiteMod, brandingMod, blogMod] = await Promise.all([
        import("../props/website-case-study-props"),
        import("../props/branding-case-study-props"),
        import("../props/blog-props"),
      ]);

      if (cancelled) return;

      const website = websiteMod.default || websiteMod;
      const branding = brandingMod.default || brandingMod;
      const blog = blogMod.default || blogMod;

      const merged = [
                ...(Array.isArray(branding) ? branding : []),
        ...(Array.isArray(website) ? website : []),
        ...(Array.isArray(blog) ? blog : []),
      ];

      setItems(merged);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user" transition={SPRING}>
      {/* JSON-LD (SEO only) */}
      <Script
        id="ld-local-business"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Kane Fernandez — Branding & Web Design",
            url: "https://kanehfernandez.com",
            image: "https://kanehfernandez.com/og-image.jpg",
            description:
              "Branding and website design for small businesses in San Francisco and the Bay Area.",
            areaServed: { "@type": "City", name: "San Francisco" },
            address: {
              "@type": "PostalAddress",
              streetAddress: "4123 24th St",
              addressLocality: "San Francisco",
              addressRegion: "CA",
              postalCode: "94114",
              addressCountry: "US",
            },
            sameAs: ["https://www.linkedin.com/in/kanehfernandez"],
            telephone: "+1-650-289-8581",
          }),
        }}
      />

      <Script
        id="ld-service"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: "Branding and Website Design",
            areaServed: "San Francisco Bay Area",
            provider: {
              "@type": "Person",
              name: "Kane Fernandez",
              url: "https://kanehfernandez.com",
            },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Branding & Web Design Packages",
              itemListElement: [
                { "@type": "Offer", name: "Brand Identity" },
                { "@type": "Offer", name: "Website Design & Development" },
                { "@type": "Offer", name: "E-commerce (Shopify/Squarespace)" },
              ],
            },
          }),
        }}
      />

  

      {/* Videos */}
      <main className="relative h-fit mt-60 overflow-visible">
        {items && (
          <CaseStudyPreview
            noBlank={false}
            items={items}
            aria-label="All case study videos"
            hover={"All"}
          />
        )}
           
      </main>
    </MotionConfig>
  );
}