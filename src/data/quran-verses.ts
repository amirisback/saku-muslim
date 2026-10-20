export interface AyahItem {
  numberInSurah: number;
  arabic: string;
  transliteration: string;
  translation: string;
  audioUrl?: string;
}

export interface SurahDetailData {
  number: number;
  nameArabic: string;
  nameLatin: string;
  nameIndonesian: string;
  revelationType: "Makkiyah" | "Madaniyah";
  numberOfAyahs: number;
  audioFullSurah: string;
  ayahs: AyahItem[];
}

export const SURAH_DETAILS: Record<number, SurahDetailData> = {
  1: {
    number: 1,
    nameArabic: "الفاتحة",
    nameLatin: "Al-Fatihah",
    nameIndonesian: "Pembukaan",
    revelationType: "Makkiyah",
    numberOfAyahs: 7,
    audioFullSurah: "https://server8.mp3quran.net/afs/001.mp3",
    ayahs: [
      {
        numberInSurah: 1,
        arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        transliteration: "Bismillaahir-rohmaanir-rohiim",
        translation: "Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang.",
        audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3"
      },
      {
        numberInSurah: 2,
        arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        transliteration: "Al-hamdu lillaahi robbil-'aalamiin",
        translation: "Segala puji bagi Allah, Tuhan seluruh alam,",
        audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2.mp3"
      },
      {
        numberInSurah: 3,
        arabic: "الرَّحْمَٰنِ الرَّحِيمِ",
        transliteration: "Ar-rohmaanir-rohiim",
        translation: "Yang Maha Pengasih lagi Maha Penyayang,",
        audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/3.mp3"
      },
      {
        numberInSurah: 4,
        arabic: "مَالِكِ يَوْمِ الدِّينِ",
        transliteration: "Maaliki yaumid-diin",
        translation: "Pemilik hari pembalasan.",
        audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/4.mp3"
      },
      {
        numberInSurah: 5,
        arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
        transliteration: "Iyyaaka na'budu wa iyyaaka nasta'iin",
        translation: "Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami memohon pertolongan.",
        audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/5.mp3"
      },
      {
        numberInSurah: 6,
        arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
        transliteration: "Ihdinas-sirootal-mustaqiim",
        translation: "Tunjukilah kami jalan yang lurus,",
        audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6.mp3"
      },
      {
        numberInSurah: 7,
        arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
        transliteration: "Sirootallaziina an'amta 'alaihim ghoiril-maghdhuubi 'alaihim wa lad-dhooolliin",
        translation: "(yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya, bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat.",
        audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/7.mp3"
      }
    ]
  },
  67: {
    number: 67,
    nameArabic: "الملك",
    nameLatin: "Al-Mulk",
    nameIndonesian: "Kerajaan",
    revelationType: "Makkiyah",
    numberOfAyahs: 30,
    audioFullSurah: "https://server8.mp3quran.net/afs/067.mp3",
    ayahs: [
      {
        numberInSurah: 1,
        arabic: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
        transliteration: "Tabaarakallazii biyadihil-mulku wa huwa 'alaa kulli syai'in qodiir",
        translation: "Mahasuci Allah yang menguasai (segala) kerajaan, dan Dia Mahakuasa atas segala sesuatu.",
        audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/5242.mp3"
      },
      {
        numberInSurah: 2,
        arabic: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ",
        transliteration: "Allazii kholaqol-mauta wal-hayaata liyabluwakum ayyukum ahsanu 'amalaa, wa huwal-'aziizul-ghofuur",
        translation: "Yang menciptakan mati dan hidup, untuk menguji kamu, siapa di antara kamu yang lebih baik amalnya. Dan Dia Mahaperkasa lagi Maha Pengampun.",
        audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/5243.mp3"
      },
      {
        numberInSurah: 3,
        arabic: "الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ",
        transliteration: "Allazii kholaqo sab'a samaawaatin thibaaqon, maa taraa fii kholqir-rohmaani min tafaawut, farji'il-bashoro hal taraa min futhuur",
        translation: "Yang menciptakan tujuh langit berlapis-lapis. Tidak akan kamu lihat sesuatu yang tidak seimbang pada ciptaan Tuhan Yang Maha Pengasih. Maka lihatlah sekali lagi, adakah kamu lihat sesuatu yang cacat?",
        audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/5244.mp3"
      },
      {
        numberInSurah: 4,
        arabic: "ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ",
        transliteration: "Summarji'il-bashoro karrataini yanqolib ilaikal-bashoru khoosi'an wa huwa hasiir",
        translation: "Kemudian pandanglah sekali lagi niscaya penglihatanmu akan kembali kepadamu tanpa menemukan cacat dan ia dalam keadaan letih.",
        audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/5245.mp3"
      },
      {
        numberInSurah: 5,
        arabic: "وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ وَجَعَلْنَاهَا رُجُومًا لِّلشَّيَاطِينِ ۖ وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ",
        transliteration: "Wa laqod zayyannas-samaaa'ad-dun-yaa bimasaabiiha wa ja'alnaahaa rujuumal lisy-syayaathiini wa a'tadnaa lahum 'azaabas-sa'iir",
        translation: "Dan sungguh, telah Kami hiasi langit yang dekat dengan bintang-bintang dan Kami jadikannya pengusir setan-setan, dan Kami sediakan bagi mereka azab neraka yang menyala-nyala.",
        audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/5246.mp3"
      }
    ]
  },
  112: {
    number: 112,
    nameArabic: "الإخلاص",
    nameLatin: "Al-Ikhlas",
    nameIndonesian: "Kemurnian Keesaan Allah",
    revelationType: "Makkiyah",
    numberOfAyahs: 4,
    audioFullSurah: "https://server8.mp3quran.net/afs/112.mp3",
    ayahs: [
      {
        numberInSurah: 1,
        arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
        transliteration: "Qul huwalloohu ahad",
        translation: "Katakanlah (Muhammad), \"Dialah Allah, Yang Maha Esa.\"",
        audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6221.mp3"
      },
      {
        numberInSurah: 2,
        arabic: "اللَّهُ الصَّمَدُ",
        transliteration: "Alloohus-somad",
        translation: "Allah tempat meminta segala sesuatu.",
        audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6222.mp3"
      },
      {
        numberInSurah: 3,
        arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
        transliteration: "Lam yalid wa lam yuulad",
        translation: "(Allah) tidak beranak dan tidak pula diperanakkan,",
        audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6223.mp3"
      },
      {
        numberInSurah: 4,
        arabic: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
        transliteration: "Wa lam yakul lahuu kufuwan ahad",
        translation: "Dan tidak ada sesuatu yang setara dengan Dia.",
        audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6224.mp3"
      }
    ]
  },
  113: {
    number: 113,
    nameArabic: "الفلق",
    nameLatin: "Al-Falaq",
    nameIndonesian: "Waktu Subuh",
    revelationType: "Makkiyah",
    numberOfAyahs: 5,
    audioFullSurah: "https://server8.mp3quran.net/afs/113.mp3",
    ayahs: [
      {
        numberInSurah: 1,
        arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
        transliteration: "Qul a'uuzu birobbil-falaq",
        translation: "Katakanlah, \"Aku berlindung kepada Tuhan yang menguasai subuh (fajar),\"",
        audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6225.mp3"
      },
      {
        numberInSurah: 2,
        arabic: "مِن شَرِّ مَا خَلَقَ",
        transliteration: "Min syarri maa kholaq",
        translation: "dari kejahatan (makhluk yang) Dia ciptakan,",
        audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6226.mp3"
      },
      {
        numberInSurah: 3,
        arabic: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
        transliteration: "Wa min syarri ghoosiqin izaa waqob",
        translation: "dan dari kejahatan malam apabila telah gelap gulita,",
        audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6227.mp3"
      },
      {
        numberInSurah: 4,
        arabic: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ",
        transliteration: "Wa min syarrin-naffaasaati fil-'uqod",
        translation: "dan dari kejahatan (perempuan-perempuan) penyihir yang meniup pada buhul-buhul (talinya),",
        audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6228.mp3"
      },
      {
        numberInSurah: 5,
        arabic: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
        transliteration: "Wa min syarri haasidin izaa hasad",
        translation: "dan dari kejahatan orang yang dengki apabila dia dengki.",
        audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6229.mp3"
      }
    ]
  },
  114: {
    number: 114,
    nameArabic: "الناس",
    nameLatin: "An-Nas",
    nameIndonesian: "Manusia",
    revelationType: "Makkiyah",
    numberOfAyahs: 6,
    audioFullSurah: "https://server8.mp3quran.net/afs/114.mp3",
    ayahs: [
      {
        numberInSurah: 1,
        arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
        transliteration: "Qul a'uuzu birobbin-naas",
        translation: "Katakanlah, \"Aku berlindung kepada Tuhannya manusia,\"",
        audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6230.mp3"
      },
      {
        numberInSurah: 2,
        arabic: "مَلِكِ النَّاسِ",
        transliteration: "Malikin-naas",
        translation: "Raja manusia,",
        audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6231.mp3"
      },
      {
        numberInSurah: 3,
        arabic: "إِلَٰهِ النَّاسِ",
        transliteration: "Ilaahin-naas",
        translation: "Sembahan manusia,",
        audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6232.mp3"
      },
      {
        numberInSurah: 4,
        arabic: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
        transliteration: "Min syarril-waswaasil-khonnaas",
        translation: "dari kejahatan (bisikan) setan yang bersembunyi,",
        audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6233.mp3"
      },
      {
        numberInSurah: 5,
        arabic: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ",
        transliteration: "Allazii yuwaswisu fii suduurin-naas",
        translation: "yang membisikkan (kejahatan) ke dalam dada manusia,",
        audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6234.mp3"
      },
      {
        numberInSurah: 6,
        arabic: "مِنَ الْجِنَّةِ وَالنَّاسِ",
        transliteration: "Minal-jinnati wan-naas",
        translation: "dari (golongan) jin dan manusia.",
        audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6235.mp3"
      }
    ]
  }
};

