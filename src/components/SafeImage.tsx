import { motion } from 'framer-motion';
import { useState, memo } from 'react';

// SafeImage: NEVER shows broken image icons.
// Falls back to a procedural Islamic geometric pattern if image fails.

interface Props {
  src?: string;
  alt?: string;
  className?: string;
  fallbackColor?: string;
  patternScale?: number;
}

const SafeImage = memo(({ src, alt = '', className = '', fallbackColor = '#d4a853', patternScale = 40 }: Props) => {
  const [failed, setFailed] = useState(!src);
  const [loaded, setLoaded] = useState(false);

  const patternId = `fallback-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Always render SVG fallback underneath */}
      <div className="absolute inset-0" style={{ background: `${fallbackColor}08` }}>
        <svg className="w-full h-full opacity-25">
          <defs>
            <pattern id={patternId} x="0" y="0" width={patternScale} height={patternScale} patternUnits="userSpaceOnUse">
              <path
                d={`M${patternScale/2} 0L${patternScale} ${patternScale/2}L${patternScale/2} ${patternScale}L0 ${patternScale/2}Z`}
                fill="none" stroke={fallbackColor} strokeWidth="0.4"
              />
              <circle cx={patternScale/2} cy={patternScale/2} r={patternScale/5} fill="none" stroke={fallbackColor} strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
      </div>

      {/* Actual image with fade-in */}
      {src && !failed && (
        <motion.img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          onLoad={() => setLoaded(true)}
          initial={{ opacity: 0, filter: 'blur(8px)' }}
          animate={{
            opacity: loaded ? 1 : 0,
            filter: loaded ? 'blur(0px)' : 'blur(8px)',
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
    </div>
  );
});

export default SafeImage;
