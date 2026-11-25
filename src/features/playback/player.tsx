"use client";

import {
  ArrowLeft, AudioLines, Flag, LoaderCircle, Maximize, Minimize, Pause, Play, RotateCcw,
  RotateCw, Settings as SettingsIcon, SkipForward, Volume2, VolumeX,
} from "lucide-react";
import { NavigationLink as Link } from "@/components/navigation-progress";
import { useRouter } from "@bprogress/next/app";
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { SaveButton } from "@/components/actions";
import { BrandMark } from "@/components/brand";
import { formatTime, titleMetadata } from "@/features/catalog/format";
import type { PlayableEntry, Title } from "@/features/catalog/types";
import {
  getProgress, progressKey, rememberWatchOrigin, saveProgress, useLibrary, wasOpenedFromBrowse,
} from "@/features/library/library";
import { PlayerSettings, type Panel } from "./player-settings";
import { Timeline } from "./timeline";
import { useDash } from "./use-dash";
import styles from "./player.module.css";

type Status = "loading" | "playing" | "paused" | "buffering" | "seeking" | "completed";
const demoManifest = "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd";

function IconButton({ label, children, onClick, expanded, disabled }: {
  label: string; children: ReactNode; onClick: () => void; expanded?: boolean; disabled?: boolean;
}) {
  return <button type="button" className={styles.icon} aria-label={label} title={label} aria-expanded={expanded} disabled={disabled} onClick={onClick}>{children}</button>;
}

export function WatchExperience({ entry, related }: { entry: PlayableEntry; related: Title[] }) {
  const [attempt, reinitialize] = useState(0);
  return <Session key={`${entry.asset.id}:${attempt}`} entry={entry} related={related} onRetry={() => reinitialize(attempt + 1)} />;
}

