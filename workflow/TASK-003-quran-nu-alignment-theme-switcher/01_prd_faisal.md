# TASK-003: Al-Qur'an NU Online Alignment & Global Theme Switcher - Product Requirement Document (PRD)

> **Author:** Faisal (Product Manager & Business Analyst)  
> **Status:** FROZEN  
> **Date:** 2026-10-21  
> **Target Release:** Saku Muslim Web v1.2  

---

## 1. Business Objective & Context

### Problem Statement
1. **Critical Verse Truncation Bug in Reader (`/quran/[id]`):** Mushaf detail reader currently only provides full verses for Surah 1 (Al-Fatihah) and Surah 67 (Al-Mulk). All remaining 112 surahs fall back to two dummy/placeholder verses in `quran-verses.ts`. This breaks the fundamental value proposition of Saku Muslim as a trusted digital Quran companion.
2. **Directory Gaps compared to NU Online (`https://quran.nu.or.id`):** Current `/quran` lacks Juz categorization (1 to 30), chronological revelation order ("Urutan Turun"), quick popular surah filters (Yasin, Al-Kahf, Al-Mulk, Al-Waqiah, Ar-Rahman, Ayat Kursi), sort toggles, and coordinate-based smart search (e.g. "2:255" or "36:1").
3. **Reader UX Missing Sticky Control Bar:** Current reader lacks quick surah jumping, direct verse selector, tafsir per ayat, and top sticky navigation matching NU Online standard.
4. **Missing Theme Switcher in Global Navigation:** Dark and light modes are configured in Tailwind v4 and `next-themes`, but the navigation header lacks an accessible theme switcher trigger for desktop and mobile drawer users.

### User Persona
- **Daily Reciter (Santri / Muslim Urban):** Reads daily surahs (Al-Kahf on Friday, Al-Mulk at night, Yasin) and expects instant access, smooth verse jumping, complete audio tartil, and eye-friendly dark mode during night recitation.
- **Student of the Quran:** Studies specific verses by coordinate (e.g. Al-Baqarah 255), searches by revelation order (Makkiyah vs Madaniyah chronology), and reads concise Indonesian tafsir per verse.

### Impact Metric
- 100% of 114 Surahs display complete verses (6,236 total verses across 30 Juz) with zero dummy placeholders.
- Quran directory search and filter response time < 50ms (client-side indexed search).
- Reader first contentful paint (FCP) < 800ms with ISR and stale-while-revalidate client caching.
- Zero theme flicker (FOUC) on page reload across light, dark, and system modes.

---

## 2. Scope & Boundaries

