import { useEffect, useMemo, useState } from "react";

export type ThemeMode = "auto" | "light" | "dark";
export type DensityMode = "comfortable" | "compact";

type ResolvedTheme = "light" | "dark";

const THEME_STORAGE_KEY = "assettrackpro-theme-mode";
const DENSITY_STORAGE_KEY = "assettrackpro-density-mode";

const isThemeMode = (value: string): value is ThemeMode =>
  value === "auto" || value === "light" || value === "dark";

const isDensityMode = (value: string): value is DensityMode =>
  value === "comfortable" || value === "compact";

const resolveTheme = (mode: ThemeMode): ResolvedTheme => {
  if (mode === "light" || mode === "dark") {
    return mode;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export function useUiTheme() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved && isThemeMode(saved) ? saved : "auto";
  });

  const [densityMode, setDensityMode] = useState<DensityMode>(() => {
    const saved = localStorage.getItem(DENSITY_STORAGE_KEY);
    return saved && isDensityMode(saved) ? saved : "compact";
  });

  const resolvedTheme = useMemo(() => resolveTheme(themeMode), [themeMode]);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, themeMode);
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem(DENSITY_STORAGE_KEY, densityMode);
  }, [densityMode]);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
    root.dataset.themeMode = themeMode;
  }, [themeMode, resolvedTheme]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.density = densityMode;
  }, [densityMode]);

  useEffect(() => {
    if (themeMode !== "auto") {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => {
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(media.matches ? "dark" : "light");
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [themeMode]);

  return {
    themeMode,
    setThemeMode,
    densityMode,
    setDensityMode,
    resolvedTheme,
  };
}
