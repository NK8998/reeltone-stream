import type { Metadata } from "next";
import { Settings } from "@/features/account/settings";
import { CatalogPage } from "@/features/catalog/catalog-layout";

export const metadata: Metadata = { title: "Settings", robots: { index: false } };

export default function SettingsPage() {
  return <CatalogPage name="Settings"><Settings /></CatalogPage>;
}
