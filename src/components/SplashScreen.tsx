import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAppStore } from '../store/appStore';

export default function SplashScreen() {
  const [phase, setPhase] = useState(0);
  const setPage = useAppStore(s => s.setPage);
  const hasCompleted = useAppStore(s => s.hasCompletedOnboarding);

  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 120),
      setTimeout(() => setPhase(2), 500),
      setTimeout(() => setPhase(3), 1100),
      setTimeout(() => setPhase(4), 1800),
      setTimeout(() => setPage(hasCompleted ? 'home' : 'onboarding-auth'), 3400),
    ];
    return () => t.forEach(clearTimeout);
  }, [setPage, hasCompleted]);

  return (
    <div className="fixed inset-0 bg-[#020408] flex items-center justify-center overflow-hidden z-50">
      {/* Deep atmospheric layers */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} transition={{ duration: 3 }}
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(212,168,83,0.05) 0%, transparent 55%)' }} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} transition={{ duration: 2.5 }}
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 35% 65%, rgba(45,212,168,0.025) 0%, transparent 45%)' }} />

      {/* Rotating geometric ornament */}
      {phase >= 1 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.svg initial={{ opacity: 0, scale: 0.4, rotate: -120 }}
            animate={{ opacity: 0.035, scale: 1, rotate: 0 }}
            transition={{ duration: 2.8, ease: [0.22, 1, 0.36, 1] }}
            width="500" height="500" viewBox="0 0 200 200" className="ornament-spin">
            <polygon points="100,8 192,100 100,192 8,100" fill="none" stroke="#d4a853" strokeWidth="0.25"/>
            <polygon points="100,28 172,100 100,172 28,100" fill="none" stroke="#d4a853" strokeWidth="0.2"/>
            <polygon points="100,48 152,100 100,152 48,100" fill="none" stroke="#2dd4a8" strokeWidth="0.18"/>
            <circle cx="100" cy="100" r="32" fill="none" stroke="#d4a853" strokeWidth="0.15"/>
            <circle cx="100" cy="100" r="58" fill="none" stroke="#2dd4a8" strokeWidth="0.12"/>
            <circle cx="100" cy="100" r="80" fill="none" stroke="#6366f1" strokeWidth="0.1"/>
          </motion.svg>
        </div>
      )}

      {/* Vertical noor beam */}
      {phase >= 1 && (
        <motion.div initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 0.35 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute w-[1px] h-[70vh]"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(212,168,83,0.4), rgba(212,168,83,0.6), rgba(212,168,83,0.4), transparent)' }} />
      )}

      {/* Logo */}
      {phase >= 3 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.82, y: 28, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 text-center">
          <motion.div initial={{ letterSpacing: '0.5em' }} animate={{ letterSpacing: '0.08em' }}
            transition={{ duration: 1.4, delay: 0.15 }}
            className="text-7xl md:text-9xl font-bold text-glow-gold font-arabic text-amber-100">نُور</motion.div>
          <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: '120px', opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="divider-gold mx-auto my-3" />
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.35 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-[9px] tracking-[0.45em] uppercase text-amber-200/35 font-light">
            Islamic Digital Ecosystem
          </motion.p>
        </motion.div>
      )}

      {/* Light particles */}
      {phase >= 2 && Array.from({ length: 28 }).map((_, i) => (
        <motion.div key={i}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
          animate={{
            x: (Math.random() - 0.5) * 550,
            y: (Math.random() - 0.5) * 550,
            opacity: [0, Math.random() * 0.35 + 0.08, 0],
            scale: [0, Math.random() + 0.4, 0],
          }}
          transition={{ duration: 3.5 + Math.random() * 2.5, delay: Math.random() * 1.5, ease: 'easeOut' }}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 2.5 + 0.5, height: Math.random() * 2.5 + 0.5,
            background: ['#d4a853', '#2dd4a8', '#6366f1', '#fff'][Math.floor(Math.random() * 4)],
            boxShadow: `0 0 ${Math.random() * 5 + 2}px currentColor`,
          }}
        />
      ))}
    </div>
  );
}
