import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Command } from 'lucide-react';

const groups = [
  {
    title: 'Navigation',
    items: [
      { keys: ['G', 'H'], desc: 'Go to Home' },
      { keys: ['G', 'F'], desc: 'Jump to Features' },
      { keys: ['G', 'Q'], desc: 'Jump to FAQ' },
      { keys: ['G', 'C'], desc: 'Jump to Contacts' },
      { keys: ['G', 'L'], desc: 'Open Login portal' }
    ]
  },
  {
    title: 'Interface',
    items: [
      { keys: ['T'], desc: 'Toggle light / dark theme' },
      { keys: ['?'], desc: 'Open this help panel' },
      { keys: ['Esc'], desc: 'Close any open dialog' }
    ]
  }
];

function Kbd({ children }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[24px] px-1.5 h-6 rounded-md border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-200 shadow-sm">
      {children}
    </kbd>
  );
}

export default function ShortcutsHelp({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Command className="h-4 w-4 text-red-500" aria-hidden="true" />
                <h2 id="shortcuts-title" className="text-sm font-bold uppercase tracking-widest text-slate-700 dark:text-slate-200">
                  Keyboard Shortcuts
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close shortcuts panel"
                className="rounded-lg p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-6">
              {groups.map((g) => (
                <div key={g.title}>
                  <h3 className="font-mono text-[10px] uppercase tracking-widest text-red-500 mb-3 font-bold">
                    {g.title}
                  </h3>
                  <ul className="space-y-2">
                    {g.items.map((item, i) => (
                      <li key={i} className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">{item.desc}</span>
                        <span className="flex items-center gap-1">
                          {item.keys.map((k, j) => (
                            <React.Fragment key={j}>
                              {j > 0 && <span className="text-[10px] text-slate-500">then</span>}
                              <Kbd>{k}</Kbd>
                            </React.Fragment>
                          ))}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
              Tip: press <Kbd>?</Kbd> anywhere on the landing page to reopen this panel.
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
