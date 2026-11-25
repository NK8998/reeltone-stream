import styles from "@/features/catalog/catalog.module.css";

export default function BrowsingLoading() {
  return (
    <div className={`page-width ${styles.page}`} role="status">
      <span className="sr-only">Loading titles</span>
      <div className={`${styles.skeleton} ${styles.skeletonHeading}`} aria-hidden="true" />
      <div className={styles.grid} aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <div className={styles.skeletonCard} key={index}>
            <div className={`${styles.thumbnail} ${styles.skeleton}`} />
            <div className={`${styles.skeleton} ${styles.skeletonLabel}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
