import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';

const faqs = [
  {
    q: 'What is the primary purpose of the DPRES system?',
    a: 'DPRES (Disaster Preparedness and Response Education System) is designed to replace static safety manuals with an active digital environment. It combines interactive mapping blueprints, automated quiz evaluations, and simulated AI testing to ensure students and faculty are drill-ready.'
  },
  {
    q: 'How does the AI Disaster Assistant work?',
    a: 'The AI Disaster Assistant is a Gemini-powered chatbot that answers questions about disaster preparedness, first aid, CPR, floods, earthquakes, cyclones, fire safety, evacuation procedures, and emergency kits. Ask a question in natural language and receive structured, actionable safety guidance instantly.'
  },
  {
    q: 'Can administrators deploy live drills?',
    a: 'Yes. The Administrator Console features a real-time broadcast center. Clicking "Broadcast" instantly publishes the drill details onto all active student screens, raising emergency sound visual alerts across the network.'
  },
  {
    q: 'Is our student data saved securely?',
    a: 'Absolutely. The platform saves student modules, scores, ranks, and logs locally using standard browser storage protocols. This guarantees rapid recovery and zero dependencies on external databases during local network configurations.'
  },
  {
    q: 'Which emergency scenarios are covered?',
    a: 'Out-of-the-box DPRES ships with Fire safety, Monsoon flooding, Earthquake protocol, and Active Threat lockdown modules. Each module includes a quiz, an evacuation diagram, and an AI-driven simulator scenario.'
  },
  {
    q: 'Do we need to install anything on student devices?',
    a: 'No. DPRES is a fully browser-based progressive web app. Students just visit the portal URL on any phone, tablet, or laptop and sign in — no app store install required.'
  },
  {
    q: 'How are leaderboard points calculated?',
    a: 'Points are awarded for completed quiz modules, perfect-score bonuses, and timely drill responses. The leaderboard refreshes in real time so students can see their rank change as classmates progress.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs.map((f, i) => ({ ...f, originalIndex: i }));
    return faqs
      .map((f, i) => ({ ...f, originalIndex: i }))
      .filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
  }, [query]);

  return (
    <section id="faq" className="py-24 bg-white dark:bg-slate-900 text-slate-900 dark:text-white relative transition-colors">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-red-500">
            ▶ Information Base
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Search below or browse the most common questions from administrators and students.
          </p>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions..."
            aria-label="Search FAQs"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:border-red-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="space-y-3">
          {filtered.length === 0 && (
            <p className="text-center text-sm text-slate-500 py-8">
              No questions match &ldquo;{query}&rdquo;. Try a different keyword.
            </p>
          )}
          {filtered.map((faq) => {
            const idx = faq.originalIndex;
            const isOpen = openIndex === idx;
            const panelId = `faq-panel-${idx}`;
            const buttonId = `faq-button-${idx}`;
            return (
              <div
                key={idx}
                className={`rounded-xl border bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-200 ${isOpen ? 'border-red-500/40' : 'border-slate-200 dark:border-slate-800'}`}
              >
                <button
                  id={buttonId}
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full items-center justify-between p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-inset"
                >
                  <span className="font-bold text-slate-900 dark:text-white text-base md:text-lg pr-4">{faq.q}</span>
                  <ChevronDown
                    aria-hidden="true"
                    className={`h-5 w-5 flex-shrink-0 text-slate-500 dark:text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-red-500' : ''}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="border-t border-slate-200 dark:border-slate-800/60 p-6 text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-900/20">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
