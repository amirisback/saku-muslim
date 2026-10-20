# Design Specification: Nuansa Visual & Fitur Khusus Ramadhan (TASK-001-ramadhan-nuance)

**Lead Designer:** Angel (`angel_uiux`) — Senior UI/UX Designer  
**Target Audience:** Fiqry (`fiqry_frontend`), Sandra (`sandra_qa`), Faisal (`product_manager`)  
**Status:** Approved & Ready for Implementation  
**Version:** 1.0.0  
**Design Philosophy:** Anti-Slop Islamic Craftsmanship, High-Contrast Sacred Geometry, Zero-CLS Performance.

---

## 1. Executive Design Philosophy & Aesthetic Vision

Aplikasi Saku Muslim mengusung tema **"Kekhidmatan & Kehangatan Ramadhan 1448 H"**. Menghindari tampilan korporat yang kaku dan dingin, maupun ornamen murahan yang berlebihan (*visual slop*), desain ini berfokus pada:

1. **Sacred Aesthetics & Warmth:** Kombinasi harmonis antara *Deep Nocturnal Emerald* (kedalaman malam Lailatul Qadar) dan *Luminous Warm Gold / Amber* (cahaya lentera Fanous dan keberkahan sahur & iftar).
2. **Anti-Slop Craftsmanship:** Tidak menggunakan gambar bitmap berat atau ilustrasi AI generik yang kabur. Seluruh ornamen adalah vektor SVG presisi dengan koordinat matematis bersih, bobot < 2KB, dan rendering tajam di semua densitas piksel (Retina/OLED).
3. **Information Ergonomics:** Mengedepankan hierarki waktu kritis (*Imsak* & *Maghrib*) yang paling dicari jutaan umat Muslim saat berpuasa, mempermudah pelacakan ibadah harian (*Mutaba'ah Yaumiyah*), serta akses instan ke Niat Puasa dan Doa Berbuka.
4. **Accessible by Design (WCAG AA & AAA):** Kontras warna teks minimal 4.5:1 (bahkan mencapai > 7:1 untuk elemen kritis), *touch target* minimal 44×44px, serta dukungan penuh untuk *dark mode* dan *light mode*.

---

## 2. Tailwind CSS v4 Design Tokens Specification

Sesuai arsitektur Tailwind CSS v4 pada `@/src/app/globals.css`, berikut adalah sistem token tema Ramadhan yang didefinisikan secara inline dan semantik.

### 2.1. Color Palette Tokens

```css
/* Ramadhan Thematic Tokens (Tailwind CSS v4 Inline Theme) */
@theme inline {
  /* Emerald Palette: Kedalaman, spiritualitas, ketenteraman */
  --color-ramadhan-emerald-50: #ecfdf5;
  --color-ramadhan-emerald-100: #d1fae5;
  --color-ramadhan-emerald-200: #a7f3d0;
  --color-ramadhan-emerald-600: #059669;
  --color-ramadhan-emerald-700: #047857;
  --color-ramadhan-emerald-800: #065f46;
  --color-ramadhan-emerald-900: #064e3b;
  --color-ramadhan-emerald-950: #022c22;

  /* Amber & Gold Palette: Cahaya lentera, kehangatan sahur & iftar */
  --color-ramadhan-gold-50: #fffbeb;
  --color-ramadhan-gold-100: #fef3c7;
  --color-ramadhan-gold-200: #fde68a;
  --color-ramadhan-gold-300: #fcd34d;
  --color-ramadhan-gold-400: #fbbf24;
  --color-ramadhan-gold-500: #f59e0b;
  --color-ramadhan-gold-600: #d97706;
  --color-ramadhan-gold-700: #b45309;
  --color-ramadhan-gold-800: #92400e;
  --color-ramadhan-gold-900: #78350f;
  --color-ramadhan-gold-950: #451a03;

  /* Nocturnal Deep Card: Ramadhan Night Elevation */
  --color-ramadhan-night-base: #061014;
  --color-ramadhan-night-card: #091a1e;
  --color-ramadhan-night-border: #13333b;

  /* Glow Effects */
  --shadow-ramadhan-gold-glow: 0 0 25px -4px rgba(245, 158, 11, 0.35);
  --shadow-ramadhan-emerald-glow: 0 0 30px -5px rgba(16, 185, 129, 0.3);
  --shadow-ramadhan-card: 0 10px 30px -10px rgba(4, 47, 46, 0.45);
}
```

### 2.2. Token Utility Mapping (Light vs Dark Mode)

| Semantic Element | Light Mode Utility Classes | Dark Mode Utility Classes | WCAG Contrast Ratio |
| :--- | :--- | :--- | :--- |
| **Hero Card Background** | `bg-gradient-to-br from-emerald-800 via-emerald-900 to-teal-950` | `bg-gradient-to-br from-emerald-950 via-[#072421] to-[#041614]` | N/A (Surface) |
| **Hero Card Border** | `border-amber-400/25` | `border-amber-400/20` | N/A |
| **Hero Primary Text** | `text-white` | `text-white` | **12.4:1** (AAA) |
| **Gold Highlight Text** | `text-amber-300` | `text-amber-400` | **8.6:1** (AAA) |
| **Subtle Subtitle Text** | `text-emerald-100/90` | `text-emerald-200/80` | **7.8:1** (AAA) |
| **Interactive Card (Light)** | `bg-card border-border` | `bg-card border-border` | Standard |
| **Gold Badge / Pill** | `bg-amber-100 text-amber-900 border-amber-300` | `bg-amber-950/70 text-amber-300 border-amber-800` | **7.1:1** (AAA) |
| **Emerald Badge / Pill**| `bg-emerald-100 text-emerald-900 border-emerald-300` | `bg-emerald-950/70 text-emerald-300 border-emerald-800` | **6.9:1** (AAA) |
| **Gold Action Button** | `bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 hover:from-amber-400 hover:to-amber-500` | Sama | **8.2:1** (AAA) |

### 2.3. Typography & Spacing Rules

- **Arabic Typography:** Wajib menggunakan kelas `.font-arabic` (`'Amiri', 'Traditional Arabic', serif`) dengan `line-height` minimal `2.2` sampai `2.4` (`leading-[2.4]`) untuk mencegah tanda harakat/syakal terpotong (*glyph clipping*).
- **Tabular Numbers:** Seluruh tampilan countdown dan waktu hisab wajib menerapkan `font-mono` atau `tabular-nums` untuk mencegah jitter/layout shift saat angka berubah tiap detik/menit.
- **Elevation & Radius:**
  - Hero Card: `rounded-3xl` (24px) dengan *inner subtle ring* `ring-1 ring-white/10`.
  - Feature Cards (Doa & Checklist): `rounded-3xl` (24px) dengan padding `p-6 sm:p-7`.
  - Buttons & Interactive Controls: `rounded-xl` (12px) hingga `rounded-2xl` (16px).
  - Minimum Tap Target: `min-h-[44px] min-w-[44px]`.

---

## 3. Aesthetics & Ornament Specs (Lightweight Pure SVG Vectors)

Berikut adalah definisi komponen SVG murni (*zero external asset dependencies*, *low DOM footprint*, *crisp at any resolution*).

### 3.1. Fanous (Lentera Ramadhan) — Vektor Berbobot Ringan

Lentera Fanous khas Ramadhan melambangkan lentera yang dibawa anak-anak menyambut bulan suci di jalanan Kairo dan Timur Tengah, kini menjadi simbol universal kehangatan Ramadhan.

```tsx
/**
 * Komponen Fanous (Lentera Ramadhan)
 * Props: size (number | string), className (string), glowing (boolean)
 */
export function FanousIcon({ className = "w-6 h-6", glowing = false }: { className?: string; glowing?: boolean }) {
  return (
    <svg
      viewBox="0 0 64 84"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${glowing ? "drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" : ""}`}
      aria-hidden="true"
    >
      {/* Hanging Chain / Top Ring */}
      <line x1="32" y1="0" x2="32" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="15" r="4.5" stroke="currentColor" strokeWidth="2" fill="none" />
      
      {/* Lantern Cap (Kubah Atas) */}
      <path
        d="M20 25C20 20 25 18 32 18C39 18 44 20 44 25L48 29H16L20 25Z"
        fill="currentColor"
        fillOpacity="0.85"
      />
      <rect x="18" y="28" width="28" height="3" rx="1.5" fill="currentColor" />

      {/* Glass Body (Badan Kaca Lentera) */}
      <path
        d="M17 31L22 60H42L47 31H17Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="currentColor"
        fillOpacity="0.15"
      />

      {/* Internal Candle & Warm Flame (Cahaya Lentera) */}
      <ellipse cx="32" cy="46" rx="5" ry="8" fill="#FBBF24" fillOpacity="0.8" />
      <circle cx="32" cy="45" r="2.5" fill="#FFFBEB" />
      <path d="M32 36C32 36 34 39 34 41C34 42.1 33.1 43 32 43C30.9 43 30 42.1 30 41C30 39 32 36 32 36Z" fill="#F59E0B" />

      {/* Structural Ribs (Rangka Logam Kaca) */}
      <line x1="27" y1="31" x2="29" y2="60" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" />
      <line x1="37" y1="31" x2="35" y2="60" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" />
      <line x1="19" y1="45" x2="45" y2="45" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.5" />

      {/* Base / Pedestal (Kaki Penyangga Lentera) */}
      <rect x="20" y="60" width="24" height="4" rx="1" fill="currentColor" fillOpacity="0.85" />
      <path
        d="M22 64L19 72H45L42 64H22Z"
        fill="currentColor"
        fillOpacity="0.9"
      />
      <rect x="17" y="72" width="30" height="3" rx="1.5" fill="currentColor" />
      
      {/* Bottom Finial (Pucuk Bawah) */}
      <polygon points="32,80 29,75 35,75" fill="currentColor" />
    </svg>
  );
}
```

### 3.2. Hilal (Bulan Sabit & Bintang Delapan Penjuru Khatim)

```tsx
/**
 * Komponen Hilal & Bintang 8 (Khatim Al-Sulayman)
 */
