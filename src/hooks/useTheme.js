import { useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'dpres_theme';

function readStoredTheme() {
  if (typeof window === 'undefined') return 'dark';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch (_) { /* ignore */ }
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

function applyTheme(theme) {
  const root = document.documentElement;
  // Disable transitions briefly to avoid theme flash
  root.classList.add('theme-transitioning');
  if (theme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
  // Re-enable transitions on next frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      root.classList.remove('theme-transitioning');
    });
  });
}

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const t = readStoredTheme();
    if (typeof document !== 'undefined') applyTheme(t);
    return t;
  });

  useEffect(() => {
    applyTheme(theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (_) { /* ignore */ }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  const isDark = theme === 'dark';

  return { theme, setTheme, toggleTheme, isDark };
}
