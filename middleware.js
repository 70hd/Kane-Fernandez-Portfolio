// import { clerkMiddleware } from '@clerk/nextjs/server';

// export default clerkMiddleware();

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// };

// middleware.js
import { clerkMiddleware } from "@clerk/nextjs/server";

// If you need to customize, pass an options object to clerkMiddleware({...})
export default clerkMiddleware();

// Safe matcher: skip _next and any file with an extension
export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // all app routes, excluding static files and Next internals
    "/",                      // root
    "/(api|trpc)(.*)",        // your API routes (only if you actually need auth here)
  ],
};