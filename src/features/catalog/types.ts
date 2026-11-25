export type TitleKind = "movie" | "series" | "documentary" | "animation" | "short";

export type Encoding = {
  width: number;
  height: number;
  tag: string;
};

export type Playable = {
  id: string;
  addedAt: string;
  artwork: string;
  encodings: Encoding[];
  manifestUrl?: string;
  runtime?: number;
  introEnd?: number;
  recapEnd?: number;
};

export type Episode = {
  number: number;
  name: string;
  synopsis: string;
  asset: Playable;
};

export type Season = {
  number: number;
  episodes: Episode[];
};

export type Title = {
  slug: string;
  name: string;
  kind: TitleKind;
  synopsis: string;
  genres: string[];
  artwork: string;
  addedAt: string;
  year?: number;
  runtime?: number;
  language?: string;
  director?: string;
  cast?: string[];
  rating?: string;
  advisory?: string;
  credits?: string;
  asset?: Playable;
  seasons?: Season[];
};

export type PlayableEntry = {
  title?: Title;
  asset: Playable;
  season?: number;
  episode?: Episode;
  next?: { id: string; name: string };
};

export type CatalogPlayableEntry = PlayableEntry & { title: Title };
