import type { Metadata } from "next";
import { NavigationLink as Link } from "@/components/navigation-progress";
import { featured, titles } from "@/features/catalog/catalog";
import { CatalogPage, EmptyState, TitleGrid } from "@/features/catalog/catalog-layout";
import { collectionSlugs, collections } from "@/features/catalog/collections";
import { filterOptions, filterTitles, queryValue, type Query } from "@/features/catalog/filters";
import { CatalogFilters, RecentSearches } from "@/features/catalog/search-form";
import styles from "@/features/catalog/search.module.css";

export const metadata: Metadata = { title: "Search", robots: { index: false } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<Query> }) {
  const query = await searchParams;
  const term = queryValue(query, "q");
  const hasFilters = ["format", "genre", "year", "language", "sort"].some((key) => queryValue(query, key));
  const results = filterTitles(titles, query);
  const options = filterOptions(titles);

  return (
    <CatalogPage name="Search">
      <CatalogFilters path="/search" query={query} options={options} search />
      {term || hasFilters ? (
        <>
          <p className={styles.resultCount} aria-live="polite">
            {results.length} {results.length === 1 ? "result" : "results"}{term && <> for “{term}”</>}
          </p>
          {results.length ? <TitleGrid items={results} /> : <EmptyState title="No titles found for your search." message="Check the spelling, try a different title or genre, or clear your filters." href="/search" label="Clear search and filters" />}
        </>
      ) : (
        <div className={styles.suggestions}>
          <RecentSearches />
          <section className={styles.suggestion}>
            <h2>Explore genres</h2>
            <div className={styles.chips}>
              {["Drama", "Science Fiction", "Animation", "Independent", "Adventure"].map((genre) => (
                <Link key={genre} href={`/search?genre=${encodeURIComponent(genre)}`}>{genre}</Link>
              ))}
            </div>
          </section>
          <section className={styles.suggestion}>
            <h2>Curated collections</h2>
            <div className={styles.chips}>{collectionSlugs.map((slug) => <Link key={slug} href={`/collections/${slug}`}>{collections[slug].name}</Link>)}</div>
          </section>
          <section className={styles.suggestion}>
            <h2>Suggested titles</h2>
            <TitleGrid items={featured.map(({ title }) => title)} />
          </section>
        </div>
      )}
    </CatalogPage>
  );
}
