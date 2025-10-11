import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import { Analytics } from "@vercel/analytics/next";
import AuthHeader from "./components/AuthHeader";
import Providers from "./providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// optional while wiring; prevents static eval surprises
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kane Fernandez",
  description:
    "Portfolio of Kane Fernandez, a 15 year old San Francisco-based designer & developer. Specializing in high-end websites, branding, e-commerce, email design, and design systems.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <Providers>
          {/* This header will render only on /subscription per your component */}
          <AuthHeader />

          <Suspense fallback={null}>
            <SmoothScroll />
          </Suspense>

          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}