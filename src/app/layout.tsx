import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/inter";
import "@fontsource-variable/manrope";
import "@/styles/globals.css";
import { ViewerPreferences } from "@/components/navigation";
import { NavigationProgress } from "@/components/navigation-progress";

export const metadata: Metadata = {
  title: {
    default: "ReelTone",
    template: "%s | ReelTone",
  },
  description:
    "Discover and watch movies, TV shows, documentaries, animation, and independent films on ReelTone.",
  icons: {
    icon: [
      { url: "/brand/favicon.ico" },
      { url: "/brand/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/brand/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: { url: "/brand/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavigationProgress>
          <ViewerPreferences />
          {children}
        </NavigationProgress>
      </body>
    </html>
  );
}
