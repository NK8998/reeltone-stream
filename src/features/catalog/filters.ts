import type { Title, TitleKind } from "./types";

export type Query = Record<string, string | string[] | undefined>;

export function queryValue(query: Query, key: string) {
  const value = query[key];
  return (Array.isArray(value) ? value[0] : value)?.trim().slice(0, 160) ?? "";
}

export const formats: { value: TitleKind; label: string }[] = [
  { value: "movie", label: "Movies" },
  { value: "series", label: "TV Shows" },
  { value: "documentary", label: "Documentaries" },
  { value: "short", label: "Short Films" },
  { value: "animation", label: "Animation" },
];

function matchesFormat(title: Title, format: string) {
  return title.kind === format || (format === "animation" && title.genres.includes("Animation"));
}

function sortedUnique(items: (string | undefined)[]) {
  return [...new Set(items.filter((item): item is string => Boolean(item)))].sort((a, b) => a.localeCompare(b));
}

export function filterOptions(titles: Title[]) {
  return {
    genres: sortedUnique(titles.flatMap((title) => title.genres)),
    years: sortedUnique(titles.map((title) => title.year?.toString())).reverse(),
    languages: sortedUnique(titles.map((title) => title.language)),
  };
}

function score(title: Title, search: string) {
  if (!search) return 1;
  const name = title.name.toLowerCase();
  const fields = [name, title.year, title.synopsis, title.director, title.language, ...title.genres, ...title.cast ?? []].join(" ").toLowerCase();
  const words = search.split(/\s+/);
  if (!words.every((word) => fields.includes(word))) return 0;
  return name === search ? 5 : name.includes(search) ? 4 : 1;
}

export function filterTitles(titles: Title[], query: Query) {
  const term = queryValue(query, "q").toLowerCase();
  const format = queryValue(query, "format");
  const genre = queryValue(query, "genre");
  const year = queryValue(query, "year");
  const language = queryValue(query, "language");
  const sort = queryValue(query, "sort");
  return titles
    .map((title) => ({ title, score: score(title, term) }))
    .filter(({ title, score }) => score > 0 &&
      (!format || matchesFormat(title, format)) &&
      (!genre || title.genres.includes(genre)) &&
      (!year || String(title.year) === year) &&
      (!language || title.language === language))
    .sort((a, b) => {
      if (sort === "title") return a.title.name.localeCompare(b.title.name);
      if (sort === "year") return (b.title.year ?? 0) - (a.title.year ?? 0) || b.title.addedAt.localeCompare(a.title.addedAt);
      return b.score - a.score;
    })
    .map(({ title }) => title);
}
