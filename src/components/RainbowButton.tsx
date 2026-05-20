import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useAppStore } from '../store/appStore';

interface Props {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function RainbowButton({ children, onClick, className = '', disabled = false, size = 'md' }: Props) {
  const performanceMode = useAppStore(s => s.performanceMode);
  const sizeClasses = { sm: 'px-4 py-2.5 text-xs', md: 'px-6 py-3.5 text-sm', lg: 'px-8 py-4 text-[15px]' };
  const isLow = performanceMode === 'low';

  if (isLow) {
    return (
      <motion.button
        onClick={onClick}
        disabled={disabled}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.97 }}
        className={`relative ${sizeClasses[size]} font-medium rounded-2xl text-white/90 bg-white/[0.05] border border-white/[0.10] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${className}`}
        style={{ isolation: 'isolate' }}
      >
        <span className="relative z-10 flex items-center justify-center gap-2 tracking-wide font-light">
          {children}
        </span>
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.975 }}
      className={`relative ${sizeClasses[size]} font-medium rounded-2xl text-white/90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer group ${className}`}
      style={{ isolation: 'isolate' }}
    >
      {/* Ambient glow - illuminates surrounding area */}
      <div className="absolute -inset-3 rounded-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-1000 blur-2xl pointer-events-none"
        style={{
          background: 'conic-gradient(from var(--angle, 0deg), #d4a85350, #2dd4a850, #6366f150, #ec489950, #f9731650, #d4a85350)',
          animation: 'rainbow-spin 4s linear infinite, glow-pulse 3s ease-in-out infinite',
        }}
      />
      {/* Rainbow border */}
      <div className="absolute -inset-[1.5px] rounded-2xl overflow-hidden">
        <div className="absolute inset-0"
          style={{
            background: 'conic-gradient(from var(--angle, 0deg), #d4a853, #2dd4a8, #6366f1, #ec4899, #f97316, #d4a853)',
            animation: 'rainbow-spin 3s linear infinite',
          }}
        />
      </div>
      {/* Inner background */}
      <div className="absolute inset-[1.5px] rounded-[14.5px] bg-[#080c1a] group-hover:bg-[#0a0f20] transition-colors duration-700" />
      {/* Light trail on hover */}
      <div className="absolute inset-[1.5px] rounded-[14.5px] overflow-hidden">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute top-0 h-[1px] w-[30%] opacity-60"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(212,168,83,0.4), transparent)',
              animation: 'light-trail 3s ease-in-out infinite',
            }}
          />
        </div>
      </div>
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2 tracking-wide font-light">
        {children}
      </span>
    </motion.button>
  );
}
