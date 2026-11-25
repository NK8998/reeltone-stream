"use client";

import { useState } from "react";
import { InfoLink, SaveButton, WatchLink } from "@/components/actions";
import { Artwork } from "@/components/artwork";
import { kindLabel, titleMetadata } from "@/features/catalog/format";
import type { Title } from "@/features/catalog/types";
import styles from "./home.module.css";

export function FeaturedHero({ items }: { items: { title: Title; backdrop: string }[] }) {
  const [active, select] = useState(0);
  const { title, backdrop } = items[active];
  const asset = title.asset ?? title.seasons?.[0]?.episodes[0]?.asset;

  return (
    <section className={styles.hero} aria-label="Featured titles">
      <div className={styles.heroArt} key={backdrop}>
        <Artwork src={backdrop} className={styles.backdrop} eager sizes="100vw" />
      </div>
      <div className={`page-width ${styles.heroInner}`}>
        <div className={styles.heroCopy} key={title.slug}>
          <p className={styles.eyebrow}><span /> Featured {kindLabel[title.kind]}</p>
          <h1>{title.name}</h1>
          <p className={styles.meta}>
            {titleMetadata(title)} <span aria-hidden>·</span> {title.genres[0]}
            {title.rating && <span className={styles.rating}>{title.rating}</span>}
          </p>
          <p className={styles.synopsis}>{title.synopsis}</p>
          <div className={styles.actions}>
            {asset && <WatchLink asset={asset} />}
            <InfoLink slug={title.slug} name={title.name} />
            <SaveButton slug={title.slug} name={title.name} />
          </div>
        </div>
        <div className={styles.indicators} aria-label="Choose a featured title">
          {items.map(({ title }, index) => (
            <button key={title.slug} type="button" onClick={() => select(index)} aria-label={`Feature ${title.name}`} aria-pressed={active === index}>
              <span />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
