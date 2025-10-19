// import { SignIn } from "@clerk/nextjs";

// export default function SignInPage() {
//   return (
//     <main className="min-h-[70vh] grid place-items-center p-6 bg-black">
//       <SignIn
//             afterSignInUrl="/subscription"
//         appearance={{
//           variables: {
//             colorBackground: "#121212",
//             colorForeground: "#ffffff",
//             colorPrimary: "#ffffff",
//             colorPrimaryForeground: "#000000",
//             borderRadius: "0px",
//           },
//           elements: {
//             // Whole social block
//             socialButtons: { gap: "12px" },

//             // All block-style social buttons
//             socialButtonsBlockButton: {
//               backgroundColor: "#ffffff",
//               color: "#000000",
//               border: "1px solid #ffffff",
//             },
//             socialButtonsBlockButton__hover: {
//               backgroundColor: "#ffffff",
//               opacity: 0.9,
//             },

//             // Specifically Google (if available in your build)
//             socialButtonsBlockButton__google: {
//               backgroundColor: "#ffffff",
//               color: "#000000",
//               border: "1px solid #ffffff",
//             },

//             // Icon-only variant (if you enable compact)
//             socialButtonsIconButton: {
//               backgroundColor: "#ffffff",
//               color: "#000000",
//               border: "1px solid #ffffff",
//             },
//           },
//         }}
//         // Optional: only show Google + Email
//         // routing="path"  // if you need path-based routing
//       />
//     </main>
//   );
// }

"use client";

import { SignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
  const router = useRouter();

  // If the user somehow hits /sign-in while already signed in, push them along.
  useEffect(() => {
    // Clerk injects a <SignedIn> portal when authenticated; this keeps UX snappy.
  }, []);

  return (
    <main className="min-h-[70vh] grid place-items-center p-6 bg-black">
      {/* If signed in already, go to /subscription */}
      <SignedIn>
        {router.push("/subscription")}
      </SignedIn>

      {/* Otherwise, show the SignIn form */}
      <SignedOut>
        <SignIn
          // Ensure post-auth lands on subscription
          afterSignInUrl="/subscription"

          // If you also show the "Sign up" link, send those users here
          signUpUrl="/sign-up"

          // If you use path routing (recommended for App Router)
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

              // Specifically Google
              socialButtonsBlockButton__google: {
                backgroundColor: "#ffffff",
                color: "#000000",
                border: "1px solid #ffffff",
              },

              // Icon-only (if enabled)
              socialButtonsIconButton: {
                backgroundColor: "#ffffff",
                color: "#000000",
                border: "1px solid #ffffff",
              },

              // Card styling
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