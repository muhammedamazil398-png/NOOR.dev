import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';

interface Props {
  show: boolean;
  onClose: () => void;
  anchorX: number;
  anchorY: number;
  children: ReactNode;
}

// Cinematic context popup that appears where the user clicked
// Smart collision detection keeps it on screen
export default function ContextPopup({ show, onClose, anchorX, anchorY, children }: Props) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const maxW = 360;
  const maxH = 400;

  useEffect(() => {
    if (!show) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const padding = 16;

    let x = anchorX - maxW / 2;
    let y = anchorY + 12;

    // Keep on screen
    if (x < padding) x = padding;
    if (x + maxW > vw - padding) x = vw - padding - maxW;
    if (y + maxH > vh - padding) y = anchorY - maxH - 12;
    if (y < padding) y = padding;

    setPos({ x, y });
  }, [show, anchorX, anchorY]);

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(3,5,10,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />
          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="context-popup glass-strong rounded-2xl p-5 overflow-y-auto"
            style={{
              left: pos.x,
              top: pos.y,
              width: `min(${maxW}px, 90vw)`,
              maxHeight: maxH,
              boxShadow: '0 32px 80px -12px rgba(0,0,0,0.5), 0 0 40px rgba(212,168,83,0.04)',
              border: '1px solid rgba(212,168,83,0.08)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-7 h-7 rounded-full glass flex items-center justify-center cursor-pointer hover:bg-white/10 transition z-10"
            >
              <svg className="w-3.5 h-3.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
