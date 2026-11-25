import type { ReactNode } from "react";
import { Navigation } from "@/components/navigation";

export default function BrowseLayout({ children, modal }: { children: ReactNode; modal: ReactNode }) {
  return (
    <>
      <Navigation />
      <main id="main-content" tabIndex={-1}>{children}</main>
      {modal}
    </>
  );
}