### In Scope
1. **Quran Directory Enhancements (`/quran`):**
   - Three navigation tabs matching NU Online:
     - **Surah:** 114 Surahs in standard mushaf order.
     - **Juz:** 30 Juz with start and end markers (surah and ayah coordinate).
     - **Urutan Turun:** 114 Surahs ordered by nuzul (revelation sequence from Al-'Alaq to An-Nasr).
   - Quick pills for popular surahs: Yasin, Al-Waqi'ah, Al-Mulk, Al-Kahfi, Ar-Rahman, and Ayat Kursi (Al-Baqarah 255 direct jump).
   - Smart search engine supporting:
     - Surah name in Latin (e.g. "Al-Baqarah", "Yasin")
     - Surah translation name (e.g. "Sapi Betina")
     - Surah number (e.g. "18", "36")
     - Direct verse coordinate search (e.g. "2:255", "36:1", "18:10") with instant link to jump.
   - Sort toggle: Default (1 to 114), Alphabetical A to Z, and Reverse Z to A.
   - Modern cards displaying surah number badge, Latin name, Arabic calligraphy name, Indonesian translation, total verses, and revelation type badge.

2. **Quran Detail Reader Upgrade (`/quran/[id]`):**
   - Dynamic verse data fetching for all 114 Surahs from Kemenag / equran.id API v2:
     - Arabic script with full harakat (Uthmani/IndoPak standard).
     - Standard Indonesian transliteration.
     - Official Kemenag RI translation.
     - Audio tartil per ayah (Misyari Rasyid Al-Afasy).
     - Audio full surah player.
     - Ringkas Tafsir per ayah (collapsible / toggleable).
   - Sticky top bar matching NU Online:
     - Back to directory button ("Daftar Surah").
     - Previous Surah button (`<`).
     - Surah dropdown / modal selector (1 to 114).
     - Verse dropdown / modal jump selector (1 to N).
     - Next Surah button (`>`).
   - Surah Header metadata: Type (Makkiyah/Madaniyah), Juz placement, total ayah, Arabic name, Latin name, Indonesian meaning, and full surah audio player trigger.
   - Bismillah banner displayed on all surahs except Surah At-Taubah (Surah 9).
   - Action toolbar per verse: Play ayah audio, Copy Arabic + translation text, Toggle Tafsir ringkas, and Share ayah.
   - Bottom navigation footer: Previous Surah & Next Surah buttons.

3. **Global Theme Switcher:**
   - Integrate `ThemeSwitcher` component into `src/components/shared/header.tsx`.
   - Desktop view: Placed next to "Waktu Sholat" pill in header actions.
   - Mobile view: Placed inside the mobile drawer menu with high tap-target accessibility.
   - Seamless hydration: Zero Flash of Unstyled Content (FOUC), fully synced with `next-themes` and CSS variables in `globals.css`.

### Out of Scope (Ponytail / YAGNI)
- External third-party user accounts or cloud bookmarks synchronization (rely strictly on local client `localStorage`).
- Audio speed modification or complex multi-qari streaming downloads (keep single premier qari Syeikh Mishary Rashid Alafasy).
- Word-by-word grammar breakdown or morphological tree analysis (deferred to future advanced study roadmap).
- Complex custom font file uploaders (use system fonts and established `font-arabic` stack).

---

## 3. Acceptance Criteria (AC Matrix)

### AC-01: Directory Navigation Tabs & NU Online Categorization
```gherkin
Scenario: Switching between Surah, Juz, and Urutan Turun tabs
  Given user navigates to "/quran"
  When user clicks the "Juz" tab
  Then the directory renders 30 cards representing Juz 1 to Juz 30
  And each Juz card displays the starting verse and ending verse coordinates
  When user clicks the "Urutan Turun" tab
  Then the directory renders 114 surahs ordered by revelation order (starting with Surah Al-'Alaq as #1)
  When user clicks the "Surah" tab
  Then the directory restores standard Mushaf sequence (Surah 1 Al-Fatihah to Surah 114 An-Nas)
```

### AC-02: Smart Search & Popular Surah Pills with Coordinate Jump
```gherkin
Scenario: Searching by verse coordinate
  Given user is on "/quran"
  When user types "2:255" in the smart search field
  Then the search result displays a direct jump card for "Surah Al-Baqarah Ayat 255 (Ayat Kursi)"
  When user clicks on the result
  Then user is redirected to "/quran/2#255" and the page scrolls smoothly to Ayah 255

Scenario: Clicking a popular surah pill
  Given user is on "/quran"
  When user clicks the "Yasin" pill
  Then user is navigated directly to "/quran/36"
```

### AC-03: Full 114 Surahs Complete Verses & Tafsir Integration
```gherkin
Scenario: Loading any surah beyond 1 and 67
  Given user navigates to "/quran/2" (Al-Baqarah)
  When the page finishes loading
  Then the reader displays exactly 286 verses with valid Arabic text, transliteration, and Indonesian translation
  And no dummy placeholder verses are shown
  And each verse includes a collapsible "Tafsir" toggle button
  When user clicks "Tafsir" on Ayah 1
  Then the concise Indonesian tafsir text for Ayah 1 expands smoothly
```

### AC-04: Sticky Reader Top Bar & Navigation Controls
```gherkin
Scenario: Interacting with sticky navigation bar in surah reader
  Given user is reading "/quran/18" (Al-Kahf)
  When user scrolls down past the header banner
  Then a sticky navigation bar remains fixed at the top of the viewport
  And the bar displays "Daftar Surah", previous surah button (Al-Isra), Surah selector dropdown, Ayah jump dropdown (1-110), and next surah button (Maryam)
  When user selects Ayah "50" in the Ayah selector
  Then the viewport immediately scrolls to Ayah 50 with visual highlight
```

### AC-05: Global Theme Switcher Integration
```gherkin
Scenario: Toggling theme from header on desktop and mobile
  Given user is on any page of Saku Muslim
  When user clicks the "Dark" theme button in the header
  Then the HTML document tag applies class "dark"
  And background switches to "#090d16" and text switches to "#f8fafc" without page reload
  And the preference persists in localStorage across browser refreshes
  When user accesses the mobile drawer menu on a viewport < 1024px
  Then the ThemeSwitcher is visible and functional inside the drawer
```

---

## 4. Contract Freeze Specifications (Phase 2 Alignment)

### 4.1 Client and Internal API Contract

#### Surah Item Model (Directory)
```typescript
export interface SurahDirectoryItem {
  number: number;
  nameArabic: string;
  nameLatin: string;
  nameIndonesian: string;
  numberOfAyahs: number;
  revelationType: "Makkiyah" | "Madaniyah";
  revelationOrder: number; // 1 to 114
  juzStart: number;
  juzEnd: number;
}
```

#### Juz Item Model (Directory)
```typescript
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
```

#### Surah Detail & Verses Contract
```typescript
export interface AyahDetail {
  numberInSurah: number;
  numberInQuran: number;
  arabic: string;
  transliteration: string;
  translation: string;
  audioUrl: string; // Mishary Rashid Alafasy 128kbps mp3
  tafsirShort?: string; // Kemenag ringkas
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
  bismillahPre: boolean; // false for Surah 9 (At-Taubah), true for 1-8, 10-114
  ayahs: AyahDetail[];
  previousSurah: { number: number; nameLatin: string } | null;
  nextSurah: { number: number; nameLatin: string } | null;
}
```

### 4.2 Data Fetching & Caching Strategy
- **API Source:** Primary: Internal proxy / cached layer calling Kemenag / equran.id API v2 (`https://equran.id/api/v2/surat/${number}` and `https://equran.id/api/v2/tafsir/${number}`).
- **Static Pre-Rendering & ISR:** Server components pre-render with `stale-while-revalidate` (SWR) cache headers (1 day revalidation).
- **Client Fallback:** If upstream API experiences network timeout, client displays a structured retry banner with offline graceful degradation.
- **Local Storage Cache:** Client caches fetched surahs in browser IndexedDB / CacheStorage so previously read surahs load instantly offline.

---

## 5. Cross-Role Alignment Log

| Role | Question / Constraint | Resolution / Binding Decision |
|---|---|---|
| **Sandra (QA)** | How will test automation verify 114 surahs without flaky network timeouts? | Playwright E2E and Vitest unit tests will verify representative surahs (1, 2, 9 without Bismillah, 18, 36, 114) and validate mock responses for API error handling. |
| **Bryan (Backend & API)** | Direct client fetching to external API can hit rate limits or CORS issues. | Implement Next.js route handlers (`/api/quran/[id]`) with in-memory / response caching and security guard validations. |
| **Angel (UI/UX)** | NU Online has distinct sticky header tabs and badge styles. How to match while keeping Saku Muslim identity? | Adopt NU Online functional hierarchy (Surah/Juz/Urutan Turun tabs, sticky bar with surah & ayah selectors) wrapped in Saku Muslim emerald and gold design tokens. |
| **Fiqry (Frontend Web)** | Theme switcher currently lives in `src/app/_components/theme-switcher.tsx`. Where should it be injected? | Import into `src/components/shared/header.tsx` in both desktop header action bar and mobile drawer menu, styled with border tokens. |

---

## 6. Execution Tracks (Fork-Join Concurrency)

- **Track A (UI/UX - Angel):**
  - Deliver `workflow/TASK-003-quran-nu-alignment-theme-switcher/02_design_angel.md`.
  - Design specifications for NU Online tab bar, Juz list cards, popular surah pills, sticky reader navigation bar, ayah action sheet, and header ThemeSwitcher placement.
- **Track B (Frontend Web - Fiqry):**
  - Deliver `workflow/TASK-003-quran-nu-alignment-theme-switcher/03_build_frontend.md`.
  - Implement full 114 surah dynamic fetcher with tafsir, Juz metadata, Urutan Turun sorting, smart coordinate search, sticky reader bar, and ThemeSwitcher integration in header.
- **Track C (QA & Security - Sandra):**
  - Deliver `workflow/TASK-003-quran-nu-alignment-theme-switcher/04_qa_sandra.md`.
  - Write Playwright E2E tests for `/quran` tabs, coordinate jump ("2:255"), full verse rendering for Surah 2 and 9, and dark mode toggle persistence.
- **Track D (Signoff - Faisal):**
  - Deliver `workflow/TASK-003-quran-nu-alignment-theme-switcher/05_signoff_faisal.md`.
  - Final acceptance criteria verification gate against AC-01 through AC-05.
