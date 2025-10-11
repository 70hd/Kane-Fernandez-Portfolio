"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export default function AuthHeader() {
  const pathname = usePathname();
  if (pathname !== "/subscription") return null; // show only on /subscription

  return (
    <header className="flex justify-end items-center p-4 gap-4 h-16">
      <SignedOut>
        <SignInButton>
          <button className="border-[#CBB9D5] hover:bg-[#CBB9D5] text-white hover:text-black px-6 py-3">
            Sign In
          </button>
        </SignInButton>

        <SignUpButton>
          <button className="bg-[#CBB9D5] text-black px-6 py-3">Sign Up</button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}
