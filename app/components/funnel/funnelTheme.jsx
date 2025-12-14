"use client";
import { useEffect } from "react";

export default function FunnelTheme({ children }) {
  useEffect(() => {
    document.documentElement.classList.add("funnel-page");
    return () => document.documentElement.classList.remove("funnel-page");
  }, []);

  return children;
}