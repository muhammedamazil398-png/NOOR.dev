import { motion } from 'framer-motion';

// Rich inline SVG Islamic visuals for every section — NO living beings
// Each creates a unique, detailed atmospheric scene

export function VisualQuran({ size = 80, className = '' }: { size?: number; className?: string }) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 80 80" className={className}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      <defs>
        <linearGradient id="vq-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2dd4a8" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#d4a853" stopOpacity="0.1"/>
        </linearGradient>
      </defs>
      <rect x="15" y="12" width="50" height="56" rx="4" fill="url(#vq-g)" stroke="#2dd4a8" strokeWidth="0.6"/>
      <rect x="18" y="15" width="44" height="50" rx="3" fill="none" stroke="#2dd4a8" strokeWidth="0.3"/>
      <line x1="40" y1="18" x2="40" y2="62" stroke="#2dd4a8" strokeWidth="0.3" opacity="0.5"/>
      <path d="M25 28h12M25 34h10M25 40h12M25 46h8" stroke="#d4a853" strokeWidth="0.5" opacity="0.4"/>
      <path d="M45 28h12M45 34h10M45 40h12M45 46h8" stroke="#d4a853" strokeWidth="0.5" opacity="0.4"/>
      <path d="M36 8l4-3 4 3" stroke="#d4a853" strokeWidth="0.5" fill="none" opacity="0.6"/>
      <circle cx="40" cy="6" r="1" fill="#d4a853" opacity="0.4"/>
    </motion.svg>
  );
}

export function VisualMosque({ size = 80, className = '' }: { size?: number; className?: string }) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 80 80" className={className}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      <defs>
        <linearGradient id="vm-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15"/>
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.03"/>
        </linearGradient>
      </defs>
      {/* Dome */}
      <path d="M40 14 C30 22, 22 32, 22 42 L22 65 L58 65 L58 42 C58 32, 50 22, 40 14Z" fill="url(#vm-g)" stroke="#6366f1" strokeWidth="0.5"/>
      {/* Crescent */}
      <path d="M40 10 C38 12, 37 14, 38 16 C36 14, 36 11, 40 10Z" fill="#d4a853" opacity="0.5"/>
      <circle cx="39" cy="12" r="0.8" fill="#d4a853" opacity="0.4"/>
      {/* Minarets */}
      <rect x="10" y="30" width="6" height="35" rx="1" fill="none" stroke="#6366f1" strokeWidth="0.4" opacity="0.5"/>
      <rect x="64" y="30" width="6" height="35" rx="1" fill="none" stroke="#6366f1" strokeWidth="0.4" opacity="0.5"/>
      <path d="M13 28 L13 24 L12 22 L14 22 L13 24Z" fill="#d4a853" opacity="0.3"/>
      <path d="M67 28 L67 24 L66 22 L68 22 L67 24Z" fill="#d4a853" opacity="0.3"/>
      {/* Door */}
      <path d="M34 65 L34 50 Q40 44, 46 50 L46 65Z" fill="#6366f1" opacity="0.1" stroke="#6366f1" strokeWidth="0.3"/>
      {/* Stars */}
      <circle cx="20" cy="12" r="0.6" fill="#fff" opacity="0.3"/>
      <circle cx="60" cy="10" r="0.5" fill="#fff" opacity="0.25"/>
      <circle cx="70" cy="18" r="0.4" fill="#d4a853" opacity="0.2"/>
      {/* Ground */}
      <line x1="5" y1="65" x2="75" y2="65" stroke="#6366f1" strokeWidth="0.5" opacity="0.3"/>
    </motion.svg>
  );
}

export function VisualHadith({ size = 80, className = '' }: { size?: number; className?: string }) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 80 80" className={className}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      <defs>
        <linearGradient id="vh-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15"/>
          <stop offset="100%" stopColor="#d4a853" stopOpacity="0.05"/>
        </linearGradient>
      </defs>
      {/* Scroll */}
      <path d="M18 12 L18 68 Q18 72, 22 72 L58 72 Q62 72, 62 68 L62 12 Q62 8, 58 8 L22 8 Q18 8, 18 12Z" fill="url(#vh-g)" stroke="#f59e0b" strokeWidth="0.5"/>
      {/* Scroll edges */}
      <ellipse cx="18" cy="12" rx="4" ry="3" fill="none" stroke="#f59e0b" strokeWidth="0.4" opacity="0.5"/>
      <ellipse cx="18" cy="68" rx="4" ry="3" fill="none" stroke="#f59e0b" strokeWidth="0.4" opacity="0.5"/>
      {/* Text lines */}
      <path d="M26 22h28M26 30h24M26 38h28M26 46h20M26 54h26M26 62h16" stroke="#d4a853" strokeWidth="0.5" opacity="0.3"/>
      {/* Decorative seal */}
      <circle cx="50" cy="62" r="6" fill="none" stroke="#d4a853" strokeWidth="0.4" opacity="0.4"/>
      <circle cx="50" cy="62" r="3" fill="#d4a853" opacity="0.08"/>
    </motion.svg>
  );
}

