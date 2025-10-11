"use client";

import { ClerkProvider } from "@clerk/nextjs";

export default function Providers({ children }) {
  const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!pk) {
    // helpful during local/preview if envs aren’t set
    console.warn("Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY");
  }

  return <ClerkProvider publishableKey={pk}>{children}</ClerkProvider>;
}