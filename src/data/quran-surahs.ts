import { getRevelationOrderNumber, getSurahJuzInfo } from "./quran-juz";

export interface SurahMeta {
  number: number;
  nameArabic: string;
  nameLatin: string;
  nameIndonesian: string;
  numberOfAyahs: number;
  revelationType: "Makkiyah" | "Madaniyah";
  revelationOrder: number;
  juzStart: number;
  juzEnd: number;
}

export type SurahDirectoryItem = SurahMeta;

interface RawSurahMeta {
  number: number;
  nameArabic: string;
  nameLatin: string;
  nameIndonesian: string;
  numberOfAyahs: number;
  revelationType: "Makkiyah" | "Madaniyah";
}

const RAW_SURAHS: RawSurahMeta[] = [
  { number: 1, nameArabic: "الفاتحة", nameLatin: "Al-Fatihah", nameIndonesian: "Pembukaan", numberOfAyahs: 7, revelationType: "Makkiyah" },
  { number: 2, nameArabic: "البقرة", nameLatin: "Al-Baqarah", nameIndonesian: "Sapi Betina", numberOfAyahs: 286, revelationType: "Madaniyah" },
  { number: 3, nameArabic: "آل عمران", nameLatin: "Ali 'Imran", nameIndonesian: "Keluarga Imran", numberOfAyahs: 200, revelationType: "Madaniyah" },
  { number: 4, nameArabic: "النساء", nameLatin: "An-Nisa'", nameIndonesian: "Wanita", numberOfAyahs: 176, revelationType: "Madaniyah" },
  { number: 5, nameArabic: "المائدة", nameLatin: "Al-Ma'idah", nameIndonesian: "Jamuan (Hidangan)", numberOfAyahs: 120, revelationType: "Madaniyah" },
  { number: 6, nameArabic: "الأنعام", nameLatin: "Al-An'am", nameIndonesian: "Binatang Ternak", numberOfAyahs: 165, revelationType: "Makkiyah" },
  { number: 7, nameArabic: "الأعراف", nameLatin: "Al-A'raf", nameIndonesian: "Tempat yang Tertinggi", numberOfAyahs: 206, revelationType: "Makkiyah" },
  { number: 8, nameArabic: "الأنفال", nameLatin: "Al-Anfal", nameIndonesian: "Harta Rampasan Perang", numberOfAyahs: 75, revelationType: "Madaniyah" },
  { number: 9, nameArabic: "التوبة", nameLatin: "At-Taubah", nameIndonesian: "Pengampunan", numberOfAyahs: 129, revelationType: "Madaniyah" },
  { number: 10, nameArabic: "يونس", nameLatin: "Yunus", nameIndonesian: "Nabi Yunus", numberOfAyahs: 109, revelationType: "Makkiyah" },
  { number: 11, nameArabic: "هود", nameLatin: "Hud", nameIndonesian: "Nabi Hud", numberOfAyahs: 123, revelationType: "Makkiyah" },
  { number: 12, nameArabic: "يوسف", nameLatin: "Yusuf", nameIndonesian: "Nabi Yusuf", numberOfAyahs: 111, revelationType: "Makkiyah" },
  { number: 13, nameArabic: "الرعد", nameLatin: "Ar-Ra'd", nameIndonesian: "Guruh", numberOfAyahs: 43, revelationType: "Madaniyah" },
  { number: 14, nameArabic: "ابراهيم", nameLatin: "Ibrahim", nameIndonesian: "Nabi Ibrahim", numberOfAyahs: 52, revelationType: "Makkiyah" },
  { number: 15, nameArabic: "الحجر", nameLatin: "Al-Hijr", nameIndonesian: "Gunung Al-Hijr", numberOfAyahs: 99, revelationType: "Makkiyah" },
  { number: 16, nameArabic: "النحل", nameLatin: "An-Nahl", nameIndonesian: "Lebah", numberOfAyahs: 128, revelationType: "Makkiyah" },
  { number: 17, nameArabic: "الإسراء", nameLatin: "Al-Isra'", nameIndonesian: "Perjalanan Malam", numberOfAyahs: 111, revelationType: "Makkiyah" },
  { number: 18, nameArabic: "الكهف", nameLatin: "Al-Kahf", nameIndonesian: "Gua", numberOfAyahs: 110, revelationType: "Makkiyah" },
  { number: 19, nameArabic: "مريم", nameLatin: "Maryam", nameIndonesian: "Siti Maryam", numberOfAyahs: 98, revelationType: "Makkiyah" },
  { number: 20, nameArabic: "طه", nameLatin: "Taha", nameIndonesian: "Taha", numberOfAyahs: 135, revelationType: "Makkiyah" },
  { number: 21, nameArabic: "الأنبياء", nameLatin: "Al-Anbiya'", nameIndonesian: "Para Nabi", numberOfAyahs: 112, revelationType: "Makkiyah" },
  { number: 22, nameArabic: "الحج", nameLatin: "Al-Hajj", nameIndonesian: "Haji", numberOfAyahs: 78, revelationType: "Madaniyah" },
  { number: 23, nameArabic: "المؤمنون", nameLatin: "Al-Mu'minun", nameIndonesian: "Orang-orang Mukmin", numberOfAyahs: 118, revelationType: "Makkiyah" },
  { number: 24, nameArabic: "النور", nameLatin: "An-Nur", nameIndonesian: "Cahaya", numberOfAyahs: 64, revelationType: "Madaniyah" },
  { number: 25, nameArabic: "الفرقان", nameLatin: "Al-Furqan", nameIndonesian: "Pembeda", numberOfAyahs: 77, revelationType: "Makkiyah" },
  { number: 26, nameArabic: "الشعراء", nameLatin: "Asy-Syu'ara'", nameIndonesian: "Para Penyair", numberOfAyahs: 227, revelationType: "Makkiyah" },
  { number: 27, nameArabic: "النمل", nameLatin: "An-Naml", nameIndonesian: "Semut", numberOfAyahs: 93, revelationType: "Makkiyah" },
  { number: 28, nameArabic: "القصص", nameLatin: "Al-Qasas", nameIndonesian: "Kisah-kisah", numberOfAyahs: 88, revelationType: "Makkiyah" },
  { number: 29, nameArabic: "العنكبوت", nameLatin: "Al-'Ankabut", nameIndonesian: "Laba-laba", numberOfAyahs: 69, revelationType: "Makkiyah" },
  { number: 30, nameArabic: "الروم", nameLatin: "Ar-Rum", nameIndonesian: "Bangsa Romawi", numberOfAyahs: 60, revelationType: "Makkiyah" },
  { number: 31, nameArabic: "لقمان", nameLatin: "Luqman", nameIndonesian: "Keluarga Luqman", numberOfAyahs: 34, revelationType: "Makkiyah" },
  { number: 32, nameArabic: "السجدة", nameLatin: "As-Sajdah", nameIndonesian: "Sujud", numberOfAyahs: 30, revelationType: "Makkiyah" },
  { number: 33, nameArabic: "الأحزاب", nameLatin: "Al-Ahzab", nameIndonesian: "Golongan yang Bersekutu", numberOfAyahs: 73, revelationType: "Madaniyah" },
  { number: 34, nameArabic: "سبإ", nameLatin: "Saba'", nameIndonesian: "Kaum Saba'", numberOfAyahs: 54, revelationType: "Makkiyah" },
  { number: 35, nameArabic: "فاطر", nameLatin: "Fatir", nameIndonesian: "Pencipta", numberOfAyahs: 45, revelationType: "Makkiyah" },
  { number: 36, nameArabic: "يس", nameLatin: "Yasin", nameIndonesian: "Yasin", numberOfAyahs: 83, revelationType: "Makkiyah" },
  { number: 37, nameArabic: "الصافات", nameLatin: "As-Saffat", nameIndonesian: "Barisan-barisan", numberOfAyahs: 182, revelationType: "Makkiyah" },
  { number: 38, nameArabic: "ص", nameLatin: "Sad", nameIndonesian: "Sad", numberOfAyahs: 88, revelationType: "Makkiyah" },
  { number: 39, nameArabic: "الزمر", nameLatin: "Az-Zumar", nameIndonesian: "Rombongan-rombongan", numberOfAyahs: 75, revelationType: "Makkiyah" },
  { number: 40, nameArabic: "غافر", nameLatin: "Ghafir", nameIndonesian: "Yang Mengampuni", numberOfAyahs: 85, revelationType: "Makkiyah" },
  { number: 41, nameArabic: "فصلت", nameLatin: "Fussilat", nameIndonesian: "Yang Dijelaskan", numberOfAyahs: 54, revelationType: "Makkiyah" },
  { number: 42, nameArabic: "الشورى", nameLatin: "Asy-Syura", nameIndonesian: "Musyawarah", numberOfAyahs: 53, revelationType: "Makkiyah" },
  { number: 43, nameArabic: "الزخرف", nameLatin: "Az-Zukhruf", nameIndonesian: "Perhiasan", numberOfAyahs: 89, revelationType: "Makkiyah" },
  { number: 44, nameArabic: "الدخان", nameLatin: "Ad-Dukhan", nameIndonesian: "Kabut", numberOfAyahs: 59, revelationType: "Makkiyah" },
  { number: 45, nameArabic: "الجاثية", nameLatin: "Al-Jasiyah", nameIndonesian: "Yang Berlutut", numberOfAyahs: 37, revelationType: "Makkiyah" },
  { number: 46, nameArabic: "الأحقاف", nameLatin: "Al-Ahqaf", nameIndonesian: "Bukit-bukit Pasir", numberOfAyahs: 35, revelationType: "Makkiyah" },
  { number: 47, nameArabic: "محمد", nameLatin: "Muhammad", nameIndonesian: "Nabi Muhammad", numberOfAyahs: 38, revelationType: "Madaniyah" },
  { number: 48, nameArabic: "الفتح", nameLatin: "Al-Fath", nameIndonesian: "Kemenangan", numberOfAyahs: 29, revelationType: "Madaniyah" },
  { number: 49, nameArabic: "الحجرات", nameLatin: "Al-Hujurat", nameIndonesian: "Kamar-kamar", numberOfAyahs: 18, revelationType: "Madaniyah" },
  { number: 50, nameArabic: "ق", nameLatin: "Qaf", nameIndonesian: "Qaf", numberOfAyahs: 45, revelationType: "Makkiyah" },
  { number: 51, nameArabic: "الذاريات", nameLatin: "Az-Zariyat", nameIndonesian: "Angin yang Menerbangkan", numberOfAyahs: 60, revelationType: "Makkiyah" },
  { number: 52, nameArabic: "الطور", nameLatin: "At-Tur", nameIndonesian: "Bukit", numberOfAyahs: 49, revelationType: "Makkiyah" },
  { number: 53, nameArabic: "النجم", nameLatin: "An-Najm", nameIndonesian: "Bintang", numberOfAyahs: 62, revelationType: "Makkiyah" },
  { number: 54, nameArabic: "القمر", nameLatin: "Al-Qamar", nameIndonesian: "Bulan", numberOfAyahs: 55, revelationType: "Makkiyah" },
  { number: 55, nameArabic: "الرحمن", nameLatin: "Ar-Rahman", nameIndonesian: "Yang Maha Pemurah", numberOfAyahs: 78, revelationType: "Madaniyah" },
  { number: 56, nameArabic: "الواقعة", nameLatin: "Al-Waqi'ah", nameIndonesian: "Hari Kiamat", numberOfAyahs: 96, revelationType: "Makkiyah" },
  { number: 57, nameArabic: "الحديد", nameLatin: "Al-Hadid", nameIndonesian: "Besi", numberOfAyahs: 29, revelationType: "Madaniyah" },
  { number: 58, nameArabic: "المجادلة", nameLatin: "Al-Mujadilah", nameIndonesian: "Wanita yang Mengajukan Gugatan", numberOfAyahs: 22, revelationType: "Madaniyah" },
  { number: 59, nameArabic: "الحشر", nameLatin: "Al-Hasyr", nameIndonesian: "Pengusiran", numberOfAyahs: 24, revelationType: "Madaniyah" },
  { number: 60, nameArabic: "الممتحنة", nameLatin: "Al-Mumtahanah", nameIndonesian: "Wanita yang Diuji", numberOfAyahs: 13, revelationType: "Madaniyah" },
  { number: 61, nameArabic: "الصف", nameLatin: "As-Saff", nameIndonesian: "Barisan", numberOfAyahs: 14, revelationType: "Madaniyah" },
  { number: 62, nameArabic: "الجمعة", nameLatin: "Al-Jumu'ah", nameIndonesian: "Hari Jum'at", numberOfAyahs: 11, revelationType: "Madaniyah" },
  { number: 63, nameArabic: "المنافقون", nameLatin: "Al-Munafiqun", nameIndonesian: "Orang-orang Munafik", numberOfAyahs: 11, revelationType: "Madaniyah" },
  { number: 64, nameArabic: "التغابن", nameLatin: "At-Taghabun", nameIndonesian: "Hari Ditampakkan Kesalahan", numberOfAyahs: 18, revelationType: "Madaniyah" },
  { number: 65, nameArabic: "الطلاق", nameLatin: "At-Talaq", nameIndonesian: "Talak", numberOfAyahs: 12, revelationType: "Madaniyah" },
  { number: 66, nameArabic: "التحريم", nameLatin: "At-Tahrim", nameIndonesian: "Mengharamkan", numberOfAyahs: 12, revelationType: "Madaniyah" },
  { number: 67, nameArabic: "الملك", nameLatin: "Al-Mulk", nameIndonesian: "Kerajaan", numberOfAyahs: 30, revelationType: "Makkiyah" },
  { number: 68, nameArabic: "القلم", nameLatin: "Al-Qalam", nameIndonesian: "Pena", numberOfAyahs: 52, revelationType: "Makkiyah" },
  { number: 69, nameArabic: "الحاقة", nameLatin: "Al-Haqqah", nameIndonesian: "Hari Kiamat", numberOfAyahs: 52, revelationType: "Makkiyah" },
  { number: 70, nameArabic: "المعارج", nameLatin: "Al-Ma'arij", nameIndonesian: "Tempat Naik", numberOfAyahs: 44, revelationType: "Makkiyah" },
  { number: 71, nameArabic: "نوح", nameLatin: "Nuh", nameIndonesian: "Nabi Nuh", numberOfAyahs: 28, revelationType: "Makkiyah" },
  { number: 72, nameArabic: "الجن", nameLatin: "Al-Jinn", nameIndonesian: "Jin", numberOfAyahs: 28, revelationType: "Makkiyah" },
  { number: 73, nameArabic: "المزمل", nameLatin: "Al-Muzzammil", nameIndonesian: "Orang yang Berselimut", numberOfAyahs: 20, revelationType: "Makkiyah" },
  { number: 74, nameArabic: "المدثر", nameLatin: "Al-Muddassir", nameIndonesian: "Orang yang Berkemul", numberOfAyahs: 56, revelationType: "Makkiyah" },
  { number: 75, nameArabic: "القيامة", nameLatin: "Al-Qiyamah", nameIndonesian: "Hari Kiamat", numberOfAyahs: 40, revelationType: "Makkiyah" },
  { number: 76, nameArabic: "الإنسان", nameLatin: "Al-Insan", nameIndonesian: "Manusia", numberOfAyahs: 31, revelationType: "Madaniyah" },
  { number: 77, nameArabic: "المرسلات", nameLatin: "Al-Mursalat", nameIndonesian: "Malaikat-malaikat yang Diutus", numberOfAyahs: 50, revelationType: "Makkiyah" },
  { number: 78, nameArabic: "النبإ", nameLatin: "An-Naba'", nameIndonesian: "Berita Besar", numberOfAyahs: 40, revelationType: "Makkiyah" },
  { number: 79, nameArabic: "النازعات", nameLatin: "An-Nazi'at", nameIndonesian: "Malaikat-malaikat yang Mencabut", numberOfAyahs: 46, revelationType: "Makkiyah" },
  { number: 80, nameArabic: "عبس", nameLatin: "'Abasa", nameIndonesian: "Ia Bermuka Masam", numberOfAyahs: 42, revelationType: "Makkiyah" },
  { number: 81, nameArabic: "التكوير", nameLatin: "At-Takwir", nameIndonesian: "Menggulung", numberOfAyahs: 29, revelationType: "Makkiyah" },
  { number: 82, nameArabic: "الانفطار", nameLatin: "Al-Infitar", nameIndonesian: "Terbelah", numberOfAyahs: 19, revelationType: "Makkiyah" },
  { number: 83, nameArabic: "المطففين", nameLatin: "Al-Mutaffifin", nameIndonesian: "Orang-orang yang Curang", numberOfAyahs: 36, revelationType: "Makkiyah" },
  { number: 84, nameArabic: "الانشقاق", nameLatin: "Al-Insyiqaq", nameIndonesian: "Terbelah", numberOfAyahs: 25, revelationType: "Makkiyah" },
  { number: 85, nameArabic: "البروج", nameLatin: "Al-Buruj", nameIndonesian: "Gugusan Bintang", numberOfAyahs: 22, revelationType: "Makkiyah" },
  { number: 86, nameArabic: "الطارق", nameLatin: "At-Tariq", nameIndonesian: "Yang Datang di Malam Hari", numberOfAyahs: 17, revelationType: "Makkiyah" },
  { number: 87, nameArabic: "الأعلى", nameLatin: "Al-A'la", nameIndonesian: "Yang Paling Tinggi", numberOfAyahs: 19, revelationType: "Makkiyah" },
  { number: 88, nameArabic: "الغاشية", nameLatin: "Al-Ghasyiyah", nameIndonesian: "Hari Pembalasan", numberOfAyahs: 26, revelationType: "Makkiyah" },
  { number: 89, nameArabic: "الفجر", nameLatin: "Al-Fajr", nameIndonesian: "Fajar", numberOfAyahs: 30, revelationType: "Makkiyah" },
  { number: 90, nameArabic: "البلد", nameLatin: "Al-Balad", nameIndonesian: "Negeri", numberOfAyahs: 20, revelationType: "Makkiyah" },
  { number: 91, nameArabic: "الشمس", nameLatin: "Asy-Syams", nameIndonesian: "Matahari", numberOfAyahs: 15, revelationType: "Makkiyah" },
  { number: 92, nameArabic: "الليل", nameLatin: "Al-Lail", nameIndonesian: "Malam", numberOfAyahs: 21, revelationType: "Makkiyah" },
  { number: 93, nameArabic: "الضحى", nameLatin: "Ad-Duha", nameIndonesian: "Waktu Duha", numberOfAyahs: 11, revelationType: "Makkiyah" },
  { number: 94, nameArabic: "الشرح", nameLatin: "Asy-Syarh", nameIndonesian: "Kelapangan", numberOfAyahs: 8, revelationType: "Makkiyah" },
  { number: 95, nameArabic: "التين", nameLatin: "At-Tin", nameIndonesian: "Buah Tin", numberOfAyahs: 8, revelationType: "Makkiyah" },
  { number: 96, nameArabic: "العلق", nameLatin: "Al-'Alaq", nameIndonesian: "Segumpal Darah", numberOfAyahs: 19, revelationType: "Makkiyah" },
  { number: 97, nameArabic: "القدر", nameLatin: "Al-Qadr", nameIndonesian: "Kemuliaan", numberOfAyahs: 5, revelationType: "Makkiyah" },
  { number: 98, nameArabic: "البينة", nameLatin: "Al-Bayyinah", nameIndonesian: "Bukti yang Nyata", numberOfAyahs: 8, revelationType: "Madaniyah" },
  { number: 99, nameArabic: "الزلزلة", nameLatin: "Az-Zalzalah", nameIndonesian: "Kegoncangan", numberOfAyahs: 8, revelationType: "Madaniyah" },
  { number: 100, nameArabic: "العاديات", nameLatin: "Al-'Adiyat", nameIndonesian: "Kuda Perang yang Berlari Kencang", numberOfAyahs: 11, revelationType: "Makkiyah" },
  { number: 101, nameArabic: "القارعة", nameLatin: "Al-Qari'ah", nameIndonesian: "Hari Kiamat", numberOfAyahs: 11, revelationType: "Makkiyah" },
  { number: 102, nameArabic: "التكاثر", nameLatin: "At-Takasur", nameIndonesian: "Bermegah-megahan", numberOfAyahs: 8, revelationType: "Makkiyah" },
  { number: 103, nameArabic: "العصر", nameLatin: "Al-'Asr", nameIndonesian: "Masa/Waktu", numberOfAyahs: 3, revelationType: "Makkiyah" },
  { number: 104, nameArabic: "الهمزة", nameLatin: "Al-Humazah", nameIndonesian: "Pengumpat", numberOfAyahs: 9, revelationType: "Makkiyah" },
  { number: 105, nameArabic: "الفيل", nameLatin: "Al-Fil", nameIndonesian: "Gajah", numberOfAyahs: 5, revelationType: "Makkiyah" },
  { number: 106, nameArabic: "قريش", nameLatin: "Quraisy", nameIndonesian: "Suku Quraisy", numberOfAyahs: 4, revelationType: "Makkiyah" },
  { number: 107, nameArabic: "الماعون", nameLatin: "Al-Ma'un", nameIndonesian: "Barang-barang yang Berguna", numberOfAyahs: 7, revelationType: "Makkiyah" },
  { number: 108, nameArabic: "الكوثر", nameLatin: "Al-Kausar", nameIndonesian: "Nikmat yang Berlimpah", numberOfAyahs: 3, revelationType: "Makkiyah" },
  { number: 109, nameArabic: "الكافرون", nameLatin: "Al-Kafirun", nameIndonesian: "Orang-orang Kafir", numberOfAyahs: 6, revelationType: "Makkiyah" },
  { number: 110, nameArabic: "النصر", nameLatin: "An-Nasr", nameIndonesian: "Pertolongan", numberOfAyahs: 3, revelationType: "Madaniyah" },
  { number: 111, nameArabic: "المسد", nameLatin: "Al-Lahab", nameIndonesian: "Gejolak Api (Sabut)", numberOfAyahs: 5, revelationType: "Makkiyah" },
  { number: 112, nameArabic: "الإخلاص", nameLatin: "Al-Ikhlas", nameIndonesian: "Kemurnian Keesaan Allah", numberOfAyahs: 4, revelationType: "Makkiyah" },
  { number: 113, nameArabic: "الفلق", nameLatin: "Al-Falaq", nameIndonesian: "Waktu Subuh", numberOfAyahs: 5, revelationType: "Makkiyah" },
  { number: 114, nameArabic: "الناس", nameLatin: "An-Nas", nameIndonesian: "Manusia", numberOfAyahs: 6, revelationType: "Makkiyah" }
];

export const QURAN_SURAHS: SurahMeta[] = RAW_SURAHS.map((surah) => {
  const juzInfo = getSurahJuzInfo(surah.number);
  return {
    ...surah,
    revelationOrder: getRevelationOrderNumber(surah.number),
    juzStart: juzInfo.startJuz,
    juzEnd: juzInfo.endJuz,
  };
});
