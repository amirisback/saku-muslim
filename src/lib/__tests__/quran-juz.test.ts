import { describe, it, expect } from "vitest";
import {
  QURAN_JUZ_LIST,
  REVELATION_ORDER_SURAHS,
  getSurahJuzInfo,
  getRevelationOrderNumber,
  toEasternArabicNumerals,
} from "@/data/quran-juz";
import { QURAN_SURAHS } from "@/data/quran-surahs";

describe("Quran Juz and Metadata Helpers", () => {
  it("should have exactly 30 Juz in QURAN_JUZ_LIST", () => {
    expect(QURAN_JUZ_LIST).toHaveLength(30);
    expect(QURAN_JUZ_LIST[0].name).toBe("Juz 1");
    expect(QURAN_JUZ_LIST[29].name).toBe("Juz 30");
  });

  it("should total exactly 6,236 verses across all 30 Juz", () => {
    const totalVerses = QURAN_JUZ_LIST.reduce((sum, juz) => sum + juz.totalVerses, 0);
    expect(totalVerses).toBe(6236);
  });

  it("should have exactly 114 unique surahs in revelation order", () => {
    expect(REVELATION_ORDER_SURAHS).toHaveLength(114);
    const uniqueSurahs = new Set(REVELATION_ORDER_SURAHS);
    expect(uniqueSurahs.size).toBe(114);

    // First revelation is Surah Al-'Alaq (#96)
    expect(REVELATION_ORDER_SURAHS[0]).toBe(96);
    expect(getRevelationOrderNumber(96)).toBe(1);

    // Last revelation is Surah An-Nasr (#110)
    expect(REVELATION_ORDER_SURAHS[113]).toBe(110);
    expect(getRevelationOrderNumber(110)).toBe(114);
  });

  it("should compute correct Juz range for individual surahs", () => {
    const fatihah = getSurahJuzInfo(1);
    expect(fatihah.startJuz).toBe(1);
    expect(fatihah.endJuz).toBe(1);
    expect(fatihah.label).toBe("Juz 1");

    const baqarah = getSurahJuzInfo(2);
    expect(baqarah.startJuz).toBe(1);
    expect(baqarah.endJuz).toBe(3);
    expect(baqarah.label).toBe("Juz 1 - 3");

    const yasin = getSurahJuzInfo(36);
    expect(yasin.startJuz).toBe(22);
    expect(yasin.endJuz).toBe(23);
    expect(yasin.label).toBe("Juz 22 - 23");

    const mulk = getSurahJuzInfo(67);
    expect(mulk.startJuz).toBe(29);
    expect(mulk.endJuz).toBe(29);
    expect(mulk.label).toBe("Juz 29");

    const nas = getSurahJuzInfo(114);
    expect(nas.startJuz).toBe(30);
    expect(nas.endJuz).toBe(30);
    expect(nas.label).toBe("Juz 30");
  });

  it("should convert latin digits to eastern arabic numerals correctly", () => {
    expect(toEasternArabicNumerals(1)).toBe("١");
    expect(toEasternArabicNumerals(7)).toBe("٧");
    expect(toEasternArabicNumerals(255)).toBe("٢٥٥");
    expect(toEasternArabicNumerals(114)).toBe("١١٤");
  });

  it("should have complete metadata for all 114 surahs in QURAN_SURAHS", () => {
    expect(QURAN_SURAHS).toHaveLength(114);
    for (const surah of QURAN_SURAHS) {
      expect(surah.number).toBeGreaterThanOrEqual(1);
      expect(surah.number).toBeLessThanOrEqual(114);
      expect(surah.nameArabic).toBeTruthy();
      expect(surah.nameLatin).toBeTruthy();
      expect(surah.nameIndonesian).toBeTruthy();
      expect(surah.numberOfAyahs).toBeGreaterThan(0);
      expect(["Makkiyah", "Madaniyah"]).toContain(surah.revelationType);
      expect(surah.revelationOrder).toBeGreaterThanOrEqual(1);
      expect(surah.revelationOrder).toBeLessThanOrEqual(114);
      expect(surah.juzStart).toBeGreaterThanOrEqual(1);
      expect(surah.juzEnd).toBeLessThanOrEqual(30);
    }
  });
});
