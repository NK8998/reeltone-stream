import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  robots: { index: false },
};

export default function PlaybackLayout({ children }: { children: ReactNode }) {
  return <main>{children}</main>;
}
