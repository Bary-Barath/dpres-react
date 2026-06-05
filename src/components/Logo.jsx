import React, { useState } from 'react';
import BRAND from '../config/branding';

const sizeMap = {
  sm: { px: 40,  text: 'text-lg',   tag: 'text-[8px]'  },
  md: { px: 52,  text: 'text-2xl',  tag: 'text-[9px]'  },
  lg: { px: 72,  text: 'text-3xl',  tag: 'text-[11px]' },
};

/** Inline SVG that exactly reproduces the hexagon+cross mark — shown when PNG fails to load */
function HexCrossIcon({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dpres-hex-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EF1B31" />
          <stop offset="100%" stopColor="#B0003A" />
        </linearGradient>
      </defs>
      <polygon points="50,4 93,27 93,73 50,96 7,73 7,27" fill="url(#dpres-hex-g)" />
      <polygon points="50,10 88,30 88,70 50,90 12,70 12,30"
        fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="2" />
      <rect x="42" y="24" width="16" height="52" rx="4" fill="white" />
      <rect x="24" y="42" width="52" height="16" rx="4" fill="white" />
    </svg>
  );
}

export default function Logo({
  size = 'md',
  showText = true,
  forceDark = false,
  className = '',
  iconOnly = false,
  onClick,
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const dims = sizeMap[size] || sizeMap.md;

  const nameClasses = forceDark
    ? 'text-white'
    : 'text-slate-900 dark:text-white';

  return (
    <span
      className={`inline-flex items-center gap-2.5 ${onClick ? 'cursor-pointer select-none' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Logo mark */}
      <span className="relative flex-shrink-0" style={{ width: dims.px, height: dims.px }}>
        {!imgFailed ? (
          <img
            src={BRAND.logo.png}
            alt={BRAND.logo.alt}
            className="w-full h-full object-contain"
            onError={() => setImgFailed(true)}
            draggable={false}
            style={{ filter: 'drop-shadow(0 2px 8px rgba(220,38,38,0.35))' }}
          />
        ) : (
          <HexCrossIcon className="w-full h-full" />
        )}
      </span>

      {/* Wordmark */}
      {showText && !iconOnly && (
        <span className="text-left leading-tight flex-shrink-0">
          <span className={`block font-extrabold tracking-wider ${dims.text} ${nameClasses}`}>
            DPRES
          </span>
          <span className={`block font-mono font-bold uppercase tracking-widest ${dims.tag}`}
            style={{ color: BRAND.colors.primary }}>
            Campus Safety
          </span>
        </span>
      )}
    </span>
  );
}
