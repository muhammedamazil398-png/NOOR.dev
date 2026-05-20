import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../store/appStore';
import RainbowButton from '../components/RainbowButton';
import SceneBg from '../components/SceneBg';

const AYAHS = [
  { arabic: 'وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ', english: 'And do not despair of the mercy of Allah', ref: 'Yusuf 12:87' },
  { arabic: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ', english: 'Indeed, Allah is with the patient', ref: 'Al-Baqarah 2:153' },
  { arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', english: 'For indeed, with hardship comes ease', ref: 'Ash-Sharh 94:5' },
  { arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا', english: 'Whoever fears Allah, He will make a way out', ref: 'At-Talaq 65:2' },
];

const HABITS = [
  { id: 'phone', label: 'Reduce Screen Time', description: 'Limit unnecessary phone usage' },
  { id: 'sleep', label: 'Sleep Early', description: 'Sleep before midnight, wake for Fajr' },
  { id: 'haram', label: 'Avoid Haram Content', description: 'Stay away from harmful content' },
  { id: 'quran', label: 'Daily Qur\'an', description: 'Read at least 1 page daily' },
  { id: 'salah', label: 'All 5 Prayers', description: 'Pray all 5 on time' },
  { id: 'dhikr', label: 'Morning/Evening Adhkar', description: 'Complete daily remembrance' },
];

export default function DeaddictionPage() {
  const setPage = useAppStore(s => s.setPage);
  const [focusTimer, setFocusTimer] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [tracked, setTracked] = useState<string[]>(() => {
    const s = localStorage.getItem('noor-habits-' + new Date().toDateString());
    return s ? JSON.parse(s) : [];
  });
  const ayah = AYAHS[Math.floor(Date.now() / 86400000) % AYAHS.length];

  const toggle = useCallback((id: string) => {
    const u = tracked.includes(id) ? tracked.filter(h => h !== id) : [...tracked, id];
    setTracked(u);
    localStorage.setItem('noor-habits-' + new Date().toDateString(), JSON.stringify(u));
  }, [tracked]);

  useEffect(() => {
    let iv: ReturnType<typeof setInterval>;
    if (isRunning && focusTimer > 0) iv = setInterval(() => setFocusTimer(t => t - 1), 1000);
    else if (focusTimer === 0) { setIsRunning(false); setFocusTimer(25 * 60); }
    return () => clearInterval(iv);
  }, [isRunning, focusTimer]);

  const mm = Math.floor(focusTimer / 60);
  const ss = focusTimer % 60;

  return (
    <div className="min-h-screen pb-28">
      <div className="relative overflow-hidden">
        <SceneBg scene="mosque" />
        <div className="relative z-10 px-6 pt-8 pb-6">
          <div className="flex items-center gap-4">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setPage('more')}
              className="w-10 h-10 glass rounded-xl flex items-center justify-center cursor-pointer">
              <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold font-arabic text-glow-emerald text-emerald-200">التزكية</h1>
              <p className="text-white/30 text-[11px]">Focus & Purification</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ayah */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="mx-6 mb-6 glass-gold rounded-2xl p-5">
        <p className="font-arabic text-xl text-emerald-300/70 text-right leading-10 mb-2">{ayah.arabic}</p>
        <div className="divider-emerald mb-2" />
        <p className="text-white/45 text-sm italic font-light">{ayah.english}</p>
        <p className="text-white/20 text-[11px] mt-1">— {ayah.ref}</p>
      </motion.div>

      {/* Focus Timer */}
      <div className="px-6 mb-8">
        <h3 className="text-white/25 text-[10px] uppercase tracking-[0.2em] mb-4">Focus Session</h3>
        <div className={`glass rounded-2xl p-6 text-center transition-all duration-500
          ${isRunning ? 'border-emerald-500/10' : ''}`}
          style={isRunning ? { boxShadow: '0 0 30px rgba(45,212,168,0.05)' } : {}}>
          <div className="text-5xl font-bold font-mono text-white/85 mb-4 tracking-wider">
            {String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}
          </div>
          <div className="flex gap-2 justify-center mb-5">
            {[15, 25, 45, 60].map(m => (
              <button key={m} onClick={() => { setFocusTimer(m * 60); setIsRunning(false); }}
                className="px-3 py-1.5 glass rounded-lg text-[11px] text-white/35 hover:text-white/60 transition cursor-pointer">
                {m}min
              </button>
            ))}
          </div>
          <RainbowButton onClick={() => setIsRunning(!isRunning)} size="md" className="w-full">
            {isRunning ? 'Pause' : 'Start Focus'}
          </RainbowButton>
        </div>
      </div>

      {/* Habits */}
      <div className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white/25 text-[10px] uppercase tracking-[0.2em]">Daily Habits</h3>
          <span className="text-emerald-300/40 text-[11px]">{tracked.length}/{HABITS.length}</span>
        </div>
        <div className="space-y-1.5">
          {HABITS.map((h, i) => (
            <motion.button key={h.id} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }} whileTap={{ scale: 0.98 }}
              onClick={() => toggle(h.id)}
              className={`w-full glass rounded-xl p-4 flex items-center gap-3 transition-all cursor-pointer text-left
                ${tracked.includes(h.id) ? 'bg-emerald-500/[0.04]' : ''}`}>
              <div className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition shrink-0
                ${tracked.includes(h.id) ? 'border-emerald-400/60 bg-emerald-400/15' : 'border-white/10'}`}>
                {tracked.includes(h.id) && (
                  <svg className="w-3 h-3 text-emerald-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                )}
              </div>
              <div>
                <span className={`text-sm ${tracked.includes(h.id) ? 'text-emerald-300/70 line-through' : 'text-white/65'}`}>{h.label}</span>
                <p className="text-white/20 text-[11px]">{h.description}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {tracked.length === HABITS.length && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="mx-6 glass rounded-2xl p-6 text-center" style={{ border: '1px solid rgba(45,212,168,0.12)' }}>
            <p className="text-emerald-300/70 font-bold">All habits complete today!</p>
            <p className="text-white/30 text-sm mt-1 font-light">Masha'Allah, keep it up</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
