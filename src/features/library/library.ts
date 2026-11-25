"use client";

import { useSyncExternalStore } from "react";
import type { Playable } from "@/features/catalog/types";

export type WatchProgress = {
  position: number;
  duration: number;
  updatedAt: number;
  completed: boolean;
};

export type Preferences = {
  autoplayNext: boolean;
  viewingMode: "cinema" | "standard";
  captionSize: "normal" | "large";
  captionBackground: boolean;
  reducedMotion: boolean;
};

type Library = {
  saved: Record<string, number>;
  progress: Record<string, WatchProgress>;
  recent: string[];
  preferences: Preferences;
  profile: string | null;
};

const storageKey = "reeltone:library:v1";
const changeEvent = "reeltone-library-change";
const defaults: Library = {
  saved: {},
  progress: {},
  recent: [],
  preferences: {
    autoplayNext: false,
    viewingMode: "cinema",
    captionSize: "normal",
    captionBackground: true,
    reducedMotion: false,
  },
  profile: null,
};

let current: Library = defaults;
let currentRaw: string | null = null;

function getSnapshot() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw === currentRaw) return current;
    currentRaw = raw;
    if (!raw) return (current = defaults);

    const data = JSON.parse(raw) as Partial<Library> | null;
    current = {
      ...defaults,
      ...data,
      preferences: { ...defaults.preferences, ...data?.preferences },
    };
  } catch {
    // An unavailable store can still hold the current session in memory.
  }
  return current;
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(changeEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(changeEvent, callback);
  };
}

function update(transform: (state: Library) => Library) {
  current = transform(getSnapshot());
  try {
    const raw = JSON.stringify(current);
    localStorage.setItem(storageKey, raw);
    currentRaw = raw;
  } catch {
    // Keep changes for this session when storage is unavailable.
  }
  window.dispatchEvent(new Event(changeEvent));
}

export function useLibrary() {
  return useSyncExternalStore(subscribe, getSnapshot, () => defaults);
}

export function progressKey(asset: Pick<Playable, "id" | "manifestUrl">) {
  return asset.manifestUrl ? `${asset.id}:dash` : asset.id;
}

export function getProgress(id: string) {
  return getSnapshot().progress[id];
}

export function toggleSaved(slug: string) {
  update((state) => {
    const saved = { ...state.saved };
    if (Object.hasOwn(saved, slug)) delete saved[slug];
    else saved[slug] = Date.now();
    return { ...state, saved };
  });
}

export function saveProgress(id: string, position: number, duration: number, completed = false) {
  if (!Number.isFinite(duration) || duration <= 0 || !Number.isFinite(position)) return;
  if (!completed && position < 1) return;
  update((state) => ({
    ...state,
    progress: {
      ...state.progress,
      [id]: { position: Math.min(position, duration), duration, updatedAt: Date.now(), completed },
    },
  }));
}

export function removeProgress(id: string) {
  update((state) => {
    const progress = { ...state.progress };
    delete progress[id];
    return { ...state, progress };
  });
}

export function rememberSearch(query: string) {
  const text = query.trim();
  if (text) update((state) => ({
    ...state,
    recent: [text, ...state.recent.filter((item) => item.toLowerCase() !== text.toLowerCase())].slice(0, 6),
  }));
}

export function clearSearches() {
  update((state) => ({ ...state, recent: [] }));
}

export function setPreference<K extends keyof Preferences>(key: K, value: Preferences[K]) {
  update((state) => ({ ...state, preferences: { ...state.preferences, [key]: value } }));
}

export function setProfile(name: string | null) {
  update((state) => ({ ...state, profile: name?.trim().slice(0, 40) || null }));
}

const watchOriginKey = "reeltone:watch-origin";

export function rememberWatchOrigin(id: string) {
  try {
    sessionStorage.setItem(watchOriginKey, id);
  } catch {
    // A directly opened watch page can return to the title page.
  }
}

export function wasOpenedFromBrowse(id: string) {
  try {
    return sessionStorage.getItem(watchOriginKey) === id;
  } catch {
    return false;
  }
}
