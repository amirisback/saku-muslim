"use client";

import { useState, useRef, useEffect } from "react";

export interface AudioPlayerProps {
  title: string;
  subtitle?: string;
  audioUrl: string;
  onClose?: () => void;
  autoPlay?: boolean;
}

export function AudioPlayer({
  title,
  subtitle,
  audioUrl,
  onClose,
  autoPlay = true,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.load();
    if (autoPlay) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }

    // Unmount cleanup: pause audio to prevent lingering playback and memory leaks
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audioUrl, autoPlay]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const dur = audioRef.current.duration;
      if (Number.isFinite(dur)) {
        setDuration(dur);
      }
      setIsLoading(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (!Number.isFinite(time) || duration <= 0) return;
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatSec = (sec: number): string => {
    if (isNaN(sec)) return "00:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-4 right-4 max-w-lg mx-auto z-50 rounded-2xl border border-emerald-500/30 bg-card/95 backdrop-blur-md p-4 shadow-xl text-foreground">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
      />

      <div className="flex items-center justify-between mb-2">
        <div className="flex flex-col overflow-hidden pr-3">
          <span className="font-semibold text-sm truncate text-foreground">
            {title}
          </span>
          {subtitle && (
            <span className="text-xs text-muted-foreground truncate">
              {subtitle}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={togglePlay}
            disabled={isLoading && duration === 0}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
            aria-label={isPlaying ? "Jeda Audio" : "Putar Audio"}
          >
            {isPlaying ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="h-5 w-5 translate-x-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              aria-label="Tutup Player"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar & Timestamps */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-muted-foreground w-8 text-right font-mono">
          {formatSec(currentTime)}
        </span>
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="flex-1 h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <span className="text-[10px] text-muted-foreground w-8 font-mono">
          {formatSec(duration)}
        </span>
      </div>
    </div>
  );
}
