export interface JuzItem {
  juzNumber: number;
  name: string;
  startSurahNumber: number;
  startSurahName: string;
  startAyah: number;
  endSurahNumber: number;
  endSurahName: string;
  endAyah: number;
  totalVerses: number;
}

export const QURAN_JUZ_LIST: JuzItem[] = [
  {
    juzNumber: 1,
    name: "Juz 1",
    startSurahNumber: 1,
    startSurahName: "Al-Fatihah",
    startAyah: 1,
    endSurahNumber: 2,
    endSurahName: "Al-Baqarah",
    endAyah: 141,
    totalVerses: 148,
  },
  {
    juzNumber: 2,
    name: "Juz 2",
    startSurahNumber: 2,
    startSurahName: "Al-Baqarah",
    startAyah: 142,
    endSurahNumber: 2,
    endSurahName: "Al-Baqarah",
    endAyah: 252,
    totalVerses: 111,
  },
  {
    juzNumber: 3,
    name: "Juz 3",
    startSurahNumber: 2,
    startSurahName: "Al-Baqarah",
    startAyah: 253,
    endSurahNumber: 3,
    endSurahName: "Ali 'Imran",
    endAyah: 92,
    totalVerses: 126,
  },
  {
    juzNumber: 4,
    name: "Juz 4",
    startSurahNumber: 3,
    startSurahName: "Ali 'Imran",
    startAyah: 93,
    endSurahNumber: 4,
    endSurahName: "An-Nisa'",
    endAyah: 23,
    totalVerses: 131,
  },
  {
    juzNumber: 5,
    name: "Juz 5",
    startSurahNumber: 4,
    startSurahName: "An-Nisa'",
    startAyah: 24,
    endSurahNumber: 4,
    endSurahName: "An-Nisa'",
    endAyah: 147,
    totalVerses: 124,
  },
  {
    juzNumber: 6,
    name: "Juz 6",
    startSurahNumber: 4,
    startSurahName: "An-Nisa'",
    startAyah: 148,
    endSurahNumber: 5,
    endSurahName: "Al-Ma'idah",
    endAyah: 81,
    totalVerses: 110,
  },
  {
    juzNumber: 7,
    name: "Juz 7",
    startSurahNumber: 5,
    startSurahName: "Al-Ma'idah",
    startAyah: 82,
    endSurahNumber: 6,
    endSurahName: "Al-An'am",
    endAyah: 110,
    totalVerses: 149,
  },
  {
    juzNumber: 8,
    name: "Juz 8",
    startSurahNumber: 6,
    startSurahName: "Al-An'am",
    startAyah: 111,
    endSurahNumber: 7,
    endSurahName: "Al-A'raf",
    endAyah: 87,
    totalVerses: 142,
  },
  {
    juzNumber: 9,
    name: "Juz 9",
    startSurahNumber: 7,
    startSurahName: "Al-A'raf",
    startAyah: 88,
    endSurahNumber: 8,
    endSurahName: "Al-Anfal",
    endAyah: 40,
    totalVerses: 159,
  },
  {
    juzNumber: 10,
    name: "Juz 10",
    startSurahNumber: 8,
    startSurahName: "Al-Anfal",
    startAyah: 41,
    endSurahNumber: 9,
    endSurahName: "At-Taubah",
    endAyah: 92,
    totalVerses: 127,
  },
  {
    juzNumber: 11,
    name: "Juz 11",
    startSurahNumber: 9,
    startSurahName: "At-Taubah",
    startAyah: 93,
    endSurahNumber: 11,
    endSurahName: "Hud",
    endAyah: 5,
    totalVerses: 151,
  },
  {
    juzNumber: 12,
    name: "Juz 12",
    startSurahNumber: 11,
    startSurahName: "Hud",
    startAyah: 6,
    endSurahNumber: 12,
    endSurahName: "Yusuf",
    endAyah: 52,
    totalVerses: 170,
  },
  {
    juzNumber: 13,
    name: "Juz 13",
    startSurahNumber: 12,
    startSurahName: "Yusuf",
    startAyah: 53,
    endSurahNumber: 14,
    endSurahName: "Ibrahim",
    endAyah: 52,
    totalVerses: 154,
  },
  {
    juzNumber: 14,
    name: "Juz 14",
    startSurahNumber: 15,
    startSurahName: "Al-Hijr",
    startAyah: 1,
    endSurahNumber: 16,
    endSurahName: "An-Nahl",
    endAyah: 128,
    totalVerses: 227,
  },
  {
    juzNumber: 15,
    name: "Juz 15",
    startSurahNumber: 17,
    startSurahName: "Al-Isra'",
    startAyah: 1,
    endSurahNumber: 18,
    endSurahName: "Al-Kahf",
    endAyah: 74,
    totalVerses: 185,
  },
  {
    juzNumber: 16,
    name: "Juz 16",
    startSurahNumber: 18,
    startSurahName: "Al-Kahf",
    startAyah: 75,
    endSurahNumber: 20,
    endSurahName: "Taha",
    endAyah: 135,
    totalVerses: 269,
  },
  {
    juzNumber: 17,
    name: "Juz 17",
    startSurahNumber: 21,
    startSurahName: "Al-Anbiya'",
    startAyah: 1,
    endSurahNumber: 22,
    endSurahName: "Al-Hajj",
    endAyah: 78,
    totalVerses: 190,
  },
  {
    juzNumber: 18,
    name: "Juz 18",
    startSurahNumber: 23,
    startSurahName: "Al-Mu'minun",
    startAyah: 1,
    endSurahNumber: 25,
    endSurahName: "Al-Furqan",
    endAyah: 20,
    totalVerses: 202,
  },
  {
    juzNumber: 19,
    name: "Juz 19",
    startSurahNumber: 25,
    startSurahName: "Al-Furqan",
    startAyah: 21,
    endSurahNumber: 27,
    endSurahName: "An-Naml",
    endAyah: 55,
    totalVerses: 339,
  },
  {
    juzNumber: 20,
    name: "Juz 20",
    startSurahNumber: 27,
    startSurahName: "An-Naml",
    startAyah: 56,
    endSurahNumber: 29,
    endSurahName: "Al-'Ankabut",
    endAyah: 45,
    totalVerses: 171,
  },
  {
    juzNumber: 21,
    name: "Juz 21",
    startSurahNumber: 29,
    startSurahName: "Al-'Ankabut",
    startAyah: 46,
    endSurahNumber: 33,
    endSurahName: "Al-Ahzab",
    endAyah: 30,
    totalVerses: 178,
  },
  {
    juzNumber: 22,
    name: "Juz 22",
    startSurahNumber: 33,
    startSurahName: "Al-Ahzab",
    startAyah: 31,
    endSurahNumber: 36,
    endSurahName: "Yasin",
    endAyah: 27,
    totalVerses: 169,
  },
  {
    juzNumber: 23,
    name: "Juz 23",
    startSurahNumber: 36,
    startSurahName: "Yasin",
    startAyah: 28,
    endSurahNumber: 39,
    endSurahName: "Az-Zumar",
    endAyah: 31,
    totalVerses: 357,
  },
  {
    juzNumber: 24,
    name: "Juz 24",
    startSurahNumber: 39,
    startSurahName: "Az-Zumar",
    startAyah: 32,
    endSurahNumber: 41,
    endSurahName: "Fussilat",
    endAyah: 46,
    totalVerses: 175,
  },
  {
    juzNumber: 25,
    name: "Juz 25",
    startSurahNumber: 41,
    startSurahName: "Fussilat",
    startAyah: 47,
    endSurahNumber: 45,
    endSurahName: "Al-Jasiyah",
    endAyah: 37,
    totalVerses: 246,
  },
  {
    juzNumber: 26,
    name: "Juz 26",
    startSurahNumber: 46,
    startSurahName: "Al-Ahqaf",
    startAyah: 1,
    endSurahNumber: 51,
    endSurahName: "Az-Zariyat",
    endAyah: 30,
    totalVerses: 195,
  },
  {
    juzNumber: 27,
    name: "Juz 27",
    startSurahNumber: 51,
    startSurahName: "Az-Zariyat",
    startAyah: 31,
    endSurahNumber: 57,
    endSurahName: "Al-Hadid",
    endAyah: 29,
    totalVerses: 399,
  },
  {
    juzNumber: 28,
    name: "Juz 28",
    startSurahNumber: 58,
    startSurahName: "Al-Mujadilah",
    startAyah: 1,
    endSurahNumber: 66,
    endSurahName: "At-Tahrim",
    endAyah: 12,
    totalVerses: 137,
  },
  {
    juzNumber: 29,
    name: "Juz 29",
    startSurahNumber: 67,
    startSurahName: "Al-Mulk",
    startAyah: 1,
    endSurahNumber: 77,
    endSurahName: "Al-Mursalat",
    endAyah: 50,
    totalVerses: 431,
  },
  {
    juzNumber: 30,
    name: "Juz 30",
    startSurahNumber: 78,
    startSurahName: "An-Naba'",
    startAyah: 1,
    endSurahNumber: 114,
    endSurahName: "An-Nas",
    endAyah: 6,
    totalVerses: 564,
  },
];

