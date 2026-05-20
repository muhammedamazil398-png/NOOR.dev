import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAppStore, LANGUAGES } from '../store/appStore';
import RainbowButton from '../components/RainbowButton';
import SceneBg from '../components/SceneBg';

export default function SettingsPage() {
  const setPage = useAppStore(s => s.setPage);
  const userProfile = useAppStore(s => s.userProfile);
  const setUserProfile = useAppStore(s => s.setUserProfile);
  const setLanguageLoaded = useAppStore(s => s.setLanguageLoaded);
  const performanceMode = useAppStore(s => s.performanceMode);
  const setPerformanceMode = useAppStore(s => s.setPerformanceMode);

  const [name, setName] = useState(userProfile?.name || '');
  const [city, setCity] = useState(userProfile?.city || '');
  const [country, setCountry] = useState(userProfile?.country || '');
  const [madhab, setMadhab] = useState(userProfile?.madhab || 'hanafi');
  const [language, setLanguage] = useState(userProfile?.language || 'en');
  const [showLanguages, setShowLanguages] = useState(false);
  const [downloadingLang, setDownloadingLang] = useState(false);
  const [saved, setSaved] = useState(false);

  const selectedLang = LANGUAGES.find(l => l.code === language);

  const handleLanguageSelect = async (langCode: string) => {
    setLanguage(langCode);
    setShowLanguages(false);
    if (langCode !== userProfile?.language) {
      setDownloadingLang(true);
      setLanguageLoaded(false);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLanguageLoaded(true);
      setDownloadingLang(false);
      // Immediately save the language change to profile
      const updatedProfile: any = {
        name: userProfile?.name || name || 'Guest',
        madhab: userProfile?.madhab || madhab,
        city: userProfile?.city || city || 'Makkah',
        country: userProfile?.country || country || 'Saudi Arabia',
        gender: userProfile?.gender || '',
        language: langCode,
        arabicLevel: userProfile?.arabicLevel || '',
      };
      setUserProfile(updatedProfile);
    }
  };

  const handleSave = () => {
    const updatedProfile: any = {
      name: name || 'Guest',
      madhab,
      city: city || 'Makkah',
      country: country || 'Saudi Arabia',
      gender: userProfile?.gender || '',
      language: language,
      arabicLevel: userProfile?.arabicLevel || '',
    };
    setUserProfile(updatedProfile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen pb-28">
      {/* Downloading language overlay */}
      <AnimatePresence>
        {downloadingLang && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="text-center">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-amber-200/20 border-t-amber-200/80" />
              <p className="text-white/60 text-sm">Downloading language pack...</p>
              <p className="text-white/30 text-xs mt-1">{selectedLang?.native}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative overflow-hidden">
        <SceneBg scene="geometric" />
        <div className="relative z-10 px-6 pt-8 pb-5">
          <div className="flex items-center gap-4 mb-4">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setPage('more')}
              className="w-10 h-10 glass rounded-xl flex items-center justify-center cursor-pointer">
              <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold font-arabic text-glow-gold text-amber-100">الإعدادات</h1>
              <p className="text-white/30 text-[11px]">Personalize Your Experience</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6 relative z-0">
        {/* Language */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5 relative z-10 overflow-visible">
          <h3 className="text-white/50 text-xs font-medium mb-4 tracking-wider">LANGUAGE</h3>
          <div className="relative z-50">
            <button onClick={() => setShowLanguages(!showLanguages)}
              className="w-full bg-white/[0.03] px-4 py-3 rounded-xl text-left flex items-center justify-between
                border border-white/[0.06] hover:border-amber-500/20 transition-all cursor-pointer">
              <span className="text-white/80 text-sm">{selectedLang?.native} ({selectedLang?.name})</span>
              <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <AnimatePresence>
              {showLanguages && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="absolute z-50 w-full mt-2 glass-strong rounded-xl max-h-48 overflow-y-auto pointer-events-auto">
                  {LANGUAGES.map((l) => (
                    <button key={l.code} onClick={() => handleLanguageSelect(l.code)}
                      className={`w-full px-4 py-2.5 text-left hover:bg-white/5 transition-colors flex justify-between items-center cursor-pointer border-b border-white/[0.03] last:border-0 pointer-events-auto
                        ${language === l.code ? 'bg-amber-500/10' : ''}`}>
                      <span className={`text-sm ${language === l.code ? 'text-amber-200' : 'text-white/70'}`}>{l.native}</span>
                      <span className="text-white/30 text-xs">{l.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Profile */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass rounded-2xl p-5">
          <h3 className="text-white/50 text-xs font-medium mb-4 tracking-wider">PROFILE</h3>
          <div className="space-y-4">
            <div>
              <label className="text-white/30 text-[11px] mb-1 block">Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                className="w-full bg-white/[0.03] rounded-xl px-4 py-3 text-white/80 outline-none border border-white/[0.04] focus:border-amber-500/20 transition text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white/30 text-[11px] mb-1 block">City</label>
                <input type="text" value={city} onChange={e => setCity(e.target.value)}
                  className="w-full bg-white/[0.03] rounded-xl px-4 py-3 text-white/80 outline-none border border-white/[0.04] focus:border-amber-500/20 transition text-sm" />
              </div>
              <div>
                <label className="text-white/30 text-[11px] mb-1 block">Country</label>
                <input type="text" value={country} onChange={e => setCountry(e.target.value)}
                  className="w-full bg-white/[0.03] rounded-xl px-4 py-3 text-white/80 outline-none border border-white/[0.04] focus:border-amber-500/20 transition text-sm" />
              </div>
            </div>
            <div>
              <label className="text-white/30 text-[11px] mb-2 block">Madhab</label>
              <div className="grid grid-cols-4 gap-1.5">
                {['hanafi', 'shafii', 'maliki', 'hanbali'].map(m => (
                  <button key={m} onClick={() => setMadhab(m)}
                    className={`py-2.5 rounded-lg text-[11px] capitalize cursor-pointer transition-all
                      ${madhab === m ? 'bg-amber-500/10 text-amber-200 border border-amber-500/15' : 'glass text-white/35'}`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Visual */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-5">
          <h3 className="text-white/50 text-xs font-medium mb-4 tracking-wider">VISUAL</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Current style</p>
                <p className="text-white/30 text-xs mt-1">Low-end or high-end mode for app visuals.</p>
              </div>
              <span className="text-emerald-300/40 text-[11px]">{performanceMode === 'low' ? 'Simple' : 'Styled'}</span>
            </div>
            <div className="flex items-center justify-between">
              <div><p className="text-white/70 text-sm">Rainbow Borders</p></div>
              <span className="text-emerald-300/40 text-[11px]">{performanceMode === 'low' ? 'Off' : 'On'}</span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="glass rounded-2xl p-5">
          <h3 className="text-white/50 text-xs font-medium mb-4 tracking-wider">DEVICE MODE</h3>
          <div className="grid gap-3">
            {[
              { id: 'low', title: 'Low-End Device', subtitle: 'No rainbow borders, no particles, simple theme.' },
              { id: 'high', title: 'High-End Device', subtitle: 'Rainbow border, theme glow, flying particles.' },
            ].map((option) => (
              <button key={option.id} onClick={() => setPerformanceMode(option.id as 'low' | 'high')}
                className={`w-full p-4 rounded-2xl text-left border transition-all ${performanceMode === option.id ? 'border-amber-400/30 bg-amber-500/5' : 'border-white/[0.06] bg-white/[0.015] hover:border-white/[0.16]'}`}>
                <p className="text-sm text-white/80 font-medium">{option.title}</p>
                <p className="text-white/30 text-xs mt-1">{option.subtitle}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* About */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass rounded-2xl p-5">
          <h3 className="text-white/50 text-xs font-medium mb-3 tracking-wider">ABOUT</h3>
          <p className="text-white/40 text-sm">Noor — Islamic Digital Ecosystem</p>
          <p className="text-white/20 text-[11px] mt-1">Version 1.0</p>
        </motion.div>

        <div className="space-y-3">
          <RainbowButton onClick={handleSave} size="lg" className="w-full">
            {saved ? 'Saved!' : 'Save Settings'}
          </RainbowButton>
          <button onClick={() => { localStorage.clear(); window.location.reload(); }}
            className="w-full py-3 rounded-xl text-red-400/40 text-sm hover:text-red-400/70 hover:bg-red-500/5 transition cursor-pointer">
            Reset All Data
          </button>
        </div>
      </div>
    </div>
  );
}
