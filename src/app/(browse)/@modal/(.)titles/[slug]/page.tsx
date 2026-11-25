import { notFound } from "next/navigation";
import { featured, getTitle, relatedTo } from "@/features/catalog/catalog";
import { TitleDetails } from "@/features/catalog/title-details";
import { TitleDialog } from "@/features/catalog/title-dialog";

export default async function InterceptedTitlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = getTitle(slug);
  if (!title) notFound();
  return (
    <TitleDialog>
      <TitleDetails title={title} related={relatedTo(title)} headingId="title-dialog-heading" backdrop={featured.find((item) => item.title.slug === slug)?.backdrop} />
    </TitleDialog>
  );
}
