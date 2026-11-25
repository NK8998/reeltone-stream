import { getTitle, newest, titles } from "./catalog";

function selection(slugs: string[]) {
  return slugs.flatMap((slug) => getTitle(slug) ?? []);
}

export const collections = {
  "featured-films": {
    name: "Featured Films",
    description: "A handpicked selection of stories to settle into.",
    titles: selection(["northbound", "after-the-orbit", "ember-line", "the-quiet-tide", "blackwater", "signal-lost", "flight-path"]),
  },
  "recently-added": {
    name: "Recently Added",
    description: "The latest arrivals in the ReelTone catalog.",
    titles: newest(titles),
  },
  "independent-cinema": {
    name: "Independent Cinema",
    description: "Personal stories and distinctive voices.",
    titles: titles.filter((title) => title.genres.includes("Independent")),
  },
  animation: {
    name: "Animation",
    description: "Stories drawn in worlds of their own.",
    titles: titles.filter((title) => title.kind === "animation" || title.genres.includes("Animation")),
  },
  documentaries: {
    name: "Documentaries",
    description: "Curious looks at the real world.",
    titles: titles.filter((title) => title.kind === "documentary"),
  },
  "short-films": {
    name: "Short Films",
    description: "Small films with a lasting impression.",
    titles: titles.filter((title) => title.kind === "short"),
  },
};

export type CollectionSlug = keyof typeof collections;
export const collectionSlugs = Object.keys(collections) as CollectionSlug[];

export function getCollection(slug: string) {
  return Object.hasOwn(collections, slug) ? collections[slug as CollectionSlug] : undefined;
}
