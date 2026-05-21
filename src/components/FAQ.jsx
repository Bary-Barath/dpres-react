import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: 'What is the primary purpose of the DPRES system?',
      a: 'DPRES (Disaster Preparedness and Response Education System) is designed to replace static safety manuals with an active digital environment. It combines interactive mapping blueprints, automated quiz evaluations, and simulated AI testing to ensure students and faculty are drill-ready.'
    },
    {
      q: 'How does the Gemini AI Simulator work?',
      a: 'The AI Simulator utilizes Gemini-driven prompts to create realistic emergency scenarios based on specific locations (like chemistry labs or server centers). Students write out their response actions, which are instantly reviewed by safety algorithms to provide compliance ratings and improvement recommendations.'
    },
    {
      q: 'Can administrators deploy live drills?',
      a: 'Yes. The Administrator Console features a real-time broadcast center. Clicking "Broadcast" instantly publishes the drill details onto all active student screens, raising emergency sound visual alerts across the network.'
    },
    {
      q: 'Is our student data saved securely?',
      a: 'Absolutely. The platform saves student modules, scores, ranks, and logs locally using standard browser storage protocols. This guarantees rapid recovery and zero dependencies on external databases during local network configurations.'
    }
  ];

  return (
    <section id="faq" className="py-24 bg-slate-900 text-white relative">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-red-500">
            ▶ Information Base
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden transition-colors duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="font-bold text-white text-base md:text-lg">{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-red-500' : ''}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="border-t border-slate-800/60 p-6 text-sm md:text-base text-slate-400 leading-relaxed bg-slate-900/20">
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
