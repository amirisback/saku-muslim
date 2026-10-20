import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { getRamadhanState } from "../ramadhan";
import { getHijriDate } from "@/data/islamic-calendar";
import { Header } from "@/components/shared/header";
import { HomeHeroContent } from "@/app/_components/home-hero";

describe("TASK-002: Ramadhan Conditional Activation Verification Suite", () => {
  describe("AC-01 & AC-05: Real Hisab Calendar Calculation", () => {
    it("AC-01: should evaluate real current date as non-Ramadhan (Jumadil Awwal 1448 H, month 5)", () => {
      const state = getRamadhanState();
      expect(state.isRamadhan).toBe(false);
      expect(state.hijriMonth).toBe(5);
      expect(state.hijriYear).toBe(1448);
      expect(state.formattedHijri).toContain("Jumadil Awwal 1448 H");
      expect(state.isSimulated).toBe(false);
    });

    it("AC-05: should automatically activate isRamadhan: true when given a date in month 9 (Ramadhan)", () => {
      let ramadhanDate: Date | null = null;
      const testDate = new Date("2026-01-01T12:00:00Z");
      for (let i = 0; i < 500; i++) {
        const hijri = getHijriDate(testDate);
        if (hijri.month === 9) {
          ramadhanDate = new Date(testDate);
          break;
        }
        testDate.setDate(testDate.getDate() + 5);
      }

      expect(ramadhanDate).not.toBeNull();
      if (ramadhanDate) {
        const state = getRamadhanState({ date: ramadhanDate });
        expect(state.isRamadhan).toBe(true);
        expect(state.hijriMonth).toBe(9);
        expect(state.isSimulated).toBe(false);
      }
    });

    it("should evaluate other non-Ramadhan months (month 8 Sya'ban and month 10 Syawwal) as isRamadhan: false", () => {
      let syabanDate: Date | null = null;
      let syawwalDate: Date | null = null;
      const testDate = new Date("2026-01-01T12:00:00Z");
      for (let i = 0; i < 600; i++) {
        const hijri = getHijriDate(testDate);
        if (hijri.month === 8 && !syabanDate) syabanDate = new Date(testDate);
        if (hijri.month === 10 && !syawwalDate) syawwalDate = new Date(testDate);
        if (syabanDate && syawwalDate) break;
        testDate.setDate(testDate.getDate() + 5);
      }

      expect(syabanDate).not.toBeNull();
      expect(syawwalDate).not.toBeNull();
      if (syabanDate) {
        const stateSyaban = getRamadhanState({ date: syabanDate });
        expect(stateSyaban.isRamadhan).toBe(false);
        expect(stateSyaban.hijriMonth).toBe(8);
      }
      if (syawwalDate) {
        const stateSyawwal = getRamadhanState({ date: syawwalDate });
        expect(stateSyawwal.isRamadhan).toBe(false);
        expect(stateSyawwal.hijriMonth).toBe(10);
      }
    });
  });

  describe("AC-06: Preview Simulation Parameter (?ramadhan=true / ?ramadhan=false)", () => {
    it("should force isRamadhan = true when forcedQueryValue is 'true'", () => {
      const state = getRamadhanState({ forcedQueryValue: "true" });
      expect(state.isRamadhan).toBe(true);
      expect(state.hijriMonth).toBe(9);
      expect(state.hijriYear).toBe(1448);
      expect(state.formattedHijri).toBe("Ramadhan 1448 H");
      expect(state.isSimulated).toBe(true);
    });

    it("should force isRamadhan = false when forcedQueryValue is 'false'", () => {
      const state = getRamadhanState({ forcedQueryValue: "false" });
      expect(state.isRamadhan).toBe(false);
      expect(state.hijriMonth).toBe(5);
      expect(state.hijriYear).toBe(1448);
      expect(state.formattedHijri).toBe("Jumadil Awwal 1448 H");
      expect(state.isSimulated).toBe(true);
    });

    it("should fallback to real hisab if forcedQueryValue is null, undefined, or empty/invalid", () => {
      const stateNull = getRamadhanState({ forcedQueryValue: null });
      expect(stateNull.isSimulated).toBe(false);
      expect(stateNull.hijriMonth).toBe(5);

      const stateUndefined = getRamadhanState({ forcedQueryValue: undefined });
      expect(stateUndefined.isSimulated).toBe(false);

      const stateRandom = getRamadhanState({ forcedQueryValue: "random_string" });
      expect(stateRandom.isSimulated).toBe(false);
    });
  });

  describe("AC-02: Header Branding Cleanliness", () => {
    it("should NOT render Fanous badge or seasonal text in desktop navbar when isRamadhan is false", () => {
      const html = renderToString(<Header isRamadhan={false} />);
      expect(html).not.toContain("Ramadhan 1448 H");
      expect(html).not.toContain("Marhaban Ya Ramadhan");
      expect(html).toContain("Saku Muslim");
      expect(html).toContain("Islamic Companion");
    });

    it("should render Fanous badge with Ramadhan 1448 H when isRamadhan is true", () => {
      const html = renderToString(<Header isRamadhan={true} />);
      expect(html).toContain("Ramadhan 1448 H");
      expect(html).toContain("Saku Muslim");
      expect(html).toContain("Islamic Companion");
    });
  });

  describe("AC-03: Hero Card Non-Ramadhan Regular Mode Focus", () => {
    it("should render spacious next prayer spotlight, An-Nisa: 103, and hide Ramadhan ornaments when forcedQuery is null (default)", () => {
      const html = renderToString(<HomeHeroContent forcedQuery={null} />);

      // 1. Regular Header Titles and Sacred Quote
      expect(html).toContain("Waktu Sholat Fardhu Berikutnya");
      expect(html).toContain("Jadwal Sholat &amp; Ibadah Harian Presisi");
      expect(html).toContain("إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا");
      expect(html).toContain("QS. An-Nisa: 103");

      // 2. Single Next Prayer Spotlight Card
      expect(html).toContain("Sholat Berikutnya:");
      expect(html).toContain("Fardhu");
      expect(html).toContain("Dengarkan Adzan");
      expect(html).toContain("Hitung Mundur Menuju");

      // 3. Ribbon 5 Waktu Sholat & City Selector
      expect(html).toContain("Pilih Kota untuk Jadwal Hisab");
      expect(html).toContain("Subuh");
      expect(html).toContain("Dzuhur");
      expect(html).toContain("Ashar");
      expect(html).toContain("Maghrib");
      expect(html).toContain("Isya");

      // 4. Actual Hijri Date
      expect(html).toContain("Jumadil Awwal 1448 H");

      // 5. Ramadhan elements must NOT be present
      expect(html).not.toContain("Marhaban Ya Ramadhan 1448 H");
      expect(html).not.toContain("Bulan Penuh Ampunan");
      expect(html).not.toContain("Jadwal Imsakiyah &amp; Waktu Sholat Presisi");
      expect(html).not.toContain("شَهْرُ رَمَضَانَ الَّذِي أُنْزِلَ فِيهِ الْقُرْآنُ");
      expect(html).not.toContain("Fokus Menuju Imsak");
      expect(html).not.toContain("Fokus Buka Puasa");
    });
  });

  describe("AC-04: Conditional Rendering of Ramadhan Modules", () => {
    it("should NOT render RamadhanDuaSuite and RamadhanWorshipTracker in default non-Ramadhan state", () => {
      const html = renderToString(<HomeHeroContent forcedQuery={null} />);

      // Ramadhan Dua Suite markers
      expect(html).not.toContain("Doa Pilihan Ramadhan");
      expect(html).not.toContain("Niat Puasa Ramadhan");
      expect(html).not.toContain("Doa Berbuka Puasa");

      // Ramadhan Worship Tracker markers
      expect(html).not.toContain("Mutaba&#x27;ah Yaumiyah");
      expect(html).not.toContain("Sholat Tarawih &amp; Witir");
      expect(html).not.toContain("Tadarus Al-Qur&#x27;an 1 Juz");

      // Core Daily Features MUST remain rendered directly without layout gap
      expect(html).toContain("Menu Utama Ibadah");
      expect(html).toContain("7 Fitur Lengkap");
      expect(html).toContain("Ayat Hari Ini");
      expect(html).toContain("Pelacak Sholat Fardhu Hari Ini");
      expect(html).toContain("أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ");
    });
  });

  describe("AC-06: Preview Simulation Rendering with Forced Query", () => {
    it("should render full Ramadhan Thematic Hero and Suites when forcedQuery is 'true'", () => {
      const html = renderToString(<HomeHeroContent forcedQuery="true" />);

      // Ramadhan Thematic Banner & Verse
      expect(html).toContain("Marhaban Ya Ramadhan 1448 H");
      expect(html).toContain("Bulan Penuh Ampunan");
      expect(html).toContain("Jadwal Imsakiyah &amp; Waktu Sholat Presisi");
      expect(html).toContain("شَهْرُ رَمَضَانَ الَّذِي أُنْزِلَ فِيهِ الْقُرْآنُ");

      // Dual Countdown Spotlight Cards
      expect(html).toContain("Imsak (Batas Sahur)");
      expect(html).toContain("Maghrib (Buka Puasa)");

      // Ramadhan Modules rendered
      expect(html).toContain("Doa Pilihan Ramadhan");
      expect(html).toContain("Niat Puasa Ramadhan");
      expect(html).toContain("Mutaba&#x27;ah Yaumiyah");
      expect(html).toContain("Target Khatam");

      // Daily Core also preserved
      expect(html).toContain("Ayat Hari Ini");
      expect(html).toContain("Pelacak Sholat Fardhu Hari Ini");
    });

    it("should render standard non-Ramadhan view when forcedQuery is 'false'", () => {
      const html = renderToString(<HomeHeroContent forcedQuery="false" />);

      expect(html).toContain("Waktu Sholat Fardhu Berikutnya");
      expect(html).toContain("Jadwal Sholat &amp; Ibadah Harian Presisi");
      expect(html).not.toContain("Marhaban Ya Ramadhan 1448 H");
      expect(html).not.toContain("Doa &amp; Niat Khusus Ramadhan");
      expect(html).not.toContain("Mutaba&#x27;ah Yaumiyah");
    });
  });
});