/**
 * Urutan kronologis pewahyuan (Nuzul) 114 surah.
 * Indeks 0 = Surah wahyu ke-1 (Al-'Alaq - #96)
 * Indeks 113 = Surah wahyu ke-114 (An-Nasr - #110)
 */
export const REVELATION_ORDER_SURAHS: number[] = [
  96, 68, 73, 74, 1, 111, 81, 87, 92, 89,
  93, 94, 103, 100, 108, 102, 107, 109, 105, 113,
  114, 112, 53, 80, 97, 91, 85, 95, 106, 101,
  75, 104, 77, 50, 90, 86, 54, 38, 7, 72,
  36, 25, 35, 19, 20, 56, 26, 27, 28, 17,
  10, 11, 12, 15, 6, 37, 31, 34, 39, 40,
  41, 42, 43, 44, 45, 46, 51, 88, 18, 16,
  71, 14, 21, 23, 32, 52, 67, 69, 70, 78,
  79, 82, 84, 30, 29, 83, 2, 8, 3, 33,
  60, 4, 99, 57, 47, 13, 55, 76, 65, 98,
  59, 24, 22, 63, 58, 49, 66, 64, 61, 62,
  48, 5, 9, 110,
];

/**
 * Mengambil informasi Juz tempat surah berada (bisa satu juz atau merentang beberapa juz).
 */
