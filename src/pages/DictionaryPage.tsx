import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { useAppStore } from '../store/appStore';
import SceneBg from '../components/SceneBg';

interface DictionaryEntry {
  arabic: string;
  transliteration: string;
  english: string;
  root?: string;
  type?: string;
  examples?: string[];
}

// Common Arabic-English dictionary entries
const DICTIONARY: DictionaryEntry[] = [
  { arabic: 'الله', transliteration: 'Allāh', english: 'God, The One True God', type: 'noun' },
  { arabic: 'رَبّ', transliteration: 'rabb', english: 'Lord, Master, Sustainer', root: 'ر-ب-ب', type: 'noun' },
  { arabic: 'كِتَاب', transliteration: 'kitāb', english: 'book', root: 'ك-ت-ب', type: 'noun' },
  { arabic: 'قُرْآن', transliteration: 'qurʾān', english: 'recitation, The Quran', root: 'ق-ر-أ', type: 'noun' },
  { arabic: 'صَلَاة', transliteration: 'ṣalāh', english: 'prayer, worship', root: 'ص-ل-و', type: 'noun' },
  { arabic: 'زَكَاة', transliteration: 'zakāh', english: 'charity, purification', root: 'ز-ك-و', type: 'noun' },
  { arabic: 'صَوْم', transliteration: 'ṣawm', english: 'fasting', root: 'ص-و-م', type: 'noun' },
  { arabic: 'حَجّ', transliteration: 'ḥajj', english: 'pilgrimage', root: 'ح-ج-ج', type: 'noun' },
  { arabic: 'إِيمَان', transliteration: 'īmān', english: 'faith, belief', root: 'أ-م-ن', type: 'noun' },
  { arabic: 'إِسْلَام', transliteration: 'islām', english: 'submission, Islam', root: 'س-ل-م', type: 'noun' },
  { arabic: 'مُسْلِم', transliteration: 'muslim', english: 'one who submits, Muslim', root: 'س-ل-م', type: 'noun' },
  { arabic: 'مُؤْمِن', transliteration: 'muʾmin', english: 'believer', root: 'أ-م-ن', type: 'noun' },
  { arabic: 'تَقْوَى', transliteration: 'taqwā', english: 'God-consciousness, piety', root: 'و-ق-ي', type: 'noun' },
  { arabic: 'جَنَّة', transliteration: 'jannah', english: 'paradise, garden', root: 'ج-ن-ن', type: 'noun' },
  { arabic: 'نَار', transliteration: 'nār', english: 'fire, hellfire', root: 'ن-و-ر', type: 'noun' },
  { arabic: 'رَحْمَة', transliteration: 'raḥmah', english: 'mercy, compassion', root: 'ر-ح-م', type: 'noun' },
  { arabic: 'مَغْفِرَة', transliteration: 'maghfirah', english: 'forgiveness', root: 'غ-ف-ر', type: 'noun' },
  { arabic: 'تَوْبَة', transliteration: 'tawbah', english: 'repentance', root: 'ت-و-ب', type: 'noun' },
  { arabic: 'ذِكْر', transliteration: 'dhikr', english: 'remembrance', root: 'ذ-ك-ر', type: 'noun' },
  { arabic: 'دُعَاء', transliteration: 'duʿāʾ', english: 'supplication, prayer', root: 'د-ع-و', type: 'noun' },
  { arabic: 'شُكْر', transliteration: 'shukr', english: 'gratitude, thanks', root: 'ش-ك-ر', type: 'noun' },
  { arabic: 'صَبْر', transliteration: 'ṣabr', english: 'patience, perseverance', root: 'ص-ب-ر', type: 'noun' },
  { arabic: 'عِلْم', transliteration: 'ʿilm', english: 'knowledge', root: 'ع-ل-م', type: 'noun' },
  { arabic: 'حِكْمَة', transliteration: 'ḥikmah', english: 'wisdom', root: 'ح-ك-م', type: 'noun' },
  { arabic: 'حَقّ', transliteration: 'ḥaqq', english: 'truth, right', root: 'ح-ق-ق', type: 'noun' },
  { arabic: 'عَدْل', transliteration: 'ʿadl', english: 'justice, fairness', root: 'ع-د-ل', type: 'noun' },
  { arabic: 'سَلَام', transliteration: 'salām', english: 'peace', root: 'س-ل-م', type: 'noun' },
  { arabic: 'نُور', transliteration: 'nūr', english: 'light', root: 'ن-و-ر', type: 'noun' },
  { arabic: 'هُدَى', transliteration: 'hudā', english: 'guidance', root: 'ه-د-ي', type: 'noun' },
  { arabic: 'سِرَاط', transliteration: 'ṣirāṭ', english: 'path, way', type: 'noun' },
  { arabic: 'آيَة', transliteration: 'āyah', english: 'sign, verse', root: 'أ-ي-ي', type: 'noun' },
  { arabic: 'سُورَة', transliteration: 'sūrah', english: 'chapter (of Quran)', type: 'noun' },
  { arabic: 'نَبِيّ', transliteration: 'nabiyy', english: 'prophet', root: 'ن-ب-أ', type: 'noun' },
  { arabic: 'رَسُول', transliteration: 'rasūl', english: 'messenger', root: 'ر-س-ل', type: 'noun' },
  { arabic: 'مَلَك', transliteration: 'malak', english: 'angel', root: 'م-ل-ك', type: 'noun' },
  { arabic: 'شَيْطَان', transliteration: 'shayṭān', english: 'satan, devil', type: 'noun' },
  { arabic: 'دُنْيَا', transliteration: 'dunyā', english: 'worldly life, this world', type: 'noun' },
  { arabic: 'آخِرَة', transliteration: 'ākhirah', english: 'hereafter, next life', root: 'أ-خ-ر', type: 'noun' },
  { arabic: 'يَوْم', transliteration: 'yawm', english: 'day', type: 'noun' },
  { arabic: 'قِيَامَة', transliteration: 'qiyāmah', english: 'resurrection', root: 'ق-و-م', type: 'noun' },
  // Verbs
  { arabic: 'قَالَ', transliteration: 'qāla', english: 'he said', root: 'ق-و-ل', type: 'verb' },
  { arabic: 'كَتَبَ', transliteration: 'kataba', english: 'he wrote', root: 'ك-ت-ب', type: 'verb' },
  { arabic: 'قَرَأَ', transliteration: 'qaraʾa', english: 'he read/recited', root: 'ق-ر-أ', type: 'verb' },
  { arabic: 'عَلِمَ', transliteration: 'ʿalima', english: 'he knew', root: 'ع-ل-م', type: 'verb' },
  { arabic: 'عَمِلَ', transliteration: 'ʿamila', english: 'he did/worked', root: 'ع-م-ل', type: 'verb' },
  { arabic: 'آمَنَ', transliteration: 'āmana', english: 'he believed', root: 'أ-م-ن', type: 'verb' },
  { arabic: 'صَلَّى', transliteration: 'ṣallā', english: 'he prayed', root: 'ص-ل-و', type: 'verb' },
  { arabic: 'ذَكَرَ', transliteration: 'dhakara', english: 'he remembered', root: 'ذ-ك-ر', type: 'verb' },
  { arabic: 'شَكَرَ', transliteration: 'shakara', english: 'he thanked', root: 'ش-ك-ر', type: 'verb' },
  { arabic: 'صَبَرَ', transliteration: 'ṣabara', english: 'he was patient', root: 'ص-ب-ر', type: 'verb' },
];

