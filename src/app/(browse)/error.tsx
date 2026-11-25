"use client";

import { CatalogPage } from "@/features/catalog/catalog-layout";
import styles from "@/features/catalog/catalog.module.css";
import actions from "@/components/actions.module.css";
import { NavigationLink as Link } from "@/components/navigation-progress";

export default function CatalogError({ reset }: { reset: () => void }) {
  return (
    <CatalogPage name="Catalog unavailable">
      <div className={styles.empty} role="alert">
        <p>We couldn’t load this page. Try again or return to Home.</p>
        <div className={styles.errorActions}>
          <button className={`${actions.button} ${actions.primary}`} type="button" onClick={reset}>Retry</button>
          <Link className={actions.button} href="/">Return Home</Link>
        </div>
      </div>
    </CatalogPage>
  );
}
