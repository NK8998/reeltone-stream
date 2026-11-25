"use client";

import { useRef, useState, type CSSProperties, type PointerEvent } from "react";
import type { Thumbnail } from "dashjs";
import { formatTime } from "@/features/catalog/format";
import type { DashControls } from "./use-dash";
import styles from "./player.module.css";

export function Timeline({ time, duration, buffered, seek, previewAt }: {
  time: number; duration: number; buffered: number; seek: (time: number) => void; previewAt: DashControls["previewAt"];
}) {
  const request = useRef(0);
  const [preview, showPreview] = useState<{ progress: number; time: number; image?: Thumbnail } | null>(null);
  const durationAvailable = Number.isFinite(duration) && duration > 0;
  const percent = durationAvailable ? 100 * time / duration : 0;
  const loaded = durationAvailable ? Math.max(percent, 100 * buffered / duration) : 0;

  function onMove(event: PointerEvent<HTMLInputElement>) {
    if (event.pointerType === "touch" || !durationAvailable) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const at = Math.min(Math.max(0, duration - .05), progress * duration);
    const token = ++request.current;
    showPreview((current) => ({ progress, time: at, image: current?.image }));
    previewAt(at, (image) => {
      if (token === request.current) showPreview({ progress, time: at, image: image ?? undefined });
    });
  }

  return (
    <div className={styles.timeline}>
      {preview && <div className={styles.preview} style={{ left: `clamp(2rem, ${preview.progress * 100}%, calc(100% - 2rem))` }} aria-hidden>
        {preview.image && <div style={{
          width: preview.image.width,
          height: preview.image.height,
          backgroundImage: `url(${JSON.stringify(preview.image.url)})`,
          backgroundPosition: `-${preview.image.x}px -${preview.image.y}px`,
        }} />}
        <span>{formatTime(preview.time)}</span>
      </div>}
      <input
        aria-label="Seek"
        aria-valuetext={`${formatTime(time)} of ${formatTime(duration)}`}
        type="range" min={0} max={durationAvailable ? duration : 1} step={.1}
        value={durationAvailable ? Math.min(duration, time) : 0}
        disabled={!durationAvailable}
        style={{ "--played": `${percent}%`, "--buffered": `${loaded}%` } as CSSProperties}
        onChange={(event) => seek(Number(event.target.value))}
        onPointerMove={onMove}
        onPointerLeave={() => { request.current++; showPreview(null); }}
      />
    </div>
  );
}
