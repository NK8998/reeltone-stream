import type { Metadata } from "next";
import { titles } from "@/features/catalog/catalog";
import { Category } from "@/features/catalog/category";
import type { Query } from "@/features/catalog/filters";

export const metadata: Metadata = { title: "TV Shows", description: "Discover series and explore seasons and episodes on ReelTone." };

export default async function TVShowsPage({ searchParams }: { searchParams: Promise<Query> }) {
  return <Category name="TV Shows" description="Find a series to settle into." path="/tv-shows" titles={titles.filter(({ kind }) => kind === "series")} query={await searchParams} />;
}