function Session({ entry, related, onRetry }: { entry: PlayableEntry; related: Title[]; onRetry: () => void }) {
  const { asset, title, season, episode, next } = entry;
  const name = episode?.name ?? title?.name ?? "Video";
  const detailsUrl = title ? `/titles/${title.slug}` : undefined;
  const router = useRouter();
  const { preferences } = useLibrary();
  const isDemo = !asset.manifestUrl;
  const progressId = progressKey(asset);
  const video = useRef<HTMLVideoElement>(null);
  const captions = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const attemptedStart = useRef(false);
  const resumed = useRef(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const lastWrite = useRef(0);
  const snapshot = useRef({ time: 0, duration: 0, completed: false });
  const [status, setStatus] = useState<Status>("loading");
  const [panel, setPanel] = useState<Panel | null>(null);
  const [controls, showControls] = useState(true);
  const [offline, setOffline] = useState(false);
  const [mediaError, setMediaError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const dash = useDash(asset.manifestUrl ?? demoManifest, video, captions);

  useEffect(() => {
    function onFullscreen() { setFullscreen(Boolean(document.fullscreenElement)); }
    function updateConnection() { setOffline(!navigator.onLine); }
    document.addEventListener("fullscreenchange", onFullscreen);
    window.addEventListener("online", updateConnection);
    window.addEventListener("offline", updateConnection);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreen);
      window.removeEventListener("online", updateConnection);
      window.removeEventListener("offline", updateConnection);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  useEffect(() => {
    function persistOnExit() {
      const current = snapshot.current;
      if (current.time > 1 && !current.completed) saveProgress(progressId, current.time, current.duration);
    }
    window.addEventListener("pagehide", persistOnExit);
    return () => {
      window.removeEventListener("pagehide", persistOnExit);
      persistOnExit();
    };
  }, [progressId]);

  const error = dash.error || mediaError;
  const errorTitle = offline ? "Connection interrupted" : error ? "Playback unavailable" : "";
  const isPlaying = status === "playing";
  const waiting = status === "buffering" || status === "seeking" || status === "loading";

  function displayControls() {
    showControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => showControls(false), 2900);
  }

  function rememberPosition(node: HTMLVideoElement, force = false, completed = false) {
    if (!Number.isFinite(node.duration) || node.duration <= 0) return;
    const position = node.currentTime;
    if (snapshot.current.completed && !completed && position > node.duration - 1) return;
    snapshot.current = { time: position, duration: node.duration, completed };
    if (force || completed || Date.now() - lastWrite.current > 3000) {
      lastWrite.current = Date.now();
      saveProgress(progressId, position, node.duration, completed);
    }
  }

  function alignProgress(node: HTMLVideoElement) {
    setTime(node.currentTime);
    const ranges = node.buffered;
    if (ranges.length) {
      const index = Array.from({ length: ranges.length }, (_, i) => i).find((i) => ranges.start(i) <= node.currentTime && ranges.end(i) >= node.currentTime);
      setBuffered(index === undefined ? node.currentTime : ranges.end(index));
    }
  }

  function seek(target: number) {
    const node = video.current;
    if (!node || !Number.isFinite(node.duration)) return;
    node.currentTime = Math.max(0, Math.min(target, node.duration));
    setTime(node.currentTime);
    displayControls();
  }

  function skip(amount: number) {
    seek((video.current?.currentTime ?? 0) + amount);
  }

  function play() {
    const node = video.current;
    if (node) void node.play().catch(() => showControls(true));
  }

  function togglePlayback() {
    if (video.current?.paused) play();
    else video.current?.pause();
    displayControls();
  }

  function onNext() {
    if (!next) return;
    if (wasOpenedFromBrowse(asset.id)) rememberWatchOrigin(next.id);
    try {
      sessionStorage.setItem("reeltone:next-play", next.id);
    } catch {
      // The next episode can still be started manually.
    }
    router.replace(`/watch/${next.id}`);
  }

  function playIfRequested() {
    if (attemptedStart.current) return;
    attemptedStart.current = true;
    let nextRequested = false;
    try {
      nextRequested = sessionStorage.getItem("reeltone:next-play") === asset.id;
      if (nextRequested) sessionStorage.removeItem("reeltone:next-play");
    } catch {
      // Manual play remains available with storage disabled.
    }
    if (nextRequested || wasOpenedFromBrowse(asset.id)) play();
  }

  function goBack() {
    if (wasOpenedFromBrowse(asset.id) && window.history.length > 1) router.back();
    else router.push(detailsUrl ?? "/");
  }

  function setPlaybackRate(value: number) {
    if (video.current) video.current.playbackRate = value;
    setRate(value);
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (stage.current?.requestFullscreen) await stage.current.requestFullscreen();
      else {
        const node = video.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
        if (!node?.webkitEnterFullscreen) throw new Error("Fullscreen is unavailable");
        node.webkitEnterFullscreen();
      }
    } catch {
      setFeedback("Fullscreen isn’t available in this browser.");
    }
  }

  function togglePanel(value: Panel) { setPanel(panel === value ? null : value); }

  function handleKeys(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" && panel) {
      setPanel(null);
      return;
    }
    if (event.target instanceof HTMLElement && event.target.closest("button, input, select, a")) return;
    const node = video.current;
    if (!node) return;
    const key = event.key.toLowerCase();
    if (![" ", "arrowleft", "arrowright", "m", "f"].includes(key)) return;
    event.preventDefault();
    if (key === " ") togglePlayback();
    if (key === "arrowleft") skip(-10);
    if (key === "arrowright") skip(10);
    if (key === "m") node.muted = !node.muted;
    if (key === "f") void toggleFullscreen();
    displayControls();
  }

  const skipMarker = !isDemo && time > 0 && (asset.recapEnd && time < asset.recapEnd
    ? { label: "Skip Recap", end: asset.recapEnd } : asset.introEnd && time < asset.introEnd
      ? { label: "Skip Intro", end: asset.introEnd } : null);

  return (
    <div className={styles.watch}>
      <div className={styles.stage} data-mode={preferences.viewingMode} data-controls={controls || !isPlaying || Boolean(panel)}
        data-caption-size={preferences.captionSize} data-caption-bg={preferences.captionBackground}
        onPointerMove={displayControls} onKeyDown={handleKeys} tabIndex={0} ref={stage} aria-label={`Video player for ${name}`}>
        <video
          ref={video}
          playsInline
          poster={!isDemo && title ? asset.artwork : undefined}
          aria-label={isDemo ? "Big Buck Bunny demonstration video" : name}
          onClick={togglePlayback}
          onLoadedMetadata={(event) => {
            const node = event.currentTarget;
            if (Number.isFinite(node.duration)) setDuration(node.duration);
            if (resumed.current) return;
            resumed.current = true;
            const saved = getProgress(progressId);
            if (saved && !saved.completed && saved.position < node.duration - .5) node.currentTime = saved.position;
          }}
          onDurationChange={(event) => {
            if (Number.isFinite(event.currentTarget.duration)) setDuration(event.currentTarget.duration);
          }}
          onTimeUpdate={(event) => { alignProgress(event.currentTarget); rememberPosition(event.currentTarget); }}
          onProgress={(event) => alignProgress(event.currentTarget)}
          onVolumeChange={(event) => { setVolume(event.currentTarget.volume); setMuted(event.currentTarget.muted); }}
          onWaiting={() => setStatus("buffering")}
          onSeeking={() => setStatus("seeking")}
          onSeeked={(event) => { setStatus(event.currentTarget.paused ? "paused" : "playing"); rememberPosition(event.currentTarget, true); }}
          onCanPlay={(event) => { setStatus(event.currentTarget.paused ? "paused" : "playing"); playIfRequested(); }}
          onPlaying={() => { setStatus("playing"); displayControls(); }}
          onPause={(event) => {
            if (!event.currentTarget.ended) { setStatus("paused"); rememberPosition(event.currentTarget, true); }
          }}
          onEnded={(event) => {
            setStatus("completed");
            rememberPosition(event.currentTarget, true, true);
            if (next && preferences.autoplayNext) onNext();
          }}
          onError={() => setMediaError("The video couldn’t be played.")}
        />
        <div ref={captions} className={styles.captionOverlay} />
        <div className={styles.top}>
          <IconButton label="Back to browsing" onClick={goBack}><ArrowLeft size={24} aria-hidden /></IconButton>
          {isDemo ? <p className={styles.demo}>Demo stream · Big Buck Bunny</p> : <BrandMark className={styles.playerBrand} />}
          <IconButton label="Report playback issue" expanded={panel === "report"} onClick={() => togglePanel("report")}><Flag size={20} aria-hidden /></IconButton>
        </div>

        {errorTitle ? <div className={styles.center} role="alert">
          <h1>{errorTitle}</h1><p>{offline ? "Reconnect to the internet and try again." : error}</p>
          <div className={styles.centerActions}><button type="button" onClick={onRetry}>Retry</button><button type="button" onClick={goBack}>Return to browsing</button></div>
        </div> : status === "completed" ? <div className={styles.center}>
          <h1>{name}</h1><p>Playback complete</p>
          <div className={styles.centerActions}>
            {next && <button type="button" onClick={onNext}>Next episode</button>}
            <button type="button" onClick={() => { seek(0); play(); }}>Replay</button>
            {detailsUrl && <Link href={detailsUrl}>Title details</Link>}
            <button type="button" onClick={goBack}>Return to browsing</button>
          </div>
          {related.length > 0 && <p className={styles.endRelated}>More Like This {related.slice(0, 2).map((item) => <Link key={item.slug} href={`/titles/${item.slug}`}>{item.name}</Link>)}</p>}
        </div> : waiting ? <div className={`${styles.center} ${styles.loading}`} role="status">
          <LoaderCircle size={34} aria-hidden /><span className="sr-only">{status === "seeking" ? "Seeking" : status === "buffering" ? "Buffering" : "Loading video"}</span>
        </div> : status === "paused" && <button type="button" onClick={play} className={styles.bigPlay} aria-label="Start playback"><Play size={34} fill="currentColor" aria-hidden /></button>}

        {skipMarker && !errorTitle && <button type="button" className={styles.skip} onClick={() => seek(skipMarker.end)}>{skipMarker.label}</button>}
        {panel && <PlayerSettings key={panel} panel={panel} dash={dash} rate={rate} onRate={setPlaybackRate} preferences={preferences} videoId={asset.id} isDemo={isDemo} onClose={() => setPanel(null)} />}

        <div className={styles.bottom}>
          <Timeline time={time} duration={duration} buffered={buffered} seek={seek} previewAt={dash.previewAt} />
          <div className={styles.controls}>
            <div className={styles.controlGroup}>
              <IconButton label={isPlaying ? "Pause" : "Play"} onClick={togglePlayback} disabled={Boolean(errorTitle)}>
                {isPlaying ? <Pause size={22} fill="currentColor" aria-hidden /> : <Play size={22} fill="currentColor" aria-hidden />}
              </IconButton>
              <IconButton label="Back 10 seconds" onClick={() => skip(-10)} disabled={!duration}><span className={styles.skipIcon}><RotateCcw size={23} aria-hidden /><small aria-hidden>10</small></span></IconButton>
              <IconButton label="Forward 10 seconds" onClick={() => skip(10)} disabled={!duration}><span className={styles.skipIcon}><RotateCw size={23} aria-hidden /><small aria-hidden>10</small></span></IconButton>
              <IconButton label={muted || !volume ? "Unmute" : "Mute"} onClick={() => {
                if (!video.current) return;
                if (!video.current.volume) { video.current.volume = 1; video.current.muted = false; }
                else video.current.muted = !video.current.muted;
              }}>{muted || !volume ? <VolumeX size={22} aria-hidden /> : <Volume2 size={22} aria-hidden />}</IconButton>
              <input className={styles.volume} type="range" aria-label="Volume" min={0} max={1} step={.05} value={muted ? 0 : volume} onChange={(event) => {
                if (video.current) { video.current.muted = false; video.current.volume = Number(event.target.value); }
              }} />
              <p className={styles.time}>{formatTime(time)} <span>/</span> {formatTime(duration)}</p>
            </div>
            <p className={styles.nowPlaying}>{title?.name ?? name}{episode && <span>S{season} E{episode.number} · {episode.name}</span>}</p>
            <div className={styles.controlGroup}>
              {next && <IconButton label="Next episode" onClick={onNext}><SkipForward size={22} aria-hidden /></IconButton>}
              <IconButton label="Audio and subtitles" expanded={panel === "tracks"} onClick={() => togglePanel("tracks")}><AudioLines size={22} aria-hidden /></IconButton>
              <IconButton label="Playback settings" expanded={panel === "settings"} onClick={() => togglePanel("settings")}><SettingsIcon size={22} aria-hidden /></IconButton>
              <IconButton label={fullscreen ? "Exit fullscreen" : "Fullscreen"} onClick={() => void toggleFullscreen()}>{fullscreen ? <Minimize size={21} aria-hidden /> : <Maximize size={21} aria-hidden />}</IconButton>
            </div>
          </div>
          {feedback && <p role="status" className={styles.feedback}>{feedback}</p>}
        </div>
      </div>
      {preferences.viewingMode === "standard" && <div className={`page-width ${styles.standard}`}>
        <div>
          {title && <p>{titleMetadata(title)}</p>}
          <h1>{name}</h1>
          {title && episode && <p>{title.name} · Season {season}, Episode {episode.number}</p>}
          {(episode || title) && <p>{episode?.synopsis ?? title?.synopsis}</p>}
          {title?.credits && <p>{title.credits}</p>}
          {isDemo && <p>Demo film by the Blender Foundation and the Peach open movie team.</p>}
        </div>
        {title && <SaveButton slug={title.slug} name={title.name} />}
        {next && <button type="button" onClick={onNext} className={styles.standardNext}>Next episode · {next.name}</button>}
      </div>}
    </div>
  );
}
