import { motion } from 'framer-motion';
import { useAppStore, AppPage } from '../store/appStore';
import SceneBg from '../components/SceneBg';

// SVG inline icons for each item
function ItemIcon({ type, color }: { type: string; color: string }) {
  const s = 28;
  switch(type) {
    case 'dhikr': return (
      <svg width={s} height={s} viewBox="0 0 28 28" fill="none">
        {[0,1,2,3,4,5,6,7,8,9].map(i => {
          const a=(i/10)*Math.PI*2-Math.PI/2;
          return <circle key={i} cx={14+Math.cos(a)*9} cy={14+Math.sin(a)*9} r={2} fill={color} opacity="0.2"/>;
        })}
        <circle cx="14" cy="14" r="4" fill="none" stroke={color} strokeWidth="0.5" opacity="0.3"/>
      </svg>
    );
    case 'library': return (
      <svg width={s} height={s} viewBox="0 0 28 28" fill="none">
        <rect x="4" y="5" width="5" height="18" rx="0.5" fill={color} opacity="0.08" stroke={color} strokeWidth="0.4"/>
        <rect x="10" y="4" width="5" height="19" rx="0.5" fill={color} opacity="0.06" stroke={color} strokeWidth="0.4"/>
        <rect x="16" y="6" width="5" height="17" rx="0.5" fill={color} opacity="0.1" stroke={color} strokeWidth="0.4"/>
        <rect x="22" y="5" width="4" height="18" rx="0.5" fill={color} opacity="0.07" stroke={color} strokeWidth="0.4"/>
      </svg>
    );
    case 'arabic': return (
      <svg width={s} height={s} viewBox="0 0 28 28" fill="none">
        <path d="M6 18 Q14 8, 22 14" fill="none" stroke={color} strokeWidth="1" opacity="0.2"/>
        <path d="M8 22 Q16 14, 24 18" fill="none" stroke={color} strokeWidth="0.7" opacity="0.15"/>
        <circle cx="12" cy="10" r="1.2" fill={color} opacity="0.2"/>
        <circle cx="20" cy="16" r="1" fill={color} opacity="0.15"/>
      </svg>
    );
    case 'dictionary': return (
      <svg width={s} height={s} viewBox="0 0 28 28" fill="none">
        <rect x="5" y="3" width="18" height="22" rx="2" fill="none" stroke={color} strokeWidth="0.5" opacity="0.3"/>
        <line x1="5" y1="8" x2="23" y2="8" stroke={color} strokeWidth="0.3" opacity="0.2"/>
        <text x="10" y="19" fill={color} fontSize="10" opacity="0.2" fontFamily="serif">ع</text>
      </svg>
    );
    case 'quiz': return (
      <svg width={s} height={s} viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" fill="none" stroke={color} strokeWidth="0.5" opacity="0.25"/>
        <path d="M11 11 Q11 8, 14 8 Q17 8, 17 11 Q17 13, 14 14 L14 16" stroke={color} strokeWidth="0.8" opacity="0.3" fill="none"/>
        <circle cx="14" cy="19" r="0.8" fill={color} opacity="0.3"/>
      </svg>
    );
    case 'ai': return (
      <svg width={s} height={s} viewBox="0 0 28 28" fill="none">
        <path d="M14 4 L24 14 L14 24 L4 14Z" fill="none" stroke={color} strokeWidth="0.5" opacity="0.2"/>
        <circle cx="14" cy="14" r="5" fill="none" stroke={color} strokeWidth="0.5" opacity="0.3"/>
        <circle cx="14" cy="14" r="2" fill={color} opacity="0.1"/>
        <path d="M14 4v3M14 21v3M4 14h3M21 14h3" stroke={color} strokeWidth="0.4" opacity="0.2"/>
      </svg>
    );
    case 'focus': return (
      <svg width={s} height={s} viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" fill="none" stroke={color} strokeWidth="0.5" opacity="0.2"/>
        <circle cx="14" cy="14" r="6" fill="none" stroke={color} strokeWidth="0.4" opacity="0.15"/>
        <circle cx="14" cy="14" r="2" fill={color} opacity="0.12"/>
        <path d="M14 4v4M14 20v4M4 14h4M20 14h4" stroke={color} strokeWidth="0.5" opacity="0.15"/>
      </svg>
    );
    case 'settings': return (
      <svg width={s} height={s} viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="4" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3"/>
        {[0,1,2,3,4,5].map(i => {
          const a=(i/6)*Math.PI*2;
          return <line key={i} x1={14+Math.cos(a)*7} y1={14+Math.sin(a)*7} x2={14+Math.cos(a)*10} y2={14+Math.sin(a)*10}
            stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.2"/>;
        })}
      </svg>
    );
    default: return null;
  }
}

