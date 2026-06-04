import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star, TrendingUp } from 'lucide-react';
import { useAppData } from '../hooks/useAppData';
import { useThemeContext } from '../App';
import BackToHomeButton from '../components/common/BackToHomeButton';

export default function Leaderboard() {
  const { data } = useAppData();
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';

  const leaderboard = data.users
    .filter(u => u.role === 'student')
    .map(s => ({ ...s, pts: (s.completedModules || []).length * 200 }))
    .sort((a, b) => b.pts - a.pts);

  const podium = [
    { idx: 0, icon: '🥇', color: '#F59E0B', ring: 'ring-2 ring-amber-400/40', bg: isDark ? 'bg-amber-500/10 border-amber-500/25' : 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200' },
    { idx: 1, icon: '🥈', color: '#94A3B8', ring: 'ring-2 ring-slate-400/30', bg: isDark ? 'bg-slate-500/10 border-slate-500/25' : 'bg-gradient-to-br from-slate-50 to-slate-100/50 border-slate-200' },
    { idx: 2, icon: '🥉', color: '#B45309', ring: 'ring-2 ring-amber-700/30', bg: isDark ? 'bg-amber-700/10 border-amber-700/25' : 'bg-gradient-to-br from-orange-50 to-amber-50 border-amber-200' }
  ];

  const card = isDark ? 'bg-[#0f172a] border border-white/[0.06]' : 'bg-white border border-slate-100';
  const cardShadow = isDark ? '0 4px 24px rgba(0,0,0,0.35)' : '0 4px 24px rgba(0,0,0,0.06)';

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <BackToHomeButton />
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="h-4 w-4 text-amber-500 animate-bounce" />
          <span className="section-label" style={{ color: '#F59E0B' }}>Gamified Scoreboard</span>
        </div>
        <h1 className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Leaderboard
        </h1>
      </motion.div>

      {/* Top 3 podium cards */}
      {leaderboard.length >= 3 && (
        <div className="grid grid-cols-3 gap-3">
          {podium.map(({ idx, icon, color, bg }) => {
            const item = leaderboard[idx];
            if (!item) return null;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
                className={`rounded-2xl border p-4 text-center ${bg}`}
                style={{ boxShadow: `0 4px 20px ${color}20` }}
              >
                <span className="text-3xl block mb-2">{icon}</span>
                <p className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>{item.name}</p>
                <p className="text-lg font-extrabold mt-1" style={{ color }}>{item.pts}</p>
                <p className={`text-[10px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>pts</p>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Full rankings */}
      <div className={`rounded-2xl p-3 space-y-2 ${card}`} style={{ boxShadow: cardShadow }}>
        {leaderboard.length === 0 ? (
          <p className={`text-sm text-center py-10 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            No student records found.
          </p>
        ) : (
          leaderboard.map((item, idx) => {
            const completedCount = (item.completedModules || []).length;
            const isTop3 = idx < 3;
            const medalColors = ['#F59E0B', '#94A3B8', '#B45309'];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                className={`rounded-xl border p-4 flex items-center justify-between gap-4 transition-all ${
                  isTop3
                    ? isDark
                      ? idx === 0 ? 'border-amber-500/20 bg-amber-500/5' : idx === 1 ? 'border-slate-400/15 bg-slate-400/5' : 'border-amber-700/20 bg-amber-700/5'
                      : idx === 0 ? 'border-amber-200 bg-amber-50/50' : idx === 1 ? 'border-slate-200 bg-slate-50' : 'border-orange-200 bg-orange-50/50'
                    : isDark
                      ? 'border-white/[0.05] bg-white/[0.02] hover:border-white/[0.1]'
                      : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 flex-shrink-0 flex justify-center">
                    {isTop3
                      ? <span className="text-xl">{['🥇','🥈','🥉'][idx]}</span>
                      : <span className={`font-mono text-sm font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{idx + 1}</span>
                    }
                  </div>
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 text-white`}
                    style={{ background: isTop3 ? `linear-gradient(135deg, ${medalColors[idx]}, ${medalColors[idx]}aa)` : isDark ? '#1e293b' : '#EFF6FF', color: isTop3 ? 'white' : isDark ? '#94a3b8' : '#2563EB' }}>
                    {item.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h4 className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>{item.name}</h4>
                    <span className={`text-[10px] font-mono block mt-0.5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                      {item.rollNo} · {item.dept}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Modules</span>
                    <span className={`text-xs font-bold font-mono ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{completedCount}/4</span>
                  </div>
                  <div className={`rounded-xl px-3 py-2 min-w-[72px] text-center ${isDark ? 'bg-slate-900 border border-white/[0.06]' : 'bg-amber-50 border border-amber-100'}`}>
                    <span className={`block text-[9px] font-bold tracking-wider font-mono ${isDark ? 'text-slate-500' : 'text-amber-600/60'}`}>PTS</span>
                    <span className="font-mono text-sm font-extrabold text-amber-500">{item.pts}</span>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
