"use client";

import { NavigationLink as Link } from "@/components/navigation-progress";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { InfoLink, SaveButton, WatchLink } from "@/components/actions";
import { Artwork } from "@/components/artwork";
import { titleMetadata } from "./format";
import type { Title } from "./types";
import styles from "./catalog.module.css";

type Placement = { left: number; top: number; width: number; container: HTMLElement };

export function TitleCard({ title, portrait = false }: { title: Title; portrait?: boolean }) {
  const anchor = useRef<HTMLAnchorElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(null);
  const [placement, setPlacement] = useState<Placement | null>(null);
  const playable = title.asset ?? title.seasons?.[0]?.episodes[0]?.asset;

  useEffect(() => {
    function close() {
      if (timer.current) clearTimeout(timer.current);
      setPlacement(null);
    }
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      if (timer.current) clearTimeout(timer.current);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, []);

  function cancelTimer() {
    if (timer.current) clearTimeout(timer.current);
  }

  function preview() {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    cancelTimer();
    if (placement) return;
    timer.current = setTimeout(() => {
      const node = anchor.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const dialog = node.closest("dialog");
      const bounds = dialog?.getBoundingClientRect();
      const left = Math.max(0, bounds?.left ?? 0);
      const right = Math.min(window.innerWidth, bounds?.right ?? window.innerWidth);
      const top = Math.max(0, bounds?.top ?? 0);
      const bottom = Math.min(window.innerHeight, bounds?.bottom ?? window.innerHeight);
      const width = Math.min(Math.max(rect.width * 1.2, 265), right - left - 32);
      setPlacement({
        container: dialog ?? document.body,
        width,
        left: Math.max(left + 12, Math.min(rect.left - (width - rect.width) / 2, right - width - 12)),
        top: Math.max(top + 12, Math.min(rect.top - 12, bottom - (width * .5625 + 164))),
      });
    }, 500);
  }

  function dismiss() {
    cancelTimer();
    timer.current = setTimeout(() => setPlacement(null), 120);
  }

  return (
    <article className={styles.card}>
      <Link
        href={`/titles/${title.slug}`}
        scroll={false}
        ref={anchor}
        className={styles.cardLink}
        onPointerEnter={preview}
        onPointerLeave={dismiss}
      >
        <div className={`${styles.thumbnail} ${portrait ? styles.portrait : ""}`}>
          <Artwork src={title.artwork} />
        </div>
        <h3>{title.name}</h3>
        <p>{titleMetadata(title)}</p>
      </Link>
      {placement && createPortal(
        <div className={styles.hoverCard} style={{ left: placement.left, top: placement.top, width: placement.width }} onPointerEnter={cancelTimer} onPointerLeave={dismiss} onKeyDown={(event) => {
          if (event.key === "Escape") {
            setPlacement(null);
            anchor.current?.focus();
          }
        }}>
          <Link href={`/titles/${title.slug}`} scroll={false} aria-label={`Details for ${title.name}`} className={styles.thumbnail} onClick={() => setPlacement(null)}>
            <Artwork src={title.artwork} />
          </Link>
          <div className={styles.hoverContent}>
            <div className={styles.cardActions}>
              {playable && <WatchLink asset={playable} compact />}
              <SaveButton slug={title.slug} name={title.name} />
              <span onClick={() => setPlacement(null)}><InfoLink slug={title.slug} name={title.name} /></span>
            </div>
            <strong>{title.name}</strong>
            <p className={styles.hoverMeta}>{titleMetadata(title)} · {title.genres[0]}</p>
            <p className={styles.hoverSynopsis}>{title.synopsis}</p>
          </div>
        </div>,
        placement.container,
      )}
    </article>
  );
}
