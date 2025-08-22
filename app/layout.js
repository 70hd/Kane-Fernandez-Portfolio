import "./globals.css";
import { Suspense } from "react";
import SmoothScroll from "./components/SmoothScroll"; // client component

export const metadata = {
  title: "Kane Fernandez",
  description: "Portfolio of Kane Fernandez, a 15 year old San Francisco-based designer & developer. Specializing in high-end websites, branding, e-commerce, email design, and design systems. Featured work includes Reframe Pilates, Everlane spec redesign, K2 branding, and The Little Chihuahua merch site.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <Suspense fallback={null}>
          <SmoothScroll />
        </Suspense>
        {children}
      </body>
    </html>
  );
}