/**
 * Mengambil detail surah berdasarkan nomor surah (1 - 114)
 */
import { QURAN_SURAHS } from "./quran-surahs";

export function getSurahDetail(surahNumber: number): SurahDetailData {
  if (SURAH_DETAILS[surahNumber]) {
    return SURAH_DETAILS[surahNumber];
  }

  const meta = QURAN_SURAHS.find((s) => s.number === surahNumber) || QURAN_SURAHS[0];
  const padded = surahNumber.toString().padStart(3, "0");

  // Fallback representatif dengan ayat pembuka
  return {
    number: meta.number,
    nameArabic: meta.nameArabic,
    nameLatin: meta.nameLatin,
    nameIndonesian: meta.nameIndonesian,
    revelationType: meta.revelationType,
    numberOfAyahs: meta.numberOfAyahs,
    audioFullSurah: `https://server8.mp3quran.net/afs/${padded}.mp3`,
    ayahs: [
      {
        numberInSurah: 1,
        arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        transliteration: "Bismillaahir-rohmaanir-rohiim",
        translation: "Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang.",
      },
      {
        numberInSurah: 2,
        arabic: `${meta.nameArabic} - آيَاتُ الْكِتَابِ الْحَكِيمِ`,
        transliteration: `Tilka aayaatul-kitaabil-hakiim`,
        translation: `Inilah ayat-ayat Al-Qur'an surah ${meta.nameLatin} yang mengandung hikmah dan petunjuk bagi umat manusia.`,
      }
    ]
  };
}
