# TASK-002: Ramadhan Conditional Activation - Product Requirement Document (PRD)

> **Author:** Faisal (Product Manager & Business Analyst)  
> **Status:** APPROVED / FROZEN  
> **Date:** 2026-10-20  
> **Target Delivery:** Tim FE (Angel, Fiqry, Sandra)  

---

## 1. Business Objective & Context

### 1.1 Problem Statement
Aplikasi Saku Muslim saat ini menampilkan ornamen, banner, dan fitur khusus Ramadhan secara permanen (hardcoded) pada navigation header dan homepage hero. Elemen-elemen ini mencakup:
- Lentera Fanous dan kaligrafi/badge "Marhaban Ya Ramadhan 1448 H".
- Spotlight ganda hitung mundur Imsak (sahur) dan Maghrib (buka puasa).
- Modul RamadhanDuaSuite dan RamadhanWorshipTracker.

Berdasarkan kalender hisab Hijriah riil sistem saat ini (`Intl.DateTimeFormat("id-u-ca-islamic-umalqura")`), tanggal sekarang berada di bulan Jumadil Awwal 1448 H (`month === 5`), bukan bulan Ramadhan (`month === 9`). 

Menampilkan elemen Ramadhan di luar bulan Ramadhan menimbulkan kebingungan bagi pengguna, mengurangi relevansi kontekstual aplikasi, dan mengaburkan fokus utama ibadah harian non-Ramadhan (jadwal sholat 5 waktu fardhu berikutnya). Pengguna meminta agar seluruh fitur dan nuansa Ramadhan hanya aktif saat kalender hisab benar-benar memasuki bulan Ramadhan.

### 1.2 User Persona
1. **Pengguna Harian (Regular Muslim Worshipper):** Membutuhkan antarmuka beranda yang bersih, fokus pada jadwal sholat 5 waktu terdekat, tanggal Masehi & Hijriah aktual, ayat harian, dan checklist sholat fardhu.
2. **Jamaah Ramadhan (Fasting Muslim):** Saat bulan Ramadhan tiba, membutuhkan pemantau waktu sahur (Imsak), waktu berbuka (Maghrib), doa puasa, dan pelacak ibadah Ramadhan secara otomatis tanpa harus mengatur setelan manual.
3. **QA & Developer:** Memerlukan mekanisme simulasi yang deterministik (`?ramadhan=true` atau `?ramadhan=false`) untuk memverifikasi kedua kondisi antarmuka kapan saja tanpa mengubah waktu sistem operasi.

### 1.3 Impact Metric
- **100% Ketepatan Kontekstual:** Fitur visual dan fungsional Ramadhan hanya aktif otomatis pada bulan ke-9 Hijriah (`month === 9`).
- **Nol Hydration Mismatch:** Tidak ada error hidrasi React 19 antara Server Component dan Client Component.
- **Performa & Stabilitas UI:** Cumulative Layout Shift (CLS) < 0.05 saat beralih antara state default dan state Ramadhan.
- **Zero Build Warnings:** Build produksi bersih dengan TypeScript strict dan ESLint tanpa warning.

---

## 2. Scope & Boundaries

### 2.1 In Scope
1. **Pendeteksi Status Ramadhan (`isRamadhanActive` Helper):**
   - Menambahkan utilitas hisab deterministik pada `src/data/islamic-calendar.ts` atau modul terisolasi `src/lib/ramadhan.ts` untuk memeriksa apakah tanggal saat ini adalah bulan Ramadhan (`month === 9`).
   - Menyediakan dukungan override simulasi melalui parameter URL (searchParams `?ramadhan=true` atau `?ramadhan=false`) untuk pengujian dan pratinjau.

2. **Adaptasi Navigation Header (`src/components/shared/header.tsx`):**
   - **Saat Ramadhan Aktif:** Menampilkan badge lentera Fanous "Ramadhan 1448 H" di desktop dan banner "Marhaban Ya Ramadhan" di mobile drawer.
   - **Di Luar Ramadhan (Default):** Menghilangkan badge Ramadhan dan banner Fanous. Header menampilkan identitas aplikasi default yang bersih dan elegan.

3. **Adaptasi Hero Section (`src/app/_components/home-hero.tsx`):**
   - **Saat Ramadhan Aktif:** Menampilkan Hero Card Thematic Ramadhan lengkap dengan watermark Arabesque, lentera Fanous, countdown spotlight ganda Imsak-Maghrib, serta modul `RamadhanDuaSuite` dan `RamadhanWorshipTracker`.
   - **Di Luar Ramadhan (Default):** 
     - Hero Card default berfokus pada waktu sholat fardhu berikutnya, countdown menuju sholat fardhu terdekat, tombol dengarkan Adzan, selector kota hisab, dan ribbon 5 waktu sholat.
     - Menyembunyikan modul khusus Ramadhan (`RamadhanDuaSuite` dan `RamadhanWorshipTracker`) dari homepage beranda.
     - Mempertahankan aksesibilitas fitur harian: Quick Action Menu 7 alat ibadah, Ayat Hari Ini, dan Pelacak Sholat Fardhu Hari Ini.

