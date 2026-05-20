import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAppStore } from '../store/appStore';
import RainbowButton from '../components/RainbowButton';
import SceneBg from '../components/SceneBg';

interface HadithEntry {
  id: number;
  num: number;
  arabic?: string;
  english: string;
  section: string;
  grade: string;
}

// Verified CDN URLs
const COLLECTIONS = [
  { id: 'bukhari', name: 'Sahih al-Bukhari', arabic: 'صحيح البخاري', total: 7563, color: '#2dd4a8',
    url: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-bukhari.min.json',
    arabicUrl: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-bukhari.min.json',
    format: 'fawaz' as const },
  { id: 'muslim', name: 'Sahih Muslim', arabic: 'صحيح مسلم', total: 7459, color: '#6366f1',
    url: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-muslim.min.json',
    arabicUrl: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-muslim.min.json',
    format: 'fawaz' as const },
  { id: 'abudawud', name: 'Sunan Abu Dawud', arabic: 'سنن أبي داود', total: 5274, color: '#f59e0b',
    url: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-abudawud.min.json',
    arabicUrl: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-abudawud.min.json',
    format: 'fawaz' as const },
  { id: 'tirmidhi', name: "Jami' at-Tirmidhi", arabic: 'جامع الترمذي', total: 3956, color: '#ec4899',
    url: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-tirmidhi.min.json',
    arabicUrl: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-tirmidhi.min.json',
    format: 'fawaz' as const },
  { id: 'nasai', name: "Sunan an-Nasa'i", arabic: 'سنن النسائي', total: 5758, color: '#a855f7',
    url: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-nasai.min.json',
    arabicUrl: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-nasai.min.json',
    format: 'fawaz' as const },
  { id: 'ibnmajah', name: 'Sunan Ibn Majah', arabic: 'سنن ابن ماجه', total: 4341, color: '#d4a853',
    url: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-ibnmajah.min.json',
    arabicUrl: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-ibnmajah.min.json',
    format: 'fawaz' as const },
  { id: 'malik', name: 'Muwatta Malik', arabic: 'موطأ مالك', total: 1832, color: '#14b8a6',
    url: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-malik.min.json',
    arabicUrl: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-malik.min.json',
    format: 'fawaz' as const },
];

const FEATURED = {
  ar: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
  en: 'The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended.',
  src: 'Sahih al-Bukhari 1', narrator: 'Umar ibn al-Khattab (RA)',
};

// Module-level cache so data persists across re-renders
const cache: Record<string, { hadiths: HadithEntry[]; sections: Record<string, string> }> = {};

