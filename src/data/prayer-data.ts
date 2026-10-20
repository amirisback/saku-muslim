export interface CityLocation {
  id: string;
  name: string;
  province: string;
  latitude: number;
  longitude: number;
  timezone: number; // UTC offset in hours
}

export interface PrayerTimesSchedule {
  imsak: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export const INDONESIA_CITIES: CityLocation[] = [
  { id: "jakarta", name: "DKI Jakarta", province: "DKI Jakarta", latitude: -6.2088, longitude: 106.8456, timezone: 7 },
  { id: "surabaya", name: "Surabaya", province: "Jawa Timur", latitude: -7.2575, longitude: 112.7521, timezone: 7 },
  { id: "bandung", name: "Bandung", province: "Jawa Barat", latitude: -6.9175, longitude: 107.6191, timezone: 7 },
  { id: "medan", name: "Medan", province: "Sumatera Utara", latitude: 3.5952, longitude: 98.6722, timezone: 7 },
  { id: "semarang", name: "Semarang", province: "Jawa Tengah", latitude: -6.9667, longitude: 110.4167, timezone: 7 },
  { id: "makassar", name: "Makassar", province: "Sulawesi Selatan", latitude: -5.1477, longitude: 119.4327, timezone: 8 },
  { id: "palembang", name: "Palembang", province: "Sumatera Selatan", latitude: -2.9761, longitude: 104.7754, timezone: 7 },
  { id: "yogyakarta", name: "Yogyakarta", province: "DI Yogyakarta", latitude: -7.7956, longitude: 110.3695, timezone: 7 },
  { id: "denpasar", name: "Denpasar", province: "Bali", latitude: -8.6705, longitude: 115.2126, timezone: 8 },
  { id: "balikpapan", name: "Balikpapan", province: "Kalimantan Timur", latitude: -1.2379, longitude: 116.8529, timezone: 8 },
  { id: "banda-aceh", name: "Banda Aceh", province: "Aceh", latitude: 5.5483, longitude: 95.3238, timezone: 7 },
  { id: "jayapura", name: "Jayapura", province: "Papua", latitude: -2.5337, longitude: 140.7181, timezone: 9 }
];

export const KAABA_COORDINATES = {
  latitude: 21.422487,
  longitude: 39.826206,
};
