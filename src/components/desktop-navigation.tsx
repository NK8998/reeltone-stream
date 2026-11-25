"use client";

import { NavigationLink as Link } from "@/components/navigation-progress";
import { useLayoutEffect, useRef } from "react";
import styles from "./navigation.module.css";

const links = [
  { path: "/", label: "Home" },
  { path: "/movies", label: "Movies" },
  { path: "/tv-shows", label: "TV Shows" },
  { path: "/documentaries", label: "Documentaries" },
  { path: "/my-list", label: "My List" },
];

function indicatorPosition(left: number, width: number) {
  return { transform: `translateX(${left}px)`, width: `${width}px` };
}

export function DesktopNavigation({ path, reducedMotion }: { path: string; reducedMotion: boolean }) {
  const navigation = useRef<HTMLElement>(null);
  const underline = useRef<HTMLSpanElement>(null);
  const lastTarget = useRef<{ left: number; width: number }>(null);

  useLayoutEffect(() => {
    const nav = navigation.current;
    const indicator = underline.current;
    if (!nav || !indicator) return;

    function align(nav: HTMLElement, indicator: HTMLSpanElement, animate: boolean) {
      const active = nav.querySelector<HTMLAnchorElement>('[aria-current="page"]');
      if (!active?.getClientRects().length) {
        indicator.getAnimations().forEach((animation) => animation.cancel());
        lastTarget.current = null;
        delete nav.dataset.indicatorReady;
        return;
      }

      const bounds = nav.getBoundingClientRect();
      const target = active.getBoundingClientRect();
      const left = target.left - bounds.left;
      const previous = lastTarget.current;
      if (previous?.left === left && previous.width === target.width) return;

      const end = indicatorPosition(left, target.width);
      lastTarget.current = { left, width: target.width };
      const start = indicator.getBoundingClientRect();
      indicator.getAnimations().forEach((animation) => animation.cancel());
      Object.assign(indicator.style, end);
      nav.dataset.indicatorReady = "true";

      if (!animate || !previous || reducedMotion || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Extend the edge nearest the destination before drawing in the opposite edge.
      const leadingLeft = Math.min(start.left, target.left);
      const leadingRight = Math.max(start.right, target.right);
      indicator.animate([
        { ...indicatorPosition(start.left - bounds.left, start.width), easing: "cubic-bezier(.2,.65,.35,1)" },
        { ...indicatorPosition(leadingLeft - bounds.left, leadingRight - leadingLeft), offset: .48, easing: "cubic-bezier(.35,0,.2,1)" },
        end,
      ], { duration: 340 });
    }

    align(nav, indicator, true);
    const observer = new ResizeObserver(() => align(nav, indicator, false));
    observer.observe(nav);
    nav.querySelectorAll("a").forEach((link) => observer.observe(link));
    return () => observer.disconnect();
  }, [path, reducedMotion]);

  return (
    <nav ref={navigation} className={styles.desktop} aria-label="Main navigation">
      {links.map(({ path: href, label }) => (
        <Link key={href} href={href} aria-current={path === href ? "page" : undefined}>{label}</Link>
      ))}
      <span ref={underline} className={styles.indicator} aria-hidden="true" />
    </nav>
  );
}
