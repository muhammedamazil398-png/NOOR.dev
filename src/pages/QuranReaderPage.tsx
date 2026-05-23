import { motion, AnimatePresence } from 'framer-motion';
import { MouseEvent, useEffect, useState } from 'react';
import { useAppStore } from '../store/appStore';
import { SURAHS } from '../data/surahs';
import RainbowButton from '../components/RainbowButton';

interface Ayah { number: number; numberInSurah: number; text: string; juz: number; }
interface TranslationAyah { numberInSurah: number; text: string; }

// Mapping of language codes to quran.com translation IDs.
// English uses Saheeh International via Quran.com, a trusted, scholarly translation source.
const LANGUAGE_TO_QURAN_TRANSLATION: Record<string, number> = {
  en: 20, // Saheeh International
  ar: 20,
  ur: 87,
  bn: 58,
  fa: 82,
  tr: 77,
  fr: 95,
  de: 76,
  es: 93,
  ru: 106,
  id: 33,
  ms: 39,
  hi: 54,
  zh: 112,
  ja: 109,
  ko: 92,
  // Fallback for unsupported languages
  ps: 20,
  sw: 20,
  ha: 20,
  so: 20,
};

const RECITERS = [
  { id: '7', name: 'Mishary Alafasy' },
  { id: '4', name: 'Abdurrahman As-Sudais' },
  { id: '1', name: 'Abdul Basit' },
  { id: '5', name: 'Mahmoud Khalil Al-Husary' },
  { id: '13', name: 'Mohamed Siddiq Al-Minshawi' },
];

