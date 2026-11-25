import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { featured, getTitle, relatedTo, titles } from "@/features/catalog/catalog";
import { TitleDetails } from "@/features/catalog/title-details";
import styles from "@/features/catalog/details.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return titles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const title = getTitle((await params).slug);
  if (!title) return {};
  return { title: title.name, description: title.synopsis, openGraph: { title: title.name, description: title.synopsis } };
}

export default async function TitlePage({ params }: Props) {
  const { slug } = await params;
  const title = getTitle(slug);
  if (!title) notFound();
  return <div className={styles.direct}><TitleDetails title={title} related={relatedTo(title)} backdrop={featured.find((item) => item.title.slug === slug)?.backdrop} /></div>;
}
