"use client";

import { SignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  return (
    <main className="min-h-[70vh] grid place-items-center p-6 bg-black">
      {/* Already signed in: don't auto-redirect; offer a button instead */}
      <SignedIn>
        <div className="text-white text-center space-y-4">
          <p className="opacity-80">You’re already signed in.</p>
          <Link
            href="/subscription"
            className="inline-block px-4 py-2 bg-white text-black"
          >
            Continue to Subscription
          </Link>
        </div>
      </SignedIn>

      {/* Not signed in: show the SignIn and let Clerk redirect AFTER sign-in */}
      <SignedOut>
        <SignIn
          // Clerk will navigate to this ONLY after the sign-in flow completes
          afterSignInUrl="/subscription"

          // If the user clicks "Sign up", send them here
          signUpUrl="/sign-up"

          // Path-based routing (recommended with App Router)
          routing="path"
          path="/sign-in"

          appearance={{
            variables: {
              colorBackground: "#121212",
              colorForeground: "#ffffff",
              colorPrimary: "#ffffff",
              colorPrimaryForeground: "#000000",
              borderRadius: "0px",
            },
            elements: {
              socialButtons: { gap: "12px" },
              socialButtonsBlockButton: {
                backgroundColor: "#ffffff",
                color: "#000000",
                border: "1px solid #ffffff",
              },
              socialButtonsBlockButton__hover: {
                backgroundColor: "#ffffff",
                opacity: 0.9,
              },
              socialButtonsBlockButton__google: {
                backgroundColor: "#ffffff",
                color: "#000000",
                border: "1px solid #ffffff",
              },
              socialButtonsIconButton: {
                backgroundColor: "#ffffff",
                color: "#000000",
                border: "1px solid #ffffff",
              },
              card: "border border-white/15 shadow-none",
              headerTitle: "font-serif text-2xl",
              formButtonPrimary:
                "bg-white text-black hover:bg-white/90 transition",
            },
          }}
        />
      </SignedOut>
    </main>
  );
}