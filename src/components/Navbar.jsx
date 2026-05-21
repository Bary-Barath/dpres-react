import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShieldAlert, ArrowRight } from 'lucide-react';
import { navigate } from '../hooks/useRoute';

export default function Navbar({ activeUser, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: 'Product Features', href: '#features' },
    { label: 'Interactive Demo', href: '#/login' },
    { label: 'Safety FAQs', href: '#faq' },
    { label: 'Emergency Protocol', href: '#contacts' }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/40 bg-slate-900/80 backdrop-blur-md dark:border-slate-800/40 dark:bg-slate-950/80 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.hash = '#/home'}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-800 shadow-lg shadow-red-500/20">
              <ShieldAlert className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-sans text-xl font-extrabold tracking-wider bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">DPRES</span>
              <span className="block font-mono text-[8px] tracking-widest text-red-500 font-bold uppercase">Campus Safety</span>
            </div>
          </div>

          {/* Desktop Nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-semibold text-slate-300 hover:text-red-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Call to Action */}
          <div className="hidden md:flex items-center gap-4">
            {activeUser ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">Logged in as <strong className="text-white">{activeUser.name}</strong></span>
                <button
                  onClick={() => navigate(activeUser.role === 'admin' ? '#/admin' : '#/portal')}
                  className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold hover:bg-red-500 transition-all flex items-center gap-1 shadow-md shadow-red-500/20"
                >
                  Enter Portal <ArrowRight className="h-3 w-3" />
                </button>
                <button
                  onClick={onLogout}
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('#/login')}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold hover:bg-red-500 transition-all flex items-center gap-1.5 shadow-lg shadow-red-500/25"
              >
                Access Portal <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white focus:outline-none"
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
            className="md:hidden bg-slate-900 border-t border-slate-800"
          >
            <div className="space-y-1 px-2 pb-4 pt-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-4 border-t border-slate-800 pt-4 px-3 flex flex-col gap-3">
                {activeUser ? (
                  <>
                    <span className="text-xs text-slate-400">Logged in as {activeUser.name}</span>
                    <button
                      onClick={() => { setIsOpen(false); navigate(activeUser.role === 'admin' ? '#/admin' : '#/portal'); }}
                      className="w-full rounded-lg bg-red-600 py-2.5 text-center text-sm font-bold text-white hover:bg-red-500"
                    >
                      Go to Portal Dashboard
                    </button>
                    <button
                      onClick={() => { setIsOpen(false); onLogout(); }}
                      className="w-full text-center text-sm text-slate-400 hover:text-white"
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
  );
}
