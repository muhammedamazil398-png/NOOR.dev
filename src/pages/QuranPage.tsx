import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { SURAHS } from '../data/surahs';
import SceneBg from '../components/SceneBg';

export default function QuranPage() {
  const setPage = useAppStore(s => s.setPage);
  const setCurrentSurah = useAppStore(s => s.setCurrentSurah);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'Meccan' | 'Medinan'>('all');

  const filtered = SURAHS.filter(s => {
    const matchesSearch =
      s.englishName.toLowerCase().includes(search.toLowerCase()) ||
      s.name.includes(search) ||
      s.englishNameTranslation.toLowerCase().includes(search.toLowerCase()) ||
      s.number.toString() === search;
    const matchesFilter = filter === 'all' || s.revelationType === filter;
    return matchesSearch && matchesFilter;
  });

  const openSurah = (num: number) => {
    setCurrentSurah(num);
    setPage('quran-reader');
  };

  return (
    <div className="min-h-screen pb-28">
      {/* Header with background */}
      <div className="relative overflow-hidden">
        <SceneBg scene="quran" />
        <div className="relative z-10 px-6 pt-8 pb-6">
          <div className="flex items-center gap-4 mb-5">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setPage('home')}
              className="w-10 h-10 glass rounded-xl flex items-center justify-center cursor-pointer"
            >
              <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold text-glow-gold font-arabic text-amber-100">القرآن الكريم</h1>
              <p className="text-white/30 text-[11px] tracking-wider">The Noble Qur'an — 114 Surahs</p>
            </div>
          </div>

          {/* Search */}
          <div className="glass rounded-xl px-4 py-3.5 flex items-center gap-3 mb-4">
            <svg className="w-4 h-4 text-white/20 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search surah by name or number..."
              className="flex-1 bg-transparent text-white/80 placeholder-white/15 outline-none text-sm"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            {(['all', 'Meccan', 'Medinan'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 text-xs rounded-full transition-all cursor-pointer
                  ${filter === f
                    ? 'bg-amber-500/15 text-amber-200 border border-amber-500/20'
                    : 'glass text-white/30 hover:text-white/50'}`}
              >
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Surah list */}
      <div className="px-6 space-y-1.5 mt-2">
        {filtered.map((surah, i) => (
          <motion.button
            key={surah.number}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Math.min(i * 0.015, 0.4) }}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => openSurah(surah.number)}
            className="w-full rounded-xl p-4 flex items-center gap-4 hover:bg-white/[0.03] transition-all cursor-pointer group text-left"
          >
            {/* Number with rainbow border */}
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 relative">
              <div className="absolute inset-0 rounded-lg opacity-60"
                style={{
                  background: 'conic-gradient(from var(--angle, 0deg), rgba(212,168,83,0.15), rgba(45,212,168,0.15), rgba(99,102,241,0.15), rgba(212,168,83,0.15))',
                  animation: 'rainbow-spin 8s linear infinite',
                }}
              />
              <div className="absolute inset-[1px] rounded-[7px] bg-[#080d1a]" />
              <span className="relative text-amber-200/70 text-xs font-medium">{surah.number}</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-white/80 font-medium text-sm truncate">{surah.englishName}</span>
                <span className="font-arabic text-amber-200/60 text-lg shrink-0">{surah.name}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-white/25 text-[11px]">{surah.englishNameTranslation}</span>
                <span className="text-white/10">·</span>
                <span className="text-white/25 text-[11px]">{surah.numberOfAyahs} ayahs</span>
                <span className="text-white/10">·</span>
                <span className="text-white/25 text-[11px]">{surah.revelationType}</span>
              </div>
            </div>

            <svg className="w-4 h-4 text-white/10 group-hover:text-amber-200/30 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
