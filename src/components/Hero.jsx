import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Play, ArrowRight, ShieldAlert } from 'lucide-react';
import { navigate } from '../hooks/useRoute';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-24 sm:py-32 text-white">
      {/* Dynamic Background Glows */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-red-500/10 blur-[120px]" />
        <div className="absolute top-60 right-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0)_40%,rgba(2,6,23,0.9)_90%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-red-400 mb-8"
        >
          <ShieldAlert className="h-3.5 w-3.5" /> Next-Gen Safety Protocols
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-sans text-5xl font-extrabold tracking-tight sm:text-7xl bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent max-w-4xl mx-auto leading-none"
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
          className="mt-6 text-lg leading-8 text-slate-400 max-w-2xl mx-auto"
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
            className="group rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-3.5 text-sm font-bold text-white hover:from-red-500 hover:to-red-600 transition-all flex items-center gap-2 shadow-lg shadow-red-600/30"
          >
            Launch Live Demo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <a
            href="#features"
            className="rounded-xl border border-slate-800 bg-slate-900/60 px-6 py-3.5 text-sm font-bold text-slate-300 hover:bg-slate-900 hover:border-slate-700 transition-all flex items-center gap-2"
          >
            Explore Features
          </a>
        </motion.div>

        {/* Interactive Stats Overlay */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 sm:mt-20 border border-slate-800/80 bg-slate-900/40 backdrop-blur-md rounded-2xl p-8 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-800/60 shadow-2xl"
        >
          {[
            { label: 'Cloud Synchronized', value: '100%', detail: 'Real-time state storage' },
            { label: 'Safety Modules', value: '4 Modules', detail: 'Quizzes & procedures' },
            { label: 'AI Reflex Testing', value: 'Gemini 3.5', detail: 'Dynamic safety reviews' },
            { label: 'Evacuation Paths', value: 'SVG Layers', detail: 'Dynamic blueprints' }
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center p-4">
              <span className="font-mono text-3xl font-extrabold text-red-500 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                {stat.value}
              </span>
              <span className="text-sm font-bold text-white mt-1">{stat.label}</span>
              <span className="text-xs text-slate-500 mt-0.5">{stat.detail}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
