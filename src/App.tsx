import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from './store/appStore';
import ParticleBackground from './components/ParticleBackground';
import PageTransition from './components/PageTransition';
import SplashScreen from './components/SplashScreen';
import OnboardingAuth from './components/OnboardingAuth';
import OnboardingSlides from './components/OnboardingSlides';
import HomePage from './pages/HomePage';
import QuranPage from './pages/QuranPage';
import QuranReaderPage from './pages/QuranReaderPage';
import SalahPage from './pages/SalahPage';
import HadithPage from './pages/HadithPage';
import MorePage from './pages/MorePage';
import DhikrPage from './pages/DhikrPage';
import LibraryPage from './pages/LibraryPage';
import QuizPage from './pages/QuizPage';
import AIAssistantPage from './pages/AIAssistantPage';
import DeaddictionPage from './pages/DeaddictionPage';
import SettingsPage from './pages/SettingsPage';
import ArabicLearningPage from './pages/ArabicLearningPage';
import DictionaryPage from './pages/DictionaryPage';

function App() {
  const currentPage = useAppStore(s => s.currentPage);
  const userProfile = useAppStore(s => s.userProfile);
  const performanceMode = useAppStore(s => s.performanceMode);
  const appScale = useAppStore(s => s.appScale);
  const hasParticles = performanceMode !== 'low';

  const renderPage = () => {
    switch (currentPage) {
      case 'splash': return <SplashScreen />;
      case 'onboarding-auth': return <OnboardingAuth />;
      case 'onboarding-slides': return <OnboardingSlides />;
      case 'home': return <HomePage />;
      case 'quran': return <QuranPage />;
      case 'quran-reader': return <QuranReaderPage />;
      case 'salah': return <SalahPage />;
      case 'hadith': return <HadithPage />;
      case 'more': return <MorePage />;
      case 'dhikr': return <DhikrPage />;
      case 'library': return <LibraryPage />;
      case 'quiz': return <QuizPage />;
      case 'ai-assistant': return <AIAssistantPage />;
      case 'deaddiction': return <DeaddictionPage />;
      case 'settings': return <SettingsPage />;
      case 'arabic-learning': return <ArabicLearningPage />;
      case 'dictionary': return <DictionaryPage />;
      default: return <HomePage />;
    }
  };

  const isOverlay = currentPage === 'splash' || currentPage === 'onboarding-auth' || currentPage === 'onboarding-slides';
  const isRtl = userProfile?.language && ['ar', 'ur', 'fa', 'ps'].includes(userProfile.language);

  const rootBg = performanceMode === 'low' ? 'bg-[#050816]' : 'bg-[#040710]';

  return (
    <div className={`fixed inset-0 ${rootBg} text-white ${isRtl ? 'rtl' : 'ltr'}`} style={{ overflowX: 'hidden' }}>
      <div style={{ position: 'absolute', left: '50%', top: 0, width: `${100 / appScale}%`, minHeight: '100vh', transform: `translateX(-50%) scale(${appScale})`, transformOrigin: 'top center' }}>
        {/* Atmospheric background layers */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0" style={{
            background: performanceMode === 'low'
              ? 'rgba(4,7,16,1)'
              : 'radial-gradient(ellipse at 20% 15%, rgba(212,168,83,0.02) 0%, transparent 40%), radial-gradient(ellipse at 80% 85%, rgba(45,212,168,0.012) 0%, transparent 35%), radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.008) 0%, transparent 45%)',
          }}/>
          {hasParticles && (
            <div className="absolute inset-0 animate-breathe" style={{
              background: 'radial-gradient(ellipse at 55% 35%, rgba(212,168,83,0.012) 0%, transparent 45%)',
            }}/>
          )}
          {hasParticles && <ParticleBackground />}
        </div>

        {isOverlay ? (
          <AnimatePresence mode="wait">{renderPage()}</AnimatePresence>
        ) : (
          <div className="fixed inset-0 z-10 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                <PageTransition key={currentPage} pageKey={currentPage}>
                  {renderPage()}
                </PageTransition>
              </AnimatePresence>
            </div>
            <BottomNav />
          </div>
        )}
      </div>
    </div>
  );
}

