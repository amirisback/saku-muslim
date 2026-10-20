import { describe, it, expect, vi, beforeEach } from "vitest";
import { getSurahDetailFull } from "@/lib/quran-service";

describe("Quran Service (getSurahDetailFull)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should fetch Surah Al-Fatihah (1) with 7 ayahs and previousSurah null", async () => {
    const data = await getSurahDetailFull(1);
    expect(data.number).toBe(1);
    expect(data.nameLatin).toBe("Al-Fatihah");
    expect(data.numberOfAyahs).toBe(7);
    expect(data.ayahs.length).toBe(7);
    expect(data.previousSurah).toBeNull();
    expect(data.nextSurah).toEqual({ number: 2, nameLatin: "Al-Baqarah" });
    expect(data.bismillahPre).toBe(true);
  });

  it("should set bismillahPre to false for Surah At-Taubah (9)", async () => {
    const data = await getSurahDetailFull(9);
    expect(data.number).toBe(9);
    expect(data.nameLatin).toBe("At-Taubah");
    expect(data.bismillahPre).toBe(false);
  });

  it("should fetch Surah An-Nas (114) with nextSurah null and previousSurah Al-Falaq", async () => {
    const data = await getSurahDetailFull(114);
    expect(data.number).toBe(114);
    expect(data.nameLatin).toBe("An-Nas");
    expect(data.numberOfAyahs).toBe(6);
    expect(data.nextSurah).toBeNull();
    expect(data.previousSurah).toEqual({ number: 113, nameLatin: "Al-Falaq" });
  });

  it("should provide fallback gracefully when network fetch fails", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("Network offline"));
    const data = await getSurahDetailFull(112); // Al-Ikhlas
    expect(data.number).toBe(112);
    expect(data.nameLatin).toBe("Al-Ikhlas");
    expect(data.ayahs.length).toBeGreaterThan(0);
  });
});
