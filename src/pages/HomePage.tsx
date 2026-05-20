import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import RainbowButton from '../components/RainbowButton';
import { VisualQuran, VisualMosque, VisualHadith, VisualStar, IconDhikr, IconAI, IconLibrary, IconSettings } from '../components/IslamicVisuals';
import SceneBg from '../components/SceneBg';
import { useEffect, useState } from 'react';

const MAIN_NAV = [
  { id: 'quran', label: "Qur'an", arabic: 'القرآن', color: '#2dd4a8', Visual: VisualQuran },
  { id: 'salah', label: 'Salah', arabic: 'الصلاة', color: '#6366f1', Visual: VisualMosque },
  { id: 'hadith', label: 'Hadith', arabic: 'الحديث', color: '#f59e0b', Visual: VisualHadith },
  { id: 'more', label: 'More', arabic: 'المزيد', color: '#ec4899', Visual: VisualStar },
];

const QUICK_ACCESS = [
  { label: 'Dhikr', page: 'dhikr', Icon: IconDhikr, color: '#2dd4a8' },
  { label: 'AI Guide', page: 'ai-assistant', Icon: IconAI, color: '#a855f7' },
  { label: 'Library', page: 'library', Icon: IconLibrary, color: '#f59e0b' },
  { label: 'Settings', page: 'settings', Icon: IconSettings, color: '#64748b' },
];

export default function HomePage() {
  const setPage = useAppStore(s => s.setPage);
  const userProfile = useAppStore(s => s.userProfile);
  const prayerTimes = useAppStore(s => s.prayerTimes);
  const setPrayerTimes = useAppStore(s => s.setPrayerTimes);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string } | null>(null);
  const [hijriDate, setHijriDate] = useState('');

  useEffect(() => {
    const city = userProfile?.city || 'Makkah';
    const country = userProfile?.country || 'Saudi Arabia';
    fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=2`)
      .then(r => r.json())
      .then(data => {
        if (data.data?.timings) {
          setPrayerTimes(data.data.timings);
          if (data.data.date?.hijri) {
            const h = data.data.date.hijri;
            setHijriDate(`${h.day} ${h.month.en} ${h.year} AH`);
          }
        }
      })
      .catch(() => {});
  }, [userProfile, setPrayerTimes]);

  useEffect(() => {
    if (!prayerTimes) return;
    const now = new Date();
    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    for (const p of prayers) {
      const [h, m] = prayerTimes[p].split(':').map(Number);
      const pTime = new Date(now);
      pTime.setHours(h, m, 0);
      if (pTime > now) { setNextPrayer({ name: p, time: prayerTimes[p] }); return; }
    }
    setNextPrayer({ name: 'Fajr', time: prayerTimes.Fajr });
  }, [prayerTimes]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 5) return 'Peace in the night';
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    if (h < 20) return 'Good evening';
    return 'Peace be upon you';
  };

  return (
    <div className="min-h-screen pb-28">
      <div className="px-6 pt-10 pb-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <p className="text-amber-200/40 text-xs tracking-wider mb-1 font-light">{greeting()}</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white/90">
            {userProfile?.name || 'Guest'} <span className="text-amber-200/50 font-arabic text-xl">السلام عليكم</span>
          </h1>
          {hijriDate && <p className="text-white/20 text-[11px] mt-1.5 tracking-wider">{hijriDate}</p>}
        </motion.div>
      </div>

      {/* Next Prayer Card */}
      {nextPrayer && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="mx-6 mb-8">
          <div className="relative rounded-2xl overflow-hidden">
            <SceneBg scene="mosque" opacity={0.6} />
            <div className="relative z-10 p-6">
              <p className="text-white/30 text-[10px] uppercase tracking-[0.25em] mb-2 font-light">Next Prayer</p>
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-indigo-300">{nextPrayer.name}</h3>
                  <p className="text-white/40 text-xs mt-0.5">{userProfile?.city || 'Makkah'}</p>
                </div>
                <div className="text-3xl font-bold text-white/85 font-mono tracking-tight">{nextPrayer.time}</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Navigation — 4 Cards with Islamic SVG art */}
      <div className="px-6 grid grid-cols-2 gap-4">
        {MAIN_NAV.map((item, i) => (
          <motion.div key={item.id}
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.35 + i * 0.08, type: 'spring', stiffness: 200, damping: 20 }}>
            <RainbowButton onClick={() => setPage(item.id as any)} className="w-full !rounded-2xl">
              <div className="py-2 text-center w-full">
                <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                  <item.Visual size={56} />
                </div>
                <div className="font-arabic text-lg text-amber-200/70 mb-0.5">{item.arabic}</div>
                <div className="text-[11px] text-white/40 font-light">{item.label}</div>
              </div>
            </RainbowButton>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions with proper icons */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
        className="px-6 mt-8">
        <h3 className="text-white/25 text-[10px] uppercase tracking-[0.25em] mb-4 font-light">Quick Access</h3>
        <div className="grid grid-cols-4 gap-2.5">
          {QUICK_ACCESS.map((item, i) => (
            <motion.button key={item.page}
              whileHover={{ scale: 1.06, y: -3 }} whileTap={{ scale: 0.95 }}
              onClick={() => setPage(item.page as any)}
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 + i * 0.04 }}
              className="glass rounded-xl p-3 text-center hover:bg-white/[0.06] transition-all cursor-pointer group">
              <div className="w-8 h-8 mx-auto mb-1 flex items-center justify-center">
                <item.Icon size={22} color={item.color} />
              </div>
              <div className="text-[9px] text-white/35 group-hover:text-white/50 transition-colors font-light">{item.label}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Verse of the Day */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95 }}
        className="mx-6 mt-8 relative rounded-2xl overflow-hidden">
        <SceneBg scene="geometric" opacity={0.5} />
        <div className="relative z-10 p-6 border border-white/[0.04] rounded-2xl">
          <p className="text-amber-200/30 text-[10px] uppercase tracking-[0.25em] mb-3 font-light">Verse of the Day</p>
          <p className="font-arabic text-xl text-amber-200/70 text-right leading-10 mb-3">
            إِنَّ مَعَ الْعُسْرِ يُسْرًا
          </p>
          <div className="divider-gold mb-3" />
          <p className="text-white/40 text-sm italic font-light">"Indeed, with hardship comes ease."</p>
          <p className="text-white/20 text-xs mt-1">Ash-Sharh 94:6</p>
        </div>
      </motion.div>
    </div>
  );
}
