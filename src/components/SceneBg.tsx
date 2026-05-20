import { memo } from 'react';

// Each scene creates a unique atmospheric CSS+SVG Islamic environment
// NO living beings — only architecture, geometry, light, nature

interface Props { scene: string; opacity?: number; }

const SceneBg = memo(({ scene, opacity = 1 }: Props) => {
  const scenes: Record<string, { gradient: string; pattern: React.ReactNode; glow: string }> = {
    mosque: {
      gradient: 'linear-gradient(160deg, #0a0818 0%, #0d1428 40%, #071020 100%)',
      glow: 'radial-gradient(ellipse at 50% 25%, rgba(212,168,83,0.07) 0%, transparent 55%)',
      pattern: (
        <svg className="w-full h-full opacity-[0.025]"><defs>
          <pattern id="p-mosque" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M50 10 C40 25, 30 35, 30 50 L30 90 L70 90 L70 50 C70 35, 60 25, 50 10Z" fill="none" stroke="#d4a853" strokeWidth="0.4"/>
            <path d="M50 10 L49 15 L51 15Z" fill="#d4a853" opacity="0.5"/>
          </pattern>
        </defs><rect width="100%" height="100%" fill="url(#p-mosque)"/></svg>
      ),
    },
    quran: {
      gradient: 'linear-gradient(145deg, #0c0a14 0%, #0a1420 40%, #081018 100%)',
      glow: 'radial-gradient(ellipse at 55% 35%, rgba(45,212,168,0.06) 0%, transparent 50%)',
      pattern: (
        <svg className="w-full h-full opacity-[0.02]"><defs>
          <pattern id="p-quran" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <rect x="20" y="10" width="40" height="60" rx="3" fill="none" stroke="#2dd4a8" strokeWidth="0.3"/>
            <line x1="30" y1="25" x2="50" y2="25" stroke="#2dd4a8" strokeWidth="0.2" opacity="0.5"/>
            <line x1="30" y1="35" x2="50" y2="35" stroke="#2dd4a8" strokeWidth="0.2" opacity="0.5"/>
            <line x1="30" y1="45" x2="45" y2="45" stroke="#2dd4a8" strokeWidth="0.2" opacity="0.5"/>
          </pattern>
        </defs><rect width="100%" height="100%" fill="url(#p-quran)"/></svg>
      ),
    },
    stars: {
      gradient: 'linear-gradient(180deg, #050812 0%, #0a0e1a 50%, #060a14 100%)',
      glow: 'radial-gradient(ellipse at 60% 20%, rgba(99,102,241,0.05) 0%, transparent 50%)',
      pattern: (
        <svg className="w-full h-full opacity-[0.04]"><defs>
          <pattern id="p-stars" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="30" r="0.8" fill="#fff"/>
            <circle cx="80" cy="15" r="0.5" fill="#d4a853"/>
            <circle cx="50" cy="70" r="0.6" fill="#fff"/>
            <circle cx="100" cy="90" r="0.7" fill="#2dd4a8"/>
            <circle cx="10" cy="100" r="0.4" fill="#fff"/>
            <path d="M60 45l1.5 4.5h4.7l-3.8 2.8 1.5 4.5-3.9-2.8-3.9 2.8 1.5-4.5-3.8-2.8h4.7z" fill="#d4a853" opacity="0.15"/>
          </pattern>
        </defs><rect width="100%" height="100%" fill="url(#p-stars)"/></svg>
      ),
    },
    geometric: {
      gradient: 'linear-gradient(135deg, #080610 0%, #0d1525 50%, #070c18 100%)',
      glow: 'radial-gradient(ellipse at 50% 50%, rgba(212,168,83,0.04) 0%, transparent 50%)',
      pattern: (
        <svg className="w-full h-full opacity-[0.025]"><defs>
          <pattern id="p-geo" x="0" y="0" width="70" height="70" patternUnits="userSpaceOnUse">
            <path d="M35 0L70 35L35 70L0 35Z" fill="none" stroke="#d4a853" strokeWidth="0.35"/>
            <circle cx="35" cy="35" r="12" fill="none" stroke="#2dd4a8" strokeWidth="0.25"/>
            <path d="M35 15L55 35L35 55L15 35Z" fill="none" stroke="#d4a853" strokeWidth="0.2"/>
          </pattern>
        </defs><rect width="100%" height="100%" fill="url(#p-geo)"/></svg>
      ),
    },
    lantern: {
      gradient: 'linear-gradient(150deg, #0e0a08 0%, #0a1015 40%, #080c14 100%)',
      glow: 'radial-gradient(ellipse at 40% 30%, rgba(245,158,11,0.06) 0%, transparent 45%)',
      pattern: (
        <svg className="w-full h-full opacity-[0.025]"><defs>
          <pattern id="p-lantern" x="0" y="0" width="90" height="90" patternUnits="userSpaceOnUse">
            <path d="M40 15h10M45 15v5M38 20h14l2 8v14l-2 6H36l-2-6V28l2-8h2z" fill="none" stroke="#f59e0b" strokeWidth="0.3"/>
            <ellipse cx="45" cy="34" rx="3" ry="5" fill="#f59e0b" opacity="0.08"/>
          </pattern>
        </defs><rect width="100%" height="100%" fill="url(#p-lantern)"/></svg>
      ),
    },
    calligraphy: {
      gradient: 'linear-gradient(135deg, #0c0814 0%, #08101c 50%, #060a14 100%)',
      glow: 'radial-gradient(ellipse at 45% 35%, rgba(168,85,247,0.05) 0%, transparent 50%)',
      pattern: (
        <svg className="w-full h-full opacity-[0.02]"><defs>
          <pattern id="p-calli" x="0" y="0" width="100" height="60" patternUnits="userSpaceOnUse">
            <path d="M10 30 Q25 15 40 30 Q55 45 70 30 Q85 15 95 30" fill="none" stroke="#a855f7" strokeWidth="0.3"/>
            <circle cx="50" cy="30" r="2" fill="none" stroke="#d4a853" strokeWidth="0.2"/>
          </pattern>
        </defs><rect width="100%" height="100%" fill="url(#p-calli)"/></svg>
      ),
    },
    desert: {
      gradient: 'linear-gradient(180deg, #0a0812 0%, #12100a 50%, #0a0c10 100%)',
      glow: 'radial-gradient(ellipse at 50% 60%, rgba(212,168,83,0.04) 0%, transparent 50%)',
      pattern: (
        <svg className="w-full h-full opacity-[0.03]"><defs>
          <pattern id="p-desert" x="0" y="0" width="200" height="100" patternUnits="userSpaceOnUse">
            <path d="M0 70 Q50 50 100 65 Q150 80 200 60" fill="none" stroke="#d4a853" strokeWidth="0.3"/>
            <path d="M0 80 Q50 65 100 75 Q150 85 200 70" fill="none" stroke="#d4a853" strokeWidth="0.2"/>
          </pattern>
        </defs><rect width="100%" height="100%" fill="url(#p-desert)"/></svg>
      ),
    },
    library: {
      gradient: 'linear-gradient(135deg, #0c0a06 0%, #0a1210 40%, #080e18 100%)',
      glow: 'radial-gradient(ellipse at 35% 40%, rgba(245,158,11,0.05) 0%, transparent 45%)',
      pattern: (
        <svg className="w-full h-full opacity-[0.025]"><defs>
          <pattern id="p-lib" x="0" y="0" width="60" height="80" patternUnits="userSpaceOnUse">
            <rect x="5" y="10" width="10" height="60" rx="1" fill="none" stroke="#f59e0b" strokeWidth="0.25"/>
            <rect x="20" y="15" width="10" height="55" rx="1" fill="none" stroke="#d4a853" strokeWidth="0.25"/>
            <rect x="35" y="8" width="10" height="62" rx="1" fill="none" stroke="#2dd4a8" strokeWidth="0.25"/>
            <rect x="50" y="12" width="8" height="58" rx="1" fill="none" stroke="#6366f1" strokeWidth="0.25"/>
          </pattern>
        </defs><rect width="100%" height="100%" fill="url(#p-lib)"/></svg>
      ),
    },
  };

  const s = scenes[scene] || scenes.geometric;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity }}>
      <div className="absolute inset-0" style={{ background: s.gradient }} />
      <div className="absolute inset-0" style={{ background: s.glow }} />
      <div className="absolute inset-0">{s.pattern}</div>
    </div>
  );
});

export default SceneBg;
