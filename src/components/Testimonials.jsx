import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Star, Quote } from 'lucide-react';
import CountUp from './CountUp';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Dr. Arthur Pendelton',
      role: 'Director of Campus Security, State University',
      content: 'Transitioning from PDF manuals to DPRES has changed our entire training standard. The student engagement scores doubled in the first month, and the live drill tool works flawlessly.',
      rating: 5
    },
    {
      name: 'Sarah Jenkins',
      role: 'Student Representative, CS Dept',
      content: 'The quiz modules and the AI Disaster Assistant make safety training feel interactive. I actually know where the server room fire extinguishers are located now, which could save lives.',
      rating: 5
    },
    {
      name: 'Chief Thomas Reyes',
      role: 'Emergency Services Inspector',
      content: 'The DPRES campus evacuation maps are incredibly precise. Being able to inspect floor plans and locate active chemical labs in real-time is a massive upgrade over paper schematics.',
      rating: 5
    }
  ];

  const metrics = [
    { value: 12, suffix: 'k+', label: 'Drills simulated' },
    { value: 93, suffix: '%', label: 'Avg. quiz completion' },
    { value: 1.2, decimals: 1, prefix: '< ', suffix: 's', label: 'Broadcast latency' },
    { value: 4.9, decimals: 1, suffix: ' / 5', label: 'Inspector rating' }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-950 text-slate-900 dark:text-white relative transition-colors">
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-red-500/5 blur-[100px]" />
        <div className="absolute bottom-20 left-10 h-72 w-72 rounded-full bg-blue-500/5 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-red-500">
            ▶ Institutional Reviews
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Trusted by security officers & students
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((t, idx) => (
            <motion.figure
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-8 backdrop-blur-sm flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <Quote
                aria-hidden="true"
                className="absolute right-6 top-6 h-10 w-10 text-slate-200 dark:text-slate-800"
              />
              <div className="relative">
                <div className="flex items-center gap-1 mb-4 text-yellow-500" aria-label={`Rated ${t.rating} out of 5`}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" aria-hidden="true" />
                  ))}
                </div>
                <blockquote className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  &ldquo;{t.content}&rdquo;
                </blockquote>
              </div>

              <figcaption className="flex items-center gap-3 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/80">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  <UserCheck className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{t.role}</span>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 backdrop-blur divide-x divide-y md:divide-y-0 divide-slate-200 dark:divide-slate-800/80 overflow-hidden"
        >
          {metrics.map((m, i) => (
            <div key={i} className="p-6 text-center">
              <div className="font-mono text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                <CountUp
                  to={m.value}
                  decimals={m.decimals || 0}
                  prefix={m.prefix || ''}
                  suffix={m.suffix || ''}
                  duration={1600}
                />
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-widest text-slate-500 font-bold">
                {m.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
