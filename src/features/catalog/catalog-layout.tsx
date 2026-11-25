import { NavigationLink as Link } from "@/components/navigation-progress";
import type { ReactNode } from "react";
import { TitleCard } from "./title-card";
import type { Title } from "./types";
import styles from "./catalog.module.css";

export function CatalogPage({ name, description, children }: { name: string; description?: string; children: ReactNode }) {
  return (
    <div className={`page-width ${styles.page}`}>
      <header className={styles.pageHeading}>
        <h1>{name}</h1>
        {description && <p>{description}</p>}
      </header>
      {children}
    </div>
  );
}

export function TitleGrid({ items }: { items: Title[] }) {
  return <div className={styles.grid}>{items.map((title) => <TitleCard key={title.slug} title={title} />)}</div>;
}

export function EmptyState({ title, message, href, label }: { title: string; message?: string; href?: string; label?: string }) {
  return (
    <div className={styles.empty}>
      <h2>{title}</h2>
      {message && <p>{message}</p>}
      {href && <Link href={href}>{label}</Link>}
    </div>
  );
}
