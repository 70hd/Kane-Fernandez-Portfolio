"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="min-h-[70vh] grid place-items-center p-6">
      <SignUp
        afterSignUpUrl="/subscription"
        signInUrl="/sign-in"
        appearance={{
          variables: {
            colorPrimary: "#ffffff",
            colorBackground: "#121212",
            colorText: "#ffffff",
            colorInputBackground: "#0a0a0a",
            borderRadius: "0px",
          },
          
          elements: {
                 socialButtonsBlockButton__google: {
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
    </main>
  );
}