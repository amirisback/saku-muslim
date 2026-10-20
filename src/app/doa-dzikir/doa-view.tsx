"use client";

import { useState } from "react";
import { DUA_ITEMS, DUA_CATEGORIES, DuaItem } from "@/data/doa-dzikir";

// Singleton AudioContext to avoid exhausting browser audio hardware
let sharedAudioCtx: AudioContext | null = null;

function getSharedAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!sharedAudioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        sharedAudioCtx = new AudioContextClass();
      }
    }
    if (sharedAudioCtx && sharedAudioCtx.state === "suspended") {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

export function DoaDzikirView() {
  const [activeTab, setActiveTab] = useState<"doa" | "tasbih">("doa");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Initialize lazily from localStorage if available on client
  const [tasbihCount, setTasbihCount] = useState<number>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("tasbih_count");
        if (saved) {
          const parsed = parseInt(saved, 10);
          if (Number.isFinite(parsed) && parsed >= 0) {
            return parsed;
          }
        }
      } catch {
        // LocalStorage access fallback
      }
    }
    return 0;
  });
  const [tasbihTarget, setTasbihTarget] = useState<number>(33);
  const [tasbihRound, setTasbihRound] = useState<number>(0);
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [selectedDhikr, setSelectedDhikr] = useState<{ arabic: string; latin: string; meaning: string }>({
    arabic: "سُبْحَانَ اللَّهِ",
    latin: "Subhaanallaah",
    meaning: "Maha Suci Allah",
  });

  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getSharedAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      // ignore audio errors
    }
  };

  const incrementTasbih = () => {
    playClickSound();
    if (vibrationEnabled && typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(35);
    }

    setTasbihCount((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem("tasbih_count", next.toString());
      } catch {
        // ignore
      }

      if (tasbihTarget > 0 && next >= tasbihTarget) {
        setTasbihRound((r) => r + 1);
        if (vibrationEnabled && typeof navigator !== "undefined" && "vibrate" in navigator) {
          navigator.vibrate([80, 50, 100]);
        }
        return 0;
      }
      return next;
    });
  };

  const resetTasbih = () => {
    setTasbihCount(0);
    setTasbihRound(0);
    try {
      localStorage.removeItem("tasbih_count");
    } catch {
      // ignore
    }
  };

  const copyDua = (dua: DuaItem) => {
    const text = `${dua.titleId}\n\n${dua.arabic}\n\n"${dua.latin}"\n\nArtinya: "${dua.translationId}"\n(${dua.source})`;
    if (typeof navigator !== "undefined" && navigator?.clipboard?.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopiedId(dua.id);
          setTimeout(() => setCopiedId(null), 2000);
        })
        .catch(() => {
          // graceful fallback
        });
    }
  };

  const filteredDuas = DUA_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.titleId.toLowerCase().includes(search.toLowerCase()) ||
      item.translationId.toLowerCase().includes(search.toLowerCase()) ||
      item.latin.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const dhikrPresets = [
    { arabic: "سُبْحَانَ اللَّهِ", latin: "Subhaanallaah", meaning: "Maha Suci Allah" },
    { arabic: "الْحَمْدُ لِلَّهِ", latin: "Alhamdulillaah", meaning: "Segala puji bagi Allah" },
    { arabic: "اللَّهُ أَكْبَرُ", latin: "Allaahu Akbar", meaning: "Allah Maha Besar" },
    { arabic: "لَا إِلَهَ إِلَّا اللَّهُ", latin: "Laa ilaaha illallaah", meaning: "Tiada Tuhan selain Allah" },
    { arabic: "أَسْتَغْفِرُ اللَّهَ", latin: "Astaghfirullaah", meaning: "Aku memohon ampun kepada Allah" },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white shadow-lg">
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">
            Hisnul Muslim & Dzikir Harian
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Kumpulan Doa & Tasbih Digital
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            Doa-doa shahih sehari-hari dan alat hitung dzikir interaktif
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          role="tablist"
          aria-label="Mode Pilihan"
          className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/10 border border-white/20 self-start sm:self-auto"
        >
          <button
            role="tab"
            id="tab-doa"
            aria-selected={activeTab === "doa"}
            aria-controls="panel-doa"
            tabIndex={activeTab === "doa" ? 0 : -1}
            type="button"
            onClick={() => setActiveTab("doa")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[44px] ${
              activeTab === "doa"
                ? "bg-white text-emerald-900 shadow-md"
                : "text-white/80 hover:text-white"
            }`}
          >
            📖 Doa Harian
          </button>
          <button
            role="tab"
            id="tab-tasbih"
            aria-selected={activeTab === "tasbih"}
            aria-controls="panel-tasbih"
            tabIndex={activeTab === "tasbih" ? 0 : -1}
            type="button"
            onClick={() => setActiveTab("tasbih")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[44px] ${
              activeTab === "tasbih"
                ? "bg-white text-emerald-900 shadow-md"
                : "text-white/80 hover:text-white"
            }`}
          >
            📿 Tasbih Digital
          </button>
        </div>
      </div>

      {activeTab === "doa" ? (
        /* Tab Doa Harian */
        <div
          id="panel-doa"
          role="tabpanel"
          aria-labelledby="tab-doa"
          className="flex flex-col gap-5"
        >
          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari doa (misal: tidur, makan, masjid)..."
                className="w-full rounded-xl border border-border bg-card px-4 py-2.5 pl-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
              <svg
                className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Category Select */}
            <select
              aria-label="Pilih Kategori Doa"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-border bg-card px-3 py-2 text-xs sm:text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer w-full sm:w-auto"
            >
              {DUA_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.labelId}
                </option>
              ))}
            </select>
          </div>

          {/* Duas List */}
          <div className="flex flex-col gap-4">
            {filteredDuas.map((dua) => (
              <div
                key={dua.id}
                className="flex flex-col p-6 rounded-3xl border border-border bg-card shadow-sm hover:border-primary/40 transition-all"
              >
                {/* Header: Title & Copy Button */}
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
                      {dua.source}
                    </span>
                    <h3 className="font-bold text-base text-foreground mt-0.5">
                      {dua.titleId}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyDua(dua)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-muted/40 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                  >
                    {copiedId === dua.id ? (
                      <span className="text-emerald-600 font-bold">✓ Tersalin</span>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Salin
                      </>
                    )}
                  </button>
                </div>

                {/* Arabic Text */}
                <div className="py-5 text-right" dir="rtl">
                  <span className="font-arabic text-2xl sm:text-3xl font-bold leading-loose text-foreground">
                    {dua.arabic}
                  </span>
                </div>

                {/* Latin Transliteration */}
                <p className="text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-300 italic mb-1.5">
                  {dua.latin}
                </p>

                {/* Translation */}
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                  &quot;{dua.translationId}&quot;
                </p>
              </div>
            ))}

            {filteredDuas.length === 0 && (
              <div className="text-center py-12 p-6 rounded-2xl border border-dashed border-border text-muted-foreground">
                <p className="text-sm">Tidak ada doa yang sesuai dengan pencarian &quot;{search}&quot;.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Tab Tasbih Digital */
        <div
          id="panel-tasbih"
          role="tabpanel"
          aria-labelledby="tab-tasbih"
          className="flex flex-col items-center gap-8 p-6 sm:p-10 rounded-3xl border border-border bg-card shadow-sm"
        >
          {/* Dhikr Preset Selector */}
          <div className="w-full flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Pilih Kalimat Dzikir:</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {dhikrPresets.map((preset) => {
                const isSelected = selectedDhikr.latin === preset.latin;
                return (
                  <button
                    key={preset.latin}
                    type="button"
                    onClick={() => setSelectedDhikr(preset)}
                    className={`flex flex-col p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary bg-secondary text-secondary-foreground font-bold"
                        : "border-border bg-muted/30 text-foreground hover:border-primary/40"
                    }`}
                  >
                    <span className="font-arabic text-base">{preset.arabic}</span>
                    <span className="text-xs font-semibold mt-1">{preset.latin}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Selected Dhikr Hero */}
          <div className="text-center flex flex-col items-center gap-2">
            <span className="font-arabic text-4xl sm:text-5xl font-black text-foreground" dir="rtl">
              {selectedDhikr.arabic}
            </span>
            <span className="text-sm sm:text-base font-bold text-primary">
              {selectedDhikr.latin}
            </span>
            <span className="text-xs text-muted-foreground">
              &quot;{selectedDhikr.meaning}&quot;
            </span>
          </div>

          {/* Giant Interactive Tap Circle */}
          <div className="flex flex-col items-center justify-center my-4">
            <button
              type="button"
              onClick={incrementTasbih}
              className="relative w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex flex-col items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer select-none border-8 border-emerald-100 dark:border-emerald-950/80 group"
            >
              <span className="text-xs uppercase tracking-wider text-emerald-100 font-semibold mb-1">
                Hitungan
              </span>
              <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white drop-shadow">
                {tasbihCount}
              </span>
              <span className="text-xs text-emerald-100 font-medium mt-1">
                {tasbihTarget > 0 ? `Target: ${tasbihTarget}` : "Bebas"}
              </span>
              <span className="mt-3 text-[11px] font-bold text-amber-200 bg-black/20 px-3 py-1 rounded-full group-hover:bg-black/30">
                SENTUH UNTUK HITUNG
              </span>
            </button>

            {/* Rounds completed */}
            {tasbihRound > 0 && (
              <span className="text-xs font-bold text-primary mt-4">
                🎉 Putaran Selesai: {tasbihRound}x putaran
              </span>
            )}
          </div>

          {/* Target & Feedback Settings */}
          <div className="flex flex-wrap items-center justify-center gap-4 w-full pt-4 border-t border-border">
            {/* Target Select */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground font-medium">Target:</span>
              {[33, 99, 100, 0].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTasbihTarget(t)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    tasbihTarget === t
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {t === 0 ? "Bebas" : `${t}x`}
                </button>
              ))}
            </div>

            {/* Sound & Vibrate toggles */}
            <div className="flex items-center gap-3 text-xs">
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  soundEnabled
                    ? "bg-secondary text-secondary-foreground border-emerald-300 font-semibold"
                    : "border-border text-muted-foreground"
                }`}
              >
                🔊 Suara {soundEnabled ? "Aktif" : "Mati"}
              </button>

              <button
                type="button"
                onClick={() => setVibrationEnabled(!vibrationEnabled)}
                className={`px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  vibrationEnabled
                    ? "bg-secondary text-secondary-foreground border-emerald-300 font-semibold"
                    : "border-border text-muted-foreground"
                }`}
              >
                📳 Getar {vibrationEnabled ? "Aktif" : "Mati"}
              </button>

              {/* Reset Button */}
              <button
                type="button"
                onClick={resetTasbih}
                className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 border border-red-200 dark:border-red-900 font-semibold hover:bg-red-100 transition-colors cursor-pointer"
              >
                Reset Hitungan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
