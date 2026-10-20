"use client";

import { useState, useEffect } from "react";
import { INDONESIA_CITIES, CityLocation, KAABA_COORDINATES } from "@/data/prayer-data";
import {
  calculateQiblaDirection,
  calculateDistanceToKaaba,
} from "@/lib/prayer-calculator";

export function QiblaCompass() {
  const [selectedCity, setSelectedCity] = useState<CityLocation>(INDONESIA_CITIES[0]);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: INDONESIA_CITIES[0].latitude,
    lng: INDONESIA_CITIES[0].longitude,
  });
  const [isUsingGps, setIsUsingGps] = useState(false);
  const [heading, setHeading] = useState<number>(0);
  const [sensorAvailable, setSensorAvailable] = useState<boolean>(false);
  const [manualHeading, setManualHeading] = useState<number>(0);
  const [needsIosPermission, setNeedsIosPermission] = useState<boolean>(() => {
    return (
      typeof window !== "undefined" &&
      typeof (DeviceOrientationEvent as unknown as { requestPermission?: unknown })?.requestPermission === "function"
    );
  });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Calculate Qibla direction from current coords
  const qiblaAngle = calculateQiblaDirection(currentCoords.lat, currentCoords.lng);
  const distance = calculateDistanceToKaaba(currentCoords.lat, currentCoords.lng);

  // Effective compass heading
  const currentHeading = sensorAvailable ? heading : manualHeading;
  // Difference between current heading and Qibla angle
  const diffAngle = ((qiblaAngle - currentHeading + 360) % 360);
  const isFacingQibla = diffAngle <= 5 || diffAngle >= 355;

  // Listen to device orientation
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      let compassHeading: number | null = null;
      if ("webkitCompassHeading" in e && typeof (e as unknown as { webkitCompassHeading: number }).webkitCompassHeading === "number") {
        compassHeading = (e as unknown as { webkitCompassHeading: number }).webkitCompassHeading;
      } else if (e.alpha !== null) {
        compassHeading = 360 - e.alpha;
      }

      if (compassHeading !== null) {
        setSensorAvailable(true);
        setNeedsIosPermission(false);
        setHeading(Math.round(compassHeading));
      }
    };

    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      window.addEventListener("deviceorientation", handleOrientation, true);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("deviceorientation", handleOrientation, true);
      }
    };
  }, []);

  const requestCompassPermission = async () => {
    if (
      typeof window !== "undefined" &&
      typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> })?.requestPermission === "function"
    ) {
      try {
        const response = await (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission();
        if (response === "granted") {
          setNeedsIosPermission(false);
          setStatusMessage("Izin sensor kompas berhasil diaktifkan.");
          setTimeout(() => setStatusMessage(null), 3000);
        } else {
          setStatusMessage("Izin sensor ditolak. Silakan gunakan rotasi manual.");
        }
      } catch {
        setStatusMessage("Tidak dapat mengakses sensor kompas.");
      }
    }
  };

  const handleGetLocation = () => {
    if (typeof navigator !== "undefined" && "geolocation" in navigator) {
      setStatusMessage("Mendeteksi koordinat GPS...");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setIsUsingGps(true);
          setStatusMessage("Lokasi GPS berhasil terdeteksi.");
          setTimeout(() => setStatusMessage(null), 3000);
        },
        () => {
          setStatusMessage("Gagal membaca lokasi GPS. Menggunakan koordinat kota pilihan.");
          setTimeout(() => setStatusMessage(null), 4000);
        }
      );
    } else {
      setStatusMessage("Geolocation tidak didukung pada peramban ini.");
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const handleCityChange = (cityId: string) => {
    const city = INDONESIA_CITIES.find((c) => c.id === cityId);
    if (city) {
      setSelectedCity(city);
      setCurrentCoords({ lat: city.latitude, lng: city.longitude });
      setIsUsingGps(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <span>Arah Ka&apos;bah Makkah</span>
            <span>•</span>
            <span>21.42° N, 39.83° E</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Kompas Arah Kiblat
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Menentukan sudut kiblat presisi dari posisi Anda menuju Baitullah Ka&apos;bah
          </p>
        </div>

        {/* City / GPS Picker */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <select
            aria-label="Pilih Kota untuk Kiblat"
            value={isUsingGps ? "gps" : selectedCity.id}
            onChange={(e) => handleCityChange(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-xs sm:text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            {isUsingGps && <option value="gps">📍 Lokasi GPS Saya</option>}
            {INDONESIA_CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleGetLocation}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Deteksi GPS
          </button>
        </div>
      </div>

      {/* Status / Feedback message */}
      {statusMessage && (
        <div className="p-3.5 rounded-2xl bg-secondary/80 border border-primary/20 text-xs font-semibold text-foreground text-center animate-in fade-in">
          {statusMessage}
        </div>
      )}

      {/* iOS Permission Prompt Banner */}
      {needsIosPermission && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span>🧭</span>
            <span>Perangkat iOS membutuhkan izin akses sensor gerak/kompas.</span>
          </div>
          <button
            type="button"
            onClick={requestCompassPermission}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs shadow-sm transition-all cursor-pointer whitespace-nowrap min-h-[44px]"
          >
            Aktifkan Sensor Kompas
          </button>
        </div>
      )}

      {/* Main Interactive Compass Graphic */}
      <div className="flex flex-col items-center justify-center p-8 sm:p-12 rounded-3xl border border-border bg-gradient-to-b from-card via-card to-muted/30 shadow-md">
        {/* Facing Status Banner */}
        <div className="mb-8">
          {isFacingQibla ? (
            <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500 text-white font-bold text-sm shadow-md animate-bounce">
              <span>🕋</span>
              <span>Anda Tepat Menghadap Kiblat!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">
              <span>Putar perangkat Anda hingga jarum emas mengarah lurus ke atas</span>
            </div>
          )}
        </div>

        {/* The Compass Dial */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center select-none">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-border bg-card/60 backdrop-blur-sm shadow-inner flex items-center justify-center">
            {/* Degree ticks */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <div
                key={deg}
                className="absolute text-[10px] font-mono font-bold text-muted-foreground"
                style={{
                  transform: `rotate(${deg}deg) translateY(-118px) rotate(-${deg}deg)`,
                }}
              >
                {deg === 0 ? (
                  <span className="text-red-500 font-extrabold text-xs">U</span>
                ) : deg === 90 ? (
                  "T"
                ) : deg === 180 ? (
                  "S"
                ) : deg === 270 ? (
                  "B"
                ) : (
                  `${deg}°`
                )}
              </div>
            ))}
          </div>

          {/* Compass Needle Container (Rotates with negative heading) */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out"
            style={{ transform: `rotate(${-currentHeading}deg)` }}
          >
            {/* North Indicator Needle */}
            <div className="absolute top-4 w-1.5 h-16 bg-red-500 rounded-t-full shadow-sm" />
            <div className="absolute bottom-4 w-1.5 h-16 bg-muted-foreground/40 rounded-b-full" />

            {/* Qibla Direction Kaaba Indicator (Gold Pointer) */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ transform: `rotate(${qiblaAngle}deg)` }}
            >
              <div className="absolute -top-3 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg text-sm border-2 border-white">
                  🕋
                </div>
                <div className="w-1 h-20 bg-amber-500 rounded-full shadow" />
              </div>
            </div>
          </div>

          {/* Center Pivot Medallion */}
          <div className="relative z-10 w-16 h-16 rounded-full bg-card border-2 border-primary flex flex-col items-center justify-center shadow-md">
            <span className="text-xs font-black font-mono text-primary">
              {qiblaAngle}°
            </span>
            <span className="text-[9px] font-medium text-muted-foreground">KIBLAT</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 w-full mt-10 pt-6 border-t border-border">
          <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-muted/40 text-center">
            <span className="text-xs text-muted-foreground">Sudut Derajat Kiblat</span>
            <span className="text-2xl font-black font-mono text-foreground mt-0.5">
              {qiblaAngle}°
            </span>
            <span className="text-[11px] text-emerald-600 font-medium">dari arah Utara jarum jam</span>
          </div>

          <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-muted/40 text-center">
            <span className="text-xs text-muted-foreground">Jarak ke Baitullah Ka&apos;bah</span>
            <span className="text-2xl font-black font-mono text-foreground mt-0.5">
              {distance.toLocaleString("id-ID")}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">kilometer</span>
          </div>
        </div>

        {/* Manual heading adjustment slider if sensor not available */}
        {!sensorAvailable && (
          <div className="w-full mt-6 pt-4 border-t border-border flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Orientasi Perangkat Manual (Rotasi: {manualHeading}°):</span>
              <button
                type="button"
                onClick={() => setManualHeading(Math.round(qiblaAngle))}
                className="text-primary font-semibold hover:underline cursor-pointer"
              >
                Arahkan ke Kiblat
              </button>
            </div>
            <input
              type="range"
              min="0"
              max="359"
              value={manualHeading}
              onChange={(e) => setManualHeading(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        )}
      </div>

      {/* Guidance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-border bg-card">
          <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
            <span>🧭</span>
            <span>Cara Kalibrasi Kompas</span>
          </h4>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Pegang ponsel secara mendatar dan gerakkan dalam pola angka delapan (8) di udara beberapa kali untuk mengkalibrasi sensor magnetometer perangkat Anda.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card">
          <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
            <span>🕋</span>
            <span>Rujukan Hisab Kiblat</span>
          </h4>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Perhitungan arah kiblat menggunakan rumus Great Circle (lingkaran besar bola bumi) dengan titik koordinat Ka&apos;bah {KAABA_COORDINATES.latitude}° LU dan {KAABA_COORDINATES.longitude}° BT.
          </p>
        </div>
      </div>
    </div>
  );
}