export function VisualStar({ size = 80, className = '' }: { size?: number; className?: string }) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 80 80" className={className}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      {/* 8-pointed star */}
      <path d="M40 8 L46 28 L66 22 L52 38 L72 40 L52 42 L66 58 L46 52 L40 72 L34 52 L14 58 L28 42 L8 40 L28 38 L14 22 L34 28Z" fill="#ec4899" fillOpacity="0.06" stroke="#ec4899" strokeWidth="0.5"/>
      <circle cx="40" cy="40" r="10" fill="none" stroke="#d4a853" strokeWidth="0.4" opacity="0.5"/>
      <circle cx="40" cy="40" r="5" fill="#d4a853" opacity="0.06"/>
      {/* Small stars */}
      <circle cx="18" cy="14" r="0.8" fill="#fff" opacity="0.3"/>
      <circle cx="65" cy="12" r="0.6" fill="#fff" opacity="0.25"/>
      <circle cx="12" cy="55" r="0.5" fill="#d4a853" opacity="0.3"/>
      <circle cx="68" cy="60" r="0.7" fill="#ec4899" opacity="0.2"/>
    </motion.svg>
  );
}

// Unique visuals for each onboarding slide
export function VisualPrayer({ size = 140, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" className={className}>
      <defs>
        <radialGradient id="vp-rg" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.12"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>
      <rect width="140" height="140" fill="url(#vp-rg)"/>
      {/* Grand mosque */}
      <path d="M70 25 C55 38, 35 52, 35 68 L35 110 L105 110 L105 68 C105 52, 85 38, 70 25Z" fill="#6366f1" fillOpacity="0.06" stroke="#6366f1" strokeWidth="0.6"/>
      <path d="M70 22 L69 26 L71 26Z" fill="#d4a853" opacity="0.5"/>
      <circle cx="70" cy="20" r="1.5" fill="none" stroke="#d4a853" strokeWidth="0.4"/>
      {/* Minarets */}
      <rect x="18" y="48" width="8" height="62" rx="2" fill="#6366f1" fillOpacity="0.04" stroke="#6366f1" strokeWidth="0.4"/>
      <rect x="114" y="48" width="8" height="62" rx="2" fill="#6366f1" fillOpacity="0.04" stroke="#6366f1" strokeWidth="0.4"/>
      <path d="M22 46 L22 40" stroke="#d4a853" strokeWidth="0.4"/>
      <path d="M118 46 L118 40" stroke="#d4a853" strokeWidth="0.4"/>
      {/* Windows */}
      <path d="M55 110 L55 88 Q70 78, 85 88 L85 110Z" fill="#6366f1" opacity="0.05" stroke="#6366f1" strokeWidth="0.3"/>
      {/* Stars */}
      <circle cx="25" cy="22" r="0.8" fill="#fff" opacity="0.2"/>
      <circle cx="115" cy="18" r="0.6" fill="#fff" opacity="0.2"/>
      <circle cx="50" cy="15" r="0.5" fill="#d4a853" opacity="0.3"/>
      {/* Moon */}
      <path d="M120 30 C117 32, 116 36, 118 38 C114 36, 115 31, 120 30Z" fill="#d4a853" opacity="0.25"/>
      <line x1="10" y1="110" x2="130" y2="110" stroke="#6366f1" strokeWidth="0.5" opacity="0.3"/>
    </svg>
  );
}

