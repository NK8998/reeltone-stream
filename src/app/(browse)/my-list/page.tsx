import type { Metadata } from "next";
import { titles } from "@/features/catalog/catalog";
import { CatalogPage } from "@/features/catalog/catalog-layout";
import { MyList } from "@/features/library/my-list";

export const metadata: Metadata = { title: "My List", robots: { index: false } };

export default function MyListPage() {
  return <CatalogPage name="My List"><MyList titles={titles} /></CatalogPage>;
}
