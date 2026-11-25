import { Artwork } from "@/components/artwork";
import { formatRuntime, titleMetadata } from "./format";
import { EpisodePicker, TitleActions } from "./episode-picker";
import { TitleGrid } from "./catalog-layout";
import type { Title } from "./types";
import styles from "./details.module.css";

export function TitleDetails({ title, related, backdrop, headingId }: {
  title: Title; related: Title[]; backdrop?: string; headingId?: string;
}) {
  const asset = title.asset ?? title.seasons?.[0]?.episodes[0]?.asset;
  const quality = asset?.encodings[0]?.tag;
  const relatedId = headingId ? "modal-related-titles" : "related-titles";
  const details = [
    { label: "Genres", value: title.genres.join(", ") },
    { label: "Original language", value: title.language },
    { label: "Director", value: title.director },
    { label: "Cast", value: title.cast?.join(", ") },
    { label: "Source quality", value: quality },
  ].filter(({ value }) => Boolean(value));

  return (
    <article className={styles.detail}>
      <header className={styles.hero}>
        <div className={styles.art}><Artwork src={backdrop ?? title.artwork} eager sizes="(max-width: 720px) 100vw, 82vw" /></div>
        <div className={styles.heroCopy}>
          <p>{titleMetadata(title)} {title.rating && <span>{title.rating}</span>}</p>
          <h1 id={headingId}>{title.name}</h1>
          <TitleActions title={title} />
        </div>
      </header>
      <div className={styles.body}>
        <div className={styles.facts}>
          <section aria-label="Synopsis">
            <p className={styles.synopsis}>{title.synopsis}</p>
            {title.advisory && <p className={styles.advisory}>{title.advisory}</p>}
            {title.credits && <p className={styles.advisory}>{title.credits}</p>}
            {!asset?.manifestUrl && <p className={styles.advisory}>Demo playback uses the open film Big Buck Bunny.</p>}
          </section>
          <dl>
            {details.map(({ label, value }) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            {title.runtime && <div><dt>Runtime</dt><dd>{formatRuntime(title.runtime)}</dd></div>}
          </dl>
        </div>
        {title.seasons && <EpisodePicker seasons={title.seasons} />}
        {related.length > 0 && <section className={styles.related} aria-labelledby={relatedId}><h2 id={relatedId}>More Like This</h2><TitleGrid items={related} /></section>}
      </div>
    </article>
  );
}