export function VisualLibrary({ size = 140, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" className={className}>
      <defs>
        <radialGradient id="vl-rg" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.1"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>
      <rect width="140" height="140" fill="url(#vl-rg)"/>
      {/* Bookshelf */}
      <rect x="15" y="20" width="110" height="100" rx="3" fill="none" stroke="#f59e0b" strokeWidth="0.5" opacity="0.3"/>
      <line x1="15" y1="55" x2="125" y2="55" stroke="#f59e0b" strokeWidth="0.3" opacity="0.3"/>
      <line x1="15" y1="85" x2="125" y2="85" stroke="#f59e0b" strokeWidth="0.3" opacity="0.3"/>
      {/* Books row 1 */}
      {[22,34,44,52,64,74,82,94,104,114].map((x,i) => (
        <rect key={i} x={x} y={25} width={[8,7,6,9,7,6,8,7,8,6][i]} height={28} rx="1"
          fill={['#2dd4a8','#d4a853','#6366f1','#ec4899','#f59e0b','#a855f7','#2dd4a8','#d4a853','#6366f1','#f59e0b'][i]}
          fillOpacity="0.08" stroke={['#2dd4a8','#d4a853','#6366f1','#ec4899','#f59e0b','#a855f7','#2dd4a8','#d4a853','#6366f1','#f59e0b'][i]}
          strokeWidth="0.3" opacity="0.6"/>
      ))}
      {/* Books row 2 */}
      {[22,32,44,56,66,78,90,100,112].map((x,i) => (
        <rect key={`r2-${i}`} x={x} y={58} width={[7,9,8,7,9,8,7,9,7][i]} height={25} rx="1"
          fill={['#f59e0b','#6366f1','#2dd4a8','#d4a853','#a855f7','#ec4899','#f59e0b','#2dd4a8','#6366f1'][i]}
          fillOpacity="0.06" stroke={['#f59e0b','#6366f1','#2dd4a8','#d4a853','#a855f7','#ec4899','#f59e0b','#2dd4a8','#6366f1'][i]}
          strokeWidth="0.3" opacity="0.5"/>
      ))}
      {/* Lantern */}
      <path d="M70 6 L70 12" stroke="#d4a853" strokeWidth="0.4" opacity="0.4"/>
      <path d="M65 12 L75 12 L77 18 L77 26 L75 30 L65 30 L63 26 L63 18Z" fill="#d4a853" fillOpacity="0.05" stroke="#d4a853" strokeWidth="0.4"/>
      <ellipse cx="70" cy="22" rx="2" ry="4" fill="#f59e0b" opacity="0.1"/>
    </svg>
  );
}

export function VisualArabic({ size = 140, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" className={className}>
      <defs>
        <radialGradient id="va-rg" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.1"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>
      <rect width="140" height="140" fill="url(#va-rg)"/>
      {/* Calligraphy strokes */}
      <path d="M30 70 Q50 45, 70 55 Q90 65, 110 50" fill="none" stroke="#14b8a6" strokeWidth="1.5" opacity="0.15"/>
      <path d="M35 85 Q55 65, 75 75 Q95 85, 105 70" fill="none" stroke="#d4a853" strokeWidth="1" opacity="0.12"/>
      <path d="M40 100 Q60 80, 80 90 Q100 100, 115 85" fill="none" stroke="#14b8a6" strokeWidth="0.8" opacity="0.1"/>
      {/* Dots */}
      <circle cx="55" cy="48" r="2" fill="#14b8a6" opacity="0.15"/>
      <circle cx="85" cy="62" r="1.5" fill="#d4a853" opacity="0.15"/>
      <circle cx="65" cy="78" r="2" fill="#14b8a6" opacity="0.12"/>
      {/* Ink pot */}
      <rect x="20" y="108" width="16" height="18" rx="3" fill="#14b8a6" fillOpacity="0.05" stroke="#14b8a6" strokeWidth="0.4"/>
      <path d="M28 108 L28 95 Q32 92, 36 90" stroke="#14b8a6" strokeWidth="0.4" opacity="0.3"/>
      {/* Geometric frame */}
      <path d="M70 10 L130 70 L70 130 L10 70Z" fill="none" stroke="#d4a853" strokeWidth="0.3" opacity="0.08"/>
    </svg>
  );
}

