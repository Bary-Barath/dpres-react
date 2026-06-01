import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Flame, Waves, Globe, Shield, Sparkles, Trophy, ArrowRight } from 'lucide-react';
import { navigate } from '../hooks/useRoute';

export default function StudentPortal({ user }) {
  const modules = [
    { key: 'fire', label: 'Fire Safety', color: 'text-red-500 bg-red-500/10 border-red-500/20', hoverBorder: 'hover:border-red-500/40', textColor: 'text-red-400', icon: Flame, desc: 'Evacuation drills, extinguisher classes, and R.A.C.E fire protocol.' },
    { key: 'flood', label: 'Flood Protocol', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', hoverBorder: 'hover:border-blue-500/40', textColor: 'text-blue-400', icon: Waves, desc: 'Flood safety levels, building high-zones, and water contamination risks.' },
    { key: 'quake', label: 'Earthquake Safety', color: 'text-orange-500 bg-orange-500/10 border-orange-500/20', hoverBorder: 'hover:border-orange-500/40', textColor: 'text-orange-400', icon: Globe, desc: 'Drop Cover Hold On posture, aftershock safety, and exit corridors.' },
    { key: 'threat', label: 'Active Threat', color: 'text-purple-500 bg-purple-500/10 border-purple-500/20', hoverBorder: 'hover:border-purple-500/40', textColor: 'text-purple-400', icon: Shield, desc: 'Run Hide Fight tactical guidance, doors barricade, and alerts reporting.' }
  ];

  const completed = user?.completedModules || [];
  const progressPct = Math.round((completed.length / 4) * 100);
  const earnedPts = completed.length * 200;

  return (
    <div className="space-y-8 max-w-6xl mx-auto text-white">
      {/* Welcome Header */}
      <div>
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-red-500">▶ Student Safety Console</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 mt-1 font-sans">
          Welcome back, <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent uppercase">{(user?.name || 'Student')}</span>
        </h1>
      </div>

      {/* Progress Track Card */}
      <div className="rounded-2xl border-t-4 border-t-red-500 border-x border-b border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Your Safety Compliance</p>
            <p className="mt-2 text-2xl font-extrabold text-white flex items-baseline gap-1">
              {completed.length} <span className="text-sm font-semibold text-slate-500">/ 4 Modules Certified</span>
            </p>
          </div>
          <div className="text-left sm:text-right flex sm:flex-col justify-between items-baseline sm:items-end gap-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Progress Score</span>
            <span className={`text-3xl font-extrabold ${progressPct === 100 ? 'text-emerald-500' : progressPct >= 50 ? 'text-orange-500' : 'text-red-500'}`}>
              {progressPct}%
            </span>
          </div>
        </div>

        {/* Progress bar track */}
        <div className="h-3 w-full rounded-full bg-slate-950 overflow-hidden shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${progressPct === 100 ? 'bg-emerald-500' : progressPct >= 50 ? 'bg-orange-500' : 'bg-red-500'}`}
          />
        </div>

        <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-slate-400">
          <Trophy className="h-4 w-4 text-yellow-500" />
          <span>Earned <strong className="text-white">{earnedPts}</strong> Safety Points</span>
        </div>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* AI Disaster Assistant Panel Card */}
        <div
          onClick={() => navigate('#/portal/simulator')}
          className="rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-500/10 via-transparent to-transparent p-6 backdrop-blur-sm hover:border-red-500/50 cursor-pointer shadow-lg transition-all group flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-red-500/5 blur-xl pointer-events-none" />
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="h-10 w-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30 group-hover:scale-105 transition-transform">
                <Sparkles className="h-5 w-5 animate-pulse" />
              </div>
              <span className="inline-flex items-center rounded-full bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 text-[9px] font-extrabold tracking-widest text-red-400 uppercase">
                AI Powered
              </span>
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">
              AI Disaster Assistant 🤖
            </h3>
            <p className="mt-3 text-xs text-slate-400 leading-relaxed">
              Chat with the DPRES AI for instant disaster preparedness guidance, first-aid steps, CPR help, and emergency safety information.
            </p>
          </div>
          <div className="mt-8 flex items-center gap-1.5 text-xs font-bold text-red-400 tracking-wider font-mono">
            Open Assistant <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Regular Modules Cards */}
        {modules.map((m, idx) => {
          const IconComp = m.icon;
          const isCompleted = completed.includes(m.key);

          return (
            <div
              key={m.key}
              onClick={() => navigate(`#/portal/quiz/${m.key}`)}
              className={`rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm ${m.hoverBorder} cursor-pointer shadow-lg transition-all group flex flex-col justify-between`}
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${m.color} group-hover:scale-105 transition-transform`}>
                    <IconComp className="h-5 w-5" />
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-extrabold tracking-widest uppercase border ${
                    isCompleted
                      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                      : 'border-slate-800 bg-slate-950 text-slate-500'
                  }`}>
                    {isCompleted ? <ShieldCheck className="h-3 w-3" /> : null}
                    {isCompleted ? 'Completed' : 'Pending'}
                  </span>
                </div>
                <h3 className={`text-lg font-bold text-white group-hover:${m.textColor} transition-colors uppercase tracking-wider`}>
                  {m.label}
                </h3>
                <p className="mt-3 text-xs text-slate-400 leading-relaxed">
                  {m.desc}
                </p>
              </div>
              <div className={`mt-8 flex items-center gap-1.5 text-xs font-bold ${m.textColor} tracking-wider font-mono`}>
                {isCompleted ? 'Review Quiz' : 'Start Module'} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
