import { CatalogPage, EmptyState, TitleGrid } from "./catalog-layout";
import { filterOptions, filterTitles, type Query } from "./filters";
import { CatalogFilters } from "./search-form";
import type { Title } from "./types";

export function Category({ name, description, path, titles, query }: {
  name: string; description: string; path: string; titles: Title[]; query: Query;
}) {
  const results = filterTitles(titles, query);
  return (
    <CatalogPage name={name} description={description}>
      <CatalogFilters path={path} query={query} options={filterOptions(titles)} />
      {results.length ? <TitleGrid items={results} /> : <EmptyState title="No titles match these filters" href={path} label="Clear filters" />}
    </CatalogPage>
  );
}
