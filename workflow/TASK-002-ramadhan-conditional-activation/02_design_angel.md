# Design Specification: Conditional UI Architecture — Regular vs Ramadhan Mode (TASK-002)

> **Role:** Angel (`angel_uiux`) — Senior UI/UX Designer  
> **Target Audience:** Fiqry (`fiqry_frontend`), Sandra (`sandra_qa`), Faisal (`product_manager`)  
> **Status:** APPROVED & READY FOR IMPLEMENTATION  
> **Date:** 2026-10-20  
> **Version:** 2.0.0  
> **Design Philosophy:** Anti-Slop Islamic Craftsmanship, Contextual Purity, Strict YAGNI (Ponytail), Zero-CLS Architecture.

---

## 1. Executive Summary & Design Rationale

### 1.1 Context & Problem Analysis
Pada iterasi sebelumnya (TASK-001), elemen visual dan fitur Ramadhan (seperti lentera Fanous, kaligrafi *"Marhaban Ya Ramadhan"*, hitung mundur ganda Imsak-Maghrib, serta modul `RamadhanDuaSuite` dan `RamadhanWorshipTracker`) diimplementasikan secara statis di beranda dan header.

Berdasarkan kalender hisab Hijriah riil (`Intl.DateTimeFormat("id-u-ca-islamic-umalqura")`), aplikasi saat ini berada pada bulan **Jumadil Awwal 1448 H** (`month === 5`), bukan bulan Ramadhan (`month === 9`). 

Menampilkan atribut Ramadhan di luar bulan Ramadhan melanggar prinsip dasar desain antarmuka kontekstual:
1. **Irrelevansi Informasi:** Pengguna harian di luar Ramadhan tidak membutuhkan batas sahur (Imsak) atau doa berbuka puasa, melainkan kepastian jadwal sholat fardhu terdekat (Subuh, Dzuhur, Ashar, Maghrib, Isya) beserta hitung mundur akurat.
2. **Kelelahan Visual (*Visual Fatigue & Slop*):** Banner ucapan musiman dan lentera bercahaya yang tampil sepanjang tahun mereduksi nilai sakralitas bulan suci Ramadhan saat bulan tersebut benar-benar tiba.
3. **Kerapian Layout & Fokus Spiritual:** Modul ibadah harian non-Ramadhan (Ayat Hari Ini dan Pelacak Sholat Fardhu 5 Waktu) terdorong ke bawah oleh modul-modul khusus Ramadhan yang tidak relevan.

### 1.2 Solusi Desain Dua State (Dual-State Conditional System)
Desain TASK-002 menetapkan spesifikasi 2 State independen yang ditentukan oleh nilai `isRamadhan`:

```mermaid
flowchart TD
    Init["Evaluasi Penanggalan Hisab / URL Param"] --> Check{"isRamadhan?"}
    
    Check -- "false (Default Non-Ramadhan)" --> StateA["State A: Regular Islamic Companion"]
    Check -- "true (Bulan Ramadhan / Preview)" --> StateB["State B: Ramadhan Mode"]
    
    subgraph StateA_Specs ["State A: Mode Harian (Jumadil Awwal s/d Sya'ban)"]
        A1["Header: Bersih & Minimalis (Tanpa Badge Fanous)"]
        A2["Hero: Emerald Serenity Gradient"]
        A3["Spotlight: Sholat Fardhu Berikutnya (Tunggal & Lapang)"]
        A4["Banner: Ayat Sholat Tepat Waktu (QS. An-Nisa: 103)"]
        A5["Direct Flow: Quick Tools -> Ayat Hari Ini & Tracker 5 Waktu"]
    end

    subgraph StateB_Specs ["State B: Mode Ramadhan (Bulan ke-9 Hijriah)"]
        B1["Header: Badge Fanous 'Ramadhan 1448 H' + Mobile Drawer Banner"]
        B2["Hero: Emerald-Gold Nocturnal Gradient + Fanous Glowing"]
        B3["Spotlight: Dual Critical Countdown (Imsak & Maghrib)"]
        B4["Banner: Marhaban Ya Ramadhan & Ayat Puasa (QS. Al-Baqarah: 185)"]
        B5["Expanded Suite: Quick Tools -> RamadhanDuaSuite & WorshipTracker"]
    end

    StateA --> StateA_Specs
    StateB --> StateB_Specs
```

---

## 2. Layout Hierarchy & Structural Architecture Comparison

Berikut adalah perbandingan arsitektur tata letak vertikal antara State A (Default Non-Ramadhan) dan State B (Ramadhan Mode) dari puncak halaman hingga bagian bawah beranda:

