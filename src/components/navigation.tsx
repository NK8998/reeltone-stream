"use client";

import { Bookmark, ChevronDown, House, Search, UserRound } from "lucide-react";
import { NavigationLink as Link } from "@/components/navigation-progress";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { setProfile, useLibrary } from "@/features/library/library";
import { Brand } from "./brand";
import { DesktopNavigation } from "./desktop-navigation";
import styles from "./navigation.module.css";

const mobileLinks = [
  { path: "/", label: "Home", icon: House },
  { path: "/search", label: "Search", icon: Search },
  { path: "/my-list", label: "My List", icon: Bookmark },
];

export function ViewerPreferences() {
  const { preferences } = useLibrary();
  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(preferences.reducedMotion);
  }, [preferences.reducedMotion]);
  return null;
}

export function Navigation() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const profileMenu = useRef<HTMLDetailsElement>(null);
  const { profile, preferences } = useLibrary();

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 0); }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const details = profileMenu.current;
    function closeOutside(event: PointerEvent) {
      if (details?.open && event.target instanceof Node && !details.contains(event.target)) details.open = false;
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && details?.open) {
        details.open = false;
        details.querySelector("summary")?.focus();
      }
    }
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  function closeProfile() {
    if (profileMenu.current) profileMenu.current.open = false;
  }

  return (
    <>
      <a className={styles.skip} href="#main-content">Skip to content</a>
      <header className={styles.header} data-solid={scrolled}>
        <div className={`page-width ${styles.bar}`}>
          <Brand />
          <DesktopNavigation path={path} reducedMotion={preferences.reducedMotion} />
          <div className={styles.tools}>
            <Link href="/search" aria-label="Search" className={styles.search} aria-current={path === "/search" ? "page" : undefined}>
              <Search size={21} aria-hidden />
            </Link>
            <details className={styles.profile} ref={profileMenu}>
              <summary aria-label="Profile menu">
                <span className={styles.avatar}>
                  {profile ? profile.slice(0, 1).toUpperCase() : <UserRound size={17} aria-hidden />}
                </span>
                <ChevronDown size={14} aria-hidden />
              </summary>
              <div className={styles.menu}>
                <p>{profile || "Guest"}</p>
                <Link href="/settings#account" onClick={closeProfile}>Account settings</Link>
                <Link href="/settings#playback" onClick={closeProfile}>Playback preferences</Link>
                <Link href="/settings#accessibility" onClick={closeProfile}>Accessibility</Link>
                {profile && <button type="button" onClick={() => { setProfile(null); closeProfile(); }}>Sign out</button>}
              </div>
            </details>
          </div>
        </div>
      </header>
      <nav className={styles.mobile} aria-label="Mobile navigation">
        {mobileLinks.map(({ path: href, label, icon: Icon }) => (
          <Link key={href} href={href} aria-current={path === href ? "page" : undefined}>
            <Icon size={21} aria-hidden />
            {label}
          </Link>
        ))}
      </nav>
    </>
  );
}
