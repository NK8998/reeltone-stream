"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import styles from "./details.module.css";

export function TitleDialog({ children }: { children: ReactNode }) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const close = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const node = dialog.current;
    const previousFocus = document.activeElement;
    if (node && !node.open) node.showModal();
    close.current?.focus();
    return () => {
      if (node?.open) node.close();
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-labelledby="title-dialog-heading"
      onCancel={(event) => { event.preventDefault(); router.back(); }}
      onClick={(event) => { if (event.target === event.currentTarget) router.back(); }}
    >
      <div className={styles.dialogInner}>
        <button className={styles.close} type="button" onClick={() => router.back()} aria-label="Close title details" ref={close}><X size={23} aria-hidden /></button>
        {children}
      </div>
    </dialog>
  );
}
