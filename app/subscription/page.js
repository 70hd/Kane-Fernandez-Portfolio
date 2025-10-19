// // app/subscription/page.js
// "use client";
// export const dynamic = "force-dynamic";

// import React from "react";
// import { useUser, SignedIn, SignedOut, CheckoutButton } from "@clerk/nextjs";
// import {
//   SubscriptionDetailsButton,
// } from "@clerk/nextjs/experimental";

// /* ---------- Config (test vs live IDs must match your environment) ---------- */
// const PLAN_IDS = {
//   basic: "cplan_33o88OR1VcaE2EALF8oFuX5g5ay",
//   standard: "cplan_33o8KlNt1FxkTT8KGxCPJuCV9XG",
//   support: "cplan_33o8ZLTsHj9uJ15mtRhDDAaCzNR",
// };

// const TIERS = [
//   {
//     title: "Basic",
//     slug: "basic",
//     price: "20",
//     features: [
//       "Ongoing content updates",
//       "Layout adjustments & section tweaks",
//       "Navigation/menu link updates",
//       "48-hour Email & DM support",
//     ],
//   },
//   {
//     title: "Standard",
//     slug: "standard",
//     price: "80",
//     features: [
//       "Everything in Basic Support, plus:",
//       "24 hour priority support",
//       "Content and media optimization",
//       "Monthly 1-hr design/dev work",
//       "Monthly performance updates",
//       "Blog & product upload support",
//     ],
//   },
//   {
//     title: "Support",
//     slug: "support",
//     price: "294",
//     features: [
//       "Everything in Standard Support, plus:",
//       "Hosting migration & setup assistance",
//       "Navigation/menu link updates",
//       "Key components redesign",
//       "Creation of new pages",
//       "Custom code development",
//       "Advanced analytics integration",
//       "SEO enhancements",
//       "Product support",
//       "Priority turnaround for urgent fix",
//     ],
//   },
// ];

// export default function Subscription() {
//   const { isLoaded } = useUser();

//   if (!isLoaded) {
//     return (
//       <div className="dynamic-padding">
//         <h1>Subscription Offerings</h1>
//         <p className="text-white/60 mt-2">Loading…</p>
//       </div>
//     );
//   }

//   return (
// //     <div className="w-full h-fit flex flex-col gap-9 dynamic-padding">
// //       <div className="flex items-center justify-between">
// //         <h2>Subscription Offerings</h2>

// //         <SignedIn>
// //           <SubscriptionDetailsButton>
// //             <button
// //               className="px-4 py-2 rounded-lg border border-white text-white hover:bg-white hover:text-black"
// //               aria-label="Manage or cancel subscription"
// //             >
// //               Manage / Cancel
// //             </button>
// //           </SubscriptionDetailsButton>
// //         </SignedIn>

// //         <SignedOut>
// //           <a
// //             href="/sign-in"
// //          className="px-4 py-2 rounded-lg border border-white text-white hover:bg-white hover:text-black"
// //           >
// //             Sign in to manage
// //           </a>
// //         </SignedOut>
// //       </div>

// // <div className="whitespace-pre-wrap">
// // <PricingTable
// //   appearance={{
// //     variables: {
// //       colorBackground: "#121212",
// //       colorForeground: "#FFFFFF",
// //       colorMutedForeground: "#CCCCCC",
// //       colorBorder: "#FFFFFF",
// //       colorPrimary: "#FFFFFF",
// //       colorPrimaryForeground: "#000000",
// //       borderRadius: "0px",
// //     },
// //     elements: {
// //       switchThumb: {
// //         backgroundColor: "#a7a7a7", // stays white
// //       },
// //       headerTitle: {
// //         fontFamily: '"Trivia Serif", serif',
// //         fontWeight: "400",
// //         fontSize: "32px",
// //       },
// //       headerSubtitle: {
// //         fontFamily: "Inter, sans-serif",
// //         fontWeight: "300",
// //         fontSize: "16px",
// //         color: "#CCCCCC",
// //       },
// //       priceText: {
// //         fontFamily: '"Trivia Serif", serif',
// //         fontWeight: "400",
// //         fontSize: "32px",
// //       },
// //     },
// //   }}
// //   checkoutProps={{
// //     appearance: {
// //       variables: {
// //         colorBackground: "#000000",
// //         colorForeground: "#FFFFFF",
// //         colorMutedForeground: "#CCCCCC",
// //         colorBorder: "#222222",
// //         colorPrimary: "#FFFFFF",
// //         colorPrimaryForeground: "#000000",
// //         borderRadius: "0px",
// //       },
// //     },
// //   }}
// // />
// // </div>
// //     </div>
// //   );
// // }


