import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPlayable, relatedTo } from "@/features/catalog/catalog";
import { getServerManifest } from "@/features/playback/backend";
import { WatchExperience } from "@/features/playback/player";

type Props = { params: Promise<{ playableId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const entry = getPlayable((await params).playableId);
  const name = entry?.episode?.name ?? entry?.title?.name;
  return { title: name ? `Watch ${name}` : "Watch", robots: { index: false } };
}

export default async function WatchPage({ params }: Props) {
  const entry = getPlayable((await params).playableId);
  if (!entry) notFound();
  const manifestUrl = await getServerManifest(entry.asset.id);
  const playback = manifestUrl === undefined
    ? entry
    : { ...entry, asset: { ...entry.asset, manifestUrl: manifestUrl ?? undefined } };
  return <WatchExperience entry={playback} related={entry.title ? relatedTo(entry.title) : []} />;
}
