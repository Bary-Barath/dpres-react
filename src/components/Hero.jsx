import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ArrowRight, ShieldAlert, ChevronDown, Activity, Radio } from 'lucide-react';
import { navigate } from '../hooks/useRoute';
import CountUp from './CountUp';

const trustLogos = [
  'State University',
  'Harborview Tech',
  'Northgate Polytechnic',
  'Cedarbrook Academy',
  'Meridian Institute'
];

const activityFeed = [
  { name: 'Sarah J.', action: 'completed Fire Safety quiz', color: 'text-emerald-500' },
  { name: 'Block-C', action: 'evacuation drill triggered', color: 'text-red-500' },
  { name: 'Admin', action: 'broadcast monsoon alert', color: 'text-blue-500' },
  { name: 'Liam K.', action: 'aced Earthquake module', color: 'text-yellow-500' },
  { name: 'Dr. Patel', action: 'reviewed AI simulation', color: 'text-purple-500' }
];

const heroStats = [
  { label: 'Cloud Synchronized', value: 100, suffix: '%', detail: 'Real-time state storage' },
  { label: 'Safety Modules', value: 4, suffix: ' Modules', detail: 'Quizzes & procedures', decimals: 0 },
  { label: 'AI Disaster Assistant', static: 'Gemini', detail: 'Instant safety guidance' },
  { label: 'Evacuation Paths', static: 'SVG Layers', detail: 'Dynamic blueprints' }
];

export default function Hero() {
  const [activityIdx, setActivityIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActivityIdx((i) => (i + 1) % activityFeed.length), 3200);
    return () => clearInterval(id);
  }, []);

  const activity = activityFeed[activityIdx];

  return (
    <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 pt-24 pb-32 sm:pt-32 sm:pb-40 text-slate-900 dark:text-white transition-colors">
      {/* Grid pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 opacity-[0.06] dark:opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          color: 'rgb(100 116 139)'
        }}
      />

      {/* Background glows */}
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-red-500/10 blur-[120px]" />
        <div className="absolute top-60 right-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(248,250,252,0.6)_90%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(2,6,23,0.9)_90%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* System status pill */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-emerald-600 dark:text-emerald-300 mb-5"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          All systems operational
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-red-600 dark:text-red-400 mb-8 ml-0 md:ml-3"
        >
          <ShieldAlert className="h-3.5 w-3.5" /> Next-Gen Safety Protocols
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-sans text-5xl font-extrabold tracking-tight sm:text-7xl bg-gradient-to-b from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-100 dark:to-slate-400 bg-clip-text text-transparent max-w-4xl mx-auto leading-none"
        >
          Dynamic safety training <br />
          <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            for modern campuses
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
        >
          Replace static safety manuals with DPRES. An interactive, gamified platform featuring real-time evacuations, student database logs, and Gemini-powered crisis simulations.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={() => navigate('#/login')}
            className="group rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-3.5 text-sm font-bold text-white hover:from-red-500 hover:to-red-600 transition-all flex items-center gap-2 shadow-lg shadow-red-600/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-950"
          >
            Launch Live Demo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <a
            href="#features"
            className="rounded-xl border border-slate-300 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 px-6 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-700 transition-all flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-950"
          >
            <Play className="h-3.5 w-3.5" /> Explore Features
          </a>
        </motion.div>

        {/* Live activity ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur px-3 py-1.5 text-xs"
        >
          <Radio className="h-3.5 w-3.5 text-red-500 animate-pulse" aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Live</span>
          <span className="text-slate-400 dark:text-slate-600">·</span>
          <div className="relative h-4 w-[280px] sm:w-[340px] overflow-hidden text-left">
            <AnimatePresence mode="wait">
              <motion.span
                key={activityIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex items-center gap-1 whitespace-nowrap text-slate-600 dark:text-slate-300"
              >
                <strong className={`font-bold ${activity.color}`}>{activity.name}</strong>
                <span>{activity.action}</span>
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 sm:mt-16 border border-slate-200 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl p-8 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800/60 shadow-xl"
        >
          {heroStats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center p-4">
              <span className="font-mono text-3xl font-extrabold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                {stat.static ? (
                  stat.static
                ) : (
                  <CountUp to={stat.value} decimals={stat.decimals || 0} suffix={stat.suffix || ''} duration={1500} />
                )}
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white mt-1">{stat.label}</span>
              <span className="text-xs text-slate-500 mt-0.5">{stat.detail}</span>
            </div>
          ))}
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-16"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500 mb-6 flex items-center justify-center gap-2">
            <Activity className="h-3 w-3 text-red-500" aria-hidden="true" /> Piloted by safety officers at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {trustLogos.map((name) => (
              <span
                key={name}
                className="text-sm font-semibold tracking-wide text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                {name}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.a
          href="#features"
          aria-label="Scroll to features"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="hidden md:inline-flex absolute bottom-6 left-1/2 -translate-x-1/2 h-10 w-10 items-center justify-center rounded-full border border-slate-300 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:border-red-400/50 dark:hover:border-red-500/40 transition-colors animate-bounce"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.a>
      </div>
    </section>
  );
}
