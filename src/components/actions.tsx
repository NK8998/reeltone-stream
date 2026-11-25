"use client";

import { Bookmark, Check, Info, Play } from "lucide-react";
import { NavigationLink as Link } from "@/components/navigation-progress";
import type { MouseEvent } from "react";
import { progressKey, rememberWatchOrigin, toggleSaved, useLibrary } from "@/features/library/library";
import type { Playable } from "@/features/catalog/types";
import styles from "./actions.module.css";

export function SaveButton({ slug, name }: { slug: string; name: string }) {
  const { saved } = useLibrary();
  const selected = Object.hasOwn(saved, slug);
  return (
    <button
      type="button"
      className={`${styles.button} ${styles.icon} ${selected ? styles.selected : ""}`}
      aria-label={selected ? `Remove ${name} from My List` : `Add ${name} to My List`}
      aria-pressed={selected}
      title={selected ? "Remove from My List" : "Add to My List"}
      onClick={() => toggleSaved(slug)}
    >
      {selected ? <Check size={19} aria-hidden /> : <Bookmark size={19} aria-hidden />}
    </button>
  );
}

export function WatchLink({ asset, compact = false }: { asset: Playable; compact?: boolean }) {
  const { progress } = useLibrary();
  const entry = progress[progressKey(asset)];
  const resume = entry && !entry.completed && entry.position > 1;
  const label = resume ? (asset.manifestUrl ? "Resume" : "Resume demo") : (asset.manifestUrl ? "Play" : "Play demo");

  function rememberOrigin(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    rememberWatchOrigin(asset.id);
  }

  return (
    <Link
      href={`/watch/${asset.id}`}
      className={`${styles.button} ${styles.primary} ${compact ? styles.compact : ""}`}
      onClick={rememberOrigin}
      prefetch={false}
    >
      <Play size={compact ? 16 : 20} fill="currentColor" aria-hidden />
      {label}
    </Link>
  );
}

export function InfoLink({ slug, name }: { slug: string; name?: string }) {
  return (
    <Link href={`/titles/${slug}`} className={styles.button} scroll={false} aria-label={name ? `More info about ${name}` : undefined}>
      <Info size={19} aria-hidden />
      More Info
    </Link>
  );
}
