// app/layout.jsx
import { Suspense } from "react";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import SmoothScrollGate from "./components/SmoothScrollGate";
import { Analytics } from "@vercel/analytics/next";
import AuthHeader from "./components/AuthHeader";
import Providers from "./providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });


export const dynamic = "force-dynamic";

export const metadata = {
  metadataBase: new URL("https://kanehfernandez.com"),
  title: "Branding & Website Design for Small Businesses in San Francisco | Kane Fernandez",
  description:
    "Freelance branding and website design for small businesses in San Francisco and the Bay Area. Modern identities, fast sites, and clear results.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Branding & Web Design for SF Small Businesses | Kane Fernandez",
    description: "Freelance branding + websites for cafés, restaurants, and startups in San Francisco.",
    url: "https://kanehfernandez.com/",
    siteName: "Kane Fernandez",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Branding & Web Design for SF Small Businesses | Kane Fernandez",
    description: "Freelance branding + websites for cafés, restaurants, and startups in San Francisco.",
  },
  icons: { shortcut: "/favicon.ico" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <AuthHeader />

          {/* Smooth scroll everywhere EXCEPT the first page ("/") */}
          <Suspense fallback={null}>
            <SmoothScrollGate />
          </Suspense>

          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}