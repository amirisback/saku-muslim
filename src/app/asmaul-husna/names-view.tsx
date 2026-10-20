"use client";

import { useState, useEffect } from "react";
import { ASMAUL_HUSNA, AsmaulHusnaItem } from "@/data/asmaul-husna";
import { AudioPlayer } from "@/components/shared/audio-player";

export function NamesView() {
  const [search, setSearch] = useState("");
  const [selectedName, setSelectedName] = useState<AsmaulHusnaItem | null>(null);
  const [playingAudio, setPlayingAudio] = useState<{ title: string; url: string } | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedName(null);
      }
    };
    if (selectedName) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedName]);

  const filteredNames = ASMAUL_HUSNA.filter((item) => {
    return (
      item.latin.toLowerCase().includes(search.toLowerCase()) ||
      item.meaningId.toLowerCase().includes(search.toLowerCase()) ||
      item.number.toString().includes(search)
    );
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white shadow-lg">
        <div className="flex flex-col gap-1 max-w-xl">
          <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">
            Nama-Nama Terindah Allah SWT
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            99 Asmaul Husna
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            &quot;Hanya milik Allah asma-ul husna, maka bermohonlah kepada-Nya dengan menyebut asma-ul husna itu.&quot; (QS. Al-A&apos;raf: 180)
          </p>
        </div>

        {/* Audio Recitation Button */}
        <button
          type="button"
          onClick={() =>
            setPlayingAudio({
              title: "Lantunan 99 Asmaul Husna",
              url: "https://www.islamcan.com/audio/99-names/99-names-of-allah.mp3",
            })
          }
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow transition-all cursor-pointer self-start md:self-auto"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          Putar Lantunan 99 Nama
        </button>
      </div>

      {/* Search Input */}
      <div className="relative w-full max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama Allah (misal: Ar-Rahman, Al-Malik, 1)..."
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
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 top-3 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* 99 Names Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
        {filteredNames.map((name) => (
          <button
            key={name.number}
            type="button"
            onClick={() => setSelectedName(name)}
            className="flex flex-col items-center justify-between p-4 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all text-center cursor-pointer group"
          >
            {/* Number medallion */}
            <div className="w-7 h-7 rounded-lg bg-secondary text-secondary-foreground text-[11px] font-bold flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              {name.number}
            </div>

            {/* Arabic Script */}
            <span className="font-arabic text-2xl font-bold text-foreground my-3 group-hover:scale-105 transition-transform" dir="rtl">
              {name.arabic}
            </span>

            {/* Latin Name & Meaning */}
            <div className="flex flex-col">
              <span className="font-bold text-xs text-foreground group-hover:text-primary transition-colors">
                {name.latin}
              </span>
              <span className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                {name.meaningId}
              </span>
            </div>
          </button>
        ))}
      </div>

      {filteredNames.length === 0 && (
        <div className="text-center py-12 p-6 rounded-2xl border border-dashed border-border text-muted-foreground">
          <p className="text-sm">Tidak ditemukan nama dengan kata kunci &quot;{search}&quot;.</p>
        </div>
      )}

      {/* Name Detail Modal */}
      {selectedName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl text-foreground flex flex-col items-center text-center"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedName(null)}
              aria-label="Tutup Dialog Detail Asmaul Husna"
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground cursor-pointer p-2 rounded-lg hover:bg-muted min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              ✕
            </button>

            {/* Number */}
            <div className="w-10 h-10 rounded-2xl bg-secondary text-secondary-foreground font-black text-sm flex items-center justify-center mb-3">
              #{selectedName.number}
            </div>

            {/* Big Arabic Calligraphy */}
            <span className="font-arabic text-5xl font-black text-primary my-2" dir="rtl">
              {selectedName.arabic}
            </span>

            {/* Latin Name */}
            <h3 id="modal-title" className="text-xl font-extrabold text-foreground mt-1">
              {selectedName.latin}
            </h3>

            {/* Indonesian Meaning */}
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mt-1">
              &quot;{selectedName.meaningId}&quot;
            </p>

            <span className="text-xs text-muted-foreground italic mt-0.5">
              ({selectedName.meaningEn})
            </span>

            <div className="w-full border-t border-border mt-5 pt-4 text-xs text-muted-foreground leading-relaxed">
              Memahami dan mengamalkan nama <strong>{selectedName.latin}</strong> mendatangkan ketenangan jiwa, memperkuat keyakinan tauhid, dan menumbuhkan rasa syukur serta pengagungan kepada Allah Subhanahu wa Ta&apos;ala.
            </div>

            <button
              type="button"
              onClick={() => setSelectedName(null)}
              className="mt-6 w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity cursor-pointer"
            >
              Tutup Penjelasan
            </button>
          </div>
        </div>
      )}

      {/* Floating Audio Player when listening */}
      {playingAudio && (
        <AudioPlayer
          title={playingAudio.title}
          subtitle="99 Asmaul Husna"
          audioUrl={playingAudio.url}
          onClose={() => setPlayingAudio(null)}
        />
      )}
    </div>
  );
}
