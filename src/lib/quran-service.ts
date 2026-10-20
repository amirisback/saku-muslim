import { QURAN_SURAHS } from "@/data/quran-surahs";
import { SURAH_DETAILS } from "@/data/quran-verses";

export interface AyahDetail {
  numberInSurah: number;
  numberInQuran: number;
  arabic: string;
  transliteration: string;
  translation: string;
  audioUrl: string;
  tafsirShort?: string;
}

export interface SurahDetailFull {
  number: number;
  nameArabic: string;
  nameLatin: string;
  nameIndonesian: string;
  revelationType: "Makkiyah" | "Madaniyah";
  numberOfAyahs: number;
  description: string;
  audioFullSurah: string;
  bismillahPre: boolean;
  ayahs: AyahDetail[];
  previousSurah: { number: number; nameLatin: string } | null;
  nextSurah: { number: number; nameLatin: string } | null;
}

interface EQuranAyat {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>;
}

interface EQuranSuratResponse {
  code: number;
  message: string;
  data: {
    nomor: number;
    nama: string;
    namaLatin: string;
    jumlahAyat: number;
    tempatTurun: string;
    arti: string;
    deskripsi: string;
    audioFull: Record<string, string>;
    ayat: EQuranAyat[];
  };
}

interface EQuranTafsirItem {
  ayat: number;
  teks: string;
}

interface EQuranTafsirResponse {
  code: number;
  message: string;
  data: {
    nomor: number;
    namaLatin: string;
    tafsir: EQuranTafsirItem[];
  };
}

// In-memory runtime cache to speed up subsequent server requests
const memoryCache = new Map<number, SurahDetailFull>();

export async function getSurahDetailFull(surahNumber: number): Promise<SurahDetailFull> {
  const meta = QURAN_SURAHS.find((s) => s.number === surahNumber) || QURAN_SURAHS[0];
  const previousSurah =
    surahNumber > 1
      ? { number: surahNumber - 1, nameLatin: QURAN_SURAHS[surahNumber - 2].nameLatin }
      : null;
  const nextSurah =
    surahNumber < 114
      ? { number: surahNumber + 1, nameLatin: QURAN_SURAHS[surahNumber].nameLatin }
      : null;

  // Check memory cache first
  if (memoryCache.has(surahNumber)) {
    return memoryCache.get(surahNumber)!;
  }

  try {
    const padded = surahNumber.toString().padStart(3, "0");
    const [surahRes, tafsirRes] = await Promise.all([
      fetch(`https://equran.id/api/v2/surat/${surahNumber}`, {
        next: { revalidate: 86400 }, // 1 day ISR cache
      }),
      fetch(`https://equran.id/api/v2/tafsir/${surahNumber}`, {
        next: { revalidate: 86400 },
      }).catch(() => null),
    ]);

    if (!surahRes.ok) {
      throw new Error(`Upstream equran.id returned status ${surahRes.status}`);
    }

    const surahData: EQuranSuratResponse = await surahRes.json();
    const tafsirData: EQuranTafsirResponse | null = tafsirRes && tafsirRes.ok ? await tafsirRes.json() : null;

    const tafsirMap = new Map<number, string>();
    if (tafsirData?.data?.tafsir) {
      for (const item of tafsirData.data.tafsir) {
        tafsirMap.set(item.ayat, item.teks);
      }
    }

    const ayahs: AyahDetail[] = (surahData.data.ayat || []).map((item) => {
      // Audio priority: 05 (Misyari Rasyid Al-Afasy), 01 (Abdullah Al Juhany), fallback cdn
      const audioUrl =
        item.audio?.["05"] ||
        item.audio?.["01"] ||
        `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${item.nomorAyat}.mp3`;

      const arabic =
        surahNumber === 1 && item.nomorAyat === 1
          ? "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
          : item.teksArab;

      return {
        numberInSurah: item.nomorAyat,
        numberInQuran: item.nomorAyat,
        arabic,
        transliteration: item.teksLatin,
        translation: item.teksIndonesia,
        audioUrl,
        tafsirShort: tafsirMap.get(item.nomorAyat),
      };
    });

    const audioFullSurah =
      surahData.data.audioFull?.["05"] ||
      surahData.data.audioFull?.["01"] ||
      `https://server8.mp3quran.net/afs/${padded}.mp3`;

    const fullDetail: SurahDetailFull = {
      number: surahData.data.nomor || meta.number,
      nameArabic: surahData.data.nama || meta.nameArabic,
      nameLatin: surahData.data.namaLatin || meta.nameLatin,
      nameIndonesian: surahData.data.arti || meta.nameIndonesian,
      revelationType: surahData.data.tempatTurun === "Mekah" ? "Makkiyah" : "Madaniyah",
      numberOfAyahs: surahData.data.jumlahAyat || meta.numberOfAyahs,
      description: surahData.data.deskripsi || "",
      audioFullSurah,
      bismillahPre: surahNumber !== 9, // Surah 9 (At-Taubah) omits Bismillah
      ayahs,
      previousSurah,
      nextSurah,
    };

    memoryCache.set(surahNumber, fullDetail);
    return fullDetail;
  } catch (error) {
    console.warn(`[quran-service] Failed to fetch surah ${surahNumber} from API:`, error);

    // Fallback: Check local SURAH_DETAILS if present
    if (SURAH_DETAILS[surahNumber]) {
      const local = SURAH_DETAILS[surahNumber];
      const fallbackDetail: SurahDetailFull = {
        number: local.number,
        nameArabic: local.nameArabic,
        nameLatin: local.nameLatin,
        nameIndonesian: local.nameIndonesian,
        revelationType: local.revelationType,
        numberOfAyahs: local.numberOfAyahs,
        description: "",
        audioFullSurah: local.audioFullSurah,
        bismillahPre: surahNumber !== 9,
        ayahs: local.ayahs.map((a) => ({
          numberInSurah: a.numberInSurah,
          numberInQuran: a.numberInSurah,
          arabic: a.arabic,
          transliteration: a.transliteration,
          translation: a.translation,
          audioUrl: a.audioUrl || "",
        })),
        previousSurah,
        nextSurah,
      };
      return fallbackDetail;
    }

    // Graceful offline degradation for any surah if disconnected
    const padded = surahNumber.toString().padStart(3, "0");
    return {
      number: meta.number,
      nameArabic: meta.nameArabic,
      nameLatin: meta.nameLatin,
      nameIndonesian: meta.nameIndonesian,
      revelationType: meta.revelationType,
      numberOfAyahs: meta.numberOfAyahs,
      description: `Surah ${meta.nameLatin} (${meta.nameIndonesian}) terdiri dari ${meta.numberOfAyahs} ayat.`,
      audioFullSurah: `https://server8.mp3quran.net/afs/${padded}.mp3`,
      bismillahPre: surahNumber !== 9,
      ayahs: [
        {
          numberInSurah: 1,
          numberInQuran: 1,
          arabic: surahNumber === 1 ? "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ" : "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
          transliteration: "Bismillāhir-raḥmānir-raḥīm",
          translation: "Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang.",
          audioUrl: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3`,
        },
      ],
      previousSurah,
      nextSurah,
    };
  }
}