export function VisualDhikr({ size = 140, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" className={className}>
      <defs>
        <radialGradient id="vd-rg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2dd4a8" stopOpacity="0.1"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>
      <rect width="140" height="140" fill="url(#vd-rg)"/>
      {/* Tasbih beads circle */}
      {Array.from({length: 33}).map((_, i) => {
        const angle = (i / 33) * Math.PI * 2 - Math.PI / 2;
        const r = 45;
        const cx = 70 + Math.cos(angle) * r;
        const cy = 70 + Math.sin(angle) * r;
        return <circle key={i} cx={cx} cy={cy} r={2.5} fill="#2dd4a8" fillOpacity={0.06 + (i % 3) * 0.03} stroke="#2dd4a8" strokeWidth="0.3" opacity="0.5"/>;
      })}
      {/* Center */}
      <circle cx="70" cy="70" r="15" fill="none" stroke="#d4a853" strokeWidth="0.4" opacity="0.3"/>
      <circle cx="70" cy="70" r="8" fill="none" stroke="#d4a853" strokeWidth="0.3" opacity="0.2"/>
      {/* Tassel */}
      <path d="M70 115 L70 128 M68 128 L72 128" stroke="#d4a853" strokeWidth="0.5" opacity="0.3"/>
      <circle cx="70" cy="115" r="3" fill="#d4a853" opacity="0.05" stroke="#d4a853" strokeWidth="0.3"/>
    </svg>
  );
}

export function VisualLanguage({ size = 140, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" className={className}>
      <defs>
        <radialGradient id="vlg-rg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ec4899" stopOpacity="0.08"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>
      <rect width="140" height="140" fill="url(#vlg-rg)"/>
      {/* Globe */}
      <circle cx="70" cy="65" r="38" fill="none" stroke="#ec4899" strokeWidth="0.5" opacity="0.3"/>
      <ellipse cx="70" cy="65" rx="20" ry="38" fill="none" stroke="#ec4899" strokeWidth="0.3" opacity="0.2"/>
      <ellipse cx="70" cy="65" rx="38" ry="15" fill="none" stroke="#ec4899" strokeWidth="0.3" opacity="0.2"/>
      <line x1="32" y1="65" x2="108" y2="65" stroke="#ec4899" strokeWidth="0.3" opacity="0.2"/>
      <line x1="70" y1="27" x2="70" y2="103" stroke="#ec4899" strokeWidth="0.3" opacity="0.2"/>
      {/* Script samples around */}
      <text x="20" y="30" fill="#d4a853" fontSize="8" opacity="0.15" fontFamily="serif">ع</text>
      <text x="105" y="35" fill="#ec4899" fontSize="7" opacity="0.12" fontFamily="serif">A</text>
      <text x="15" y="100" fill="#2dd4a8" fontSize="7" opacity="0.12" fontFamily="serif">中</text>
      <text x="110" y="95" fill="#6366f1" fontSize="7" opacity="0.12" fontFamily="serif">Б</text>
      <text x="60" y="120" fill="#d4a853" fontSize="7" opacity="0.12" fontFamily="serif">ب</text>
    </svg>
  );
}

// Quick-access icons
export function IconDhikr({ size = 20, color = '#2dd4a8' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      {[0,1,2,3,4,5,6,7].map(i => {
        const a = (i/8)*Math.PI*2 - Math.PI/2;
        return <circle key={i} cx={10+Math.cos(a)*6} cy={10+Math.sin(a)*6} r={1.5} fill={color} opacity="0.25"/>;
      })}
      <circle cx="10" cy="10" r="2.5" fill="none" stroke={color} strokeWidth="0.5" opacity="0.4"/>
    </svg>
  );
}

export function IconAI({ size = 20, color = '#a855f7' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3"/>
      <path d="M7 10h6M10 7v6" stroke={color} strokeWidth="0.5" opacity="0.4"/>
      <circle cx="10" cy="10" r="2" fill={color} opacity="0.1"/>
      <path d="M10 3v1M10 16v1M3 10h1M16 10h1" stroke={color} strokeWidth="0.3" opacity="0.25"/>
    </svg>
  );
}

export function IconLibrary({ size = 20, color = '#f59e0b' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <rect x="3" y="4" width="4" height="12" rx="0.5" fill={color} opacity="0.1" stroke={color} strokeWidth="0.4"/>
      <rect x="8" y="3" width="4" height="13" rx="0.5" fill={color} opacity="0.08" stroke={color} strokeWidth="0.4"/>
      <rect x="13" y="5" width="4" height="11" rx="0.5" fill={color} opacity="0.06" stroke={color} strokeWidth="0.4"/>
    </svg>
  );
}

export function IconSettings({ size = 20, color = '#64748b' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="3" fill="none" stroke={color} strokeWidth="0.6" opacity="0.4"/>
      {[0,1,2,3,4,5].map(i => {
        const a = (i/6)*Math.PI*2;
        return <line key={i} x1={10+Math.cos(a)*5} y1={10+Math.sin(a)*5} x2={10+Math.cos(a)*7.5} y2={10+Math.sin(a)*7.5}
          stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.3"/>;
      })}
    </svg>
  );
}