export default function DictionaryPage() {
  const setPage = useAppStore(s => s.setPage);
  const [search, setSearch] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<DictionaryEntry | null>(null);
  const [filter, setFilter] = useState<'all' | 'noun' | 'verb'>('all');
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = DICTIONARY.filter(entry => {
    const matchesSearch = !search || 
      entry.arabic.includes(search) ||
      entry.transliteration.toLowerCase().includes(search.toLowerCase()) ||
      entry.english.toLowerCase().includes(search.toLowerCase()) ||
      (entry.root && entry.root.includes(search));
    const matchesFilter = filter === 'all' || entry.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <div className="relative overflow-hidden">
        <SceneBg scene="calligraphy" />
        
        <div className="relative z-10 px-6 pt-8 pb-6">
          <div className="flex items-center gap-4 mb-4">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setPage('more')}
              className="w-10 h-10 glass rounded-xl flex items-center justify-center cursor-pointer">
              <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold font-arabic text-glow-gold text-amber-100">القاموس</h1>
              <p className="text-white/30 text-[11px]">Arabic Dictionary</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6">
        {/* Search */}
        <div className="glass rounded-xl px-4 py-3.5 flex items-center gap-3 mb-4">
          <svg className="w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input ref={searchRef} type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search Arabic, English, or root..."
            className="flex-1 bg-transparent text-white/80 placeholder-white/15 outline-none text-sm" />
          {search && (
            <button onClick={() => setSearch('')} className="text-white/30 hover:text-white/50 cursor-pointer">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(['all', 'noun', 'verb'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-xs rounded-full transition-all cursor-pointer capitalize
                ${filter === f ? 'bg-amber-500/15 text-amber-200 border border-amber-500/20' : 'glass text-white/30'}`}>
              {f === 'all' ? 'All Words' : f + 's'}
            </button>
          ))}
        </div>

        <p className="text-white/20 text-[11px] mb-3">{filtered.length} entries</p>

        {/* Dictionary entries */}
        <div className="space-y-2">
          {filtered.map((entry, i) => (
            <motion.button key={entry.arabic + i}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.3) }}
              onClick={() => setSelectedEntry(selectedEntry?.arabic === entry.arabic ? null : entry)}
              className={`w-full rounded-xl p-4 text-left cursor-pointer transition-all
                ${selectedEntry?.arabic === entry.arabic 
                  ? 'glass border border-amber-500/15' 
                  : 'glass hover:bg-white/[0.03]'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="font-arabic text-2xl text-amber-200/70">{entry.arabic}</span>
                  <div>
                    <p className="text-white/60 text-sm">{entry.english}</p>
                    <p className="text-white/30 text-xs">{entry.transliteration}</p>
                  </div>
                </div>
                {entry.type && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${entry.type === 'verb' ? 'bg-indigo-500/10 text-indigo-300/50' : 'bg-emerald-500/10 text-emerald-300/50'}`}>
                    {entry.type}
                  </span>
                )}
              </div>
              
              <AnimatePresence>
                {selectedEntry?.arabic === entry.arabic && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }} className="mt-4 pt-4 border-t border-white/[0.04]">
                    {entry.root && (
                      <div className="mb-2">
                        <span className="text-white/30 text-[11px]">Root: </span>
                        <span className="font-arabic text-amber-200/50 text-lg">{entry.root}</span>
                      </div>
                    )}
                    <p className="text-white/40 text-sm">
                      <span className="font-arabic text-lg">{entry.arabic}</span> ({entry.transliteration}) means "{entry.english}" in Arabic.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
