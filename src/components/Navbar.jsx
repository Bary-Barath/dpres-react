import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, ArrowUp, Keyboard } from 'lucide-react';
import { navigate } from '../hooks/useRoute';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';

export default function Navbar({ activeUser, onLogout, onOpenShortcuts }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      setShowTop(y > 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Product Features', href: '#features' },
    { label: 'Interactive Demo', href: '#/login' },
    { label: 'Safety FAQs', href: '#faq' },
    { label: 'Emergency Protocol', href: '#contacts' }
  ];

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md shadow-lg shadow-slate-900/5 dark:shadow-black/20'
            : 'border-b border-transparent bg-white/60 dark:bg-slate-950/60 backdrop-blur'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <button
              type="button"
              className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-lg"
              onClick={() => { window.location.hash = '#/home'; }}
              aria-label="Go to home"
            >
              <Logo size="md" />
            </button>

            {/* Desktop Nav links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-colors focus:outline-none focus-visible:underline"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Call to Action */}
            <div className="hidden md:flex items-center gap-3">
              <button
                type="button"
                onClick={onOpenShortcuts}
                aria-label="Show keyboard shortcuts"
                title="Keyboard shortcuts (?)"
                className="h-9 w-9 rounded-lg border border-slate-300 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur text-slate-700 dark:text-slate-200 hover:text-red-500 dark:hover:text-red-400 hover:border-red-400/50 dark:hover:border-red-500/40 transition-colors flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              >
                <Keyboard className="h-4 w-4" />
              </button>
              <ThemeToggle />
              {activeUser ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Logged in as <strong className="text-slate-900 dark:text-white">{activeUser.name}</strong></span>
                  <button
                    onClick={() => navigate(activeUser.role === 'admin' ? '#/admin' : '#/portal')}
                    className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-500 transition-all flex items-center gap-1 shadow-md shadow-red-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                  >
                    Enter Portal <ArrowRight className="h-3 w-3" />
                  </button>
                  <button
                    onClick={onLogout}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate('#/login')}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-500 transition-all flex items-center gap-1.5 shadow-lg shadow-red-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                >
                  Access Portal <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <div className="space-y-1 px-2 pb-4 pt-2">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <button
                  type="button"
                  onClick={() => { setIsOpen(false); onOpenShortcuts && onOpenShortcuts(); }}
                  className="w-full text-left rounded-lg px-3 py-2 text-base font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2"
                >
                  <Keyboard className="h-4 w-4" /> Keyboard Shortcuts
                </button>
                <div className="mt-4 border-t border-slate-200 dark:border-slate-800 pt-4 px-3 flex flex-col gap-3">
                  {activeUser ? (
                    <>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Logged in as {activeUser.name}</span>
                      <button
                        onClick={() => { setIsOpen(false); navigate(activeUser.role === 'admin' ? '#/admin' : '#/portal'); }}
                        className="w-full rounded-lg bg-red-600 py-2.5 text-center text-sm font-bold text-white hover:bg-red-500"
                      >
                        Go to Portal Dashboard
                      </button>
                      <button
                        onClick={() => { setIsOpen(false); onLogout(); }}
                        className="w-full text-center text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      >
                        Logout Account
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => { setIsOpen(false); navigate('#/login'); }}
                      className="w-full rounded-lg bg-red-600 py-2.5 text-center text-sm font-bold text-white hover:bg-red-500 flex items-center justify-center gap-1.5"
                    >
                      Access Portal <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Scroll to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Scroll to top"
            className="fixed bottom-6 left-6 z-40 h-11 w-11 rounded-full border border-slate-300 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-red-400/50 dark:hover:border-red-500/40 shadow-xl flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