export default function QuranReaderPage() {
  const setPage = useAppStore(s => s.setPage);
  const userProfile = useAppStore(s => s.userProfile);
  const currentSurah = useAppStore(s => s.currentSurah);
  const setCurrentSurah = useAppStore(s => s.setCurrentSurah);
  const surahInfo = SURAHS.find(s => s.number === currentSurah)!;

  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [translations, setTranslations] = useState<TranslationAyah[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAyah, setSelectedAyah] = useState<number | null>(null);
  const [showTranslation, setShowTranslation] = useState(true);
  const [reciter, setReciter] = useState(RECITERS[0].id);
  const [showReciterMenu, setShowReciterMenu] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioEl, setAudioEl] = useState<HTMLAudioElement | null>(null);
  const [cachedSurah, setCachedSurah] = useState(false);

  const translationCode = LANGUAGE_TO_QURAN_TRANSLATION[userProfile?.language || 'en'] || 20;
  const translationLanguage = userProfile?.language || 'en';

  useEffect(() => {
    const cacheMarker = localStorage.getItem(`noor-quran-cache-surah-${currentSurah}`) === 'true';
    setCachedSurah(cacheMarker);
  }, [currentSurah]);

  useEffect(() => {
    setLoading(true);
    setAyahs([]);
    setTranslations([]);

    const translationFetch = fetch(
      `https://api.quran.com/api/v4/verses/by_chapter/${currentSurah}?translation_id=${translationCode}&translations=${translationCode}&fields=text_uthmani,translations&language=${translationLanguage}`
    ).then(r => r.json());

    translationFetch.then((translation) => {
      const ayahs = translation.verses || [];
      const formattedAyahs: Ayah[] = ayahs.map((ayah: any) => ({
        number: ayah.verse_number,
        numberInSurah: ayah.verse_key?.split(':')[1] || ayah.verse_number,
        text: ayah.text_uthmani || ayah.text_indopak || ayah.text || '',
        juz: ayah.juz_number || 0,
      }));

      const formattedTranslations: TranslationAyah[] = ayahs.map((ayah: any) => ({
        numberInSurah: ayah.verse_key?.split(':')[1] || ayah.verse_number,
        text: ayah.translations?.[0]?.text || '',
      }));

      setAyahs(formattedAyahs);
      setTranslations(formattedTranslations);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [currentSurah, translationCode, translationLanguage]);

  const playAyah = (ayahGlobalNum: number, e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (audioEl) audioEl.pause();
    // Using Quran.com CDN for Qur'an recitations
    const audio = new Audio(`https://verses.quran.com/${reciter}/${ayahGlobalNum}.mp3`);
    audio.play().catch(() => {});
    audio.onended = () => setIsPlaying(false);
    setAudioEl(audio);
    setIsPlaying(true);
  };

  const stopAudio = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (audioEl) { audioEl.pause(); setIsPlaying(false); }
  };

  const goToSurah = (n: number) => {
    if (n >= 1 && n <= 114) {
      setCurrentSurah(n);
      setSelectedAyah(null);
      window.scrollTo(0, 0);
    }
  };

  const cacheCurrentSurah = async () => {
    if (!('caches' in window)) return;
    try {
      const cache = await caches.open('noor-pwa-cache-v1');
      const translationUrl = `https://api.quran.com/api/v4/verses/by_chapter/${currentSurah}?translation_id=${translationCode}&translations=${translationCode}&fields=translations&language=${translationLanguage}`;
      const urls = [
        `https://api.alquran.cloud/v1/surah/${currentSurah}/quran-uthmani`,
        translationUrl,
        ...ayahs.map(ayah => `https://cdn.islamic.network/quran/audio/128/${reciter}/${ayah.number}.mp3`),
      ];
      await Promise.all(urls.map(url => cache.add(url).catch(() => {})));
      localStorage.setItem(`noor-quran-cache-surah-${currentSurah}`, 'true');
      setCachedSurah(true);
    } catch {
      // ignore cache failures silently
    }
  };

  return (
    <div className="min-h-screen pb-28">
      <div className="sticky top-0 z-30 glass-strong px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setPage('quran')}
              className="w-9 h-9 glass rounded-lg flex items-center justify-center cursor-pointer">
              <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <div>
              <h2 className="font-arabic text-lg text-amber-200/80">{surahInfo.name}</h2>
              <p className="text-white/30 text-[10px]">{surahInfo.englishName} — {surahInfo.numberOfAyahs} ayahs</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button whileTap={{ scale: 0.9 }}
              onClick={() => setShowTranslation(!showTranslation)}
              className={`px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-all ${showTranslation ? 'bg-amber-500/12 text-amber-200 border border-amber-500/15' : 'glass text-white/25'}`}>
              EN
            </motion.button>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowReciterMenu(!showReciterMenu)}
              className="w-9 h-9 glass rounded-lg flex items-center justify-center cursor-pointer">
              <svg className="w-4 h-4 text-white/35" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </motion.button>
            <RainbowButton onClick={cacheCurrentSurah} size="sm" className={cachedSurah ? 'bg-emerald-500/10 text-emerald-200' : ''}>
              {cachedSurah ? 'Saved Offline' : 'Download Surah'}
            </RainbowButton>
          </div>
        </div>
        <AnimatePresence>
          {showReciterMenu && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} className="mt-2 overflow-hidden">
              <div className="glass rounded-xl p-1.5 space-y-0.5">
                {RECITERS.map(r => (
                  <button key={r.id}
                    onClick={() => { setReciter(r.id); setShowReciterMenu(false); }}
                    className={`w-full px-4 py-2.5 rounded-lg text-left text-sm transition-all cursor-pointer ${reciter === r.id ? 'bg-amber-500/10 text-amber-200' : 'text-white/45 hover:bg-white/[0.03]'}`}>
                    {r.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {currentSurah !== 9 && (
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8">
          <p className="font-arabic text-2xl md:text-3xl text-amber-200/50 text-glow-gold">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <div className="divider-gold w-48 mx-auto mt-5" />
        </motion.div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-20">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            className="w-8 h-8 rounded-full border-2 border-amber-200/10 border-t-amber-200/50" />
        </div>
      )}

      <div className="px-4 md:px-8 space-y-1 py-2">
        {ayahs.map((ayah, i) => {
          const translation = translations[i];
          const isSelected = selectedAyah === ayah.numberInSurah;

          return (
            <motion.div key={ayah.numberInSurah}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: Math.min(i * 0.012, 0.3) }}
              onClick={() => setSelectedAyah(isSelected ? null : ayah.numberInSurah)}
              className={`rounded-2xl p-4 md:p-5 transition-all duration-500 cursor-pointer ${isSelected ? 'glass' : 'hover:bg-white/[0.015]'}`}
              style={isSelected ? { boxShadow: '0 0 40px rgba(212,168,83,0.03)' } : { }}>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full glass flex items-center justify-center text-[10px] text-amber-200/40 font-medium">
                    {ayah.numberInSurah}
                  </span>
                  {isSelected && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => isPlaying ? stopAudio(e) : playAyah(ayah.number, e)}
                      className="w-7 h-7 rounded-full bg-amber-500/8 flex items-center justify-center cursor-pointer border border-amber-500/10">
                      <svg className="w-3 h-3 text-amber-200/60" fill="currentColor" viewBox="0 0 24 24">
                        {isPlaying ? <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /> : <path d="M8 5v14l11-7z" />}
                      </svg>
                    </motion.button>
                  )}
                </div>
                <span className="text-white/8 text-[9px]">Juz {ayah.juz}</span>
              </div>

              <p className="quran-text text-amber-100/80 mb-3">
                {ayah.text} <span className="text-amber-200/15 text-lg">﴿{ayah.numberInSurah}﴾</span>
              </p>

              {showTranslation && translation && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-white/35 text-[13px] leading-relaxed border-t border-white/[0.03] pt-3 font-light">
                  {translation.text}
                </motion.p>
              )}
            </motion.div>
          );
        })}
      </div>

      {!loading && ayahs.length > 0 && (
        <div className="flex items-center justify-between px-6 py-8 gap-3">
          {currentSurah > 1 ? (
            <RainbowButton onClick={() => goToSurah(currentSurah - 1)} size="sm">
              {SURAHS[currentSurah - 2]?.englishName}
            </RainbowButton>
          ) : <div />}
          {currentSurah < 114 ? (
            <RainbowButton onClick={() => goToSurah(currentSurah + 1)} size="sm">
              {SURAHS[currentSurah]?.englishName}
            </RainbowButton>
          ) : <div />}
        </div>
      )}
    </div>
  );
}
