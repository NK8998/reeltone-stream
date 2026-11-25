"use client";

import { Play, X } from "lucide-react";
import { NavigationLink as Link } from "@/components/navigation-progress";
import { Artwork } from "@/components/artwork";
import type { CatalogPlayableEntry } from "@/features/catalog/types";
import { Rail } from "@/features/catalog/title-rail";
import { formatTime } from "@/features/catalog/format";
import { progressKey, removeProgress, rememberWatchOrigin, useLibrary } from "./library";
import styles from "./library.module.css";

export function ContinueWatching({ entries }: { entries: CatalogPlayableEntry[] }) {
  const { progress } = useLibrary();
  const items = entries.flatMap((entry) => {
    const saved = progress[progressKey(entry.asset)];
    return saved && !saved.completed && saved.position > 1 && saved.position < saved.duration
      ? [{ ...entry, saved }] : [];
  }).sort((a, b) => b.saved.updatedAt - a.saved.updatedAt);
  if (!items.length) return null;

  return (
    <Rail name="Continue Watching">
      {items.map(({ asset, title, episode, season, saved }) => (
        <article className={styles.resume} key={asset.id}>
          <Link href={`/watch/${asset.id}`} prefetch={false} onClick={(event) => {
            if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) rememberWatchOrigin(asset.id);
          }} aria-label={`Resume ${episode?.name ?? title.name}`}>
            <div className={styles.resumeArt}>
              <Artwork src={asset.artwork} />
              <span className={styles.play}><Play size={20} fill="currentColor" aria-hidden /></span>
              <progress aria-label="Watched" max={saved.duration} value={saved.position} />
            </div>
            <h3>{title.name}</h3>
            <p>{episode && `S${season} E${episode.number} · `}{formatTime(saved.duration - saved.position)} left</p>
          </Link>
          <button type="button" onClick={() => removeProgress(progressKey(asset))} className={styles.remove} aria-label={`Remove ${episode?.name ?? title.name} from Continue Watching`}><X size={17} aria-hidden /></button>
        </article>
      ))}
    </Rail>
  );
}
