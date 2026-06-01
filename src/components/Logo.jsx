import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react';

// Drop your logo image at: public/logo.png  (or .svg / .webp — update LOGO_SRC).
// The Logo component will use it everywhere. If the file is missing it falls
// back to the original shield mark so the site keeps rendering.
const LOGO_SRC = '/logo.png';

const sizeMap = {
  sm: { box: 'h-8 w-8', icon: 'h-4 w-4', rounded: 'rounded-lg' },
  md: { box: 'h-10 w-10', icon: 'h-5 w-5', rounded: 'rounded-xl' },
  lg: { box: 'h-14 w-14', icon: 'h-7 w-7', rounded: 'rounded-2xl' }
};

const textSizes = {
  sm: { name: 'text-base', tag: 'text-[7px]' },
  md: { name: 'text-xl', tag: 'text-[8px]' },
  lg: { name: 'text-2xl', tag: 'text-[9px]' }
};

export default function Logo({
  size = 'md',
  showText = true,
  forceDark = false,
  className = '',
  iconOnly = false,
  onClick
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const dims = sizeMap[size] || sizeMap.md;
  const txt = textSizes[size] || textSizes.md;

  const nameClasses = forceDark
    ? 'bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent'
    : 'bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent';

  const tagClasses = 'text-red-500';

  return (
    <span
      className={`inline-flex items-center gap-2 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <span
        className={`relative flex items-center justify-center overflow-hidden ${dims.box} ${dims.rounded} ${
          imgFailed
            ? 'bg-gradient-to-br from-red-500 to-red-800 shadow-lg shadow-red-500/20'
            : 'bg-transparent'
        }`}
      >
        {!imgFailed ? (
          <img
            src={LOGO_SRC}
            alt="DPRES logo"
            className={`${dims.box} object-contain`}
            onError={() => setImgFailed(true)}
            draggable={false}
          />
        ) : (
          <ShieldAlert className={`${dims.icon} text-white`} aria-hidden="true" />
        )}
      </span>
      {showText && !iconOnly && (
        <span className="text-left leading-tight">
          <span className={`font-sans font-extrabold tracking-wider ${txt.name} ${nameClasses}`}>
            DPRES
          </span>
          <span className={`block font-mono ${txt.tag} tracking-widest font-bold uppercase ${tagClasses}`}>
            Campus Safety
          </span>
        </span>
      )}
    </span>
  );
}
