import { CatalogPage, EmptyState } from "@/features/catalog/catalog-layout";

export default function NotFound() {
  return <main><CatalogPage name="Page unavailable"><EmptyState title="We couldn’t find that page" href="/" label="Return to browsing" /></CatalogPage></main>;
}
