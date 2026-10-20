"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

export interface ThemeSwitcherProps {
  variant?: "desktop" | "mobile";
  labels?: {
    light: string;
    dark: string;
    system: string;
  };
}

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function ThemeSwitcher({ variant = "desktop", labels }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();
  const isMounted = useIsMounted();

  const lightLabel = labels?.light || "Terang";
  const darkLabel = labels?.dark || "Gelap";
  const systemLabel = labels?.system || "Sistem";

  if (!isMounted) {
    if (variant === "mobile") {
      return (
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-muted/60 border border-border h-12 w-full animate-pulse" />
      );
    }
    return (
      <div className="flex items-center gap-0.5 p-1 bg-muted/60 rounded-full border border-border shadow-2xs h-9 w-[100px] sm:w-[130px] animate-pulse" />
    );
  }

  if (variant === "mobile") {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1">
          Tema Tampilan
        </span>
        <div className="grid grid-cols-3 gap-1 p-1 bg-muted/80 dark:bg-muted/60 rounded-2xl border border-border">
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`flex items-center justify-center gap-1.5 h-11 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              theme === "light"
                ? "bg-card text-foreground font-bold shadow-xs scale-[1.02]"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label={lightLabel}
          >
            <span>☀️</span>
            <span>{lightLabel}</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`flex items-center justify-center gap-1.5 h-11 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              theme === "dark"
                ? "bg-card text-foreground font-bold shadow-xs scale-[1.02]"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label={darkLabel}
          >
            <span>🌙</span>
            <span>{darkLabel}</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme("system")}
            className={`flex items-center justify-center gap-1.5 h-11 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              theme === "system"
                ? "bg-card text-foreground font-bold shadow-xs scale-[1.02]"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label={systemLabel}
          >
            <span>💻</span>
            <span>{systemLabel}</span>
          </button>
        </div>
      </div>
    );
  }

  // Desktop segmented pill
  return (
    <div
      role="group"
      aria-label="Pilih Tema"
      className="flex items-center gap-0.5 p-1 bg-muted/80 dark:bg-muted/60 rounded-full border border-border shadow-2xs h-9"
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
          theme === "light"
            ? "bg-card text-foreground shadow-xs font-bold scale-[1.02]"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label={lightLabel}
        title={lightLabel}
      >
        <span>☀️</span>
        <span className="hidden xl:inline">{lightLabel}</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
          theme === "dark"
            ? "bg-card text-foreground shadow-xs font-bold scale-[1.02]"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label={darkLabel}
        title={darkLabel}
      >
        <span>🌙</span>
        <span className="hidden xl:inline">{darkLabel}</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme("system")}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
          theme === "system"
            ? "bg-card text-foreground shadow-xs font-bold scale-[1.02]"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label={systemLabel}
        title={systemLabel}
      >
        <span>💻</span>
        <span className="hidden xl:inline">{systemLabel}</span>
      </button>
    </div>
  );
}
