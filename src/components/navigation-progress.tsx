"use client";

import { useProgress } from "@bprogress/next";
import { ProgressProvider } from "@bprogress/next/app";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

const options = { showSpinner: false };

export function NavigationProgress({ children }: { children: ReactNode }) {
  return (
    <ProgressProvider color="var(--color-accent)" height="2px" options={options} delay={100} disableAnchorClick>
      {children}
    </ProgressProvider>
  );
}

export function useStartNavigationProgress() {
  const { start, startPosition, delay } = useProgress();
  return (destination: URL) => {
    const { pathname, search } = window.location;
    if (destination.pathname !== pathname || destination.search !== search) {
      start(startPosition, delay);
    }
  };
}

type NavigationLinkProps = Omit<ComponentProps<typeof Link>, "href" | "onNavigate"> & { href: string };

export function NavigationLink({ href, ...props }: NavigationLinkProps) {
  const startProgress = useStartNavigationProgress();

  return (
    <Link
      {...props}
      href={href}
      onNavigate={() => startProgress(new URL(href, window.location.href))}
    />
  );
}
