// components/funnel/ui/Button.jsx
import React from "react";
import Link from "next/link";
import { cn } from "./cn";

export default function Button({
  variant = "primary", // "primary" | "secondary" | "link"
  href,
  className = "",
  children,
  ...props
}) {
  const base =
    "w-fit  py-3 transition-opacity duration-150 select-none " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A90F2] focus-visible:ring-offset-2";

  // Hover/active rules you asked for:
  // - primary + link: hover 80% opacity, active 60%
  // - secondary: on hover fill (blue bg + white text), active 80% opacity
  const styles =
    variant === "primary"
      ? "bg-[#1A90F2] text-white border border-[#319BF3] hover:opacity-80 active:opacity-60 px-6"
      : variant === "secondary"
      ? "border border-[#1A90F2] text-[#151515] hover:bg-[#1A90F2] hover:text-white active:opacity-80 px-6"
      : "text-[#1A90F2] hover:opacity-80 active:opacity-60";

  const inner =
    variant === "link" ? (
      <span className="button underline">{children}</span>
    ) : (
      <span className="button">{children}</span>
    );

  const classes = cn(base, styles, className);

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {inner}
      </Link>
    );
  }

  return (
    <button className="bg-white">
      <div className={classes} {...props}>
        {inner}
      </div>
    </button>
  );
}
