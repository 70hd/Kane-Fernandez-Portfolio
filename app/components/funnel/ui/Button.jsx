// components/funnel/ui/Button.jsx
import React from "react";
import Link from "next/link";
import { cn } from "./cn";

function isExternalHref(href) {
  return typeof href === "string" && /^https?:\/\//i.test(href);
}

export default function Button({
  variant = "primary", // "primary" | "secondary" | "link"
  href,
  className = "",
  children,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center w-fit py-3 transition-opacity duration-150 select-none " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A90F2] focus-visible:ring-offset-2";

  const styles =
    variant === "primary"
      ? "bg-[#1A90F2] text-white border border-[#319BF3] hover:opacity-80 active:opacity-60 px-6"
      : variant === "secondary"
      ? "border border-[#1A90F2] text-[#151515] hover:bg-[#1A90F2] hover:text-white active:opacity-80 px-6"
      : "text-[#1A90F2] hover:opacity-80 active:opacity-60";

  const inner =
    variant === "link" ? (
      <span className="button underline underline-offset-4">{children}</span>
    ) : (
      <span className="button">{children}</span>
    );

  const classes = cn(base, styles, className);

  // Link behavior
  if (href) {
    if (isExternalHref(href)) {
      return (
        <a className={classes} href={href} {...props}>
          {inner}
        </a>
      );
    }

    return (
      <Link className={classes} href={href} prefetch={false} {...props}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {inner}
    </button>
  );
}