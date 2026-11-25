"use client";

import { useId, useState } from "react";
import { SaveButton, WatchLink } from "@/components/actions";
import { Artwork } from "@/components/artwork";
import { progressKey, useLibrary } from "@/features/library/library";
import { formatRuntime } from "./format";
import type { Season, Title } from "./types";
import styles from "./details.module.css";

export function TitleActions({ title }: { title: Title }) {
  const { progress } = useLibrary();
  const assets = title.asset ? [title.asset] : title.seasons?.flatMap((season) => season.episodes.map(({ asset }) => asset)) ?? [];
  const unfinished = assets.flatMap((asset) => {
    const item = progress[progressKey(asset)];
    return item && item.position > 1 && !item.completed ? [{ asset, item }] : [];
  }).sort((a, b) => b.item.updatedAt - a.item.updatedAt);
  const asset = unfinished[0]?.asset ?? assets[0];
  return (
    <div className={styles.actions}>
      {asset && <WatchLink asset={asset} />}
      <SaveButton slug={title.slug} name={title.name} />
    </div>
  );
}

export function EpisodePicker({ seasons }: { seasons: Season[] }) {
  const { progress } = useLibrary();
  const [number, setNumber] = useState(seasons[0].number);
  const id = useId();
  const season = seasons.find((item) => item.number === number) ?? seasons[0];

  return (
    <section className={styles.episodes} aria-labelledby={id}>
      <div className={styles.episodesHeading}>
        <h2 id={id}>Episodes</h2>
        <select aria-label="Season" value={number} onChange={(event) => setNumber(Number(event.target.value))}>
          {seasons.map(({ number }) => <option key={number} value={number}>Season {number}</option>)}
        </select>
      </div>
      {season.episodes.map(({ number, name, synopsis, asset }) => {
        const item = progress[progressKey(asset)];
        return (
          <article key={asset.id} className={styles.episode}>
            <span className={styles.episodeNumber}>{number}</span>
            <div className={styles.episodeArt}>
              <Artwork src={asset.artwork} />
              {item && <progress aria-label={`Progress for ${name}`} max={item.duration} value={item.position} />}
            </div>
            <div>
              <h3>{name}</h3>
              {asset.runtime && <p className={styles.episodeRuntime}>{formatRuntime(asset.runtime)}</p>}
              <p>{synopsis}</p>
            </div>
            <WatchLink asset={asset} compact />
          </article>
        );
      })}
    </section>
  );
}
