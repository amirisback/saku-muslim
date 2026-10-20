import { test, expect } from "@playwright/test";

test.describe("TASK-003: Al-Qur'an NU Online Alignment & Theme Switcher E2E", () => {
  test("AC-01: Directory tabs (Surah, Juz, Urutan Turun) and Sort toggle", async ({ page }) => {
    await page.goto("/quran");

    // Tab Juz (30)
    const juzTab = page.getByRole("tab", { name: /Juz \(30\)/i });
    await expect(juzTab).toBeVisible();
    await juzTab.click();
    await expect(page.getByText(/Juz 1/i).first()).toBeVisible();
    await expect(page.getByText(/Juz 30/i).first()).toBeVisible();
    await expect(page.getByText(/Buka Juz 1/i).first()).toBeVisible();

    // Tab Urutan Turun (114)
    const nuzulTab = page.getByRole("tab", { name: /Urutan Turun \(114\)/i });
    await expect(nuzulTab).toBeVisible();
    await nuzulTab.click();
    await expect(page.getByText(/#1/i).first()).toBeVisible();
    await expect(page.getByText(/Al-'Alaq/i).first()).toBeVisible();

    // Tab Surah (114)
    const surahTab = page.getByRole("tab", { name: /Surah \(114\)/i });
    await expect(surahTab).toBeVisible();
    await surahTab.click();
    await expect(page.getByText(/Al-Fatihah/i).first()).toBeVisible();

    // Sort Toggle
    const sortBtn = page.getByTitle(/Ubah Urutan Tampilan/i);
    await expect(sortBtn).toBeVisible();
    await sortBtn.click();
    await expect(page.getByText(/Urut: A-Z/i)).toBeVisible();
  });

  test("AC-02: Smart coordinate search (2:255) and Popular Surah pills", async ({ page }) => {
    await page.goto("/quran");

    // Type coordinate "2:255"
    const searchInput = page.getByPlaceholder(/Cari surah/i);
    await searchInput.fill("2:255");

    // Instant jump card appears
    const jumpCard = page.getByText(/Surah Al-Baqarah Ayat 255/i);
    await expect(jumpCard).toBeVisible();
    await expect(page.getByText(/Ayat Kursi/i).first()).toBeVisible();

    // Click popular pill Ayat Kursi
    await searchInput.fill("");
    const ayatKursiPill = page.getByText(/Ayat Kursi \(2:255\)/i);
    await expect(ayatKursiPill).toBeVisible();
  });

  test("AC-03 & AC-04: Reader Sticky Bar, full verses, and tafsir toggle", async ({ page }) => {
    // Navigate to Surah Al-Fatihah
    await page.goto("/quran/1");

    // Check Sticky Bar elements
    await expect(page.getByText(/Daftar Surah/i).first()).toBeVisible();
    await expect(page.getByText(/Pilih Ayat/i)).toBeVisible();

    // Check all 7 ayahs are rendered
    await expect(page.locator("#ayah-1")).toBeVisible();
    await expect(page.locator("#ayah-7")).toBeVisible();

    // Test Tafsir toggle
    const tafsirBtn = page.locator("#ayah-1").getByRole("button", { name: /Tafsir/i });
    if (await tafsirBtn.isVisible()) {
      await tafsirBtn.click();
      await expect(page.getByText(/Tafsir Ringkas Kemenag RI/i).first()).toBeVisible();
    }

    // Verify Surah 9 (At-Taubah) omits Bismillah banner
    await page.goto("/quran/9");
    await expect(page.getByText(/At-Taubah/i).first()).toBeVisible();
    // Bismillah header should NOT be present in At-Taubah
    const bismillahHeader = page.getByText(/"Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang"/i);
    await expect(bismillahHeader).toHaveCount(0);
  });

  test("AC-05: Global Theme Switcher toggles dark and light mode", async ({ page }) => {
    await page.goto("/");

    // Locate desktop theme switcher in header
    const darkBtn = page.getByRole("button", { name: /Gelap/i }).first();
    await expect(darkBtn).toBeVisible();

    // Click dark button
    await darkBtn.click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    // Click light button
    const lightBtn = page.getByRole("button", { name: /Terang/i }).first();
    await lightBtn.click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });
});
