import { NavigationLink as Link } from "@/components/navigation-progress";
import { featured, playables } from "@/features/catalog/catalog";
import { collections, collectionSlugs } from "@/features/catalog/collections";
import { TitleRail } from "@/features/catalog/title-rail";
import { ContinueWatching } from "@/features/library/continue-watching";
import { FeaturedHero } from "./_components/featured-hero";
import styles from "./_components/home.module.css";

export default function HomePage() {
  return (
    <>
      <FeaturedHero items={featured} />
      <div className={`page-width ${styles.rails}`}>
        <ContinueWatching entries={playables} />
        {collectionSlugs.filter((slug) => slug !== "short-films").map((slug) => (
          <TitleRail key={slug} name={collections[slug].name} titles={collections[slug].titles} href={`/collections/${slug}`} portrait={slug === "animation"} />
        ))}
        <section className={styles.collections} aria-labelledby="browse-collections">
          <h2 id="browse-collections">Browse Collections</h2>
          <Link href="/movies">Movies</Link>
          <Link href="/tv-shows">TV Shows</Link>
          {collectionSlugs.map((slug) => <Link key={slug} href={`/collections/${slug}`}>{collections[slug].name}</Link>)}
        </section>
      </div>
    </>
  );
}
