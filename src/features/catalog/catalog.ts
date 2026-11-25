import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { editorial } from "./editorial";
import type { CatalogPlayableEntry, Encoding, Playable, PlayableEntry, Title } from "./types";

type ExportRow = {
  video_id: string;
  created_at: string;
  resolutions: string;
  mpd_url?: string;
  manifest_url?: string;
  intro_end_seconds?: string;
  recap_end_seconds?: string;
};

function manifestUrl(value: string | undefined) {
  value = value?.trim();
  if (!value) return undefined;
  if (/^\/(?!\/)[^?#]+\.mpd(?:[?#].*)?$/i.test(value)) return value;
  try {
    const source = new URL(value);
    return source.protocol === "https:" ? source.href : undefined;
  } catch {
    return undefined;
  }
}

function positiveTime(value: string | undefined) {
  const seconds = Number(value);
  return Number.isFinite(seconds) && seconds > 0 ? seconds : undefined;
}

function readAssets() {
  const filename = path.join(process.cwd(), "data", "mock_data.csv");
  const rows = parse(readFileSync(filename, "utf8"), { columns: true, bom: true, skip_empty_lines: true }) as ExportRow[];
  return new Map(rows.map((row) => {
    const asset: Playable = {
      id: row.video_id,
      artwork: `/artwork/${row.video_id}.jpg`,
      addedAt: new Date(row.created_at.replace(" ", "T").replace(/([+-]\d{2})$/, "$1:00")).toISOString(),
      encodings: JSON.parse(row.resolutions) as Encoding[],
      manifestUrl: manifestUrl(row.mpd_url) ?? manifestUrl(row.manifest_url),
      introEnd: positiveTime(row.intro_end_seconds),
      recapEnd: positiveTime(row.recap_end_seconds),
    };
    return [asset.id, asset];
  }));
}

const assets = readAssets();

function getAsset(id: string, artwork?: string, runtime?: number): Playable {
  const asset = assets.get(id);
  if (!asset) throw new Error(`Missing ReelTone asset ${id} in data/mock_data.csv`);
  return { ...asset, artwork: artwork ?? asset.artwork, runtime };
}

export const titles: Title[] = editorial.map(({ id, artwork, seasons, ...metadata }) => {
  const asset = getAsset(id, artwork, metadata.runtime);
  return {
    ...metadata,
    artwork: asset.artwork,
    addedAt: asset.addedAt,
    asset: seasons ? undefined : asset,
    seasons: seasons?.map((season) => ({
      number: season.number,
      episodes: season.episodes.map(({ id, artwork, runtime, ...episode }, index) => ({
        ...episode,
        number: index + 1,
        asset: getAsset(id, artwork, runtime),
      })),
    })),
  };
});

export const playables = titles.flatMap((title): CatalogPlayableEntry[] => {
  if (title.asset) return [{ title, asset: title.asset }];
  const episodes = title.seasons?.flatMap((season) =>
    season.episodes.map((episode) => ({ season: season.number, episode })),
  ) ?? [];
  return episodes.map(({ season, episode }, index) => ({
    title,
    asset: episode.asset,
    season,
    episode,
    next: episodes[index + 1] && {
      id: episodes[index + 1].episode.asset.id,
      name: episodes[index + 1].episode.name,
    },
  }));
});

export function getTitle(slug: string) {
  return titles.find((title) => title.slug === slug);
}

export function getPlayable(id: string): PlayableEntry | undefined {
  const catalogEntry = playables.find((item) => item.asset.id === id);
  if (catalogEntry) return catalogEntry;

  const asset = assets.get(id);
  if (asset?.manifestUrl) return { asset };
}

export function newest(items: Title[]) {
  return [...items].sort((a, b) => b.addedAt.localeCompare(a.addedAt));
}

export function relatedTo(title: Title) {
  return titles.filter((other) => other.slug !== title.slug)
    .map((other) => ({
      title: other,
      score: Number(other.kind === title.kind) + other.genres.filter((genre) => title.genres.includes(genre)).length * 2,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((other) => other.title);
}

const quietTideHero = "/artwork/editorial-quiet-tide.jpg";
export const featured = ["the-quiet-tide", "northbound", "after-the-orbit"].map((slug) => {
  const title = getTitle(slug)!;
  const hasEditorialArt = slug === "the-quiet-tide" && existsSync(path.join(process.cwd(), "public", quietTideHero));
  return { title, backdrop: hasEditorialArt ? quietTideHero : title.artwork };
});