4. **Mode Simulasi Pengujian (Developer & QA Preview):**
   - Membaca search parameter `?ramadhan=true` pada URL untuk memaksa tampilan Ramadhan aktif meskipun tanggal riil bukan bulan Ramadhan.
   - Membaca search parameter `?ramadhan=false` untuk memaksa tampilan non-Ramadhan saat berada di bulan Ramadhan.

### 2.2 Out of Scope (Ponytail & YAGNI)
- Backend API database khusus toggle manual atau CMS setting jarak jauh (cukup komputasi hisab murni di sisi klien/server Next.js).
- Banner tema untuk 11 bulan Hijriah lainnya (hanya menangani bifurkasi Ramadhan vs Non-Ramadhan sesuai kebutuhan spesifik user).
- Modifikasi database lokal atau migrasi data checklist pengguna.
- Audio autoplay otomatis tanpa interaksi klik dari pengguna.

---

## 3. Acceptance Criteria (BDD / Gherkin Matrix)

### AC-01: Deteksi Penanggalan Hijriah Riil & Status Non-Ramadhan Default
```gherkin
Scenario: Sistem mendeteksi bulan Hijriah di luar Ramadhan
  Given tanggal sistem berada di luar bulan Ramadhan (misal: Jumadil Awwal, month === 5)
  When fungsi evaluasi penanggalan Hijriah dijalankan tanpa parameter simulasi
  Then nilai `isRamadhan` bernilai false
  And antarmuka beranda memuat tema standar (non-Ramadhan) secara default
```

### AC-02: Header Branding Bersih di Luar Ramadhan
```gherkin
Scenario: Pengguna membuka header aplikasi di luar bulan Ramadhan
  Given status Ramadhan bernilai false
  When komponen Header dirender pada layar desktop maupun mobile
  Then badge aksen lentera "Ramadhan 1448 H" tidak ditampilkan pada desktop bar
  And banner "Marhaban Ya Ramadhan" tidak ditampilkan pada drawer menu mobile
  And identitas aplikasi "Saku Muslim - Islamic Companion" tampil konsisten
```

### AC-03: Hero Card Non-Ramadhan Berfokus pada Sholat Fardhu
```gherkin
Scenario: Pengguna melihat Hero Card di beranda di luar bulan Ramadhan
  Given status Ramadhan bernilai false
  When halaman beranda "/" dibuka oleh pengguna
  Then kartu hero menampilkan fokus utama sholat fardhu berikutnya (Subuh / Dzuhur / Ashar / Maghrib / Isya)
  And spotlight ganda Imsak-Maghrib disembunyikan
  And ornamen lentera Fanous dan kaligrafi "Marhaban Ya Ramadhan" disembunyikan
  And ribbon 5 waktu sholat dan pemilih kota hisab tetap berfungsi normal
  And tanggal Hijriah aktual (contoh: "14 Jumadil Awwal 1448 H") tetap ditampilkan dengan benar
```

### AC-04: Kondisional Komponen RamadhanDuaSuite & RamadhanWorshipTracker
```gherkin
Scenario: Visibilitas modul khusus Ramadhan di beranda
  Given pengguna berada di halaman utama "/"
  When status Ramadhan bernilai false
  Then komponen `RamadhanDuaSuite` dan `RamadhanWorshipTracker` tidak dirender pada DOM beranda
  And section "Ayat Hari Ini" dan "Pelacak Sholat Fardhu Hari Ini" tetap tampil rapi tanpa kekosongan layout
```

### AC-05: Aktivasi Otomatis Saat Memasuki Bulan Ramadhan
```gherkin
Scenario: Penanggalan hisab memasuki bulan Ramadhan
  Given kalender hisab Hijriah mendeteksi bulan ke-9 (month === 9)
  When pengguna membuka aplikasi
  Then header menampilkan badge lentera Fanous "Ramadhan 1448 H"
  And kartu hero menampilkan banner "Marhaban Ya Ramadhan", ornamen Fanous, dan spotlight ganda Imsak-Maghrib
  And section `RamadhanDuaSuite` dan `RamadhanWorshipTracker` tampil lengkap di bawah menu utama
```

### AC-06: Mode Simulasi Preview URL (?ramadhan=true / ?ramadhan=false)
```gherkin
Scenario: Developer atau QA melakukan testing visual via URL parameter
  Given tanggal sistem adalah bulan Jumadil Awwal (month === 5)
  When pengguna mengakses URL "/?ramadhan=true"
  Then sistem mengabaikan tanggal sistem dan mengaktifkan seluruh nuansa serta fitur Ramadhan
  When pengguna mengakses URL "/?ramadhan=false" pada bulan Ramadhan
  Then sistem menampilkan antarmuka standar non-Ramadhan
```

### AC-07: Bebas Hydration Mismatch & Strict Quality Gate
```gherkin
Scenario: Verifikasi kestabilan render dan build produksi
  Given aplikasi dirender dengan Next.js App Router dan React 19
  When halaman beranda dimuat pertama kali
  Then tidak ada warning console hydration error
  And tidak terjadi pergeseran tata letak yang mengganggu (CLS < 0.05)
  And eksekusi `bun run lint` dan `bun run build` lulus 100% tanpa error maupun warning
```