export default function HadithPage() {
  const setPage = useAppStore(s => s.setPage);
  const { currentHadithCollection, setCurrentHadithCollection } = useAppStore();
  const [hadiths, setHadiths] = useState<HadithEntry[]>([]);
  const [, setSections] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [visibleCount, setVisibleCount] = useState(40);
  const [expandedH, setExpandedH] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const retryRef = useRef(0);

  const col = COLLECTIONS.find(c => c.id === currentHadithCollection);

  const loadCollection = useCallback(async (id: string) => {
    // Check cache first
    if (cache[id]) {
      setHadiths(cache[id].hadiths);
      setSections(cache[id].sections);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    const c = COLLECTIONS.find(x => x.id === id);
    if (!c) { setLoading(false); return; }

    // Parse based on data format
    const parseFawazEntries = (data: any) => {
      const secs: Record<string, string> = data.metadata?.sections || {};
      const arr = data.hadiths || [];
      return arr
        .filter((h: any) => (h.text || h.english || h.arabic) && (h.text || h.english || h.arabic).trim())
        .map((h: any, i: number) => ({
          id: i,
          num: h.hadithnumber || h.id || i + 1,
          text: (h.text || h.english || h.arabic || '').trim(),
          section: h.reference?.book ? (secs[String(h.reference.book)] || `Book ${h.reference.book}`) : '',
          grade: h.grades?.[0]?.grade || '',
        }));
    };

    const parseAhmedBaset = (data: any) => {
      const chapters: Record<number, string> = {};
      (data.chapters || []).forEach((ch: any) => { chapters[ch.id] = ch.english || ch.arabic || ''; });
      const arr = data.hadiths || [];
      return arr.map((h: any, i: number) => ({
        id: i,
        num: h.idInBook || i + 1,
        text: (h.english || h.arabic || '').trim(),
        section: chapters[h.chapterId] || '',
        grade: '',
      }));
    };

    const mapHadiths = (entries: any[]) => {
      const map = new Map<number, HadithEntry>();
      entries.forEach((h) => {
        const existing = map.get(h.num);
        if (existing) {
          if (h.englishText) existing.english = h.englishText;
          if (h.arabicText) existing.arabic = h.arabicText;
          return;
        }
        map.set(h.num, {
          id: h.id,
          num: h.num,
          arabic: h.arabicText || h.arabic || '',
          english: h.englishText || h.english || h.text || '',
          section: h.section || '',
          grade: h.grade || '',
        });
      });
      return Array.from(map.values()).sort((a, b) => a.num - b.num);
    };

    const fetchData = async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error('fetch failed');
      return res.json();
    };

    let success = false;
    try {
      const englishPromise = fetchData(c.url);
      const arabicPromise = c.arabicUrl ? fetchData(c.arabicUrl) : Promise.resolve(null);
      const [englishData, arabicData] = await Promise.allSettled([englishPromise, arabicPromise]);

      const englishEntries = englishData.status === 'fulfilled'
        ? (c.format === 'ahmedbaset' ? parseAhmedBaset(englishData.value) : parseFawazEntries(englishData.value))
        : [];
      const arabicEntries = arabicData.status === 'fulfilled' && arabicData.value
        ? (c.format === 'ahmedbaset' ? parseAhmedBaset(arabicData.value) : parseFawazEntries(arabicData.value))
        : [];

      const merged = mapHadiths(
        englishEntries.map((h) => ({ ...h, englishText: h.text })).concat(
          arabicEntries.map((h) => ({ ...h, arabicText: h.text }))
        )
      );

      if (merged.length > 0) {
        cache[id] = { hadiths: merged, sections: {} };
        setHadiths(merged);
        setSections({});
        success = true;
      }
    } catch {
      success = false;
    }

    if (!success && c.format === 'fawaz') {
      try {
        const altUrl = c.url.replace('.min.json', '.json');
        const altData = await fetchData(altUrl);
        const mapped2 = parseFawazEntries(altData).map((h: any) => ({ ...h, englishText: h.text }));
        const merged2 = mapHadiths(mapped2);
        if (merged2.length > 0) {
          cache[id] = { hadiths: merged2, sections: {} };
          setHadiths(merged2);
          setSections({});
          success = true;
        }
      } catch { /* continue */ }
    }

    if (!success) {
      setError(`Could not load ${c.name}. Please check your connection and try again.`);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (currentHadithCollection) {
      setVisibleCount(40);
      setSearch('');
      setExpandedH(null);
      loadCollection(currentHadithCollection);
    }
  }, [currentHadithCollection, loadCollection]);

  const handleRetry = () => {
    retryRef.current += 1;
    loadCollection(currentHadithCollection);
  };

  const handleBack = () => {
    if (currentHadithCollection) {
      setCurrentHadithCollection('');
      setHadiths([]);
      setSearch('');
      setError('');
    } else {
      setPage('home');
    }
  };

  const filtered = search
    ? hadiths.filter(h => (
        (h.english || '').toLowerCase().includes(search.toLowerCase()) ||
        (h.arabic || '').toLowerCase().includes(search.toLowerCase()) ||
        String(h.num).includes(search)
      ))
    : hadiths;
  const visible = filtered.slice(0, visibleCount);

  return (
    <div className="min-h-screen pb-28">
      <div className="relative overflow-hidden">
        <SceneBg scene="lantern" />
        <div className="relative z-10 px-6 pt-8 pb-5">
          <div className="flex items-center gap-4 mb-2">
            <motion.button whileTap={{ scale: 0.9 }} onClick={handleBack}
              className="w-10 h-10 glass rounded-xl flex items-center justify-center cursor-pointer">
              <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold font-arabic text-glow-gold text-amber-100">الحديث</h1>
              <p className="text-white/30 text-[11px]">
                {col ? `${col.name} — ${hadiths.length > 0 ? hadiths.length.toLocaleString() : col.total.toLocaleString()} hadiths` : 'Prophetic Traditions'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!currentHadithCollection ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Featured */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              className="mx-6 mb-6 glass-gold rounded-2xl p-5">
              <p className="text-amber-200/25 text-[9px] uppercase tracking-[0.25em] mb-3 font-light">Hadith of the Day</p>
              <p className="font-arabic text-lg text-amber-200/60 text-right leading-10 mb-2">{FEATURED.ar}</p>
              <div className="divider-gold mb-2" />
              <p className="text-white/45 text-sm italic font-light mb-1.5">{FEATURED.en}</p>
              <div className="flex justify-between text-white/20 text-[10px]">
                <span>{FEATURED.narrator}</span><span className="text-amber-200/20">{FEATURED.src}</span>
              </div>
            </motion.div>

            <div className="px-6 space-y-2">
              <p className="text-white/20 text-[9px] uppercase tracking-[0.2em] mb-2 font-light">All Collections — Tap to Read Full Content</p>
              {COLLECTIONS.map((c, i) => (
                <motion.button key={c.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 + i * 0.025 }} whileHover={{ x: 3 }} whileTap={{ scale: 0.99 }}
                  onClick={() => setCurrentHadithCollection(c.id)}
                  className="w-full glass rounded-xl p-4 flex items-center gap-3.5 cursor-pointer group text-left hover:bg-white/[0.02] transition-all">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${c.color}0c`, border: `1px solid ${c.color}15` }}>
                    <span className="font-arabic text-sm" style={{ color: c.color }}>{c.arabic.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/75 text-sm font-medium">{c.name}</p>
                    <p className="font-arabic text-amber-200/30 text-xs">{c.arabic}</p>
                    <p className="text-white/15 text-[10px] mt-0.5">{c.total.toLocaleString()} hadiths</p>
                  </div>
                  <svg className="w-3.5 h-3.5 text-white/8 group-hover:text-amber-200/25 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="reader" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }}>
            {/* Search */}
            <div className="px-6 mb-3">
              <div className="glass rounded-xl px-4 py-3 flex items-center gap-3">
                <svg className="w-3.5 h-3.5 text-white/15 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                </svg>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search hadiths by text or number..."
                  className="flex-1 bg-transparent text-white/75 placeholder-white/12 outline-none text-sm" />
                {search && (
                  <button onClick={() => setSearch('')} className="text-white/25 hover:text-white/50 cursor-pointer">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              {hadiths.length > 0 && (
                <p className="text-white/15 text-[10px] mt-1.5 px-1">{hadiths.length.toLocaleString()} hadiths loaded{search ? ` · ${filtered.length} results` : ''}</p>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    className="w-8 h-8 mx-auto mb-3 rounded-full border-2 border-amber-200/8 border-t-amber-200/50" />
                  <p className="text-white/25 text-xs">Loading {col?.name}...</p>
                  <p className="text-white/12 text-[10px] mt-1">This may take a moment for large collections</p>
                </div>
              </div>
            ) : error ? (
              <div className="px-6 py-12 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full glass flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <p className="text-white/40 text-sm mb-1">{error}</p>
                <p className="text-white/20 text-xs mb-5">The data server may be temporarily unavailable.</p>
                <RainbowButton onClick={handleRetry} size="md">Retry Loading</RainbowButton>
              </div>
            ) : (
              <div className="px-6 space-y-1.5">
                {visible.map((h, i) => (
                  <motion.div key={`${h.id}-${h.num}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(i * 0.006, 0.12) }}
                    onClick={() => setExpandedH(expandedH === i ? null : i)}
                    className={`rounded-xl p-3.5 cursor-pointer transition-all duration-300
                      ${expandedH === i ? 'glass' : 'hover:bg-white/[0.015]'}`}>
                    <div className="flex items-start gap-2.5">
                      <span className="text-amber-200/25 text-[10px] font-mono mt-0.5 shrink-0 w-10 text-right">#{h.num}</span>
                      <div className="flex-1 min-w-0">
                        {h.section && <p className="text-amber-200/20 text-[9px] mb-1 line-clamp-1">{h.section}</p>}
                        {h.arabic ? (
                          <p className={`font-arabic text-white/60 text-[14px] leading-relaxed text-right ${expandedH === i ? '' : 'line-clamp-3'}`}>
                            {h.arabic}
                          </p>
                        ) : null}
                        <p className={`text-white/50 text-[13px] leading-relaxed mt-2 ${expandedH === i ? '' : 'line-clamp-3'}`}>
                          {h.english}
                        </p>
                        {h.grade && (
                          <p className={`text-[9px] mt-1.5 ${h.grade.toLowerCase().includes('sahih') ? 'text-emerald-300/30' : 'text-amber-200/25'}`}>
                            {h.grade}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {visible.length < filtered.length && (
                  <div className="py-4">
                    <RainbowButton onClick={() => setVisibleCount(v => v + 60)} size="md" className="w-full">
                      Show More ({(filtered.length - visible.length).toLocaleString()} remaining)
                    </RainbowButton>
                  </div>
                )}

                {hadiths.length > 0 && filtered.length === 0 && search && (
                  <p className="text-white/20 text-sm text-center py-8">No hadiths match "{search}"</p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