const MORE_ITEMS = [
  { id: 'dhikr' as AppPage, label: 'Dhikr Counter', arabic: 'الذكر', desc: 'Digital Tasbih & Voice Counting', color: '#2dd4a8', icon: 'dhikr' },
  { id: 'library' as AppPage, label: 'Islamic Library', arabic: 'المكتبة', desc: 'Books, Tafsir & Hadith Collections', color: '#f59e0b', icon: 'library' },
  { id: 'arabic-learning' as AppPage, label: 'Learn Arabic', arabic: 'تعلم العربية', desc: 'AI-Powered Arabic Lessons', color: '#14b8a6', icon: 'arabic' },
  { id: 'dictionary' as AppPage, label: 'Dictionary', arabic: 'القاموس', desc: 'Arabic-English Dictionary', color: '#8b5cf6', icon: 'dictionary' },
  { id: 'quiz' as AppPage, label: 'Islamic Quiz', arabic: 'الإختبار', desc: 'Test Your Knowledge', color: '#6366f1', icon: 'quiz' },
  { id: 'ai-assistant' as AppPage, label: 'AI Assistant', arabic: 'المساعد', desc: 'Intelligent Islamic Guide', color: '#a855f7', icon: 'ai' },
  { id: 'deaddiction' as AppPage, label: 'Focus & Purification', arabic: 'التزكية', desc: 'Discipline & Habit Tracking', color: '#ec4899', icon: 'focus' },
  { id: 'settings' as AppPage, label: 'Settings', arabic: 'الإعدادات', desc: 'Customize Your Experience', color: '#64748b', icon: 'settings' },
];

export default function MorePage() {
  const setPage = useAppStore(s => s.setPage);

  return (
    <div className="min-h-screen pb-28">
      <div className="relative overflow-hidden">
        <SceneBg scene="geometric" />
        <div className="relative z-10 px-6 pt-8 pb-5">
          <div className="flex items-center gap-4">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setPage('home')}
              className="w-10 h-10 glass rounded-xl flex items-center justify-center cursor-pointer">
              <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold font-arabic text-glow-gold text-amber-100">المزيد</h1>
              <p className="text-white/30 text-[11px]">Explore the Ecosystem</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-2">
        {MORE_ITEMS.map((item, i) => (
          <motion.button key={item.id}
            initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.04, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.01, x: 4 }} whileTap={{ scale: 0.98 }}
            onClick={() => setPage(item.id)}
            className="w-full glass rounded-xl p-4 flex items-center gap-3.5 hover:bg-white/[0.03] transition-all cursor-pointer text-left group">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${item.color}08`, border: `1px solid ${item.color}12` }}>
              <ItemIcon type={item.icon} color={item.color} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-white/80 font-medium text-sm">{item.label}</span>
                <span className="font-arabic text-amber-200/30 text-xs">{item.arabic}</span>
              </div>
              <p className="text-white/30 text-xs mt-0.5">{item.desc}</p>
            </div>
            <svg className="w-4 h-4 text-white/8 group-hover:text-amber-200/25 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
