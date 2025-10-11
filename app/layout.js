import {
  ClerkProvider,
} from "@clerk/nextjs";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import { Analytics } from "@vercel/analytics/next";
import AuthHeader from "./components/AuthHeader";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "Kane Fernandez",
  description:
    "Portfolio of Kane Fernandez, a 15 year old San Francisco-based designer & developer. Specializing in high-end websites, branding, e-commerce, email design, and design systems. Featured work includes Reframe Pilates, Everlane spec redesign, K2 branding, and The Little Chihuahua merch site.",
};

export default function RootLayout({ children }) {
  return (
   <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
          {/* This header will render only on /subscription */}
          <AuthHeader />

          <Suspense fallback={null}>
            <SmoothScroll />
          </Suspense>

          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}