function NavIcon({ type, active }: { type: string; active: boolean }) {
  const c = active ? '#d4a853' : 'rgba(255,255,255,0.18)';
  const f = active ? `${c}12` : 'none';
  const w = '1.2';
  if (type === 'home') return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3L3 10v10a1 1 0 001 1h5v-6h6v6h5a1 1 0 001-1V10L12 3z" stroke={c} strokeWidth={w} fill={f} strokeLinejoin="round"/></svg>);
  if (type === 'quran') return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 6.25v13M12 6.25C10.8 5.5 9.2 5 7.5 5S4.2 5.5 3 6.25v13C4.2 18.5 5.8 18 7.5 18s3.3.5 4.5 1.25m0-13C13.2 5.5 14.8 5 16.5 5s3.3.5 4.5 1.25v13C19.8 18.5 18.2 18 16.5 18s-3.3.5-4.5 1.25" stroke={c} strokeWidth={w} strokeLinecap="round"/></svg>);
  if (type === 'salah') return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3C9 5.5 7 8.5 7 11.5V20h10v-8.5c0-3-2-6-5-8.5z" stroke={c} strokeWidth={w} fill={f} strokeLinejoin="round"/><line x1="4" y1="20" x2="20" y2="20" stroke={c} strokeWidth={w}/><path d="M12 3l-.3 1h.6L12 3z" fill={c} opacity="0.5"/></svg>);
  if (type === 'hadith') return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="18" rx="2" stroke={c} strokeWidth={w} fill={f}/><line x1="9" y1="8" x2="15" y2="8" stroke={c} strokeWidth="0.7" opacity="0.4"/><line x1="9" y1="11" x2="15" y2="11" stroke={c} strokeWidth="0.7" opacity="0.4"/><line x1="9" y1="14" x2="13" y2="14" stroke={c} strokeWidth="0.7" opacity="0.4"/></svg>);
  if (type === 'more') return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2l2 6.5L20 10l-5 4.5L16 22l-4-3.5L8 22l1-7.5L4 10l6-1.5L12 2z" stroke={c} strokeWidth={w} fill={f} strokeLinejoin="round"/></svg>);
  return null;
}

function BottomNav() {
  const currentPage = useAppStore(s => s.currentPage);
  const setPage = useAppStore(s => s.setPage);
  const items = [
    { id:'home', label:'Home', type:'home' },
    { id:'quran', label:"Qur'an", type:'quran' },
    { id:'salah', label:'Salah', type:'salah' },
    { id:'hadith', label:'Hadith', type:'hadith' },
    { id:'more', label:'More', type:'more' },
  ];
  const isActive = (id: string) => {
    if (id==='quran') return currentPage==='quran'||currentPage==='quran-reader';
    if (id==='more') return ['more','dhikr','library','quiz','ai-assistant','deaddiction','settings','arabic-learning','dictionary'].includes(currentPage);
    return currentPage===id;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="glass-strong border-t border-white/[0.03]">
        <div className="flex items-center justify-around px-1 py-2 max-w-lg mx-auto">
          {items.map(item => {
            const active = isActive(item.id);
            return (
              <motion.button key={item.id} onClick={()=>setPage(item.id as any)} whileTap={{scale:0.9}}
                className="flex flex-col items-center py-1.5 px-3 rounded-xl transition-all cursor-pointer relative group">
                {active && (
                  <motion.div layoutId="nav-dot" className="absolute -top-[1px] w-5 h-[1.5px] rounded-full"
                    style={{background:'linear-gradient(to right,#d4a853,#2dd4a8)'}}
                    transition={{type:'spring',stiffness:500,damping:30}}/>
                )}
                {active && <div className="absolute inset-0 rounded-xl opacity-25" style={{background:'radial-gradient(circle,rgba(212,168,83,0.1) 0%,transparent 70%)'}}/>}
                <NavIcon type={item.type} active={active}/>
                <span className={`text-[8px] mt-0.5 tracking-wider transition-colors duration-500 ${active?'text-amber-200/55':'text-white/12 group-hover:text-white/22'}`}>{item.label}</span>
              </motion.button>
            );
          })}
        </div>
        <div className="h-[env(safe-area-inset-bottom)]"/>
      </div>
    </div>
  );
}

export default App;
