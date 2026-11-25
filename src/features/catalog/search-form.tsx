"use client";

import { Search, X } from "lucide-react";
import Form from "next/form";
import { NavigationLink as Link, useStartNavigationProgress } from "@/components/navigation-progress";
import { useId } from "react";
import { clearSearches, rememberSearch, useLibrary } from "@/features/library/library";
import { formats, queryValue, type Query } from "./filters";
import styles from "./search.module.css";

type Options = { genres: string[]; years: string[]; languages: string[] };

function SelectFilter({ name, label, selected, options }: { name: string; label: string; selected: string; options: { value: string; label: string }[] }) {
  return (
    <label className={styles.select}>
      {label}
      <select name={name} defaultValue={selected}>
        {options.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
      </select>
    </label>
  );
}

function choices(items: string[], all: string) {
  return [{ value: "", label: all }, ...items.map((value) => ({ label: value, value }))];
}

export function CatalogFilters({ path, query, options, search = false }: {
  path: string; query: Query; options: Options; search?: boolean;
}) {
  const term = queryValue(query, "q");
  const searchId = useId();
  const startProgress = useStartNavigationProgress();

  return (
    <Form key={JSON.stringify(query)} action={path} className={styles.form} onSubmit={(event) => {
      const data = new FormData(event.currentTarget);
      if (search) rememberSearch(String(data.get("q") ?? ""));
      const destination = new URL(path, window.location.href);
      data.forEach((value, key) => {
        if (typeof value === "string") destination.searchParams.append(key, value);
      });
      startProgress(destination);
    }}>
      {search && <div className={styles.searchRow}>
        <div className={styles.searchField}>
          <Search size={22} aria-hidden />
          <label htmlFor={searchId} className="sr-only">Search movies, shows and more</label>
          <input id={searchId} name="q" type="search" defaultValue={term} placeholder="Search movies, shows and more" autoComplete="off" />
          {term && <Link href={path} aria-label="Clear search"><X size={19} aria-hidden /></Link>}
        </div>
        <button className={styles.submit} type="submit">Search</button>
      </div>}
      <div className={styles.filters}>
        {search && <SelectFilter name="format" label="Format" selected={queryValue(query, "format")} options={[{ value: "", label: "All Titles" }, ...formats]} />}
        <SelectFilter name="genre" label="Genre" selected={queryValue(query, "genre")} options={choices(options.genres, "All Genres")} />
        <SelectFilter name="year" label="Release year" selected={queryValue(query, "year")} options={choices(options.years, "All Years")} />
        {options.languages.length > 0 && <SelectFilter name="language" label="Language" selected={queryValue(query, "language")} options={choices(options.languages, "All Languages")} />}
        <SelectFilter name="sort" label="Sort by" selected={queryValue(query, "sort")} options={[
          { value: "", label: search ? "Relevance" : "Featured" },
          { value: "year", label: "Release Date" },
          { value: "title", label: "Alphabetical" },
        ]} />
        <button className={styles.apply} type="submit">Apply filters</button>
      </div>
    </Form>
  );
}

export function RecentSearches() {
  const { recent } = useLibrary();
  if (!recent.length) return null;
  return (
    <section className={styles.suggestion} aria-label="Recent searches">
      <div className={styles.suggestionHeading}>
        <h2>Recent searches</h2>
        <button type="button" onClick={clearSearches}>Clear history</button>
      </div>
      <div className={styles.chips}>
        {recent.map((term) => <Link key={term} href={`/search?q=${encodeURIComponent(term)}`}>{term}</Link>)}
      </div>
    </section>
  );
}
