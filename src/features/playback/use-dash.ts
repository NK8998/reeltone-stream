"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import type { MediaInfo, MediaPlayerClass, TextTracksAddedEvent, Thumbnail } from "dashjs";

type Quality = { id: string; height: number; bandwidth: number };
type Track = { value: string; label: string };
type Tracks = { qualities: Quality[]; audio: Track[]; text: Track[]; currentAudio: string };

const noTracks: Tracks = { qualities: [], audio: [], text: [], currentAudio: "" };

function audioValue(track: MediaInfo, fallback: number) {
  return track.id ?? String(track.index ?? fallback);
}

function trackLabel(track: MediaInfo, fallback: string) {
  if (track.labels?.[0]?.text) return track.labels[0].text;
  if (track.lang) {
    try {
      return new Intl.DisplayNames(["en"], { type: "language" }).of(track.lang) ?? track.lang;
    } catch {
      return track.lang;
    }
  }
  return fallback;
}

export function useDash(source: string, videoRef: RefObject<HTMLVideoElement | null>, captionsRef: RefObject<HTMLDivElement | null>) {
  const playerRef = useRef<MediaPlayerClass>(null);
  const [tracks, setTracks] = useState(noTracks);
  const [error, setError] = useState("");
  const [quality, setQuality] = useState("auto");
  const [subtitle, setSubtitle] = useState("off");
  const [selectedAudio, setSelectedAudio] = useState("");

  useEffect(() => {
    let disposed = false;
    let player: MediaPlayerClass | undefined;
    const video = videoRef.current;
    if (!video) return;

    async function attach(video: HTMLVideoElement) {
      try {
        const dash = await import("dashjs");
        if (disposed) return;
        if (!("MediaSource" in window || "ManagedMediaSource" in window)) {
          setError("This browser does not support DASH playback.");
          return;
        }
        const engine = dash.MediaPlayer().create();
        playerRef.current = player = engine;
        engine.initialize(video, undefined, false);
        engine.updateSettings({
          debug: { logLevel: 0 },
          streaming: {
            text: { defaultEnabled: false },
            abr: { autoSwitchBitrate: { video: true } },
          },
        });
        if (captionsRef.current) engine.attachTTMLRenderingDiv(captionsRef.current);
        engine.on(dash.MediaPlayer.events.STREAM_INITIALIZED, () => {
          if (disposed) return;
          const audio = engine.getTracksFor("audio") ?? [];
          const current = engine.getCurrentTrackFor("audio");
          const qualities = engine.getRepresentationsByType("video")
            .filter(({ height }) => height > 0)
            .sort((a, b) => b.height - a.height || b.bandwidth - a.bandwidth)
            .filter(({ height }, i, list) => !i || height !== list[i - 1].height)
            .map(({ id, height, bandwidth }) => ({ id, height, bandwidth }));
          setTracks((previous) => ({
            ...previous,
            qualities,
            audio: audio.map((track, i) => ({ value: audioValue(track, i), label: trackLabel(track, audio.length === 1 ? "Original audio" : `Audio ${i + 1}`) })),
            currentAudio: current ? audioValue(current, 0) : audio[0] ? audioValue(audio[0], 0) : "",
          }));
        });
        engine.on(dash.MediaPlayer.events.TEXT_TRACKS_ADDED, ({ tracks: text }: TextTracksAddedEvent) => {
          if (disposed) return;
          setTracks((previous) => ({
            ...previous,
            text: text.map((track, i) => ({ value: String(i), label: trackLabel(track, `Captions ${i + 1}`) })),
          }));
          engine.setTextTrack(-1);
        });
        engine.on(dash.MediaPlayer.events.ERROR, () => {
          if (!disposed) setError("We couldn’t load this stream. Check your connection and try again.");
        });
        engine.attachSource(source);
      } catch {
        if (!disposed) setError("The video player could not start.");
      }
    }
    void attach(video);

    return () => {
      disposed = true;
      if (playerRef.current === player) playerRef.current = null;
      player?.destroy();
    };
  }, [captionsRef, source, videoRef]);

  function selectQuality(value: string) {
    const player = playerRef.current;
    if (!player) return;
    player.updateSettings({ streaming: { abr: { autoSwitchBitrate: { video: value === "auto" } } } });
    if (value !== "auto") player.setRepresentationForTypeById("video", value, true);
    setQuality(value);
  }

  function selectAudio(value: string) {
    const player = playerRef.current;
    const track = player?.getTracksFor("audio").find((item, i) => audioValue(item, i) === value);
    if (track) {
      player?.setCurrentTrack(track);
      setSelectedAudio(value);
    }
  }

  function selectSubtitle(value: string) {
    playerRef.current?.setTextTrack(value === "off" ? -1 : Number(value));
    setSubtitle(value);
  }

  function previewAt(time: number, resolved: (image: Thumbnail | null) => void) {
    playerRef.current?.provideThumbnail(time, resolved);
  }

  return { tracks, error, quality, subtitle, audio: selectedAudio || tracks.currentAudio, selectQuality, selectAudio, selectSubtitle, previewAt };
}

export type DashControls = ReturnType<typeof useDash>;