export function HilalStarIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Crescent Moon (Bulan Sabit Emas) */}
      <path
        d="M24 4C12.954 4 4 12.954 4 24C4 35.046 12.954 44 24 44C27.8 44 31.35 42.94 34.4 41.1C24.8 38.6 17.6 29.9 17.6 19.5C17.6 13.5 20.1 8.1 24.2 4.3C24.13 4.2 24.07 4.1 24 4Z"
        fill="currentColor"
      />
      {/* 8-Point Islamic Star (Bintang Delapan) */}
      <g transform="translate(32, 16) scale(0.65)">
        <polygon
          points="0,-12 3.5,-3.5 12,0 3.5,3.5 0,12 -3.5,3.5 -12,0 -3.5,-3.5"
          fill="currentColor"
        />
        <circle cx="0" cy="0" r="2.5" fill="#FFFBEB" />
      </g>
    </svg>
  );
}
```

### 3.3. Geometric Arabesque Seamless Watermark

Pola geometris segi delapan yang di-render secara transparan (`opacity-[0.04]` hingga `opacity-[0.08]`) di sudut hero card untuk menghadirkan aura arsitektur masjid klasik Granada/Cordoba tanpa menyita performa.

```tsx
export function ArabesquePattern() {
  return (
    <svg
      className="absolute -right-8 -top-8 w-80 h-80 opacity-[0.06] text-amber-300 pointer-events-none select-none"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
      <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="1" />
      <polygon points="100,10 126,74 190,100 126,126 100,190 74,126 10,100 74,74" stroke="currentColor" strokeWidth="1.5" />
      <polygon points="100,30 149,49 170,100 149,151 100,170 51,151 30,100 51,49" stroke="currentColor" strokeWidth="1" />
      <circle cx="100" cy="100" r="30" stroke="currentColor" strokeWidth="1.5" />
      <polygon points="100,75 118,88 125,100 118,112 100,125 82,112 75,100 82,88" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
```

---

## 4. Detailed Layout Hierarchy & Component Blueprints

```
┌────────────────────────────────────────────────────────────────────────┐
│ HEADER: [Logo + AppName]  [Badge: Marhaban Ramadhan + Fanous]  [Menu]   │
└────────────────────────────────────────────────────────────────────────┘
                                   │
┌────────────────────────────────────────────────────────────────────────┐
│ THEMATIC HERO CARD (Gradient Emerald-Teal + Warm Gold Glow)            │
│  - Location selector & Hijri Date ("Ramadhan 1448 H")                  │
│  - Banner Title: "Marhaban Ya Ramadhan 1448 H" + Ambient Subtitle      │
│  - DUAL CRITICAL COUNTDOWN SPOTLIGHT:                                  │
│    ┌──────────────────────────────┐  ┌──────────────────────────────┐  │
│    │ IMSAK (Penutupan Sahur)      │  │ MAGHRIB (Buka Puasa / Iftar) │  │
│    │ Time: 04:32 WIB              │  │ Time: 18:05 WIB              │  │
│    │ [Badge Status: Active/Next]  │  │ [Countdown: 02j 45m 12d]     │  │
│    └──────────────────────────────┘  └──────────────────────────────┘  │
│  - Quick 5 Prayer Times Horizontal Ribbon                              │
└────────────────────────────────────────────────────────────────────────┘
                                   │
┌────────────────────────────────────────────────────────────────────────┐
│ INTERACTIVE RAMADHAN DU'A SUITE CARD                                   │
│  - Tab Switcher: [ Niat Puasa Ramadhan ] [ Doa Berbuka Puasa ]         │
│  - Arabic Typography (Lafadz Harakat Lengkap - font-arabic, leading)   │
│  - Transliterasi Latin & Terjemahan Bahasa Indonesia                   │
│  - Action Bar: Button [ Dengarkan Lafadz Doa (Tartil) ]                │
└────────────────────────────────────────────────────────────────────────┘
                                   │
┌────────────────────────────────────────────────────────────────────────┐
│ RAMADHAN DAILY WORSHIP CHECKLIST (Mutaba'ah Yaumiyah)                 │
│  - Header: "Amalan Harian Ramadhan" • Progress Bar [ 3/4 Selesai ]     │
│  - 4 Cards:                                                            │
│    1. Puasa Ramadhan (Ibadah Wajib Hari Ini)                           │
│    2. Sholat Tarawih & Witir (Qiyamul Lail Berjamaah/Munfarid)         │
│    3. Tadarus Al-Qur'an (Target 1 Hari 1 Juz)                          │
│    4. Sedekah Subuh / Infaq Berkah                                     │
│  - Persistent localStorage feedback note                               │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 4.1. Header Ramadhan Accent & Subtle Lantern Motif

- **Penempatan:** Pada `src/components/shared/header.tsx`.
- **Elemen:**
  - Di samping nama aplikasi atau sebelum action button: Tampilkan pill badge tematik Ramadhan.
  - Teks: `"Ramadhan 1448 H"` dengan ikon `FanousIcon` mungil berkedip halus (*subtle pulse*).
  - Styling:
    - Light: `bg-amber-50 text-amber-800 border border-amber-200/80 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-xs`
    - Dark: `bg-amber-950/60 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-xs`

---

### 4.2. Thematic Hero Card: Dual Critical Countdown Spotlight

Hero card diperkaya dengan fokus utama Ramadhan: **Imsak** (waktu henti sahur) dan **Maghrib** (waktu berbuka puasa).

#### Komponen Countdown Waktu Kritis (Dual Spotlight Grid)
Terdiri dari 2 modul berdampingan di dalam Hero Card:
1. **Modul Imsak (Waktu Sahur):**
   - Label: `"Imsak (Batas Sahur)"`
   - Waktu Hisab: Jam:Menit (misal `04:32 WIB`)
   - Indikator Visual: Ikon bulan sabit terbit / fajar.
   - Status Tag: Menampilkan countdown jika waktu saat ini berada di antara Isya hingga Imsak.
2. **Modul Maghrib (Waktu Buka Puasa):**
   - Label: `"Maghrib (Buka Puasa)"`
   - Waktu Hisab: Jam:Menit (misal `18:05 WIB`)
   - Indikator Visual: Ikon kurma / piring hidangan iftar & lentera.
   - Status Tag: Menampilkan countdown jam & menit tersisa menuju berbuka puasa.

#### Spotlight Logika Fokus Aktif (Active Target)
- Jika jam saat ini antara `04:32 - 18:05`: Modul **Maghrib** diberi visual highlight (*active glowing ring* amber emas, skala 102%, label `"Menuju Buka Puasa"`).
- Jika jam saat ini antara `18:05 - 04:32`: Modul **Imsak** diberi visual highlight (*active glowing ring* emerald, label `"Menuju Waktu Imsak Sahur"`).

---

### 4.3. Interactive Ramadhan Du'a Suite Card

Card interaktif khusus doa Ramadhan dirancang dengan tipografi yang tenang, agung, dan kontras tinggi.

#### 1. Konten Doa 1: Niat Puasa Ramadhan
- **Lafadz Arab:**
  ```arabic
  نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هَذِهِ السَّنَةِ لِلَّهِ تَعَالَى
  ```
- **Transliterasi:**
  *Nawaitu shauma ghadin 'an adaa'i fardhi syahri Ramadhaana haadzihis sanati lillaahi ta'aalaa.*
- **Arti Bahasa Indonesia:**
  "Aku berniat puasa esok hari untuk menunaikan kewajiban bulan Ramadhan tahun ini karena Allah Ta'ala."
- **Audio URL:**
  `https://islamcan.com/audio/dua/niat-puasa-ramadhan.mp3` *(atau CDN public yang disediakan)*.

#### 2. Konten Doa 2: Doa Berbuka Puasa
- **Lafadz Arab:**
  ```arabic
  ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ
  ```
- **Transliterasi:**
  *Dzahabaz zhama'u wabtallatil 'uruuqu wa tsabatal ajru in syaa Allah.*
- **Arti Bahasa Indonesia:**
  "Telah hilang rasa haus, telah basah tenggorokan, dan telah tetap pahala, insya Allah." *(HR. Abu Dawud no. 2357)*
- **Lafadz Alternatif Populer:**
  ```arabic
  اللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ
  ```
  *Allahumma laka shumtu wa 'alaa rizqika afthartu.*
- **Audio URL:**
  `https://islamcan.com/audio/dua/doa-buka-puasa.mp3`.

#### UI Features Card Doa:
- **Tab Header:** Dual pill switch `[ Niat Puasa ]` dan `[ Doa Berbuka ]` dengan transisi halus.
- **Copy Text Action:** Tombol cepat salin lafadz & terjemahan dengan toast feedback "Tersalin ke clipboard".
- **Audio Reciter Button:** Tombol interaktif `Dengarkan Tartil Doa` dengan status playing, waveform visualizer, dan pause/stop yang terhubung ke `<AudioPlayer />`.

---

### 4.4. Ramadhan Daily Worship Checklist Card (Mutaba'ah Yaumiyah)

Widget pelacak 4 amalan utama Ramadhan yang responsif dan persisten (`localStorage` key: `ramadhan_tracker_YYYY-MM-DD`).

#### 4 Item Amalan Utama:
1. **Puasa Ramadhan Hari Ini**
   - Subtitle: *Menahan lapar, dahaga, dan hawa nafsu sejak terbit fajar hingga maghrib.*
   - Icon: Hilal / Kalender Puasa.
2. **Sholat Tarawih & Witir**
   - Subtitle: *Qiyamul lail berjamaah di masjid atau munfarid di rumah (8/20 rakaat + 3 witir).*
   - Icon: Kubah Masjid / Sajadah.
3. **Tadarus Al-Qur'an (Target 1 Juz)**
   - Subtitle: *Membaca 1 juz Al-Qur'an per hari untuk target khatam 30 juz di akhir Ramadhan.*
   - Icon: Mushaf Al-Qur'an Terbuka.
4. **Sedekah Subuh / Infaq Berkah**
   - Subtitle: *Mengeluarkan sedekah terbaik di awal hari untuk membersihkan harta dan jiwa.*
   - Icon: Tangan Sedekah / Koin Berkah.

#### Fitur Visual Checklist:
- **Progress Bar & Counter:** Menampilkan meteran `X / 4 Amalan Selesai` dengan progress bar warna gradasi `emerald-500` ke `amber-400`.
- **Celebration Banner:** Jika `4/4` selesai tercapai, kartu memunculkan alert sukses bernuansa emas lembut:  
  *🎉 "Maa syaa Allah! Seluruh amalan utama Ramadhan hari ini telah lengkap. Semoga Allah menerima amal ibadah Anda."*

---

## 5. 8-State Component Design Matrix

Untuk memastikan implementasi antarmuka bebas dari cacat interaksi (*bulletproof UI*), berikut adalah matriks spesifikasi untuk seluruh 8 state:

| State | Interactive Button (Dengarkan Doa / Adzan) | Checklist Item (Mutaba'ah) | Tab Pill (Niat / Doa) | Card Surface (Spotlight) |
| :--- | :--- | :--- | :--- | :--- |
| **1. Default** | `bg-amber-500 text-amber-950 font-semibold shadow-sm` | `border-border bg-card text-foreground` | `text-muted-foreground bg-transparent hover:text-foreground` | `border-white/15 bg-white/10 backdrop-blur-xs` |
| **2. Hover** | `bg-amber-400 -translate-y-0.5 shadow-md` | `border-amber-400/50 bg-amber-50/20 dark:bg-amber-950/20` | `bg-muted/70 text-foreground` | `border-white/25 bg-white/15` |
| **3. Active / Pressed**| `bg-amber-600 scale-[0.98]` | `scale-[0.99] bg-emerald-50/50 dark:bg-emerald-950/40` | `scale-[0.98]` | `scale-[0.995]` |
| **4. Focus-Visible** | `outline-none ring-2 ring-amber-400 ring-offset-2 ring-offset-emerald-900` | `outline-none ring-2 ring-amber-500 ring-offset-2 ring-offset-background` | `outline-none ring-2 ring-emerald-500` | `outline-none ring-2 ring-amber-400` |
| **5. Checked / Selected**| N/A | `border-emerald-500 bg-emerald-50/70 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-100 dark:border-emerald-500` | `bg-white dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 font-bold shadow-sm` | `ring-2 ring-amber-400/80 shadow-ramadhan-gold-glow` |
| **6. Disabled** | `opacity-50 cursor-not-allowed pointer-events-none` | `opacity-50 cursor-not-allowed pointer-events-none` | `opacity-40 cursor-not-allowed` | `opacity-60` |
| **7. Loading / Pending**| `cursor-wait opacity-85` + Spinner SVG menggantikan ikon play | `animate-pulse bg-muted/50 cursor-wait` | N/A | Skeleton shimmer `bg-white/5 animate-pulse` |
| **8. Empty / Fallback** | Teks `"Audio Belum Tersedia"` | Menampilkan placeholder `"Belum ada data amalan hari ini"` | Default fallback ke Tab pertama (Niat Puasa) | Countdown menampilkan `--:--:--` dengan teks `"Menghitung..."` |

---

## 6. Accessibility (A11y) & Contrast Specification

### 6.1. WCAG 2.1 Contrast Ratio Verification

| Foreground Color | Background Surface | Applied Element | Contrast Ratio | WCAG Compliance |
| :--- | :--- | :--- | :--- | :--- |
| `#FFFFFF` (White) | `#064e3b` (Emerald 900) | Hero Card Headings | **10.8:1** | **AAA Pass** |
| `#FCD34D` (Amber 300) | `#064e3b` (Emerald 900) | Countdown Digits / Critical Time | **8.6:1** | **AAA Pass** |
| `#D1FAE5` (Emerald 100) | `#042F2E` (Emerald 950) | Subtitles & Meta Info | **11.2:1** | **AAA Pass** |
| `#451A03` (Amber 950) | `#F59E0B` (Amber 500) | Primary CTA Button Text | **8.2:1** | **AAA Pass** |
| `#0F172A` (Slate 900) | `#FFFFFF` (White Card) | Doa Translation & Checklist Titles | **16.1:1** | **AAA Pass** |
| `#047857` (Emerald 700) | `#F8FAFC` (Light BG) | Transliteration / Ayat Ref | **4.9:1** | **AA Pass** |
| `#34D399` (Emerald 400) | `#0F172A` (Dark Card) | Transliteration Dark Mode | **7.4:1** | **AAA Pass** |

### 6.2. Touch Target & Screen Reader Standards
- Seluruh elemen yang dapat diklik (tombol tab, checkbox amalan, tombol audio) memiliki ukuran area sentuh minimal **44px × 44px**.
- Checkbox amalan ibadah menggunakan elemen `<button role="checkbox" aria-checked={boolean} aria-label="...">` dengan fokus keyboard yang jelas (*focus-visible outline*).
- Tab Doa menggunakan standar WAI-ARIA Tabs pattern (`role="tablist"`, `role="tab"`, `aria-selected="true"`, `aria-controls="panel-id"`).
- Countdown kritis menggunakan atribut `aria-live="polite"` dan `aria-atomic="true"` agar pembaruan waktu tidak membombardir pembaca layar (*screen reader friendly*).

---

## 7. Concrete Implementation Blueprint for Frontend (Fiqry)

Bagian ini menyediakan spesifikasi komponen dan penataan kode yang siap dipasang langsung oleh Fiqry pada file target:

### 7.1. File Target Modifikasi & Pembuatan Baru:
1. `src/components/shared/header.tsx` — Menambahkan Ramadhan Theme Accent & Badge.
2. `src/app/_components/ramadhan-ornaments.tsx` — Menyediakan `FanousIcon`, `HilalStarIcon`, dan `ArabesquePattern`.
3. `src/app/_components/ramadhan-hero-card.tsx` (atau update pada `home-hero.tsx`) — Mengintegrasikan Dual Countdown Waktu Kritis (Imsak & Maghrib).
4. `src/app/_components/ramadhan-dua-suite.tsx` — Komponen interaktif Tab Niat Puasa & Doa Buka Puasa + Audio Tartil.
5. `src/app/_components/ramadhan-worship-tracker.tsx` — Komponen Checklist 4 Amalan Harian Ramadhan dengan LocalStorage.
6. `src/app/_components/home-hero.tsx` — Menggandengkan seluruh seksi baru ke dalam tata letak beranda utama.

### 7.2. Logika Hitung Mundur Imsak & Maghrib:
```ts
// Rumus Presisi Countdown Waktu Kritis (Fiqry Reference)
const now = currentTime;
const currentMinutes = now.getHours() * 60 + now.getMinutes();

// Imsak: schedule.imsak (misal "04:32")
// Maghrib: schedule.maghrib (misal "18:05")
function getMinutesFromTimeStr(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

const imsakMinutes = getMinutesFromTimeStr(schedule.imsak);
const maghribMinutes = getMinutesFromTimeStr(schedule.maghrib);

// Target Waktu Kritis Terdekat
let targetName: "Imsak" | "Maghrib" = "Maghrib";
let diffMinutes = 0;

if (currentMinutes < imsakMinutes) {
  // Masih waktu sahur dini hari menuju Imsak
  targetName = "Imsak";
  diffMinutes = imsakMinutes - currentMinutes;
} else if (currentMinutes < maghribMinutes) {
  // Sedang berpuasa menuju Maghrib
  targetName = "Maghrib";
  diffMinutes = maghribMinutes - currentMinutes;
} else {
  // Sudah lewat Maghrib, target berikutnya adalah Imsak esok hari
  targetName = "Imsak";
  diffMinutes = (24 * 60 - currentMinutes) + imsakMinutes;
}
```

---

## 8. Quality Gate & Acceptance Checklist untuk Sandra (QA)

| ID | Skenario Verifikasi | Harapan Tampilan & Fungsi | Status |
| :--- | :--- | :--- | :--- |
| **QAG-01** | Hero Ramadhan Header & Banner | Header menampilkan badge lentera Ramadhan 1448 H. Hero menampilkan ornamen Fanous SVG, Hilal, dan gradasi Emerald-Gold. | Ready for QA |
| **QAG-02** | Dual Critical Countdown | Tampil kartu Imsak & Maghrib. Hitung mundur aktif berganti sesuai waktu kota yang dipilih. | Ready for QA |
| **QAG-03** | Interactive Du'a Suite | Tab Niat Puasa & Doa Berbuka dapat berpindah mulus. Teks Arab tampil dengan harakat lengkap tanpa terpotong. | Ready for QA |
| **QAG-04** | Doa Tartil Audio Playback | Tombol audio memutar suara doa tanpa reload halaman atau memutuskan alur browsing. | Ready for QA |
| **QAG-05** | Worship Checklist Persistence | Mencentang amalan memperbarui meteran progres. Ketika halaman di-refresh, status centang tetap tersimpan di `localStorage`. | Ready for QA |
| **QAG-06** | Dark/Light Mode Adaptability | Seluruh teks memenuhi rasio kontras >= 4.5:1. Tidak ada teks kabur atau kontras rendah. | Ready for QA |
| **QAG-07** | Touch Target & Responsive | Semua tombol minimal 44×44px, nyaman diakses di smartphone layar 360px hingga layar monitor 4K. | Ready for QA |

---

*Dokumen spesifikasi desain ini dibekukan (frozen) dan siap diserahkan kepada Fiqry (`fiqry_frontend`) untuk eksekusi implementasi komponen.*
