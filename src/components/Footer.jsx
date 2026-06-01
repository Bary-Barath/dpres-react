import React, { useState } from 'react';
import { Github, Twitter, Linkedin, Heart, Send, CheckCircle2 } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  const columns = [
    {
      title: 'Platform',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'How it Works', href: '#features' },
        { label: 'Launch Portal', href: '#/login' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Support & FAQs', href: '#faq' },
        { label: 'Emergency Protocol', href: '#contacts' },
        { label: 'Drill Manager', href: '#/login' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Data Handling', href: '#' }
      ]
    }
  ];

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 text-slate-500 text-sm transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-200 dark:border-slate-900">
          <div className="lg:col-span-5">
            <div className="mb-4">
              <Logo size="md" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mb-5">
              Subscribe to receive alert protocol updates, drill schedule digests, and platform release notes.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@campus.edu"
                aria-label="Email for newsletter"
                className="flex-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:border-red-500 focus:outline-none transition-colors"
                required
              />
              <button
                type="submit"
                className="rounded-lg bg-red-600 hover:bg-red-500 px-3 py-2 text-xs font-bold text-white transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                aria-label="Subscribe"
              >
                {subscribed ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">{subscribed ? 'Subscribed' : 'Subscribe'}</span>
              </button>
            </form>
            {subscribed && (
              <p className="mt-2 text-[11px] text-emerald-500">You&rsquo;ll get the next safety briefing.</p>
            )}
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-slate-700 dark:text-slate-300 font-bold mb-4">
                  {col.title}
                </h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-xs text-slate-500 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 text-xs text-slate-500 dark:text-slate-600 gap-4">
          <p>© {new Date().getFullYear()} DPRES platform. All rights reserved.</p>

          <p className="flex items-center gap-1 order-3 md:order-2">
            Made with <Heart className="h-3 w-3 text-red-500 fill-current" aria-hidden="true" /> for university emergency preparedness.
          </p>

          <div className="flex gap-3 order-2 md:order-3">
            {[
              { Icon: Github, label: 'GitHub' },
              { Icon: Twitter, label: 'Twitter' },
              { Icon: Linkedin, label: 'LinkedIn' }
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-900 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
