import type { Title, TitleKind } from "./types";

export const kindLabel: Record<TitleKind, string> = {
  movie: "Film",
  series: "Series",
  documentary: "Documentary",
  animation: "Animation",
  short: "Short Film",
};

export function formatRuntime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return [hours ? `${hours}h` : "", remaining ? `${remaining}m` : ""].filter(Boolean).join(" ") || "0m";
}

export function titleMetadata(title: Title) {
  return [
    kindLabel[title.kind],
    title.year,
    title.seasons ? `${title.seasons.length} ${title.seasons.length === 1 ? "season" : "seasons"}` : title.runtime && formatRuntime(title.runtime),
  ].filter(Boolean).join(" · ");
}

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainder = String(Math.floor(seconds % 60)).padStart(2, "0");
  if (minutes < 60) return `${minutes}:${remainder}`;
  return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}:${remainder}`;
}