//    <div className="w-fit flex gap-9">
//         {TIERS.map((tier, idx) => {
//           const isFeatured = idx === 1;
//           const activePlan = "Basic"
//           const isCurrent = activePlan === tier.slug;

//           return (
//             <div
//               key={tier.slug}
//               className={`relative max-w-[392px] min-w-[392px] h-[630px] text-center
//                           flex flex-col py-14 px-12 gap-4 items-center border
//                           ${
//                             isFeatured ? "border-[#CBB9D5]" : "border-white/15"
//                           }`}
//             >
         
//               {isCurrent && (
//                 <span className="absolute top-3 right-3 text-xs px-2 py-1 rounded bg-[#CBB9D5] text-black">
//                   Current
//                 </span>
//               )}

//               <div className="flex flex-col">
//                 <h2>{tier.title} Support</h2>
//                 <h2>${tier.price}/month</h2>
//               </div>

//               <SignedIn>
//                 {isCurrent ? (
//                   <SubscriptionDetailsButton>
//                     <button
//                       className="w-full px-6 py-3 rounded-lg border border-[#CBB9D5] text-white hover:bg-[#CBB9D5] hover:text-black"
//                       aria-label="Manage current plan"
//                     >
//                       Current plan · Manage
//                     </button>
//                   </SubscriptionDetailsButton>
//                 ) : (
//                   <CheckoutButton
//                     planId={PLAN_IDS[tier.slug]}
//                     planPeriod="month"
//                   >
//                     <button
//                       className={`w-full px-6 py-3 rounded-lg ${
//                         isFeatured
//                           ? "bg-[#CBB9D5] text-black hover:opacity-90"
//                           : "border border-[#CBB9D5] text-white hover:bg-[#CBB9D5] hover:text-black"
//                       }`}
//                       aria-label={activePlan ? "Switch plan" : "Subscribe"}
//                     >
//                       {activePlan ? "Switch" : "Subscribe"}
//                     </button>
//                   </CheckoutButton>
//                 )}
//               </SignedIn>

//               <SignedOut>
//                 <a
//                   href="/sign-in"
//                   className={`block w-full text-center px-6 py-3 rounded-lg ${
//                     isFeatured
//                       ? "bg-[#CBB9D5] text-black hover:opacity-90"
//                       : "border border-[#CBB9D5] text-white hover:bg-[#CBB9D5] hover:text-black"
//                   }`}
//                 >
//                   Subscribe
//                 </a>
//               </SignedOut>

//               <div className="flex flex-col gap-3">
//                 {tier.features.map((f, i) => (
//                   <p key={i}>
//                     {idx > 0 && i === 0 ? "" : "-"} {f}
//                   </p>
//                 ))}
//               </div>
//             </div>
//           );
//         })}
//       </div> )
// }
// app/subscription/page.js
"use client";
export const dynamic = "force-dynamic";

import React, { useMemo } from "react";
import { useUser, SignedIn, SignedOut, PricingTable } from "@clerk/nextjs";
import { CheckoutButton, SubscriptionDetailsButton } from "@clerk/nextjs/experimental";
import Link from "next/link";

/* ---------- Plan IDs ---------- */
const PLAN_IDS = {
  basic: "cplan_33tsdlMQyKM1Z1h3ZV8yldyLblI",
  standard: "cplan_33tsdfEBovQIOcuxJbHe5okdwKR",
  support: "cplan_33tsdhp0fTZ3ozIGDi3w3wbBjB8",
};

