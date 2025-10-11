"use client";

import React, { useMemo } from "react";
import { useUser, SignedIn, SignedOut } from "@clerk/nextjs";
import { CheckoutButton } from "@clerk/nextjs/experimental";
const PLAN_IDS = {
  basic: "cplan_33o88OR1VcaE2EALF8oFuX5g5ay",
  standard: "cplan_33o8KlNt1FxkTT8KGxCPJuCV9XG",
  support: "cplan_33o8ZLTsHj9uJ15mtRhDDAaCzNR",
};
const TIERS = [
  {
    title: "Basic",
    slug: "basic",
    price: "20",
    features: [
      "Ongoing content updates",
      "Layout adjustments & section tweaks",
      "Navigation/menu link updates",
      "48-hour Email & DM support",
    ],
  },
  {
    title: "Standard",
    slug: "standard",
    price: "80",
    features: [
      "Everything in Basic Support, plus:",
      "24 hour priority support",
      "Content and media optimization",
      "Monthly 1-hr design/dev work",
      "Monthly performance updates",
      "Blog & product upload support",
    ],
  },
  {
    title: "Support",
    slug: "support",
    price: "294",
    features: [
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
    ],
  },
];

export default function SubscriptionsDashboard() {
  const { user } = useUser();

  // We store plan slug in publicMetadata.activePlan, e.g. "standard"
  const activePlan = useMemo(() => {
    const raw = user?.publicMetadata?.activePlan;
    return raw ? String(raw).toLowerCase() : null;
  }, [user?.publicMetadata?.activePlan]);

  // Optional: a renewal hint, if you store it (e.g. ISO date) in publicMetadata
  const renewal = user?.publicMetadata?.renewalDate
    ? new Date(user.publicMetadata.renewalDate)
    : null;

  async function openBillingPortal() {
    try {
      const res = await fetch("/api/billing-portal", { method: "POST" });
      if (!res.ok) throw new Error("Failed to create portal session");
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (e) {
      console.error(e);
      alert("Could not open billing portal. Please contact support.");
    }
  }

  return (
    <div className="dynamic-padding max-w-6xl mx-auto flex flex-col gap-10">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl">Your Subscription</h1>
          <p className="text-white/60">
            Manage your plan, switch tiers, and update billing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openBillingPortal}
            className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10"
          >
            Manage billing
          </button>
        </div>
      </header>

      {/* SUMMARY CARD */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 rounded-xl border border-white/15 p-6 bg-[#0f0f10]">
          <h2 className="text-lg mb-2">Current plan</h2>
          <div className="text-3xl font-medium">
            {activePlan ? activePlan[0].toUpperCase() + activePlan.slice(1) : "—"}
          </div>
          <div className="mt-3 text-white/70 text-sm">
            {renewal ? (
              <span>Renews on {renewal.toLocaleDateString()}</span>
            ) : activePlan ? (
              <span>Active</span>
            ) : (
              <span>No active subscription</span>
            )}
          </div>
        </div>

        <div className="col-span-1 rounded-xl border border-white/15 p-6 bg-[#0f0f10]">
          <h2 className="text-lg mb-2">Payment method</h2>
          <div className="text-white/80">
            <span className="text-sm">Update in billing portal</span>
          </div>
          <button
            onClick={openBillingPortal}
            className="mt-4 px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10"
          >
            Update card
          </button>
        </div>

        <div className="col-span-1 rounded-xl border border-white/15 p-6 bg-[#0f0f10]">
          <h2 className="text-lg mb-2">Status</h2>
          <div className="text-white/80 text-sm">
            {activePlan ? "Subscribed" : "Free / Not subscribed"}
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={openBillingPortal}
              className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10"
            >
              Cancel / Pause
            </button>
          </div>
        </div>
      </section>

      {/* PLAN SWITCHER */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xl">Switch or upgrade</h2>
        <div className="flex flex-wrap gap-9">
          {TIERS.map((tier, idx) => {
            const isFeatured = idx === 1;
            const planId = PLAN_IDS[tier.slug];
            const isCurrent = activePlan === tier.slug;
            const hasAnyPlan = Boolean(activePlan);

            const label = isCurrent
              ? "CURRENT PLAN"
              : hasAnyPlan
              ? "SWITCH PLAN"
              : "SUBSCRIBE";

            return (
              <div
                key={tier.slug}
                className={`min-w-[320px] max-w-[392px] w-[392px] min-h-[630px] h-auto
                            text-center flex flex-col justify-start items-center
                            py-14 px-12 gap-6 rounded-xl bg-[#0f0f10]
                            border ${isFeatured ? "border-[#CBB9D5]" : "border-white/15"}`}
              >
                <div className="flex flex-col gap-1">
                  <h3 className="text-white">{tier.title} Support</h3>
                  <p className="text-white/90">${tier.price}/month</p>
                </div>

                {isCurrent ? (
                  <button
                    disabled
                    className={`w-full px-6 py-3 cursor-not-allowed opacity-60 rounded-lg ${
                      isFeatured
                        ? "bg-[#CBB9D5] text-black"
                        : "border border-[#CBB9D5] text-white"
                    }`}
                    title="You're already on this plan"
                  >
                    {label}
                  </button>
                ) : (
                  <CheckoutButton planId={planId} planPeriod="month">
                    <button
                      className={`w-full px-6 py-3 rounded-lg transition ${
                        isFeatured
                          ? "bg-[#CBB9D5] text-black"
                          : "border border-[#CBB9D5] text-white hover:bg-[#CBB9D5] hover:text-black"
                      }`}
                    >
                      {label}
                    </button>
                  </CheckoutButton>
                )}

                <div className="flex flex-col gap-2 text-left text-white/90 w-full">
                  {tier.features.map((f, i) => (
                    <p key={i}>
                      {idx > 0 && i === 0 ? "" : "-"} {f}
                    </p>
                  ))}
                </div>

                <div className="grow" />
              </div>
            );
          })}
        </div>
      </section>

      {/* SIGNED OUT STATE */}
      <SignedOut>
        <div className="rounded-xl border border-white/15 p-6 bg-[#0f0f10]">
          <p className="text-white/80">
            Please <a href="/sign-in" className="underline">sign in</a> to manage your subscription.
          </p>
        </div>
      </SignedOut>
    </div>
  );
}