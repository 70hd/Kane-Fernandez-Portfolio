// app/components/SmoothScrollGate.jsx
"use client";

import { usePathname } from "next/navigation";
import SmoothScroll from "./SmoothScroll";

export default function SmoothScrollGate() {
  const pathname = usePathname();

  // Disable smooth scroll on the first page only
  if (pathname === "/") return null;

  return <SmoothScroll />;
}