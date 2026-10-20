export interface DuaItem {
  id: string;
  category: "daily" | "morningEvening" | "prayerRelated" | "travel" | "protection";
  titleId: string;
  titleEn: string;
  arabic: string;
  latin: string;
  translationId: string;
  translationEn: string;
  source: string;
}

export const DUA_CATEGORIES = [
  { id: "all", labelId: "Semua Kategori", labelEn: "All Categories" },
  { id: "daily", labelId: "Doa Sehari-hari", labelEn: "Daily Supplications" },
  { id: "morningEvening", labelId: "Dzikir Pagi & Petang", labelEn: "Morning & Evening" },
  { id: "prayerRelated", labelId: "Seputar Sholat", labelEn: "Prayer Related" },
  { id: "travel", labelId: "Perjalanan", labelEn: "Travel" },
  { id: "protection", labelId: "Perlindungan & Keselamatan", labelEn: "Protection" },
];

export const DUA_ITEMS: DuaItem[] = [
  {
    id: "dua-tidur-1",
    category: "daily",
    titleId: "Doa Sebelum Tidur",
    titleEn: "Dua Before Sleeping",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    latin: "Bismika allaahumma amuutu wa ahyaa",
    translationId: "Dengan nama-Mu ya Allah, aku mati dan aku hidup.",
    translationEn: "In Your name, O Allah, I die and I live.",
    source: "HR. Bukhari & Muslim"
  },
  {
    id: "dua-bangun-tidur",
    category: "daily",
    titleId: "Doa Bangun Tidur",
    titleEn: "Dua Upon Waking Up",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    latin: "Alhamdu lillaahil-ladzii ahyaanaa ba'da maa amaatanaa wa ilaihin-nusyuur",
    translationId: "Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami, dan kepada-Nya kami kembali.",
    translationEn: "All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.",
    source: "HR. Bukhari"
  },
  {
    id: "dua-makan-1",
    category: "daily",
    titleId: "Doa Sebelum Makan",
    titleEn: "Dua Before Eating",
    arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ، بِسْمِ اللَّهِ",
    latin: "Allaahumma baarik lanaa fiimaa rozaqtanaa wa qinaa 'adzaaban-naar, bismillaah",
    translationId: "Ya Allah, berkahilah kami dalam rezeki yang telah Engkau berikan kepada kami dan peliharalah kami dari siksa api neraka. Dengan nama Allah.",
    translationEn: "O Allah, bless for us what You have provided for us, and protect us from the punishment of the Fire. In the name of Allah.",
    source: "HR. Ibnu Sunni"
  },
  {
    id: "dua-sesudah-makan",
    category: "daily",
    titleId: "Doa Sesudah Makan",
    titleEn: "Dua After Eating",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
    latin: "Alhamdu lillaahil-ladzii ath'amanaa wa saqoonaa wa ja'alanaa muslimiin",
    translationId: "Segala puji bagi Allah yang telah memberi kami makan dan minum, serta menjadikan kami orang-orang muslim.",
    translationEn: "Praise be to Allah Who has fed us and given us drink, and made us Muslims.",
    source: "HR. Abu Dawud"
  },
  {
    id: "dzikir-pagi-sayyidul-istighfar",
    category: "morningEvening",
    titleId: "Sayyidul Istighfar (Rajanya Istighfar)",
    titleEn: "The Master of Forgiveness",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    latin: "Allaahumma anta robbii laa ilaaha illaa anta kholaqtanii wa ana 'abduka wa ana 'alaa 'ahdika wa wa'dika mastatho'tu, a'uudzu bika min syarri maa shona'tu, abuu'u laka bini'matika 'alayya wa abuu'u bidzambii faghfir lii fa-innahu laa yaghfirudz-dzunuuba illaa anta",
    translationId: "Ya Allah, Engkau adalah Tuhanku, tidak ada Tuhan yang berhak disembah selain Engkau. Engkau yang menciptakanku dan aku adalah hamba-Mu. Aku mematuhi perjanjian-Mu sekuat kemampuanku. Aku berlindung kepada-Mu dari keburukan yang aku perbuat. Aku mengakui nikmat-Mu kepadaku dan aku mengakui dosaku, maka ampunilah aku, sesungguhnya tidak ada yang mengampuni dosa selain Engkau.",
    translationEn: "O Allah, You are my Lord, none has the right to be worshipped but You. You created me and I am Your servant, and I abide to Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favor upon me and I acknowledge my sin, so forgive me, for none forgives sins but You.",
    source: "HR. Bukhari"
  },
  {
    id: "dzikir-pagi-ridho",
    category: "morningEvening",
    titleId: "Dzikir Keridhaan Iman (Dibaca 3x)",
    titleEn: "Supplication of Contentment in Faith",
    arabic: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا وَرَسُولًا",
    latin: "Rodhiitu billaahi robbaa, wa bil-islaami diinaa, wa bi-muhammadin shollallaahu 'alaihi wa sallama nabiyyaw wa rosuulaa",
    translationId: "Aku ridha Allah sebagai Tuhanku, Islam sebagai agamaku, dan Nabi Muhammad SAW sebagai nabi dan rasulku.",
    translationEn: "I am pleased with Allah as my Lord, with Islam as my religion and with Muhammad (peace and blessings of Allah be upon him) as my Prophet.",
    source: "HR. Abu Dawud & Tirmidzi"
  },
  {
    id: "dua-masuk-masjid",
    category: "prayerRelated",
    titleId: "Doa Masuk Masjid",
    titleEn: "Dua Entering the Mosque",
    arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    latin: "Allaahummaftah lii abwaaba rohmatik",
    translationId: "Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.",
    translationEn: "O Allah, open the doors of Your mercy for me.",
    source: "HR. Muslim"
  },
  {
    id: "dua-keluar-masjid",
    category: "prayerRelated",
    titleId: "Doa Keluar Masjid",
    titleEn: "Dua Leaving the Mosque",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
    latin: "Allaahumma innii as-aluka min fadhlik",
    translationId: "Ya Allah, sesungguhnya aku memohon kepada-Mu keutamaan dan karunia-Mu.",
    translationEn: "O Allah, verily I ask You from Your bounty.",
    source: "HR. Muslim"
  },
  {
    id: "dua-safari-perjalanan",
    category: "travel",
    titleId: "Doa Naik Kendaraan / Bepergian",
    titleEn: "Dua for Travelling / Boarding Vehicle",
    arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ",
    latin: "Subhaanalladzii sakh-khoro lanaa haadzaa wa maa kunnaa lahuu muqriniin, wa innaa ilaa robbinaa lamunqolibuun",
    translationId: "Maha Suci Allah yang telah menundukkan semua ini bagi kami padahal kami sebelumnya tidak mampu menguasainya, dan sesungguhnya kami akan kembali kepada Tuhan kami.",
    translationEn: "Glory unto Him Who created this for us, although for it we were unable, and unto our Lord we shall surely return.",
    source: "HR. Muslim"
  },
  {
    id: "dua-perlindungan-bismillah",
    category: "protection",
    titleId: "Doa Perlindungan dari Mara Bahaya (Dibaca 3x)",
    titleEn: "Supplication for Protection Against All Harm",
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    latin: "Bismillaahil-ladzii laa yadhurru ma'asmihii syai-un fil-ardhi wa laa fis-samaa-i wa huwas-samii'ul-'aliim",
    translationId: "Dengan nama Allah yang bersama nama-Nya tidak ada sesuatu pun di bumi maupun di langit yang dapat mendatangkan celaka, dan Dia Maha Mendengar lagi Maha Mengetahui.",
    translationEn: "In the Name of Allah, with whose name nothing can harm on earth or in the sky, and He is the All-Hearing, All-Knowing.",
    source: "HR. Tirmidzi & Abu Dawud"
  }
];
