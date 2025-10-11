// components/DebugSubscriptionPanel.js
"use client";
import React from "react";
import { useUser } from "@clerk/nextjs";
import { useSubscription } from "@clerk/nextjs/experimental";

export default function DebugSubscriptionPanel() {
  const { isLoaded, user } = useUser();
  const sub = (() => {
    try {
      // If experimental hook exists, use it. If not, this will throw and we’ll skip.
      // Some builds tree-shake differently; keeping it wrapped avoids hard crashes.
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { data, isLoading, error } = useSubscription();
      return { data, isLoading, error };
    } catch {
      return { data: null, isLoading: false, error: "useSubscription unavailable" };
    }
  })();

  if (!isLoaded) return null;

  return (
    <div style={{ fontSize: 12, lineHeight: 1.25 }} className="mt-6 p-4 border border-white/20 rounded">
      <div className="mb-2 font-semibold">Debug: Clerk state</div>
      <pre className="overflow-auto max-h-64">
        {JSON.stringify(
          {
            userId: user?.id,
            env: {
              publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? "set" : "missing",
            },
            publicMetadata: user?.publicMetadata || null,
            subscriptionHook: {
              isLoading: sub.isLoading ?? null,
              hasData: !!sub.data,
              error: sub.error || null,
            },
            subscriptionData: sub.data || null,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}