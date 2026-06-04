import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck, Flame, Waves, Globe, Shield, Sparkles,
  Trophy, ArrowRight, Award, TrendingUp, Clock, CheckCircle,
  Activity, BookOpen, AlertTriangle, Zap, Star, ChevronRight
} from 'lucide-react';
import { useThemeContext } from '../App';
import { navigate } from '../hooks/useRoute';

export default function StudentPortal({ user }) {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';

  const modules = [
    {
      key: 'fire', label: 'Fire Safety', emoji: '🔥',
      icon: Flame, desc: 'Evacuation drills, extinguisher training, R.A.C.E fire protocol.',
      accent: '#EF4444', bg: 'from-red-500/10 to-red-500/5', border: 'border-red-500/15',
      badge: 'bg-red-50 text-red-600 border-red-100', iconBg: 'from-red-500 to-red-600',
      shadow: 'rgba(239,68,68,0.2)', time: '15 min', level: 'Essential'
    },
    {
      key: 'flood', label: 'Flood Protocol', emoji: '🌊',
      icon: Waves, desc: 'Flood safety levels, building high-zones, water contamination risks.',
      accent: '#3B82F6', bg: 'from-blue-500/10 to-blue-500/5', border: 'border-blue-500/15',
      badge: 'bg-blue-50 text-blue-600 border-blue-100', iconBg: 'from-blue-500 to-blue-600',
      shadow: 'rgba(59,130,246,0.2)', time: '12 min', level: 'Intermediate'
    },
    {
      key: 'quake', label: 'Earthquake Safety', emoji: '🌍',
      icon: Globe, desc: 'Drop Cover Hold On posture, aftershock safety, exit corridors.',
      accent: '#F59E0B', bg: 'from-amber-500/10 to-amber-500/5', border: 'border-amber-500/15',
      badge: 'bg-amber-50 text-amber-600 border-amber-100', iconBg: 'from-amber-500 to-orange-500',
      shadow: 'rgba(245,158,11,0.2)', time: '10 min', level: 'Essential'
    },
    {
      key: 'threat', label: 'Active Threat', emoji: '🛡️',
      icon: Shield, desc: 'Run Hide Fight guidance, barricade procedures, alert protocols.',
      accent: '#8B5CF6', bg: 'from-violet-500/10 to-violet-500/5', border: 'border-violet-500/15',
      badge: 'bg-violet-50 text-violet-600 border-violet-100', iconBg: 'from-violet-500 to-violet-600',
      shadow: 'rgba(139,92,246,0.2)', time: '18 min', level: 'Advanced'
    }
  ];

  const completed = user?.completedModules || [];
  const progressPct = Math.round((completed.length / 4) * 100);
  const earnedPts = completed.length * 200;
  const modulesLeft = 4 - completed.length;

  const readiness = completed.length === 0 ? 'Getting Started'
    : completed.length === 4 ? 'Fully Prepared'
    : completed.length >= 2 ? 'Advanced' : 'Beginner';

  const readinessColor = completed.length === 4
    ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
    : completed.length >= 2
    ? 'text-blue-600 bg-blue-50 border-blue-200'
    : 'text-amber-600 bg-amber-50 border-amber-200';

  const stats = [
    { icon: Award, label: 'Modules Done', value: `${completed.length}/4`, accent: '#10B981', bg: 'from-emerald-50 to-teal-50', iconColor: '#10B981' },
    { icon: Trophy, label: 'Safety Points', value: earnedPts.toLocaleString(), accent: '#F59E0B', bg: 'from-amber-50 to-yellow-50', iconColor: '#F59E0B' },
    { icon: TrendingUp, label: 'Readiness', value: readiness, accent: '#2563EB', bg: 'from-blue-50 to-indigo-50', iconColor: '#2563EB' },
    { icon: Star, label: 'Campus Rank', value: '#42', accent: '#8B5CF6', bg: 'from-violet-50 to-purple-50', iconColor: '#8B5CF6' }
  ];

  return (
    <div className="space-y-7">
      {/* ── Hero Welcome Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative overflow-hidden rounded-2xl ${
          isDark ? 'bg-[#0f172a] border border-white/[0.06]' : 'bg-white border border-slate-100'
        }`}
        style={{ boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(37,99,235,0.08), 0 2px 8px rgba(0,0,0,0.04)' }}
      >
        {/* Decorative background shapes */}
        {!isDark && (
          <>
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-100/60 via-indigo-50/40 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-24 w-48 h-48 bg-gradient-to-tr from-cyan-100/40 to-transparent rounded-full blur-2xl pointer-events-none" />
          </>
        )}
        <div className="relative p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <span className={`text-[10px] font-bold tracking-widest uppercase ${isDark ? 'text-blue-400/70' : 'text-blue-500/80'}`}>
                Student Safety Console
              </span>
              <h1 className="text-[1.75rem] font-extrabold tracking-tight mt-1 text-slate-900 dark:text-white leading-tight">
                Welcome back, <span className="gradient-text-blue">{user?.name || 'Student'}</span> 👋
              </h1>
              <div className="flex flex-wrap items-center gap-2.5 mt-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border ${readinessColor} dark:bg-transparent dark:border-blue-500/20 dark:text-blue-300`}>
                  <Activity className="h-3 w-3" />
                  {readiness}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium border ${
                  isDark ? 'border-white/[0.08] text-slate-400 bg-white/[0.03]' : 'border-slate-200 text-slate-500 bg-slate-50'
                }`}>
                  <Trophy className="h-3 w-3 text-amber-400" />
                  {earnedPts} pts earned
                </span>
                {completed.length === 4 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium border border-emerald-200 text-emerald-600 bg-emerald-50 dark:bg-transparent dark:border-emerald-500/20 dark:text-emerald-400">
                    <ShieldCheck className="h-3 w-3" />
                    Certification Ready
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2.5 flex-shrink-0">
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('#/learning-hub')}
                className="btn-primary btn-ripple px-4 py-2.5 text-sm inline-flex items-center gap-2 rounded-xl"
              >
                <BookOpen className="h-4 w-4" /> Learn
              </motion.button>
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('#/preparedness-quiz')}
                className="btn-primary btn-ripple px-4 py-2.5 text-sm inline-flex items-center gap-2 rounded-xl"
              >
                <Shield className="h-4 w-4" /> Quiz
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Readiness Progress Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.07 }}
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
            : 'linear-gradient(135deg, #2563EB 0%, #3B82F6 60%, #06B6D4 100%)',
          backgroundSize: '200% 200%',
          boxShadow: isDark
            ? '0 8px 32px rgba(0,0,0,0.4)'
            : '0 12px 40px rgba(37,99,235,0.35), 0 4px 12px rgba(37,99,235,0.2)'
        }}
      >
        {/* Shimmer orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.05] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-12 w-40 h-40 bg-white/[0.04] rounded-full blur-2xl pointer-events-none" />

        <div className="relative p-7 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-white/[0.12] backdrop-blur-sm flex items-center justify-center border border-white/[0.15]"
                style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
                <Award className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Safety Compliance</p>
                <p className="text-2xl font-extrabold mt-0.5">
                  {completed.length}
                  <span className="text-sm font-semibold text-white/50"> / 4 Modules</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-5 py-3 rounded-2xl backdrop-blur-sm border border-white/[0.15] bg-white/[0.1] text-center">
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/50">Score</p>
                <p className="text-3xl font-extrabold tabular-nums">{progressPct}<span className="text-lg font-semibold text-white/60">%</span></p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-5 h-2.5 rounded-full bg-white/[0.12] overflow-hidden backdrop-blur-sm">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
              className="h-full rounded-full bg-white"
              style={{ boxShadow: '0 0 12px rgba(255,255,255,0.5)' }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-5 mt-4 text-xs text-white/60">
            <span className="flex items-center gap-1.5">
              <Trophy className="h-3.5 w-3.5 text-amber-300" />
              <strong className="text-white">{earnedPts}</strong> Points
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {modulesLeft > 0 ? `${modulesLeft} module${modulesLeft > 1 ? 's' : ''} remaining` : 'All complete!'}
            </span>
            {completed.length === 4 && (
              <span className="inline-flex items-center gap-1 text-emerald-300 font-semibold">
                <CheckCircle className="h-3.5 w-3.5" />
                Certification unlocked
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Quick Stats Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.06 }}
            className={`relative overflow-hidden rounded-2xl p-4 stat-card ${
              isDark
                ? 'bg-[#0f172a] border border-white/[0.06]'
                : `bg-gradient-to-br ${stat.bg} border border-white`
            }`}
            style={{ boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.3)' : `0 4px 16px ${stat.accent}18, 0 1px 4px rgba(0,0,0,0.04)` }}
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${stat.iconColor}15` }}>
                <stat.icon className="h-5 w-5" style={{ color: stat.iconColor }} />
              </div>
              <div>
                <p className={`text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{stat.label}</p>
                <p className={`text-base font-extrabold leading-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Training Modules ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Safety Certification Modules
          </h2>
          <span className={`text-xs font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {completed.length}/4 complete
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* AI Assistant Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25 }}
            onClick={() => navigate('#/portal/simulator')}
            className={`relative overflow-hidden rounded-2xl p-5 cursor-pointer group border ${
              isDark
                ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-white/[0.07]'
                : 'bg-gradient-to-br from-red-50 via-white to-red-50/30 border-red-100'
            }`}
            style={{ boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(239,68,68,0.12), 0 2px 8px rgba(0,0,0,0.04)' }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-500/10 to-transparent rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex justify-between items-start mb-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center"
                  style={{ boxShadow: '0 6px 16px rgba(239,68,68,0.35)' }}>
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="badge badge-red">AI</span>
              </div>
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'} group-hover:text-red-500 transition-colors`}>
                AI Disaster Assistant
              </h3>
              <p className={`mt-1.5 text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Chat for instant disaster guidance, first aid, and emergency info.
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-red-500 dark:text-red-400">
                Open Now <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1.5" />
              </div>
            </div>
          </motion.div>

          {/* Module Cards */}
          {modules.map((m, idx) => {
            const isCompleted = completed.includes(m.key);
            return (
              <motion.div
                key={m.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06 }}
                whileHover={{ y: -6 }}
                onClick={() => navigate(`#/portal/quiz/${m.key}`)}
                className={`relative overflow-hidden rounded-2xl p-5 cursor-pointer group border ${
                  isDark
                    ? 'bg-[#0f172a] border-white/[0.06]'
                    : `bg-white ${m.border}`
                }`}
                style={{
                  boxShadow: isDark
                    ? '0 4px 20px rgba(0,0,0,0.3)'
                    : `0 4px 20px ${m.shadow}, 0 2px 6px rgba(0,0,0,0.04)`
                }}
              >
                {/* bg accent */}
                <div className={`absolute top-0 right-0 w-28 h-28 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none`}
                  style={{ background: `radial-gradient(circle, ${m.accent}, transparent)` }} />

                <div className="relative">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${m.iconBg} flex items-center justify-center text-xl`}
                      style={{ boxShadow: `0 6px 16px ${m.shadow}` }}>
                      {m.emoji}
                    </div>
                    {isCompleted ? (
                      <span className="badge badge-green">
                        <CheckCircle className="h-2.5 w-2.5" /> Done
                      </span>
                    ) : (
                      <span className={`badge ${isDark ? 'bg-white/[0.06] text-slate-400 border-white/[0.08]' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                        Pending
                      </span>
                    )}
                  </div>

                  <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{m.label}</h3>
                  <p className={`mt-1.5 text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{m.desc}</p>

                  <div className="mt-3 flex items-center gap-2">
                    <span className={`text-[10px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      <Clock className="h-3 w-3 inline mr-0.5" />{m.time}
                    </span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                      m.level === 'Essential' ? 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10' :
                      m.level === 'Intermediate' ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10' :
                      'text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-500/10'
                    }`}>{m.level}</span>
                  </div>

                  {isCompleted && (
                    <div className="mt-3 flex items-center gap-1.5">
                      <div className="h-1.5 flex-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 overflow-hidden">
                        <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                      </div>
                      <span className="text-[10px] font-bold text-emerald-500">100%</span>
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-1 text-xs font-bold" style={{ color: m.accent }}>
                    {isCompleted ? 'Review' : 'Start Training'}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1.5" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`rounded-2xl border p-5 ${
          isDark ? 'bg-[#0f172a] border-white/[0.06]' : 'bg-white border-slate-100'
        }`}
        style={{ boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.04)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Recent Activity</h3>
          {completed.length > 0 && (
            <button className="text-[11px] font-semibold text-blue-500 hover:text-blue-600 flex items-center gap-0.5">
              View all <ChevronRight className="h-3 w-3" />
            </button>
          )}
        </div>
        <div className="space-y-1">
          {completed.length > 0 ? (
            completed.slice(-3).reverse().map((mod, idx) => (
              <div key={idx} className={`flex items-center gap-3 py-2.5 px-3 rounded-xl ${
                isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-slate-50'
              } transition-colors`}>
                <div className="h-8 w-8 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium capitalize ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    Completed {mod} module
                  </p>
                  <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>+200 safety points</p>
                </div>
                <span className={`text-[10px] font-mono flex-shrink-0 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <div className={`text-sm py-8 text-center flex flex-col items-center gap-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <Zap className="h-8 w-8 opacity-30" />
              No activity yet. Start a module above to begin!
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
