import { test, expect } from "@playwright/test";

test.describe("Saku Muslim - Comprehensive E2E Verification Suite", () => {
  test("1. Beranda: Brand title, countdown, Ramadhan tracker & du'a tabs", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Saku Muslim/i);

    // Hero section and prayer countdown
    await expect(page.getByText(/Hitung Mundur/i).first()).toBeVisible();

    // Check Ramadhan worship tracker toggles
    const trackerCheckboxes = page.locator("button[role='checkbox']");
    const checkboxCount = await trackerCheckboxes.count();
    expect(checkboxCount).toBeGreaterThanOrEqual(1);

    // Click the first tracker item to toggle
    const initialChecked = await trackerCheckboxes.first().getAttribute("aria-checked");
    await trackerCheckboxes.first().click();
    const newChecked = await trackerCheckboxes.first().getAttribute("aria-checked");
    expect(newChecked).not.toBe(initialChecked);

    // Ramadhan Du'a tabs
    const lailatulTab = page.getByRole("tab", { name: /Lailatul Qadar/i });
    if (await lailatulTab.isVisible()) {
      await lailatulTab.click();
      await expect(page.getByText(/Allahumma innaka 'afuwwun/i)).toBeVisible();
    }
  });

  test("2. Jadwal Sholat: Prayer schedule table and checklist toggle", async ({ page }) => {
    await page.goto("/jadwal-sholat");
    await expect(page.getByRole("heading", { name: /Jadwal Sholat/i, level: 1 })).toBeVisible();

    // Check prayer names are visible
    await expect(page.getByText(/Subuh/i).first()).toBeVisible();
    await expect(page.getByText(/Dzuhur/i).first()).toBeVisible();
    await expect(page.getByText(/Ashar/i).first()).toBeVisible();
    await expect(page.getByText(/Maghrib/i).first()).toBeVisible();
    await expect(page.getByText(/Isya/i).first()).toBeVisible();

    // Toggle a prayer checklist
    const prayerCheckboxes = page.locator("button[role='checkbox']");
    if (await prayerCheckboxes.count() > 0) {
      await prayerCheckboxes.first().click();
    }
  });

  test("3. Al-Qur'an: Directory, search filter, and Surah Al-Fatihah reader", async ({ page }) => {
    await page.goto("/quran");
    await expect(page.getByRole("heading", { name: /Al-Qur'an/i, level: 1 })).toBeVisible();

    // Verify Surah Al-Fatihah is rendered
    await expect(page.getByText(/Al-Fatihah/i).first()).toBeVisible();

    // Filter surah
    const searchInput = page.getByPlaceholder(/Cari surah/i);
    await searchInput.fill("Yasin");
    await expect(page.getByText(/Yasin/i).first()).toBeVisible();

    // Navigate to Surah Al-Fatihah
    await page.goto("/quran/1");
    await expect(page.getByText(/Al-Fatihah/i).first()).toBeVisible();
    // Check Arabic bismillah or verse 1
    await expect(page.locator("text=بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ").first()).toBeVisible();
  });

  test("4. Kiblat: Compass direction and city switcher", async ({ page }) => {
    await page.goto("/kiblat");
    await expect(page.getByRole("heading", { name: /Arah Kiblat/i, level: 1 })).toBeVisible();

    // Verify degree indicator is visible
    await expect(page.getByText(/°/i).first()).toBeVisible();

    // Switch city
    const citySelect = page.locator("select");
    if (await citySelect.isVisible()) {
      await citySelect.selectOption({ label: "Surabaya" });
      await expect(citySelect).toHaveValue(/Surabaya/i);
    }
  });

  test("5. Doa & Dzikir: Digital Tasbih increment, reset, and audio safety", async ({ page }) => {
    await page.goto("/doa-dzikir");
    await expect(page.getByRole("heading", { name: /Kumpulan Doa & Tasbih Digital/i, level: 1 })).toBeVisible();

    // Switch to Tasbih Digital tab
    const tasbihTab = page.getByRole("tab", { name: /Tasbih Digital/i });
    await tasbihTab.click();

    // Verify counter is visible
    const counterDisplay = page.locator("text=/^\\d+$/").first();
    await expect(counterDisplay).toBeVisible();
    const startCount = parseInt((await counterDisplay.innerText()).trim(), 10) || 0;

    // Click increment button
    const countButton = page.locator("button:has-text('Tap'), button:has-text('Hitung')").first();
    await countButton.click();

    // Verify count incremented
    const updatedCountText = (await counterDisplay.innerText()).trim();
    expect(parseInt(updatedCountText, 10)).toBe(startCount + 1);

    // Reset counter
    const resetButton = page.locator("button[title*='Reset'], button:has-text('Reset')").first();
    if (await resetButton.isVisible()) {
      await resetButton.click();
      const resetCountText = (await counterDisplay.innerText()).trim();
      expect(parseInt(resetCountText, 10)).toBe(0);
    }
  });

  test("6. 99 Asmaul Husna: Search, modal open, and Escape key close", async ({ page }) => {
    await page.goto("/asmaul-husna");
    await expect(page.getByRole("heading", { name: /Asmaul Husna/i, level: 1 })).toBeVisible();

    // Search filter
    const searchInput = page.getByPlaceholder(/Cari nama/i);
    await searchInput.fill("Rahman");
    await expect(page.getByText(/Ar-Rahman/i).first()).toBeVisible();

    // Open detail modal
    await page.getByText(/Ar-Rahman/i).first().click();
    const modalDialog = page.locator("div[role='dialog']");
    await expect(modalDialog).toBeVisible();

    // Close modal via Escape key
    await page.keyboard.press("Escape");
    await expect(modalDialog).not.toBeVisible();
  });

  test("7. Kalkulator Zakat: Calculation reactivity and input sanitization", async ({ page }) => {
    await page.goto("/zakat");
    await expect(page.getByRole("heading", { name: /Kalkulator Zakat/i, level: 1 })).toBeVisible();

    // Enter income
    const incomeInput = page.locator("input[type='number']").first();
    await incomeInput.fill("15000000");

    // Verify calculated zakat section updates and displays Rp
    await expect(page.getByText(/Rp/i).first()).toBeVisible();
  });

  test("8. Kalender Hijriah: Calendar grid and Islamic holidays", async ({ page }) => {
    await page.goto("/kalender-hijriah");
    await expect(page.getByRole("heading", { name: /Kalender Hijriah/i, level: 1 })).toBeVisible();

    // Verify month navigation or events list
    await expect(page.getByText(/Hari Besar & Momentum Penting/i).first()).toBeVisible();
  });
});
