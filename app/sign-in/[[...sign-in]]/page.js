"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-[70vh] grid place-items-center p-6 bg-black">
      <SignIn
        afterSignInUrl="/subscription"
        afterSignUpUrl="/subscription"
        appearance={{
          variables: {
            colorBackground: "#121212",
            colorForeground: "#ffffff",
            colorPrimary: "#ffffff",
            colorPrimaryForeground: "#000000",
            borderRadius: "0px",
          },
          elements: {
            // Whole social block
            socialButtons: { gap: "12px" },

            // All block-style social buttons
            socialButtonsBlockButton: {
              backgroundColor: "#ffffff",
              color: "#000000",
              border: "1px solid #ffffff",
            },
            socialButtonsBlockButton__hover: {
              backgroundColor: "#ffffff",
              opacity: 0.9,
            },

            // Specifically Google (if available in your build)
            socialButtonsBlockButton__google: {
              backgroundColor: "#ffffff",
              color: "#000000",
              border: "1px solid #ffffff",
            },

            // Icon-only variant (if you enable compact)
            socialButtonsIconButton: {
              backgroundColor: "#ffffff",
              color: "#000000",
              border: "1px solid #ffffff",
            },
          },
        }}
      />
    </main>
  );
}