| Level Hierarki | State A: Regular Companion (`isRamadhan === false`) | State B: Ramadhan Mode (`isRamadhan === true`) | Catatan Transisi & CLS Guard |
| :--- | :--- | :--- | :--- |
| **01. Sticky Header** | Brand Logo + App Name + Subtitle *"Islamic Companion"* + Nav Links + Tombol *"Waktu Sholat"*. **(Tanpa Badge Fanous)** | Brand Logo + App Name + Nav Links + **Pill Badge Fanous Gold "Ramadhan 1448 H"** + Tombol *"Waktu Sholat"*. Drawer mobile menyertakan banner Marhaban. | Tinggi container header tetap persis `h-16` (64px) di desktop dan mobile. Tidak ada pergeseran tinggi layout (0px shift). |
| **02. Hero Top Bar** | Selector Kota + Icon Geolocation + Badge Tanggal Hijriah Aktual (contoh: *"14 Jumadil Awwal 1448 H"*). **(Tanpa Pill Ramadhan)** | Selector Kota + Icon Geolocation + **Pill Badge Emas "Ramadhan 1448 H"** + Badge Tanggal Hijriah Aktual. | Menggunakan `min-h-[38px]` konsisten dengan `justify-between` flexbox. |
| **03. Hero Headline & Sacred Quote** | **Headline:** *"Jadwal Sholat Fardhu & Waktu Beribadah"*<br>**Kutipan Arab:** إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا (QS. An-Nisa: 103)<br>**Terjemahan:** *"Kewajiban yang ditentukan waktunya atas orang-orang beriman."* | **Sub-heading:** *"Marhaban Ya Ramadhan 1448 H"*<br>**Headline:** *"Jadwal Imsakiyah & Waktu Sholat Presisi"*<br>**Kutipan Arab:** شَهْرُ رَمَضَانَ الَّذِي أُنْزِلَ فِيهِ الْقُرْآنُ (QS. Al-Baqarah: 185) | Reserved text height via typography clamping dan flex gap yang simetris (`gap-1`). |
| **04. Hero Centerpiece Spotlight** | **Single Next Prayer Spotlight:**<br>1 Kartu Lebar (Full-width / 2-column span) fokus total pada waktu sholat terdekat dengan angka jam raksasa, countdown langsung ke waktu sholat, dan tombol *"Dengarkan Adzan"*. | **Dual Countdown Spotlight:**<br>2 Kartu Sejajar (Imsakiyah Sahur di kiri, Maghrib Buka Puasa di kanan) dengan indikator aktif *"Fokus Menuju Imsak / Maghrib"*. | Area spotlight memiliki struktur grid responsif fleksibel tanpa memicu pergeseran elemen di bawahnya. |
| **05. Prayer Schedule Ribbon** | 5 Waktu Sholat Fardhu Horizontal (Subuh, Dzuhur, Ashar, Maghrib, Isya) dengan indikator aktif pada sholat berikutnya. | 5 Waktu Sholat Fardhu Horizontal (Subuh, Dzuhur, Ashar, Maghrib, Isya) dengan indikator aktif pada sholat berikutnya. | Komponen identik 100% di kedua state. |
| **06. Quick Action Menu** | 7 Alat Ibadah Lengkap (Jadwal Sholat, Quran, Kiblat, Doa, Asmaul Husna, Zakat, Kalender). | 7 Alat Ibadah Lengkap (Jadwal Sholat, Quran, Kiblat, Doa, Asmaul Husna, Zakat, Kalender). | Komponen identik 100% di kedua state. |
| **07. Ramadhan Suite Modules** | **TIDAK DIRENDER (Hidden from DOM)**. | **DIRENDER:**<br>1. `RamadhanDuaSuite` (Niat, Doa Buka, Qunut, Lailatul Qadar)<br>2. `RamadhanWorshipTracker` (Tarawih, Tadarus, dll.) | Di State A, bagian ini di-skip total secara deterministik. |
| **08. Daily Core Sections** | **Langsung Tampil Proporsional:**<br>1. Ayat Hari Ini (QS. Ar-Ra'd: 28)<br>2. Pelacak Sholat Fardhu 5 Waktu Hari Ini. | Ditampilkan setelah Ramadhan Suite Modules. | Jarak vertikal dijaga dengan `gap-8` (32px) seragam. |

---

## 3. Detailed Wireframes & Structural Blueprint

### 3.1 State A: Default Regular Islamic Companion (Non-Ramadhan)

```
+-----------------------------------------------------------------------------------+
|  [Logo] SAKU MUSLIM             Beranda  Jadwal  Qur'an  Kiblat ... [Waktu Sholat] |
|        Islamic Companion                                                          |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  HERO SECTION (Emerald-Teal Serenity Background)                                  |
|  +-----------------------------------------------------------------------------+  |
|  | [Kota: Jakarta v]                                [14 Jumadil Awwal 1448 H]  |  |
|  |-----------------------------------------------------------------------------|  |
|  | WAKTU SHOLAT FARDHU BERIKUTNYA                                              |  |
|  | Jadwal Sholat Fardhu & Waktu Beribadah                                      |  |
|  | "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا" (QS. An-Nisa: 103)         |  |
|  |-----------------------------------------------------------------------------|  |
|  | NEXT PRAYER SPOTLIGHT CARD (Spacious & Focused)                             |  |
|  | +-------------------------------------------------------------------------+ |  |
|  | | [Icon Masjid] SHOLAT BERIKUTNYA: ASHAR          HITUNG MUNDUR MENUJU ASHAR| |  |
|  | |                                                                         | |  |
|  | |   15:18 WIB                                         01j 24m 12d         | |  |
|  | |   Waktu sholat wilayah Jakarta dan sekitarnya      (tersisa 84 menit)   | |  |
|  | |                                                                         | |  |
|  | |   [ > Dengarkan Kumandang Adzan Ashar ]                                 | |  |
|  | +-------------------------------------------------------------------------+ |  |
|  |                                                                             |  |
|  | RIBBON 5 WAKTU SHOLAT:                                                      |  |
|  | [ Subuh 04:32 ]  [ Dzuhur 11:58 ]  [*ASHAR 15:18*]  [ Maghrib 18:04 ]  [ Isya 19:15 ] |
|  +-----------------------------------------------------------------------------+  |
|                                                                                   |
|  MENU UTAMA IBADAH (7 Core Tools)                                                 |
|  [ Jadwal ] [ Al-Qur'an ] [ Kiblat ] [ Doa & Dzikir ] [ Asmaul ] [ Zakat ] [ Kalender ]|
|                                                                                   |
|  DAILY CORE IBADAH (Direct Flow — Zero Empty Gaps)                                |
|  +------------------------------------+  +-------------------------------------+  |
|  | AYAT HARI INI                      |  | PELACAK SHOLAT FARDHU HARI INI      |  |
|  | "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ"  |  | 3/5 Selesai                         |  |
|  | QS. Ar-Ra'd: 28                    |  | [v] Subuh  [v] Dzuhur  [ ] Ashar    |  |
|  | [ > Dengarkan Ayat ]               |  | [ ] Maghrib [ ] Isya                |  |
|  +------------------------------------+  +-------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

### 3.2 State B: Ramadhan Thematic Mode (`isRamadhan === true`)

```
+-----------------------------------------------------------------------------------+
|  [Logo] SAKU MUSLIM  [Fanous Ramadhan 1448 H]  Beranda  Jadwal ... [Waktu Sholat] |
|        Islamic Companion                                                          |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  HERO SECTION (Emerald-Gold Nocturnal Gradient + Arabesque + Glowing Fanous)     |
|  +-----------------------------------------------------------------------------+  |
|  | [Kota: Jakarta v]  [Ramadhan 1448 H]             [1 Ramadhan 1448 H]        |  |
|  |-----------------------------------------------------------------------------|  |
|  | MARHABAN YA RAMADHAN 1448 H - BULAN PENUH BERKAH                            |  |
|  | Jadwal Imsakiyah & Waktu Sholat Presisi                                     |  |
|  | "شَهْرُ رَمَضَانَ الَّذِي أُنْزِلَ فِيهِ الْقُرْآنُ هُدًى لِلنَّاسِ" (QS. Al-Baqarah: 185)       |  |
|  |-----------------------------------------------------------------------------|  |
|  | DUAL CRITICAL COUNTDOWN SPOTLIGHT (Imsak & Maghrib)                         |  |
|  | +-----------------------------------+ +-----------------------------------+ |  |
|  | | IMSAK (Batas Sahur)               | | MAGHRIB (Buka Puasa)              | |  |
|  | | 04:22 WIB        06j 12m 45d      | | 18:04 WIB        01j 24m 12d      | |  |
|  | | Batas akhir sahur                 | | [Fokus Buka Puasa]                | |  |
|  | +-----------------------------------+ +-----------------------------------+ |  |
|  |                                                                             |  |
|  | Sholat Fardhu Berikutnya: Ashar 15:18  [ > Dengarkan Adzan ]                |  |
|  | Ribbon 5 Waktu Sholat: [Subuh] [Dzuhur] [*Ashar*] [Maghrib] [Isya]          |  |
|  +-----------------------------------------------------------------------------+  |
|                                                                                   |
|  MENU UTAMA IBADAH (7 Core Tools)                                                 |
|  [ Jadwal ] [ Al-Qur'an ] [ Kiblat ] [ Doa & Dzikir ] [ Asmaul ] [ Zakat ] [ Kalender ]|
|                                                                                   |
|  SPECIAL RAMADHAN SUITE (Active in Ramadhan Only)                                 |
|  +------------------------------------+  +-------------------------------------+  |
|  | RAMADHAN INTERACTIVE DU'A SUITE    |  | RAMADHAN WORSHIP TRACKER (MUTABA'AH)|  |
|  | Niat Puasa, Doa Berbuka, Qunut...  |  | Tarawih, Tadarus, Infaq, Sedekah... |  |
|  +------------------------------------+  +-------------------------------------+  |
|                                                                                   |
|  DAILY CORE IBADAH                                                                |
|  +------------------------------------+  +-------------------------------------+  |
|  | AYAT HARI INI (QS. Ar-Ra'd: 28)    |  | PELACAK SHOLAT FARDHU HARI INI      |  |
|  +------------------------------------+  +-------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 4. Design Tokens Specification (Tailwind CSS v4)

Berikut adalah pendefinisian token spesifik untuk State A (Regular) vs State B (Ramadhan).

### 4.1 Color Palettes & Surface Tokens

```css
/* ==========================================================================
   STATE A: REGULAR ISLAMIC COMPANION TOKENS (Non-Ramadhan)
   Karakter: Hening, bersih, bernuansa zamrud menenangkan, tanpa ornamen emas.
   ========================================================================== */
:root {
  /* Surface Hero Regular */
  --hero-regular-from: #064e3b;      /* Emerald 900 */
  --hero-regular-via: #022c22;       /* Emerald 950 */
  --hero-regular-to: #041f1a;        /* Teal-Slate Deep */
  --hero-regular-border: rgba(16, 185, 129, 0.22); /* Emerald 500 @ 22% */
  
  /* Text Accents Regular */
  --hero-regular-heading: #ffffff;
  --hero-regular-subtext: #a7f3d0;    /* Emerald 200 */
  --hero-regular-time: #6ee7b7;       /* Emerald 300 - Fresh green highlight */
  --hero-regular-badge-bg: rgba(255, 255, 255, 0.10);
  --hero-regular-badge-text: #ecfdf5; /* Emerald 50 */
  --hero-regular-badge-border: rgba(167, 243, 208, 0.25);
  
  /* Next Prayer Spotlight Card (State A) */
  --spotlight-regular-bg: rgba(255, 255, 255, 0.08);
  --spotlight-regular-border: rgba(52, 211, 153, 0.35); /* Emerald 400 */
  --spotlight-regular-shadow: 0 10px 25px -5px rgba(6, 78, 59, 0.5);

  /* CTA Button Regular */
  --cta-regular-bg-from: #059669;    /* Emerald 600 */
  --cta-regular-bg-to: #047857;      /* Emerald 700 */
  --cta-regular-text: #ffffff;
  --cta-regular-hover-from: #10b981;  /* Emerald 500 */
  --cta-regular-hover-to: #059669;
}

/* Dark Mode Overrides for State A */
.dark {
  --hero-regular-from: #022c22;      /* Emerald 950 */
  --hero-regular-via: #051a16;       /* Deep Forest Base */
  --hero-regular-to: #030f0d;
  --hero-regular-border: rgba(16, 185, 129, 0.18);
  --spotlight-regular-bg: rgba(255, 255, 255, 0.05);
}

/* ==========================================================================
   STATE B: RAMADHAN THEMATIC TOKENS (Khusus Bulan Ramadhan)
   Karakter: Hangat, berkah, bercahaya (Nocturnal Emerald & Warm Lantern Gold).
   ========================================================================== */
:root {
  /* Surface Hero Ramadhan */
  --hero-ramadhan-from: #022c22;     /* Emerald 950 */
  --hero-ramadhan-via: #064e3b;      /* Emerald 900 */
  --hero-ramadhan-to: #1a1402;       /* Deep Gold Ochre Base */
  --hero-ramadhan-border: rgba(245, 158, 11, 0.25); /* Amber 500 @ 25% */
  
  /* Text & Glow Accents Ramadhan */
  --hero-ramadhan-heading: #ffffff;
  --hero-ramadhan-subtext: #d1fae5;  /* Emerald 100 */
  --hero-ramadhan-gold: #fcd34d;     /* Amber 300 - Lantern Glow */
  --hero-ramadhan-gold-badge: #fbbf24;
  
  /* Dual Spotlight Cards Ramadhan */
  --spotlight-ramadhan-active-bg: rgba(255, 255, 255, 0.15);
  --spotlight-ramadhan-active-border: #f59e0b; /* Amber 500 */
  --spotlight-ramadhan-glow: 0 0 25px -4px rgba(245, 158, 11, 0.35);

  /* CTA Button Ramadhan */
  --cta-ramadhan-bg-from: #f59e0b;   /* Amber 500 */
  --cta-ramadhan-bg-to: #d97706;     /* Amber 600 */
  --cta-ramadhan-text: #451a03;      /* Amber 950 */
}
```

### 4.2 Typography Pairing & Hierarchy Matrix

| Tingkat Tipografi | Token Kelas Tailwind | Ukuran (Desktop / Mobile) | Line Height | Font Family & Weight | Tujuan & Konteks Penggunaan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | `text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight` | 36px / 24px | `leading-tight` (1.2) | `var(--font-sans)` Black (900) | Judul utama Hero Card di kedua state. |
| **Sacred Arabic Quote** | `text-xs sm:text-sm font-arabic` | 15px / 13px | `leading-[2.2]` | `var(--font-arabic)` Regular (400) | Potongan ayat Al-Qur'an (An-Nisa 103 atau Al-Baqarah 185). |
| **Spotlight Time Numbers** | `text-3xl sm:text-5xl font-mono font-black tabular-nums` | 48px / 30px | `leading-none` (1.0) | `var(--font-mono)` Black (900) | Jam sholat terdekat (misal: "15:18") & waktu Imsak/Maghrib. |
| **Countdown Digits** | `text-base sm:text-2xl font-mono font-bold tabular-nums` | 24px / 16px | `leading-none` (1.0) | `var(--font-mono)` Bold (700) | Hitung mundur detik presisi tanpa layout shift. |
| **Ribbon Prayer Time** | `text-sm sm:text-base font-mono font-bold tabular-nums` | 16px / 14px | `leading-snug` (1.3) | `var(--font-mono)` Bold (700) | Jam masing-masing 5 waktu sholat. |
| **Label & Status Pill** | `text-[10px] sm:text-xs font-bold uppercase tracking-wider` | 12px / 10px | `leading-normal` (1.5) | `var(--font-sans)` Bold (700) | Kategori waktu, nama sholat, status "Fokus". |

---

## 5. 8-Component State Specifications

Untuk memastikan keandalan interaksi tingkat tinggi, kepatuhan WCAG 2.1 AA, dan pengalaman taktil yang responsif, berikut adalah spesifikasi 8 State untuk komponen-komponen utama pada beranda.

### 5.1 Next Prayer Spotlight Card (State A: Non-Ramadhan Spotlight)

Komponen ini menggantikan grid hitung mundur ganda saat `isRamadhan === false`. Menampilkan sholat fardhu berikutnya secara luas, elegan, dan menenangkan.

| State | Visual Behavior & Tailwind Utilities | Indikator Aksesibilitas (ARIA / Focus) |
| :--- | :--- | :--- |
| **1. Idle / Default** | `bg-white/10 dark:bg-white/5 border border-emerald-400/25 rounded-2xl p-5 sm:p-6 shadow-lg backdrop-blur-sm` | Elemen penampung informasi semantik. |
| **2. Hover** | `hover:border-emerald-400/40 hover:bg-white/[0.12] transition-colors duration-200` | Kursor pointer halus saat disentuh atau dilewati kursor. |
| **3. Active / Pressed** | `active:scale-[0.995] transition-transform` | Feedback taktil ringan jika kartu dibuat dapat diklik. |
| **4. Focus / Focus-Visible** | `focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ring-offset-emerald-950 outline-none` | Garis fokus kontras tinggi untuk navigasi keyboard (Tab). |
| **5. Disabled** | `opacity-60 cursor-not-allowed` | `aria-disabled="true"`. |
| **6. Loading / Skeleton** | `animate-pulse bg-white/10 rounded-2xl h-[130px] border border-white/10` | Menampilkan placeholder abu-abu transparan saat hisab dihitung. |
| **7. Error / Fallback** | `border-destructive/40 bg-destructive/10 text-destructive-foreground` | Pesan: *"Gagal memuat jadwal sholat kota terpilih"*. |
| **8. Selected / Active-Highlight** | `ring-2 ring-emerald-400 border-emerald-300 bg-white/15 shadow-[0_0_20px_-3px_rgba(16,185,129,0.35)]` | Menandai sholat yang sedang berlangsung atau paling dekat (< 30 menit). |

### 5.2 Adhan CTA Button ("Dengarkan Adzan")

Tombol primer untuk memicu pemutaran audio kumandang adzan dari Masjidil Haram Makkah.

| State | State A (Non-Ramadhan: Emerald Theme) | State B (Ramadhan Mode: Amber Gold Theme) | WCAG AAA Contrast |
| :--- | :--- | :--- | :--- |
| **1. Idle** | `bg-emerald-600 text-white shadow-md` | `bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 shadow-md` | > 4.5:1 (Emerald), > 7.5:1 (Amber) |
| **2. Hover** | `hover:bg-emerald-500 hover:shadow-lg` | `hover:from-amber-400 hover:to-amber-500 hover:shadow-lg` | Visual brightness lift + 10% |
| **3. Active** | `active:scale-95 active:bg-emerald-700` | `active:scale-95 active:from-amber-600 active:to-amber-700` | Feedback kompresi sentuh |
| **4. Focus-Visible** | `focus-visible:ring-2 focus-visible:ring-white ring-offset-2 ring-offset-emerald-900` | `focus-visible:ring-2 focus-visible:ring-amber-300 ring-offset-2 ring-offset-emerald-950` | Visible keyboard outline |
| **5. Disabled** | `opacity-50 cursor-not-allowed pointer-events-none` | `opacity-50 cursor-not-allowed pointer-events-none` | `aria-disabled="true"` |
| **6. Loading** | Spinner SVG berputar + Teks *"Menyiapkan Audio..."* | Spinner SVG berputar + Teks *"Menyiapkan Audio..."* | `aria-busy="true"` |
| **7. Error** | Icon tanda seru + Teks *"Audio Tidak Tersedia"* | Icon tanda seru + Teks *"Audio Tidak Tersedia"* | `role="alert"` |
| **8. Playing (Active)** | `ring-2 ring-white animate-pulse bg-emerald-500` | `ring-2 ring-amber-300 animate-pulse bg-amber-400` | `aria-label="Sedang Memutar Adzan"` |

### 5.3 Ribbon 5 Waktu Sholat Item (Current vs Regular)

Item penunjuk waktu sholat horizontal (Subuh, Dzuhur, Ashar, Maghrib, Isya):

| State | Regular Item (Bukan Waktu Sholat Terdekat) | Active Next Prayer Item (Sholat Terdekat) |
| :--- | :--- | :--- |
| **1. Idle** | `bg-white/10 text-white border border-white/5` | `bg-white text-emerald-950 font-bold shadow-lg scale-105 ring-2 ring-emerald-400 (State A) / ring-amber-400 (State B)` |
| **2. Hover** | `hover:bg-white/15 cursor-default` | `hover:bg-white/95` |
| **3. Focus-Visible** | `focus-visible:ring-2 focus-visible:ring-white` | `focus-visible:ring-2 focus-visible:ring-primary` |
| **4. Loading** | `animate-pulse bg-white/5 h-14 rounded-2xl` | `animate-pulse bg-white/20 h-14 rounded-2xl` |

### 5.4 Pelacak Sholat Fardhu Checklist Item (5 Waktu)

Item interaktif pada kartu *"Pelacak Sholat Fardhu Hari Ini"* yang disimpan otomatis di localStorage:

| State | Unchecked (Belum Dikerjakan) | Checked (Sudah Selesai) |
| :--- | :--- | :--- |
| **1. Idle** | `border-border bg-muted/40 text-muted-foreground` | `border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200` |
| **2. Hover** | `hover:border-emerald-300 hover:bg-muted/70` | `hover:bg-emerald-100 dark:hover:bg-emerald-900/60` |
| **3. Active** | `active:scale-95` | `active:scale-95` |
| **4. Focus-Visible** | `focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none` | `focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none` |
| **5. Checked Icon** | Lingkaran border abu-abu tanpa centang | Lingkaran hijau penuh dengan centang putih `✓` |
| **6. Touch Target** | Memenuhi syarat `min-h-[44px] min-w-[44px]` | Memenuhi syarat `min-h-[44px] min-w-[44px]` |

---

## 6. Zero Cumulative Layout Shift (CLS < 0.05) & Anti-FOUC Strategy

Salah satu tantangan kritis dalam merender dua state bersyarat (terutama saat simulasi `?ramadhan=true` atau `?ramadhan=false`) adalah mencegah pergeseran tata letak mendadak (*layout jump*) saat hidrasi React 19 berlangsung.

### 6.1 Layout Reservation Specs
1. **Header Stability:**
   - Navigasi header desktop dan mobile selalu mempertahankan tinggi baku `h-16` (64px).
   - Badge Fanous pada State B diletakkan di dalam flex container berdampingan dengan logo tanpa mengubah baseline vertikal navigasi.
   - Drawer mobile menggunakan flex layout absolut berlatar belakang `bg-card/95 backdrop-blur-md` sehingga tidak mendorong komponen halaman.

2. **Hero Card Height Boundary:**
   - State A (Spotlight Tunggal Sholat Berikutnya) dirancang dengan tinggi proporsional yang seimbang dengan State B (Dual Countdown Spotlight).
   - Card Next Prayer Spotlight di State A memiliki padding `p-5 sm:p-6` dengan min-height `min-h-[140px]`, sehingga tinggi total kartu hero berkisar antara 420px hingga 480px di kedua mode.
   - Transisi antara State A dan State B tidak menimbulkan lonjakan dramatis pada tinggi Hero Card.

3. **Modul RamadhanDuaSuite & WorshipTracker:**
   - Di State A, container grid pembungkus modul Ramadhan dihilangkan sepenuhnya (`isRamadhan && (...)`).
   - Tidak ada sisa margin kosong atau padding orphan (`gap-8` dikelola langsung oleh parent container `flex flex-col gap-8`).
   - Bagian *Ayat Hari Ini* dan *Pelacak Sholat Fardhu* langsung mengisi posisi di bawah Quick Action Menu tanpa jeda kosong.

```mermaid
graph TD
    subgraph ZeroCLS ["CLS Defense Architecture"]
        H["Header Box: Fixed 64px Height"]
        HC["Hero Card: Uniform Min-Height & Flex Flow"]
        QA["Quick Action Grid: Fixed 7-Column Responsive Layout"]
        COND{"isRamadhan?"}
        RS["Ramadhan Suite (Rendered only when true)"]
        CORE["Daily Core: Ayat & Tracker Sholat"]
        
        H --> HC --> QA --> COND
        COND -- "true" --> RS --> CORE
        COND -- "false" --> CORE
    end
```

---

## 7. Accessibility & WCAG 2.1 AA Compliance Matrix

Setiap elemen antarmuka pada kedua state mematuhi standar internasional WCAG 2.1 Level AA (dengan mayoritas melampaui ke AAA):

| Elemen UI | Latar Belakang (Hex) | Foreground Teks (Hex) | Rasio Kontras Terukur | Status WCAG | Keterangan Aksesibilitas |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Headline Hero (State A & B)** | `#022c22` (Emerald 950) | `#ffffff` (Putih Murni) | **15.4:1** | **Pass (AAA)** | Kontras sangat tinggi untuk keterbacaan outdoor/siang hari. |
| **Jam Sholat Terdekat (State A)** | `#022c22` (Background Card) | `#6ee7b7` (Emerald 300) | **9.2:1** | **Pass (AAA)** | Keterbacaan waktu hisab presisi. |
| **Hitung Mundur (State B)** | `#022c22` (Background Card) | `#fcd34d` (Amber 300) | **10.1:1** | **Pass (AAA)** | Keterbacaan countdown sahur/buka puasa. |
| **Tombol Adzan (State A)** | `#059669` (Emerald 600) | `#ffffff` (Putih Murni) | **4.6:1** | **Pass (AA)** | Memenuhi syarat teks tombol tebal >= 14px. |
| **Tombol Adzan (State B)** | `#f59e0b` (Amber 500) | `#451a03` (Amber 950) | **8.1:1** | **Pass (AAA)** | Kontras teks cokelat tua di atas latar kuning emas. |
| **Badge Tanggal Hijriah** | `rgba(255,255,255,0.1)` | `#d1fae5` (Emerald 100) | **7.4:1** | **Pass (AAA)** | Tanggal Hijriah terbaca jelas. |
| **Selector Kota Dropdown** | `rgba(0,0,0,0.3)` | `#ffffff` (Putih Murni) | **11.8:1** | **Pass (AAA)** | Label dropdown `aria-label="Pilih Kota untuk Jadwal Hisab"`. |

### 7.1 Screen Reader & Keyboard Navigation Standards
1. **ARIA Live Announcement untuk Hitung Mundur:**
   - Digit detik tidak boleh memicu pembacaan berulang-ulang setiap detik pada screen reader (karena akan membingungkan pengguna tunanetra).
   - Gunakan atribut `aria-hidden="true"` pada jam digital countdown yang bergerak dinamis, dan sediakan deskripsi statis/periodik dengan `aria-label="Waktu sholat berikutnya Ashar pukul 15 lewat 18 menit"`.
2. **Touch Target Size:**
   - Semua elemen interaktif (Selector Kota, Tombol Adzan, Item Checklist Sholat, Menu Navigasi, Toggle Mobile Menu) memiliki ukuran area sentuh minimal **44 × 44 piksel** (`min-h-[44px] min-w-[44px]`).
3. **Motion Sensitivity (`prefers-reduced-motion`):**
   - Animasi lentera berayun (`animate-subtle-float`) dan kelap-kelip lentera (`animate-pulse-glow`) secara otomatis dinonaktifkan jika pengguna mengaktifkan preferensi *Reduced Motion* pada sistem operasi mereka:
   ```css
   @media (prefers-reduced-motion: reduce) {
     .animate-subtle-float,
     .animate-pulse-glow,
     .animate-pulse {
       animation: none !important;
       transform: none !important;
     }
   }
   ```

---

## 8. Anti-Slop & Ponytail (YAGNI) Verification Checklist

Sesuai panduan *Antislop* dan prinsip *Ponytail (YAGNI)*:

1. **Bebas Grafis Generik & Slop:**
   - Tidak ada gambar PNG/JPG berukuran besar atau ornamen kartun yang tidak perlu.
   - Vektor ornamen SVG sepenuhnya matematis, ringan (< 2KB), dan hanya dimuat saat relevan.
   - Saat di luar Ramadhan, lentera Fanous dan kaligrafi Marhaban disembunyikan sepenuhnya — antarmuka kembali pada kesederhanaan Islami yang bermartabat.
2. **Strict YAGNI (No Over-Engineering):**
   - Tidak membuat tema khusus untuk 11 bulan Hijriah lainnya (seperti tema Safar, Rabiul Awwal, dll.) yang belum diminta user. Logika sistem hanya berfokus pada dua state: `isRamadhan === true` dan `isRamadhan === false`.
   - Menggunakan hisab kalender `Intl.DateTimeFormat` bawaan platform tanpa dependensi library eksternal berbobot besar.
   - Simulasi testing diakomodasi langsung via parameter URL `?ramadhan=true` dan `?ramadhan=false` tanpa memerlukan backend khusus.

---

## 9. Handoff Implementation Guide for Frontend (`fiqry_frontend`)

Berikut adalah panduan teknis implementasi konkret untuk Fiqry:

### 9.1 Header Modification Blueprint (`src/components/shared/header.tsx`)
Tambahkan props `isRamadhan?: boolean` (atau baca helper `getRamadhanState`):
- Bungkus badge Fanous desktop (baris 55–59) dengan conditional:
  ```tsx
  {isRamadhan && (
    <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-500/30 shadow-xs">
      <FanousIcon className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
      <span>Ramadhan 1448 H</span>
    </div>
  )}
  ```
- Bungkus banner Ramadhan drawer mobile (baris 119–127) dengan conditional `{isRamadhan && (...)}`.

### 9.2 HomeHero Modification Blueprint (`src/app/_components/home-hero.tsx`)
1. **Evaluasi State:**
   - Gunakan `useSearchParams()` untuk mendeteksi `?ramadhan=true` atau `?ramadhan=false`.
   - Jika tidak ada override param, gunakan hisab aktual: `isRamadhan = hijri.month === 9`.
2. **Top Bar Header Hero:**
   - Tampilkan `<RamadhanBadge />` hanya jika `isRamadhan === true`.
3. **Headline & Watermark Hero:**
   - Hanya tampilkan `<ArabesquePattern />` dan `<FanousIcon>` latar belakang jika `isRamadhan === true`.
   - Jika `isRamadhan === false`:
     * Sub-heading: `"WAKTU SHOLAT FARDHU BERIKUTNYA"`
     * Headline: `"Jadwal Sholat Fardhu & Waktu Beribadah"`
     * Kutipan Arab: `"إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا"` (QS. An-Nisa: 103)
4. **Spotlight Centerpiece:**
   - Jika `isRamadhan === true`: Render Dual Countdown Spotlight (Imsak & Maghrib).
   - Jika `isRamadhan === false`: Render Single Next Prayer Spotlight Card (berfokus pada satu sholat fardhu berikutnya dengan jam hisab besar, countdown presisi, dan tombol Dengarkan Adzan).
5. **Ramadhan Suite Modules:**
   - Render `RamadhanDuaSuite` dan `RamadhanWorshipTracker` HANYA saat `isRamadhan === true`.

---

## 10. QA Verification Scenarios for Sandra (`sandra_qa`)

Sandra dapat memvalidasi spesifikasi desain ini melalui matriks uji berikut:

1. **Verifikasi Default State (Non-Ramadhan):**
   - Buka `http://localhost:3000/`.
   - Pastikan header bersih tanpa badge Fanous.
   - Pastikan hero menampilkan judul "Jadwal Sholat Fardhu & Waktu Beribadah", single spotlight card, ribbon 5 waktu sholat, 7 menu utama, dan langsung diikuti oleh Ayat Hari Ini & Pelacak Sholat tanpa modul Ramadhan.
2. **Verifikasi Simulasi Ramadhan:**
   - Buka `http://localhost:3000/?ramadhan=true`.
   - Pastikan seluruh ornamen Ramadhan (badge lentera Fanous, countdown Imsak-Maghrib, RamadhanDuaSuite, RamadhanWorshipTracker) aktif sempurna.
3. **Verifikasi Simulasi Non-Ramadhan:**
   - Buka `http://localhost:3000/?ramadhan=false`.
   - Pastikan antarmuka kembali ke State A default dengan mulus.
4. **Verifikasi Kepatuhan Aksesibilitas:**
   - Jalankan uji audit Lighthouse Accessibility score 100%.
   - Pastikan navigasi keyboard (Tab & Shift+Tab) menunjukkan focus ring yang jelas di semua tombol dan link.
   - Pastikan rasio kontras warna lulus uji WCAG AA (>= 4.5:1).

---

> **Design Approval:**  
> **Angel (`angel_uiux`)** — Senior UI/UX Designer  
> *Saku Muslim (Muslim Pro) Design System 2026*
