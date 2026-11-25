"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { NavigationLink as Link } from "@/components/navigation-progress";
import { useId, useRef, type ReactNode } from "react";
import { TitleCard } from "./title-card";
import type { Title } from "./types";
import styles from "./catalog.module.css";

export function Rail({ name, href, children, portrait = false }: {
  name: string; href?: string; children: ReactNode; portrait?: boolean;
}) {
  const id = useId();
  const track = useRef<HTMLDivElement>(null);

  function advance(direction: number) {
    if (track.current) {
      const behavior = document.documentElement.dataset.reducedMotion === "true" || matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant" : "smooth";
      track.current.scrollBy({ left: track.current.clientWidth * .85 * direction, behavior });
    }
  }

  return (
    <section className={styles.rail} aria-labelledby={id}>
      <div className={styles.railHeading}>
        <h2 id={id}>{name}</h2>
        <div className={styles.railActions}>
          {href && <Link href={href} className={styles.viewAll}>View All</Link>}
          <div className={styles.railButtons}>
            <button type="button" onClick={() => advance(-1)} aria-label={`Previous ${name} titles`}><ChevronLeft size={18} aria-hidden /></button>
            <button type="button" onClick={() => advance(1)} aria-label={`Next ${name} titles`}><ChevronRight size={18} aria-hidden /></button>
          </div>
        </div>
      </div>
      <div className={`${styles.track} ${portrait ? styles.portraitTrack : ""}`} ref={track}>
        {children}
      </div>
    </section>
  );
}

export function TitleRail({ name, href, titles, portrait }: { name: string; href?: string; titles: Title[]; portrait?: boolean }) {
  if (!titles.length) return null;
  return (
    <Rail name={name} href={href} portrait={portrait}>
      {titles.map((title) => <TitleCard key={title.slug} title={title} portrait={portrait} />)}
    </Rail>
  );
}
