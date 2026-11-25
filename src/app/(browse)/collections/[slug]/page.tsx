import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogPage, TitleGrid } from "@/features/catalog/catalog-layout";
import { collectionSlugs, getCollection } from "@/features/catalog/collections";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return collectionSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const collection = getCollection((await params).slug);
  return collection ? { title: collection.name, description: collection.description } : {};
}

export default async function CollectionPage({ params }: Props) {
  const collection = getCollection((await params).slug);
  if (!collection) notFound();
  return <CatalogPage name={collection.name} description={collection.description}><TitleGrid items={collection.titles} /></CatalogPage>;
}
