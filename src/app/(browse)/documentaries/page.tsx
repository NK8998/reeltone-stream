import type { Metadata } from "next";
import { collections } from "@/features/catalog/collections";
import { Category } from "@/features/catalog/category";
import type { Query } from "@/features/catalog/filters";

export const metadata: Metadata = { title: "Documentaries", description: "Explore documentaries on ReelTone." };

export default async function DocumentariesPage({ searchParams }: { searchParams: Promise<Query> }) {
  return <Category {...collections.documentaries} path="/documentaries" query={await searchParams} />;
}
