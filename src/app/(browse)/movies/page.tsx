import type { Metadata } from "next";
import { titles } from "@/features/catalog/catalog";
import { Category } from "@/features/catalog/category";
import type { Query } from "@/features/catalog/filters";

export const metadata: Metadata = { title: "Movies", description: "Browse films, animated features, and shorts on ReelTone." };

export default async function MoviesPage({ searchParams }: { searchParams: Promise<Query> }) {
  return <Category name="Movies" description="Feature films, animation, and shorts." path="/movies" titles={titles.filter(({ kind }) => ["movie", "animation", "short"].includes(kind))} query={await searchParams} />;
}