export function getSurahJuzInfo(surahNumber: number): {
  startJuz: number;
  endJuz: number;
  label: string;
} {
  const matchingJuzs: number[] = [];
  for (const juz of QURAN_JUZ_LIST) {
    if (
      (surahNumber >= juz.startSurahNumber && surahNumber <= juz.endSurahNumber) ||
      (juz.startSurahNumber <= surahNumber && juz.endSurahNumber >= surahNumber)
    ) {
      matchingJuzs.push(juz.juzNumber);
    }
  }

  if (matchingJuzs.length === 0) {
    return { startJuz: 1, endJuz: 1, label: "Juz 1" };
  }

  const startJuz = Math.min(...matchingJuzs);
  const endJuz = Math.max(...matchingJuzs);

  return {
    startJuz,
    endJuz,
    label: startJuz === endJuz ? `Juz ${startJuz}` : `Juz ${startJuz} - ${endJuz}`,
  };
}

/**
 * Mengambil urutan wahyu (1 - 114) dari nomor surah.
 */
export function getRevelationOrderNumber(surahNumber: number): number {
  const index = REVELATION_ORDER_SURAHS.indexOf(surahNumber);
  return index !== -1 ? index + 1 : surahNumber;
}

/**
 * Konversi angka latin ke numeral Arab timur (misal: 1 -> ١, 255 -> ٢٥٥)
 */
export function toEasternArabicNumerals(num: number | string): string {
  const easternDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return num
    .toString()
    .split("")
    .map((char) => {
      const parsed = parseInt(char, 10);
      return !isNaN(parsed) ? easternDigits[parsed] : char;
    })
    .join("");
}
