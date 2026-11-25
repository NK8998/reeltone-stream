"use client";

import { useState } from "react";
import { setPreference, setProfile, useLibrary } from "@/features/library/library";
import styles from "./settings.module.css";

export function Settings() {
  const { preferences, profile } = useLibrary();
  const [notice, setNotice] = useState("");

  return (
    <div className={styles.settings}>
      <section id="account">
        <h2>Account</h2>
        <p>Your profile and preferences are saved in this browser.</p>
        <form key={profile} onSubmit={(event) => {
          event.preventDefault();
          setProfile(String(new FormData(event.currentTarget).get("name") ?? ""));
          setNotice("Profile saved.");
        }}>
          <label className={styles.textLabel}>
            Display name
            <input name="name" type="text" maxLength={40} defaultValue={profile ?? ""} placeholder="Guest" />
          </label>
          <button type="submit">Save profile</button>
          {profile && <button type="button" onClick={() => { setProfile(null); setNotice("Signed out of your local profile."); }}>Sign out</button>}
        </form>
        {notice && <p role="status">{notice}</p>}
      </section>
      <section id="playback">
        <h2>Playback</h2>
        <label className={styles.textLabel}>
          Default viewing mode
          <select value={preferences.viewingMode} onChange={(event) => setPreference("viewingMode", event.target.value === "standard" ? "standard" : "cinema")}>
            <option value="cinema">Cinema Mode</option>
            <option value="standard">Standard view</option>
          </select>
        </label>
        <label className={styles.toggle}>
          <input type="checkbox" checked={preferences.autoplayNext} onChange={(event) => setPreference("autoplayNext", event.target.checked)} />
          Automatically play the next episode
        </label>
      </section>
      <section id="accessibility">
        <h2>Accessibility</h2>
        <label className={styles.textLabel}>Caption size
          <select value={preferences.captionSize} onChange={(event) => setPreference("captionSize", event.target.value === "large" ? "large" : "normal")}>
            <option value="normal">Standard</option><option value="large">Large</option>
          </select>
        </label>
        <label className={styles.toggle}>
          <input type="checkbox" checked={preferences.captionBackground} onChange={(event) => setPreference("captionBackground", event.target.checked)} />
          Show a background behind captions
        </label>
        <label className={styles.toggle}>
          <input type="checkbox" checked={preferences.reducedMotion} onChange={(event) => setPreference("reducedMotion", event.target.checked)} />
          Reduce interface motion
        </label>
      </section>
    </div>
  );
}
