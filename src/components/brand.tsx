import Image from "next/image";
import { NavigationLink as Link } from "@/components/navigation-progress";
import styles from "./brand.module.css";

export function BrandMark({ className }: { className?: string }) {
  return <Image className={`${styles.mark} ${className ?? ""}`} src="/brand/reel_favicon.png" alt="" width={34} height={34} loading="eager" unoptimized />;
}

export function Brand() {
  return (
    <Link href="/" className={styles.brand} aria-label="ReelTone home">
      <BrandMark />
      <Image className={styles.wordmark} src="/brand/reel_logo_white.png" alt="" width={819} height={128} loading="eager" unoptimized />
    </Link>
  );
}
