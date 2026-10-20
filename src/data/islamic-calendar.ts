export interface IslamicEvent {
  day: number;
  month: number; // 1 - 12 (Hijri)
  titleId: string;
  titleEn: string;
  descriptionId: string;
  descriptionEn: string;
}

export const HIJRI_MONTHS_ID = [
  "Muharram",
  "Safar",
  "Rabi'ul Awwal",
  "Rabi'ul Akhir",
  "Jumadil Awwal",
  "Jumadil Akhir",
  "Rajab",
  "Sya'ban",
  "Ramadhan",
  "Syawwal",
  "Dzulqa'dah",
  "Dzulhijjah",
];

export const HIJRI_MONTHS_EN = [
  "Muharram",
  "Safar",
  "Rabi' al-Awwal",
  "Rabi' al-Thani",
  "Jumada al-Awwal",
  "Jumada al-Thani",
  "Rajab",
  "Sha'ban",
  "Ramadan",
  "Shawwal",
  "Dhu al-Qi'dah",
  "Dhu al-Hijjah",
];

export const ISLAMIC_EVENTS: IslamicEvent[] = [
  {
    day: 1,
    month: 1,
    titleId: "Tahun Baru Islam (1 Muharram)",
    titleEn: "Islamic New Year",
    descriptionId: "Peringatan peristiwa hijrah Nabi Muhammad SAW dari Makkah ke Madinah.",
    descriptionEn: "Commemoration of the migration of Prophet Muhammad (PBUH) to Madinah."
  },
  {
    day: 10,
    month: 1,
    titleId: "Hari Asyura (10 Muharram)",
    titleEn: "Day of Ashura",
    descriptionId: "Disunnahkan berpuasa pada hari ke-9 (Tasu'a) dan ke-10 (Asyura) Muharram.",
    descriptionEn: "Sunnah fasting on the 9th and 10th of Muharram."
  },
  {
    day: 12,
    month: 3,
    titleId: "Maulid Nabi Muhammad SAW (12 Rabi'ul Awwal)",
    titleEn: "Mawlid al-Nabi",
    descriptionId: "Peringatan hari kelahiran Rasulullah Muhammad SAW, sang pembawa rahmat bagi semesta alam.",
    descriptionEn: "Celebration of the birth of Prophet Muhammad (PBUH)."
  },
  {
    day: 27,
    month: 7,
    titleId: "Isra Mi'raj (27 Rajab)",
    titleEn: "Isra and Mi'raj",
    descriptionId: "Perjalanan agung malam hari Nabi Muhammad SAW dan diturunkannya perintah sholat lima waktu.",
    descriptionEn: "The miraculous night journey and ascension of the Prophet, where the 5 daily prayers were ordained."
  },
  {
    day: 15,
    month: 8,
    titleId: "Malam Nisfu Sya'ban",
    titleEn: "Night of Mid-Sha'ban",
    descriptionId: "Malam penuh pengampunan dan persiapan menyambut bulan suci Ramadhan.",
    descriptionEn: "Night of forgiveness and preparation for Ramadan."
  },
  {
    day: 1,
    month: 9,
    titleId: "Awal Bulan Suci Ramadhan (1 Ramadhan)",
    titleEn: "First Day of Ramadan",
    descriptionId: "Awal dimulainya kewajiban ibadah puasa Ramadhan sebulan penuh bagi umat Islam.",
    descriptionEn: "Beginning of the blessed month of fasting."
  },
  {
    day: 17,
    month: 9,
    titleId: "Nuzulul Qur'an (17 Ramadhan)",
    titleEn: "Nuzul al-Quran",
    descriptionId: "Peringatan malam pertama kali diturunkannya wahyu Al-Qur'an di Gua Hira.",
    descriptionEn: "Commemoration of the first revelation of the Holy Quran."
  },
  {
    day: 1,
    month: 10,
    titleId: "Hari Raya Idul Fitri (1 Syawwal)",
    titleEn: "Eid al-Fitr",
    descriptionId: "Hari kemenangan setelah sebulan penuh berpuasa dan menunaikan zakat fitrah.",
    descriptionEn: "Festival of breaking the fast, marking the end of Ramadan."
  },
  {
    day: 9,
    month: 12,
    titleId: "Hari Arafah & Puasa Arafah (9 Dzulhijjah)",
    titleEn: "Day of Arafah",
    descriptionId: "Puncak ibadah haji (wukuf) dan disunnahkan berpuasa yang menghapus dosa dua tahun bagi yang tidak berhaji.",
    descriptionEn: "Pinnacle of Hajj pilgrimage and recommended day of fasting for non-pilgrims."
  },
  {
    day: 10,
    month: 12,
    titleId: "Hari Raya Idul Adha (10 Dzulhijjah)",
    titleEn: "Eid al-Adha",
    descriptionId: "Hari raya kurban untuk meneladani keikhlasan Nabi Ibrahim AS dan Nabi Ismail AS.",
    descriptionEn: "Feast of Sacrifice honoring the obedience of Prophet Ibrahim."
  }
];

export interface HijriDateInfo {
  day: number;
  month: number;
  monthNameId: string;
  monthNameEn: string;
  year: number;
  formattedId: string;
  formattedEn: string;
}

/**
 * Konversi tanggal Masehi ke estimasi tanggal Hijriah (algoritma hisab kalender Islam)
 */
export function getHijriDate(date: Date = new Date()): HijriDateInfo {
  // Gunakan Intl.DateTimeFormat dengan calendar islamic-umalqura
  try {
    const formatter = new Intl.DateTimeFormat("id-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "numeric",
      year: "numeric"
    });
    const parts = formatter.formatToParts(date);
    const rawDay = parts.find((p) => p.type === "day")?.value?.replace(/[^\d]/g, "") || "1";
    const rawMonth = parts.find((p) => p.type === "month")?.value?.replace(/[^\d]/g, "") || "1";
    const rawYear = parts.find((p) => p.type === "year")?.value?.replace(/[^\d]/g, "") || "1448";

    const day = parseInt(rawDay, 10) || 1;
    const month = parseInt(rawMonth, 10) || 1;
    const year = parseInt(rawYear, 10) || 1448;

    const safeMonth = Math.min(12, Math.max(1, month));
    const monthNameId = HIJRI_MONTHS_ID[safeMonth - 1] || "Ramadhan";
    const monthNameEn = HIJRI_MONTHS_EN[safeMonth - 1] || "Ramadan";

    return {
      day,
      month: safeMonth,
      monthNameId,
      monthNameEn,
      year,
      formattedId: `${day} ${monthNameId} ${year} H`,
      formattedEn: `${day} ${monthNameEn} ${year} AH`,
    };
  } catch {
    // Fallback sederhana jika runtime tidak mendukung kalender islamic-umalqura
    return {
      day: 14,
      month: 9,
      monthNameId: "Ramadhan",
      monthNameEn: "Ramadan",
      year: 1448,
      formattedId: "14 Ramadhan 1448 H",
      formattedEn: "14 Ramadan 1448 AH",
    };
  }
}