const TIERS = [
  { title: "Basic", slug: "basic", price: "30", features: [
    "Ongoing content updates",
    "Layout adjustments & section tweaks",
    "Navigation/menu link updates",
    "48-hour Email & DM support",
  ]},
  { title: "Standard", slug: "standard", price: "80", features: [
    "Everything in Basic Support, plus:",
    "24 hour priority support",
    "Content and media optimization",
    "Monthly 1-hr design/dev work",
    "Monthly performance updates",
    "Blog & product upload support",
  ]},
  { title: "Support", slug: "support", price: "294", features: [
    "Everything in Standard Support, plus:",
    "Hosting migration & setup assistance",
    "Navigation/menu link updates",
    "Key components redesign",
    "Creation of new pages",
    "Custom code development",
    "Advanced analytics integration",
    "SEO enhancements",
    "Product support",
    "Priority turnaround for urgent fix",
  ]},
];

export default function Subscription() {
  const { isLoaded, user } = useUser();

  // whatever you store in publicMetadata.activePlan (e.g., "basic"|"standard"|"support")
  const activePlan = useMemo(() => {
    const raw = user?.publicMetadata?.activePlan;
    return raw ? String(raw).toLowerCase() : null;
  }, [user?.publicMetadata?.activePlan]);

console.log(activePlan)
  if (!isLoaded) {
    return (
      <div className="dynamic-padding">
        <h1>Subscription Offerings</h1>
        <p className="text-white/60 mt-2">Loading…</p>
      </div>
    );
  }

  return (
    <div className="w-full h-fit flex flex-col gap-9 dynamic-padding">
      <div className="flex items-center justify-between">
        <h2>Subscription Offerings</h2>
      

        <SignedIn>
          <SubscriptionDetailsButton>
            <button
              className="px-4 py-2 rounded-lg border border-white text-white hover:bg-white hover:text-black"
              aria-label="Manage or cancel subscription"
            >
              Manage / Cancel
            </button>
          </SubscriptionDetailsButton>
        </SignedIn>

        <SignedOut>
          <Link
            href="/sign-in"
            className="px-4 py-2 rounded-lg border border-white text-white hover:bg-white hover:text-black"
          >
            Sign in to manage
          </Link>
        </SignedOut>
      </div>

      <div className="w-fit flex gap-9">
        {TIERS.map((tier, idx) => {
          const isFeatured = idx === 1;
          const isCurrent = activePlan === tier.slug;

          return (
            <div
              key={tier.slug}
              className={`relative max-w-[392px] min-w-[392px] h-[630px] text-center
                          flex flex-col py-14 px-12 gap-4 items-center border
                          ${isFeatured ? "border-[#CBB9D5]" : "border-white/15"}`}
            >
              {isCurrent && (
                <span className="absolute top-3 right-3 text-xs px-2 py-1 rounded bg-[#CBB9D5] text-black">
                  Current
                </span>
              )}

              <div className="flex flex-col">
                <h2>{tier.title} Support</h2>
                <h2>${tier.price}/month</h2>
              </div>

              <SignedIn>
                {isCurrent ? (
                  <SubscriptionDetailsButton>
                    <button
                      className="w-full px-6 py-3 rounded-lg border border-[#CBB9D5] text-white hover:bg-[#CBB9D5] hover:text-black"
                      aria-label="Manage current plan"
                    >
                      Current plan · Manage
                    </button>
                  </SubscriptionDetailsButton>
                ) : (
                  <CheckoutButton planId={PLAN_IDS[tier.slug]} planPeriod="month">
                    <button
                      className={`w-full px-6 py-3 rounded-lg ${
                        isFeatured
                          ? "bg-[#CBB9D5] text-black hover:opacity-90"
                          : "border border-[#CBB9D5] text-white hover:bg-[#CBB9D5] hover:text-black"
                      }`}
                      aria-label={activePlan ? "Switch plan" : "Subscribe"}
                    >
                      {activePlan ? "Switch" : "Subscribe"}
                    </button>
                  </CheckoutButton>
                )}
              </SignedIn>

              <SignedOut>
                <Link
                  href="/sign-in"
                  className={`block w-full text-center px-6 py-3 rounded-lg ${
                    isFeatured
                      ? "bg-[#CBB9D5] text-black hover:opacity-90"
                      : "border border-[#CBB9D5] text-white hover:bg-[#CBB9D5] hover:text-black"
                  }`}
                >
                  Subscribe
                </Link>
              </SignedOut>

              <div className="flex flex-col gap-3">
                {tier.features.map((f, i) => (
                  <p key={i}>{idx > 0 && i === 0 ? "" : "-"} {f}</p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}