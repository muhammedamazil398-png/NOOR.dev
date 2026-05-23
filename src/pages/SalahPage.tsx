import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAppStore } from '../store/appStore';
import SceneBg from '../components/SceneBg';

const PRAYER_COLORS: Record<string, string> = {
  Fajr: '#4f8bff', Sunrise: '#ff9f43', Dhuhr: '#f5cd47', Asr: '#ff8c42', Maghrib: '#ff6348', Isha: '#6c5ce7',
};

export default function SalahPage() {
  const setPage = useAppStore(s => s.setPage);
  const userProfile = useAppStore(s => s.userProfile);
  const prayerTimes = useAppStore(s => s.prayerTimes);
  const setPrayerTimes = useAppStore(s => s.setPrayerTimes);
  const [currentPrayer, setCurrentPrayer] = useState('');
  const [checkedPrayers, setCheckedPrayers] = useState<string[]>(() => {
    const saved = localStorage.getItem('noor-checked-prayers-' + new Date().toDateString());
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const city = userProfile?.city || 'Makkah';
    const country = userProfile?.country || 'Saudi Arabia';
    if (!prayerTimes) {
      fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=2`)
        .then(r => r.json())
        .then(data => { if (data.data?.timings) setPrayerTimes(data.data.timings); })
        .catch(() => {});
    }
  }, [userProfile, prayerTimes, setPrayerTimes]);

  useEffect(() => {
    if (!prayerTimes) return;
    const now = new Date();
    const nowM = now.getHours() * 60 + now.getMinutes();
    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    
    // Find the next prayer (first prayer time that hasn't started yet today)
    let nextPrayer = 'Fajr'; // Default to Fajr if we're past all prayers today
    for (let i = 0; i < prayers.length; i++) {
      try {
        const timeStr = prayerTimes[prayers[i]];
        if (!timeStr) continue;
        const [h, m] = timeStr.split(':').map(Number);
        if (h !== undefined && m !== undefined) {
          const prayerM = h * 60 + m;
          if (nowM < prayerM) {
            nextPrayer = prayers[i];
            break;
          }
        }
      } catch (e) {
        // Skip if parsing fails
      }
    }
    setCurrentPrayer(nextPrayer);
  }, [prayerTimes]);


  const togglePrayer = (name: string) => {
    const updated = checkedPrayers.includes(name) ? checkedPrayers.filter(p => p !== name) : [...checkedPrayers, name];
    setCheckedPrayers(updated);
    localStorage.setItem('noor-checked-prayers-' + new Date().toDateString(), JSON.stringify(updated));
  };

  const prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <div className="relative overflow-hidden">
        <SceneBg scene="mosque" />
        <div className="relative z-10 px-6 pt-8 pb-6">
          <div className="flex items-center gap-4 mb-4">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setPage('home')}
              className="w-10 h-10 glass rounded-xl flex items-center justify-center cursor-pointer">
              <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold font-arabic text-glow-gold text-amber-100">الصلاة</h1>
              <p className="text-white/30 text-[11px]">{userProfile?.city || 'Makkah'}, {userProfile?.country || 'Saudi Arabia'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Prayer */}
      {currentPrayer && prayerTimes && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mx-6 mb-6 rounded-2xl p-6 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${PRAYER_COLORS[currentPrayer]}08, transparent)`, border: `1px solid ${PRAYER_COLORS[currentPrayer]}15` }}>
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-10" style={{ background: PRAYER_COLORS[currentPrayer] }} />
          <p className="text-white/25 text-[10px] uppercase tracking-[0.25em] mb-2">Next Prayer</p>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-bold" style={{ color: PRAYER_COLORS[currentPrayer] }}>{currentPrayer}</h2>
            <div className="text-3xl font-bold text-white/80 font-mono tracking-tight">{prayerTimes[currentPrayer]}</div>
          </div>
        </motion.div>
      )}

      {/* Prayer list */}
      <div className="px-6 space-y-2 mb-8">
        <h3 className="text-white/25 text-[10px] uppercase tracking-[0.25em] mb-3">Today's Prayers</h3>
        {prayers.map((name, i) => {
          const time = prayerTimes?.[name] || '--:--';
          const isCurrent = name === currentPrayer;
          const isChecked = checkedPrayers.includes(name);
          const color = PRAYER_COLORS[name];
          return (
            <motion.div key={name}
              initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`glass rounded-xl p-4 flex items-center justify-between transition-all ${isCurrent ? '' : ''}`}
              style={isCurrent ? { borderColor: `${color}20`, boxShadow: `0 0 20px ${color}05` } : {}}>
              <div className="flex items-center gap-3">
                {name !== 'Sunrise' && (
                  <motion.button whileTap={{ scale: 0.8 }} onClick={() => togglePrayer(name)}
                    className="w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center cursor-pointer transition-colors"
                    style={{ borderColor: isChecked ? color : 'rgba(255,255,255,0.12)', background: isChecked ? `${color}20` : 'transparent' }}>
                    {isChecked && (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24" style={{ color }}>
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    )}
                  </motion.button>
                )}
                <span className={`text-sm ${isCurrent ? 'text-white font-medium' : 'text-white/50'}`}>{name}</span>
              </div>
              <span className={`text-sm font-mono ${isCurrent ? 'text-white font-bold' : 'text-white/35'}`}>{time}</span>
            </motion.div>
          );
        })}
      </div>

      <div className="px-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-5 text-center">
          <p className="text-white/25 text-[10px] uppercase tracking-[0.2em] mb-2">Streak</p>
          <div className="text-3xl font-bold text-amber-200">{parseInt(localStorage.getItem('noor-streak') || '0')}</div>
          <p className="text-white/20 text-[10px] mt-1">days</p>
        </motion.div>
      </div>
    </div>
  );
}
