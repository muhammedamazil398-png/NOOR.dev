import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface Props { children: ReactNode; pageKey: string; }

export default function PageTransition({ children, pageKey }: Props) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
        transition={{
          duration: 0.35,
          ease: [0.22, 1, 0.36, 1],
          opacity: { duration: 0.25 },
        }}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
