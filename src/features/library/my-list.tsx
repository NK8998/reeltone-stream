"use client";

import { useState } from "react";
import { EmptyState, TitleGrid } from "@/features/catalog/catalog-layout";
import type { Title } from "@/features/catalog/types";
import { useLibrary } from "./library";
import styles from "./library.module.css";

export function MyList({ titles }: { titles: Title[] }) {
  const { saved } = useLibrary();
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("recent");
  const savedTitles = titles.filter((title) => Object.hasOwn(saved, title.slug));
  if (!savedTitles.length) return <EmptyState title="Your list is empty" message="Save a title as you browse to keep it here for later." href="/" label="Browse titles" />;

  const items = savedTitles.filter((title) => filter === "all" || (filter === "series" ? title.kind === "series" : title.kind !== "series"))
    .sort((a, b) => sort === "title" ? a.name.localeCompare(b.name) : saved[b.slug] - saved[a.slug]);

  return (
    <>
      <div className={styles.filters}>
        <label>Format<select value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="all">All Titles</option><option value="movies">Movies</option><option value="series">TV Shows</option>
        </select></label>
        <label>Sort by<select value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="recent">Recently saved</option><option value="title">Alphabetical</option>
        </select></label>
      </div>
      {items.length ? <TitleGrid items={items} /> : <EmptyState title="No saved titles in this category" />}
    </>
  );
}
