import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Flame, Waves, Globe, Shield, Sparkles, Trophy, ArrowRight, Award, TrendingUp, Clock, CheckCircle, Activity, BookOpen, AlertTriangle } from 'lucide-react';
import { useThemeContext } from '../App';
import { navigate } from '../hooks/useRoute';

export default function StudentPortal({ user }) {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';

  const modules = [
    { key: 'fire', label: 'Fire Safety', color: 'text-red-500 bg-red-500/10 border-red-500/20', textColor: 'text-red-500 dark:text-red-400', icon: Flame, desc: 'Evacuation drills, extinguisher classes, and R.A.C.E fire protocol.', emoji: '🔥' },
    { key: 'flood', label: 'Flood Protocol', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', textColor: 'text-blue-500 dark:text-blue-400', icon: Waves, desc: 'Flood safety levels, building high-zones, and water contamination risks.', emoji: '🌊' },
    { key: 'quake', label: 'Earthquake Safety', color: 'text-orange-500 bg-orange-500/10 border-orange-500/20', textColor: 'text-orange-500 dark:text-orange-400', icon: Globe, desc: 'Drop Cover Hold On posture, aftershock safety, and exit corridors.', emoji: '🌍' },
    { key: 'threat', label: 'Active Threat', color: 'text-purple-500 bg-purple-500/10 border-purple-500/20', textColor: 'text-purple-500 dark:text-purple-400', icon: Shield, desc: 'Run Hide Fight tactical guidance, doors barricade, and alerts reporting.', emoji: '🛡️' }
  ];

  const completed = user?.completedModules || [];
  const progressPct = Math.round((completed.length / 4) * 100);
  const earnedPts = completed.length * 200;
  const modulesLeft = 4 - completed.length;

  const readiness = completed.length === 0 ? 'Getting Started'
    : completed.length === 4 ? 'Fully Prepared'
    : completed.length >= 2 ? 'Intermediate' : 'Beginner';

  return (
    <div className="space-y-8">
      {/* ── Welcome Section ── */}
      <div className="relative overflow-hidden premium-card p-7">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2563eb]/5 via-[#06b6d4]/5 to-transparent" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#2563eb]/8 to-transparent rounded-full blur-3xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Student Safety Console
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight mt-1">
              Welcome back,{' '}
              <span className="gradient-text-blue">{(user?.name || 'Student')}</span>
              <span className="ml-1">👋</span>
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
              }`}>
                <Activity className="h-3.5 w-3.5" />
                {readiness}
              </span>
              <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <TrendingUp className="h-3.5 w-3.5 inline mr-1" />
                {earnedPts} pts
              </span>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => navigate('#/learning-hub')} className="btn-primary px-4 py-2 text-sm inline-flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" /> Learn
            </button>
            <button onClick={() => navigate('#/preparedness-quiz')} className="btn-primary px-4 py-2 text-sm inline-flex items-center gap-1.5">
              <Shield className="h-4 w-4" /> Quiz
            </button>
          </div>
        </div>
      </div>

      {/* ── Premium Progress Card ── */}
      <div className="relative overflow-hidden rounded-2xl" style={{
        background: isDark
          ? 'linear-gradient(135deg, #1e293b, #0f172a)'
          : 'linear-gradient(135deg, #2563eb, #3b82f6)'
      }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.06),transparent_60%)]" />
        <div className="relative p-7 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/10">
                <Award className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/70">Safety Compliance</p>
                <p className="text-2xl font-extrabold mt-0.5">
                  {completed.length}<span className="text-sm font-semibold text-white/60"> / 4 Modules</span>
                </p>
              </div>
            </div>
            <div className="px-4 py-2 rounded-xl backdrop-blur border border-white/15 bg-white/10">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60">Score</p>
              <p className="text-3xl font-extrabold">{progressPct}%</p>
            </div>
          </div>
          <div className="mt-5 h-3 rounded-full bg-white/15 backdrop-blur overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full bg-white/80 backdrop-blur"
            />
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-white/70">
            <span className="flex items-center gap-1.5">
              <Trophy className="h-3.5 w-3.5 text-yellow-300" />
              <strong className="text-white">{earnedPts}</strong> Points
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {modulesLeft > 0 ? `${modulesLeft} left` : 'All complete!'}
            </span>
            {completed.length === 4 && (
              <span className="inline-flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5 text-green-300" />
                Ready for certification
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Award, label: 'Completed', value: `${completed.length}/4`, color: '#10b981' },
          { icon: Trophy, label: 'Points', value: earnedPts, color: '#f59e0b' },
          { icon: TrendingUp, label: 'Readiness', value: readiness, color: '#2563eb' },
          { icon: Activity, label: 'Rank', value: '#42', color: '#8b5cf6' }
        ].map((stat, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
            className="premium-card p-4 flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}12` }}>
              <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
            </div>
            <div>
              <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Module Cards ── */}
      <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Safety Certification Modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* AI Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -4 }}
          onClick={() => navigate('#/portal/simulator')}
          className="premium-card p-6 cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex justify-between items-start mb-5">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white flex items-center justify-center shadow-lg shadow-red-500/20">
                <Sparkles className="h-6 w-6" />
              </div>
              <span className="inline-flex items-center rounded-full bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 text-[9px] font-extrabold tracking-widest text-red-600 dark:text-red-400 uppercase">AI</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-red-500 transition-colors">AI Disaster Assistant</h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Chat for instant disaster guidance, first aid, and emergency info.</p>
            <div className="mt-5 flex items-center gap-1 text-xs font-bold text-red-500 dark:text-red-400">
              Open <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </motion.div>

        {/* Module Cards */}
        {modules.map((m, idx) => {
          const isCompleted = completed.includes(m.key);
          return (
            <motion.div key={m.key} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }} whileHover={{ y: -4 }}
              onClick={() => navigate(`#/portal/quiz/${m.key}`)}
              className="premium-card p-6 cursor-pointer group relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-full ${m.color} blur-2xl opacity-20 group-hover:opacity-30 transition-opacity`} />
              <div className="relative">
                <div className="flex justify-between items-start mb-5">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-xl ${m.color}`}>
                    <span>{m.emoji}</span>
                  </div>
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[9px] font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
                      <CheckCircle className="h-3 w-3" /> Done
                    </span>
                  ) : (
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest ${isDark ? 'border-slate-700 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
                      Pending
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white transition-colors">{m.label}</h3>
                <p className={`mt-2 text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{m.desc}</p>
                {isCompleted && (
                  <div className="mt-3 flex items-center gap-1.5">
                    <div className="h-1 flex-1 rounded-full bg-emerald-500/20"><div className="h-full w-full rounded-full bg-emerald-500" /></div>
                    <span className="text-[10px] font-bold text-emerald-500">100%</span>
                  </div>
                )}
                <div className={`mt-5 flex items-center gap-1 text-xs font-bold ${m.textColor}`}>
                  {isCompleted ? 'Review' : 'Start'} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Recent Activity ── */}
      <div className="premium-card p-5">
        <h3 className={`text-sm font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>Recent Activity</h3>
        <div className="space-y-3">
          {completed.length > 0 ? (
            completed.slice(-3).reverse().map((mod, idx) => (
              <div key={idx} className="flex items-center gap-3 py-2">
                <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Completed {mod} module</p>
                  <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>+200 points earned</p>
                </div>
                <span className={`text-[10px] font-mono ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{new Date().toLocaleDateString()}</span>
              </div>
            ))
          ) : (
            <div className={`text-sm py-4 text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              No activity yet. Start a module!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