---

## 4. Contract Freeze Specifications (Phase 2 Alignment)

### 4.1 Utility Contract (`src/lib/ramadhan.ts` atau `src/data/islamic-calendar.ts`)
```typescript
export interface RamadhanState {
  isRamadhan: boolean;
  hijriMonth: number;
  hijriYear: number;
  formattedHijri: string;
  isSimulated: boolean;
}

/**
 * Menghitung status keaktifan fitur Ramadhan berdasarkan hisab kalender Islam
 * dan override search parameter.
 */
export function getRamadhanState(options?: {
  date?: Date;
  forcedQueryValue?: string | null;
}): RamadhanState {
  // 1. Cek parameter override (?ramadhan=true / false)
  if (options?.forcedQueryValue === "true") {
    return {
      isRamadhan: true,
      hijriMonth: 9,
      hijriYear: 1448,
      formattedHijri: "Ramadhan 1448 H",
      isSimulated: true,
    };
  }
  if (options?.forcedQueryValue === "false") {
    return {
      isRamadhan: false,
      hijriMonth: 5,
      hijriYear: 1448,
      formattedHijri: "Jumadil Awwal 1448 H",
      isSimulated: true,
    };
  }

  // 2. Evaluasi hisab riil dari getHijriDate
  const hijri = getHijriDate(options?.date ?? new Date());
  return {
    isRamadhan: hijri.month === 9,
    hijriMonth: hijri.month,
    hijriYear: hijri.year,
    formattedHijri: hijri.formattedId,
    isSimulated: false,
  };
}
```

### 4.2 Component Props Contract
- **`Header` (`src/components/shared/header.tsx`):**
  - Menerima opsi `isRamadhan?: boolean` atau membaca state hisab secara seragam agar selaras dengan hero.
- **`HomeHero` (`src/app/_components/home-hero.tsx`):**
  - Mengonsumsi `isRamadhan` untuk mengatur percabangan render:
    * `isRamadhan === true`: Render Hero Ramadhan (Imsak-Maghrib Spotlight + Du'a Suite + Worship Tracker).
    * `isRamadhan === false`: Render Hero Default (Fokus Sholat Fardhu Terdekat + Countdown Sholat + Ribbon 5 Waktu).

---

## 5. Cross-Role Alignment Log

| Role | Pertanyaan / Masukan Teknis | Kesepakatan & Keputusan PM (Binding) |
|---|---|---|
| **Sandra (QA)** | Bagaimana cara automated testing memverifikasi kedua mode tanpa memanipulasi jam mesin runner CI? | Disediakan query parameter `?ramadhan=true` dan `?ramadhan=false` yang langsung terbaca di client/server, sehingga test case E2E/Playwright/Unit dapat menguji kedua cabang secara instan. |
| **Angel (UI/UX)** | Bagaimana tampilan visual Hero Card saat non-Ramadhan agar tetap estetik dan tidak terkesan kosong? | Desain default Hero Card mempertahankan kartu gradien hijau zamrud (Emerald) dengan aksen emas yang halus. Spotlight difokuskan pada kartu tunggal "Sholat Berikutnya" yang lebih lapang dengan waktu hisab besar, ribbon 5 sholat, dan countdown aktif. |
| **Fiqry (Frontend)** | Apakah penentuan Ramadhan dilakukan di Client Component atau Server Component untuk mencegah hydration mismatch? | State evaluasi dasar dihitung secara konsisten. Untuk query param di Client Component, gunakan hook `useSearchParams()` yang aman atau fallback aman saat SSR agar tidak ada mismatch flash. |
| **Bryan (Backend/DevOps)** | Apakah memerlukan endpoint REST khusus untuk menyajikan konfigurasi seasonal? | Tidak (YAGNI). Komputasi hisab menggunakan `Intl.DateTimeFormat` Umm al-Qura yang sudah tersedia di runtime JavaScript modern tanpa beban latensi jaringan atau dependensi server. |

---

## 6. Execution Tracks (Fork-Join Concurrency)

- **Track A (UI/UX - Angel):**
  - Menyiapkan spesifikasi desain visual kartu beranda default (non-Ramadhan) dan perbandingannya dengan mode Ramadhan pada `workflow/TASK-002-ramadhan-conditional-activation/02_design_angel.md`.
- **Track B (Frontend Build - Fiqry):**
  - Mengimplementasikan helper `getRamadhanState`, refactor `src/components/shared/header.tsx`, dan modifikasi `src/app/_components/home-hero.tsx` pada `workflow/TASK-002-ramadhan-conditional-activation/03_build_frontend.md`.
- **Track C (QA & Security - Sandra):**
  - Menyusun test plan matriks (default mode, Ramadhan mode, query override, hydration check, zero warning) pada `workflow/TASK-002-ramadhan-conditional-activation/04_qa_sandra.md`.
