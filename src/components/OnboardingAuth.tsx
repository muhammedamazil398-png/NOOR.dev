import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useAppStore, LANGUAGES } from '../store/appStore';
import RainbowButton from './RainbowButton';
import SceneBg from './SceneBg';

const MADHABS = [
  { id: 'hanafi', name: 'Hanafi', arabic: 'حنفي' },
  { id: 'shafii', name: "Shafi'i", arabic: 'شافعي' },
  { id: 'maliki', name: 'Maliki', arabic: 'مالكي' },
  { id: 'hanbali', name: 'Hanbali', arabic: 'حنبلي' },
];

const RECITERS = ['Mishary Alafasy', 'Abdurrahman As-Sudais', 'Abdul Basit', 'Al-Husary', 'Al-Minshawi'];
const GOALS = ['Read full Qur\'an', 'Memorize surahs', 'Learn Arabic', 'Daily prayers', 'Study Hadith', 'Improve dhikr'];

export default function OnboardingAuth() {
  const [step, setStep] = useState(0); // 0=lang, 1=basic, 2=followup
  const [name, setName] = useState('');
  const [madhab, setMadhab] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [gender, setGender] = useState('');
  const [language, setLanguage] = useState('en');
  const [arabicLevel, setArabicLevel] = useState('');
  const [preferredQari, setPreferredQari] = useState('');
  const [goals, setGoals] = useState<string[]>([]);
  const [citySearch, setCitySearch] = useState('');
  const [cityResults, setCityResults] = useState<Array<{city:string;country:string}>>([]);
  const [showCities, setShowCities] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [downloadingLang, setDownloadingLang] = useState(false);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout>|null>(null);

  const setPage = useAppStore(s => s.setPage);
  const setUserProfile = useAppStore(s => s.setUserProfile);
  const setLanguageLoaded = useAppStore(s => s.setLanguageLoaded);
  const performanceMode = useAppStore(s => s.performanceMode);
  const setPerformanceMode = useAppStore(s => s.setPerformanceMode);

  const selectedLang = LANGUAGES.find(l => l.code === language);

  useEffect(() => { /* auto-advance animation */ }, []);

  const searchCities = (q: string) => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    if (q.length < 2) { setCityResults([]); return; }
    searchTimerRef.current = setTimeout(async () => {
      try {
        const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=8&language=en`);
        const d = await r.json();
        setCityResults(d.results?.map((x: any) => ({ city: x.name, country: x.country || '' })) || []);
      } catch { setCityResults([]); }
    }, 300);
  };

  const handleLangSelect = async (code: string) => {
    setLanguage(code); setShowLanguages(false);
    if (code !== 'en') {
      setDownloadingLang(true); setLanguageLoaded(false);
      await new Promise(r => setTimeout(r, 1200));
      setLanguageLoaded(true); setDownloadingLang(false);
    }
  };

  const toggleGoal = (g: string) => setGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);

  const handleFinish = () => {
    setUserProfile({ name: name||'Guest', madhab: madhab||'hanafi', city: city||'Makkah', country: country||'Saudi Arabia', gender, language, arabicLevel: (arabicLevel as any) || '' });
    setExiting(true);
    setTimeout(() => setPage('onboarding-slides'), 900);
  };

  return (
    <div className="fixed inset-0 overflow-y-auto z-40">
      <SceneBg scene={step === 0 ? 'stars' : step === 1 ? 'mosque' : 'geometric'} />

      {/* Particles */}
      {Array.from({length:16}).map((_,i) => (
        <motion.div key={i} className="fixed rounded-full pointer-events-none"
          style={{ width: Math.random()*2.5+0.5, height: Math.random()*2.5+0.5,
            background: i%3===0?'#d4a853':i%3===1?'#2dd4a8':'#6366f1',
            left:`${Math.random()*100}%`, top:`${Math.random()*100}%`,
            boxShadow:`0 0 6px ${i%3===0?'#d4a853':i%3===1?'#2dd4a8':'#6366f1'}`,
          }}
          animate={{ y:[0,-35,0], opacity:[0.08,0.4,0.08] }}
          transition={{ duration:5+Math.random()*4, repeat:Infinity, delay:Math.random()*3 }}
        />
      ))}

      {/* Download overlay */}
      <AnimatePresence>
        {downloadingLang && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="text-center">
              <motion.div animate={{rotate:360}} transition={{repeat:Infinity,duration:1.5,ease:'linear'}}
                className="w-10 h-10 mx-auto mb-3 rounded-full border-2 border-amber-200/15 border-t-amber-200/70"/>
              <p className="text-white/50 text-sm">Downloading {selectedLang?.native}...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exit */}
      <AnimatePresence>
        {exiting && (
          <>
            <motion.div initial={{x:'100%'}} animate={{x:0}} transition={{duration:0.5,ease:[0.22,1,0.36,1]}}
              className="fixed inset-0 z-50" style={{background:'rgba(4,7,16,0.88)',backdropFilter:'blur(30px)'}}/>
            <motion.div initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}}
              transition={{delay:0.3}} className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="font-arabic text-5xl text-amber-100 text-glow-gold">بِسْمِ اللَّهِ</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-10">
        <motion.div
          initial={{opacity:0,y:40}} animate={{opacity:exiting?0:1,y:exiting?-20:0,filter:exiting?'blur(10px)':'blur(0px)'}}
          transition={{duration:0.7,delay:0.2}} className="w-full max-w-lg">

          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-glow-gold font-arabic text-amber-100 mb-2">نُور</h1>
            <div className="divider-gold w-24 mx-auto mb-2"/>
            <p className="text-amber-200/30 text-[10px] tracking-[0.3em] uppercase font-light">
              {step===0?'Choose Your Language':step===1?'Tell Us About You':'Personalize Your Experience'}
            </p>
          </div>

          {/* Step progress */}
          <div className="flex gap-1.5 justify-center mb-6">
            {[0,1,2].map(s => (
              <div key={s} className={`h-[2px] rounded-full transition-all duration-500 ${s<=step?'w-8 bg-amber-200/40':'w-4 bg-white/8'}`}/>
            ))}
          </div>

          <div className="glass rounded-3xl p-6 md:p-8">
            <AnimatePresence mode="wait">
              {/* STEP 0: Language */}
              {step === 0 && (
                <motion.div key="s0" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} className="space-y-5">
                  <label className="block text-amber-200/50 text-xs tracking-wider uppercase font-light mb-2">Select Language</label>
                  <button onClick={()=>setShowLanguages(!showLanguages)}
                    className="w-full bg-white/[0.03] px-5 py-4 rounded-xl text-left flex items-center justify-between border border-white/[0.05] hover:border-amber-500/15 transition cursor-pointer">
                    <span className="text-white/75">{selectedLang?.native} ({selectedLang?.name})</span>
                    <svg className="w-4 h-4 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                  </button>
                  <AnimatePresence>
                    {showLanguages && (
                      <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}}
                        className="glass-strong rounded-xl max-h-48 overflow-y-auto">
                        {LANGUAGES.map(l => (
                          <button key={l.code} onClick={()=>handleLangSelect(l.code)}
                            className={`w-full px-4 py-2.5 text-left hover:bg-white/[0.04] flex justify-between items-center cursor-pointer border-b border-white/[0.02] last:border-0 text-sm ${language===l.code?'bg-amber-500/8 text-amber-200':'text-white/60'}`}>
                            <span>{l.native}</span><span className="text-white/25 text-xs">{l.name}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-3">
                    <p className="text-amber-200/50 text-xs uppercase tracking-[0.2em] font-light">Device Experience</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => setPerformanceMode('low')}
                        className={`rounded-2xl p-3 text-left text-sm transition-all border ${performanceMode === 'low' ? 'border-amber-500/30 bg-amber-500/5 text-amber-100' : 'border-white/[0.08] bg-white/[0.03] text-white/60'}`}>
                        <p className="font-medium">Low-End Device</p>
                        <p className="text-white/30 text-[11px] mt-1">No rainbow, no particles, simpler theme.</p>
                      </button>
                      <button onClick={() => setPerformanceMode('high')}
                        className={`rounded-2xl p-3 text-left text-sm transition-all border ${performanceMode === 'high' ? 'border-amber-500/30 bg-amber-500/5 text-amber-100' : 'border-white/[0.08] bg-white/[0.03] text-white/60'}`}>
                        <p className="font-medium">High-End Device</p>
                        <p className="text-white/30 text-[11px] mt-1">Rainbow borders, theme glow, flying particles.</p>
                      </button>
                    </div>
                  </div>

                  <RainbowButton onClick={()=>setStep(1)} size="lg" className="w-full">Continue</RainbowButton>
                </motion.div>
              )}

              {/* STEP 1: Basic info */}
              {step === 1 && (
                <motion.div key="s1" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} className="space-y-5">
                  <div>
                    <label className="block text-amber-200/50 text-xs tracking-wider uppercase font-light mb-1.5">Name <span className="text-white/15">— optional</span></label>
                    <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="What shall we call you?"
                      className="w-full bg-white/[0.03] px-5 py-3.5 text-white/85 placeholder-white/12 rounded-xl outline-none text-sm border border-white/[0.04] focus:border-amber-500/15 transition"/>
                  </div>
                  <div>
                    <label className="block text-amber-200/50 text-xs tracking-wider uppercase font-light mb-2">Madhab</label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {MADHABS.map(m => (
                        <motion.button key={m.id} whileTap={{scale:0.97}} onClick={()=>setMadhab(m.id)}
                          className={`p-3.5 rounded-xl text-center cursor-pointer transition-all
                            ${madhab===m.id?'bg-amber-500/8 border border-amber-500/20':'bg-white/[0.02] border border-white/[0.03]'}`}>
                          <div className="font-arabic text-lg text-amber-200/60 mb-0.5">{m.arabic}</div>
                          <div className="text-[11px] text-white/35">{m.name}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <div className="relative">
                    <label className="block text-amber-200/50 text-xs tracking-wider uppercase font-light mb-1.5">City</label>
                    <input type="text" value={citySearch}
                      onChange={e=>{setCitySearch(e.target.value);searchCities(e.target.value);setShowCities(true);}}
                      onFocus={()=>setShowCities(true)} onBlur={()=>setTimeout(()=>setShowCities(false),200)}
                      placeholder="Search any city..."
                      className="w-full bg-white/[0.03] px-5 py-3.5 text-white/85 placeholder-white/12 rounded-xl outline-none text-sm border border-white/[0.04] focus:border-emerald-500/15 transition"/>
                    <AnimatePresence>
                      {showCities && cityResults.length>0 && (
                        <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}}
                          className="absolute z-30 w-full mt-1.5 glass-strong rounded-xl max-h-40 overflow-y-auto">
                          {cityResults.map((c,i)=>(
                            <button key={`${c.city}-${i}`}
                              onMouseDown={()=>{setCity(c.city);setCountry(c.country);setCitySearch(`${c.city}, ${c.country}`);setShowCities(false);}}
                              className="w-full px-4 py-2.5 text-left hover:bg-white/[0.04] flex justify-between items-center cursor-pointer border-b border-white/[0.02] last:border-0">
                              <span className="text-white/70 text-sm">{c.city}</span>
                              <span className="text-white/25 text-xs">{c.country}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div>
                    <label className="block text-amber-200/50 text-xs tracking-wider uppercase font-light mb-2">Gender <span className="text-white/15">— optional</span></label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {['Male','Female'].map(g=>(
                        <motion.button key={g} whileTap={{scale:0.97}} onClick={()=>setGender(g.toLowerCase())}
                          className={`py-3.5 rounded-xl text-center cursor-pointer transition-all text-sm
                            ${gender===g.toLowerCase()?'bg-emerald-500/8 border border-emerald-500/20 text-emerald-300/70':'bg-white/[0.02] border border-white/[0.03] text-white/40'}`}>
                          {g}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2.5 pt-1">
                    <RainbowButton onClick={()=>setStep(0)} size="md" className="flex-1">Back</RainbowButton>
                    <RainbowButton onClick={()=>setStep(2)} size="md" className="flex-1">Continue</RainbowButton>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Adaptive follow-up */}
              {step === 2 && (
                <motion.div key="s2" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} className="space-y-5">
                  <div>
                    <label className="block text-amber-200/50 text-xs tracking-wider uppercase font-light mb-2">Arabic Level</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['beginner','intermediate','advanced'].map(l=>(
                        <button key={l} onClick={()=>setArabicLevel(l)}
                          className={`py-3 rounded-xl text-center cursor-pointer transition-all text-xs capitalize
                            ${arabicLevel===l?'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300/70':'bg-white/[0.02] border border-white/[0.03] text-white/35'}`}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-amber-200/50 text-xs tracking-wider uppercase font-light mb-2">Preferred Qari</label>
                    <div className="space-y-1.5">
                      {RECITERS.map(q=>(
                        <button key={q} onClick={()=>setPreferredQari(q)}
                          className={`w-full px-4 py-2.5 rounded-xl text-left text-sm cursor-pointer transition-all
                            ${preferredQari===q?'bg-amber-500/8 border border-amber-500/15 text-amber-200/70':'bg-white/[0.02] border border-white/[0.03] text-white/40'}`}>
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-amber-200/50 text-xs tracking-wider uppercase font-light mb-2">Your Goals</label>
                    <div className="flex flex-wrap gap-2">
                      {GOALS.map(g=>(
                        <button key={g} onClick={()=>toggleGoal(g)}
                          className={`px-3.5 py-2 rounded-full text-xs cursor-pointer transition-all
                            ${goals.includes(g)?'bg-emerald-500/12 border border-emerald-500/20 text-emerald-300/60':'bg-white/[0.02] border border-white/[0.03] text-white/30'}`}>
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2.5 pt-1">
                    <RainbowButton onClick={()=>setStep(1)} size="md" className="flex-1">Back</RainbowButton>
                    <RainbowButton onClick={handleFinish} size="md" className="flex-1">Begin Journey</RainbowButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={handleFinish}
            className="block mx-auto mt-4 text-white/15 text-[11px] hover:text-white/30 transition cursor-pointer tracking-wider">
            Skip for now
          </button>
        </motion.div>
      </div>
    </div>
  );
}
