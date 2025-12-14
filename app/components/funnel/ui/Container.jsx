// components/funnel/ui/Container.jsx
import React from "react";
import { cn } from "./cn";

export default function Container({ className = "", children }) {
  return <div className={cn("w-full max-w-[1248px] mx-auto px-6", className)}>{children}</div>;
}