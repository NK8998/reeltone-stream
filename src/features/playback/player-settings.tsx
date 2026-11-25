"use client";

import { useState } from "react";
import { setPreference, type Preferences } from "@/features/library/library";
import type { DashControls } from "./use-dash";
import styles from "./player.module.css";

export type Panel = "settings" | "tracks" | "report";

const speeds = [.5, .75, 1, 1.25, 1.5, 2];

export function PlayerSettings({ panel, dash, rate, onRate, preferences, videoId, isDemo, onClose }: {
  panel: Panel; dash: DashControls; rate: number; onRate: (value: number) => void;
  preferences: Preferences; videoId: string; isDemo: boolean; onClose: () => void;
}) {
  const [reported, setReported] = useState(false);
  const [reportError, setReportError] = useState(false);

  if (panel === "report") {
    return (
      <section className={`${styles.panel} ${styles.report}`} aria-label="Report playback issue">
        <h2>Report playback issue</h2>
        {reported ? <p role="status">Report saved on this device.</p> :
          <form onSubmit={(event) => {
            event.preventDefault();
            try {
              localStorage.setItem("reeltone:last-playback-report", JSON.stringify({
                videoId, isDemo, issue: new FormData(event.currentTarget).get("issue"), date: new Date().toISOString(),
              }));
              setReported(true);
            } catch {
              setReportError(true);
            }
          }}>
            <label>Issue<select name="issue"><option>Buffering</option><option>Video quality</option><option>Audio</option><option>Subtitles</option><option>Other playback issue</option></select></label>
            <button type="submit">Save report on this device</button>
          </form>}
        {reportError && <p role="alert">This browser couldn’t save your report.</p>}
        <button type="button" onClick={onClose}>Close</button>
      </section>
    );
  }

  if (panel === "tracks") {
    return (
      <section className={styles.panel} aria-label="Audio and subtitles">
        <h2>Audio and subtitles</h2>
        {dash.tracks.audio.length > 0 && <label>Audio<select value={dash.audio} onChange={(event) => dash.selectAudio(event.target.value)}>
          {dash.tracks.audio.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
        </select></label>}
        {dash.tracks.text.length > 0 ? <>
          <label>Subtitles<select value={dash.subtitle} onChange={(event) => dash.selectSubtitle(event.target.value)}>
            <option value="off">Off</option>
            {dash.tracks.text.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
          </select></label>
          <label>Caption size<select value={preferences.captionSize} onChange={(event) => setPreference("captionSize", event.target.value === "large" ? "large" : "normal")}>
            <option value="normal">Standard</option><option value="large">Large</option>
          </select></label>
          <label className={styles.check}><input type="checkbox" checked={preferences.captionBackground} onChange={(event) => setPreference("captionBackground", event.target.checked)} /> Caption background</label>
        </> : <p>This stream has no subtitle tracks.</p>}
      </section>
    );
  }

  return (
    <section className={styles.panel} aria-label="Playback settings">
      <h2>Playback settings</h2>
      <label>Speed<select value={rate} onChange={(event) => onRate(Number(event.target.value))}>
        {speeds.map((speed) => <option key={speed} value={speed}>{speed === 1 ? "Normal" : `${speed}×`}</option>)}
      </select></label>
      {dash.tracks.qualities.length > 0 && <label>Quality<select value={dash.quality} onChange={(event) => dash.selectQuality(event.target.value)}>
        <option value="auto">Auto</option>
        {dash.tracks.qualities.map(({ id, height }) => <option key={id} value={id}>{height}p</option>)}
      </select></label>}
      <label>Viewing mode<select value={preferences.viewingMode} onChange={(event) => setPreference("viewingMode", event.target.value === "standard" ? "standard" : "cinema")}>
        <option value="cinema">Cinema Mode</option><option value="standard">Standard view</option>
      </select></label>
    </section>
  );
}
