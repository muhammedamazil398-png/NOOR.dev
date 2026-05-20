import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import { useAppStore } from '../store/appStore';
import RainbowButton from '../components/RainbowButton';
import SceneBg from '../components/SceneBg';

const DHIKR_PRESETS = [
  { text: 'سبحان الله', transliteration: 'SubhanAllah', meaning: 'Glory be to Allah', target: 33 },
  { text: 'الحمد لله', transliteration: 'Alhamdulillah', meaning: 'All praise is due to Allah', target: 33 },
  { text: 'الله أكبر', transliteration: 'Allahu Akbar', meaning: 'Allah is the Greatest', target: 34 },
  { text: 'لا إله إلا الله', transliteration: 'La ilaha illAllah', meaning: 'There is no god but Allah', target: 100 },
  { text: 'أستغفر الله', transliteration: 'Astaghfirullah', meaning: 'I seek forgiveness from Allah', target: 100 },
  { text: 'لا حول ولا قوة إلا بالله', transliteration: 'La hawla wa la quwwata illa billah', meaning: 'No power except with Allah', target: 33 },
  { text: 'سبحان الله وبحمده', transliteration: 'SubhanAllahi wa bihamdihi', meaning: 'Glory and praise be to Allah', target: 100 },
  { text: 'اللهم صل على محمد', transliteration: 'Allahumma salli ala Muhammad', meaning: 'O Allah send blessings upon Muhammad', target: 100 },
];

export default function DhikrPage() {
  const setPage = useAppStore(s => s.setPage);
  const { dhikrCount, dhikrTarget, dhikrText, incrementDhikr, resetDhikr, setDhikrTarget, setDhikrText } = useAppStore();

  const [showPresets, setShowPresets] = useState(false);
  const [ripple, setRipple] = useState(false);

  const progress = Math.min((dhikrCount / dhikrTarget) * 100, 100);
  const circumference = 2 * Math.PI * 72;
  const strokeOffset = circumference - (progress / 100) * circumference;

  const handleTap = useCallback(() => {
    incrementDhikr();
    setRipple(true);
    setTimeout(() => setRipple(false), 400);
  }, [incrementDhikr]);

  const selectPreset = (p: typeof DHIKR_PRESETS[0]) => {
    setDhikrText(p.text); setDhikrTarget(p.target); resetDhikr(); setShowPresets(false);
  };

  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <div className="relative overflow-hidden">
        <SceneBg scene="desert" />
        <div className="relative z-10 px-6 pt-8 pb-6">
          <div className="flex items-center gap-4">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setPage('more')}
              className="w-10 h-10 glass rounded-xl flex items-center justify-center cursor-pointer">
              <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold font-arabic text-glow-emerald text-emerald-200">الذكر</h1>
              <p className="text-white/30 text-[11px]">Digital Tasbih</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dhikr text — tap to change */}
      <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowPresets(!showPresets)}
        className="mx-auto block text-center my-6 cursor-pointer px-6">
        <p className="font-arabic text-3xl text-emerald-300/70 text-glow-emerald mb-1">{dhikrText}</p>
        <p className="text-white/20 text-[10px] tracking-wider">Tap to change</p>
      </motion.button>

      {/* Presets dropdown */}
      <AnimatePresence>
        {showPresets && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} className="mx-6 mb-6 overflow-hidden">
            <div className="glass rounded-xl p-1.5 space-y-0.5 max-h-60 overflow-y-auto">
              {DHIKR_PRESETS.map(p => (
                <button key={p.text} onClick={() => selectPreset(p)}
                  className="w-full px-4 py-3 rounded-lg hover:bg-white/[0.04] transition text-left cursor-pointer">
                  <div className="font-arabic text-amber-200/60 text-lg text-right">{p.text}</div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-white/30 text-[11px]">{p.transliteration}</span>
                    <span className="text-white/15 text-[11px]">&times;{p.target}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Counter circle */}
      <div className="flex items-center justify-center mb-8 px-6">
        <div className="relative">
          <svg width="200" height="200" viewBox="0 0 160 160">
            {/* Background circle */}
            <circle cx="80" cy="80" r="72" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="3" />
            {/* Progress arc */}
            <motion.circle cx="80" cy="80" r="72" fill="none" stroke="url(#dg)" strokeWidth="3" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={strokeOffset} transform="rotate(-90, 80, 80)"
              transition={{ duration: 0.3 }} />
            <defs>
              <linearGradient id="dg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#2dd4a8" /><stop offset="100%" stopColor="#d4a853" />
              </linearGradient>
            </defs>
          </svg>

          {/* Tap area */}
          <motion.button whileTap={{ scale: 0.93 }} onClick={handleTap}
            className="absolute inset-6 rounded-full glass flex flex-col items-center justify-center cursor-pointer active:bg-white/[0.04] transition-colors">
            {/* Ripple effect */}
            <AnimatePresence>
              {ripple && (
                <motion.div initial={{ scale: 0.5, opacity: 0.3 }} animate={{ scale: 2.5, opacity: 0 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                  className="absolute inset-0 rounded-full border-2 border-emerald-400/20" />
              )}
            </AnimatePresence>
            <span className="text-4xl font-bold text-white/90">{dhikrCount}</span>
            <span className="text-white/20 text-[11px] mt-1">/ {dhikrTarget}</span>
          </motion.button>
        </div>
      </div>

      {/* Tap button */}
      <div className="px-6 space-y-4">
        <p className="text-white/20 text-xs text-center">Tap the circle or the button below</p>
        <RainbowButton onClick={handleTap} size="lg" className="w-full">
          Tap to Count
        </RainbowButton>

        <div className="text-center pt-2">
          <button onClick={resetDhikr} className="text-white/15 text-[11px] hover:text-white/30 transition cursor-pointer">
            Reset Counter
          </button>
        </div>
      </div>

      {/* Completion */}
      <AnimatePresence>
        {dhikrCount >= dhikrTarget && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="mx-6 mt-8 glass rounded-2xl p-6 text-center" style={{ border: '1px solid rgba(45,212,168,0.12)' }}>
            <p className="text-emerald-300/80 font-bold text-lg mb-1">Masha'Allah!</p>
            <p className="text-white/40 text-sm font-light">You completed your dhikr target</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
