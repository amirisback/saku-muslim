import { PrayerTimesSchedule, KAABA_COORDINATES } from "@/data/prayer-data";

/**
 * Standardized local date key for daily trackers (e.g. prayer, worship)
 * Ensures consistency across components and avoids UTC day-shifting.
 */
export function getTodayTrackerKey(prefix: string, date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${prefix}_${year}-${month}-${day}`;
}

/**
 * Derajat ke Radian
 */
function degToRad(deg: number): number {
  return (deg * Math.PI) / 180.0;
}

/**
 * Radian ke Derajat
 */
function radToDeg(rad: number): number {
  return (rad * 180.0) / Math.PI;
}

/**
 * Format desimal jam menjadi string "HH:mm"
 */
function formatTime(hours: number): string {
  let h = Math.floor(hours);
  let m = Math.floor((hours - h) * 60);

  if (m >= 60) {
    h += 1;
    m -= 60;
  }
  h = ((h % 24) + 24) % 24;

  const hStr = h.toString().padStart(2, "0");
  const mStr = m.toString().padStart(2, "0");
  return `${hStr}:${mStr}`;
}

/**
 * Hitung jadwal sholat akurat untuk tanggal dan koordinat tertentu
 * Menggunakan standar hisab Kemenag RI (Subuh -20°, Isya -18°)
 */
export function calculatePrayerTimes(
  date: Date,
  lat: number,
  lng: number,
  timezone: number
): PrayerTimesSchedule {
  // Day of year calculation using UTC to avoid DST and timezone shifts
  const startOfYear = Date.UTC(date.getFullYear(), 0, 1);
  const currentUtc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const dayOfYear = Math.floor((currentUtc - startOfYear) / (1000 * 60 * 60 * 24)) + 1;

  // Perkiraan deklinasi matahari (delta) & persamaan waktu (EoT)
  const b = (2 * Math.PI * (dayOfYear - 81)) / 365;
  const eot = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b); // dalam menit
  const delta = 23.45 * Math.sin(degToRad((360 / 365) * (dayOfYear - 81))); // dalam derajat

  // Waktu tengah hari (Dzuhur) dalam jam lokal
  const solarNoonUtc = 12 - lng / 15 - eot / 60;
  const dhuhrTime = solarNoonUtc + timezone + 2 / 60; // +2 menit ikhtiyat

  const latRad = degToRad(lat);
  const deltaRad = degToRad(delta);

  // Helper sudut waktu (hour angle)
  const calcHourAngle = (altitudeDeg: number): number => {
    const altRad = degToRad(altitudeDeg);
    const cosHA =
      (Math.sin(altRad) - Math.sin(latRad) * Math.sin(deltaRad)) /
      (Math.cos(latRad) * Math.cos(deltaRad));

    // Batasi dalam range -1 hingga 1 untuk menghindari Math.acos NaN
    const clamped = Math.max(-1, Math.min(1, cosHA));
    return radToDeg(Math.acos(clamped)) / 15;
  };

  // Subuh: -20 derajat (Kemenag)
  const fajrHA = calcHourAngle(-20);
  const fajrTime = dhuhrTime - fajrHA;

  // Imsak: 10 menit sebelum Subuh
  const imsakTime = fajrTime - 10 / 60;

  // Terbit: -0.833 derajat
  const sunriseHA = calcHourAngle(-0.833);
  const sunriseTime = dhuhrTime - sunriseHA;

  // Ashar: bayangan objek + bayangan saat tengah hari (Mazhab Syafi'i)
  const asrAlt = radToDeg(
    Math.atan(1 / (1 + Math.tan(Math.abs(latRad - deltaRad))))
  );
  const asrHA = calcHourAngle(asrAlt);
  const asrTime = dhuhrTime + asrHA;

  // Maghrib: -0.833 derajat (saat piringan matahari tenggelam) + 2 menit
  const maghribTime = dhuhrTime + sunriseHA + 2 / 60;

  // Isya: -18 derajat (Kemenag)
  const ishaHA = calcHourAngle(-18);
  const ishaTime = dhuhrTime + ishaHA;

  return {
    imsak: formatTime(imsakTime),
    fajr: formatTime(fajrTime),
    sunrise: formatTime(sunriseTime),
    dhuhr: formatTime(dhuhrTime),
    asr: formatTime(asrTime),
    maghrib: formatTime(maghribTime),
    isha: formatTime(ishaTime),
  };
}

/**
 * Hitung arah kiblat (derajat dari utara searah jarum jam)
 */
export function calculateQiblaDirection(latitude: number, longitude: number): number {
  const phiK = degToRad(KAABA_COORDINATES.latitude);
  const lambdaK = degToRad(KAABA_COORDINATES.longitude);
  const phi = degToRad(latitude);
  const lambda = degToRad(longitude);

  const deltaLambda = lambdaK - lambda;
  const y = Math.sin(deltaLambda);
  const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(deltaLambda);

  let qibla = radToDeg(Math.atan2(y, x));
  qibla = (qibla + 360) % 360;
  return Math.round(qibla * 10) / 10;
}

/**
 * Hitung jarak ke Ka'bah dalam kilometer (Haversine formula)
 */
export function calculateDistanceToKaaba(latitude: number, longitude: number): number {
  const R = 6371; // radius bumi dalam km
  const dLat = degToRad(KAABA_COORDINATES.latitude - latitude);
  const dLon = degToRad(KAABA_COORDINATES.longitude - longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(latitude)) *
      Math.cos(degToRad(KAABA_COORDINATES.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export interface NextPrayerInfo {
  name: string;
  nameKey: keyof PrayerTimesSchedule;
  time: string;
  remainingMinutes: number;
  remainingSeconds: number;
  formattedRemaining: string;
}

/**
 * Menemukan sholat berikutnya dan waktu mundurnya
 */
export function getNextPrayer(schedule: PrayerTimesSchedule, now: Date = new Date()): NextPrayerInfo {
  const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  const parseSeconds = (timeStr?: string): number => {
    if (!timeStr || !timeStr.includes(":")) return 0;
    const [h, m] = timeStr.split(":").map((v) => parseInt(v, 10) || 0);
    return h * 3600 + m * 60;
  };

  const prayers: { nameKey: keyof PrayerTimesSchedule; name: string; seconds: number }[] = [
    { nameKey: "fajr", name: "Subuh", seconds: parseSeconds(schedule?.fajr) },
    { nameKey: "dhuhr", name: "Dzuhur", seconds: parseSeconds(schedule?.dhuhr) },
    { nameKey: "asr", name: "Ashar", seconds: parseSeconds(schedule?.asr) },
    { nameKey: "maghrib", name: "Maghrib", seconds: parseSeconds(schedule?.maghrib) },
    { nameKey: "isha", name: "Isya", seconds: parseSeconds(schedule?.isha) },
  ];

  for (const prayer of prayers) {
    if (prayer.seconds > currentSeconds) {
      const diffSec = prayer.seconds - currentSeconds;
      const diffMin = Math.floor(diffSec / 60);
      const h = Math.floor(diffMin / 60);
      const m = diffMin % 60;
      return {
        name: prayer.name,
        nameKey: prayer.nameKey,
        time: schedule?.[prayer.nameKey] || "--:--",
        remainingMinutes: diffMin,
        remainingSeconds: diffSec,
        formattedRemaining: h > 0 ? `${h} jam ${m} mnt` : `${m} menit`,
      };
    }
  }

  // Jika sudah lewat Isya, sholat berikutnya adalah Subuh besok
  const tomorrowFajrSeconds = parseSeconds(schedule?.fajr) + 24 * 3600;
  const diffSec = tomorrowFajrSeconds - currentSeconds;
  const diffMin = Math.floor(diffSec / 60);
  const h = Math.floor(diffMin / 60);
  const m = diffMin % 60;

  return {
    name: "Subuh",
    nameKey: "fajr",
    time: schedule?.fajr || "--:--",
    remainingMinutes: diffMin,
    remainingSeconds: diffSec,
    formattedRemaining: `${h} jam ${m} mnt`,
  };
}
