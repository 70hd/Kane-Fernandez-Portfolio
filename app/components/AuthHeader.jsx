"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthHeader() {
  const pathname = usePathname();
  if (pathname !== "/subscription") return null; // show only on /subscription

  return (
    <header className="flex justify-end items-center p-4 gap-4 h-16">
      <SignedOut>

          <Link href={"/sign-in"} className="border-[#CBB9D5] hover:bg-[#CBB9D5] text-white hover:text-black px-6 py-3">
            Sign In
          </Link>
          <Link href={"/sign-up"} className="bg-[#CBB9D5] text-black px-6 py-3">Sign Up</Link>
     
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}
