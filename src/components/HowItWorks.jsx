import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, BookOpenCheck, Radio } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Onboard',
    desc: 'Students self-register in seconds. Admins get instant access to the central console with mock cloud sync.',
    accent: 'from-blue-500 to-cyan-500'
  },
  {
    icon: BookOpenCheck,
    title: 'Train',
    desc: 'Complete quizzes on fire, flood, earthquake, and lockdown procedures. Build points and badges on the leaderboard.',
    accent: 'from-purple-500 to-pink-500'
  },
  {
    icon: Radio,
    title: 'Respond',
    desc: 'When admins broadcast a drill, every connected device alerts simultaneously. Reflexes are scored by the Gemini engine.',
    accent: 'from-red-500 to-orange-500'
  }
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white relative overflow-hidden transition-colors">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300/70 dark:via-slate-700/60 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-red-500">
            ▶ Workflow
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            From sign-up to live drill in three steps
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
            DPRES is designed so a campus can move from theory to live emergency response training without an IT department.
          </p>
        </div>

        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
          <div aria-hidden="true" className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-red-500/30" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className={`relative z-10 inline-flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br ${step.accent} shadow-2xl shadow-slate-300/40 dark:shadow-slate-950 ring-4 ring-slate-50 dark:ring-slate-950`}>
                  <Icon className="h-10 w-10 text-white" />
                  <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs font-bold text-slate-900 dark:text-white">
                    {idx + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">{step.title}</h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
