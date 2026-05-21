import React from 'react';
import { Trophy, Award, Medal, Shield } from 'lucide-react';
import { useAppData } from '../hooks/useAppData';

export default function Leaderboard() {
  const { data } = useAppData();
  
  // Extract and sort student users based on completed modules count & points
  const leaderboard = data.users
    .filter(u => u.role === 'student')
    .map(s => ({
      ...s,
      pts: (s.completedModules || []).length * 200
    }))
    .sort((a, b) => b.pts - a.pts);

  const getRankBadge = (idx) => {
    if (idx === 0) return <Medal className="h-6 w-6 text-yellow-500 fill-current" title="1st Place - Gold Medal" />;
    if (idx === 1) return <Medal className="h-6 w-6 text-slate-350 fill-current" title="2nd Place - Silver Medal" />;
    if (idx === 2) return <Medal className="h-6 w-6 text-amber-600 fill-current" title="3rd Place - Bronze Medal" />;
    return <span className="font-mono text-sm font-bold text-slate-500 w-6 text-center">{idx + 1}</span>;
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto text-white">
      {/* Header */}
      <div>
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-yellow-500 flex items-center gap-1.5">
          <Trophy className="h-4 w-4 animate-bounce" /> Gamified Scoreboard
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 mt-1 font-sans">Leaderboard</h1>
      </div>

      {/* Ranks list container */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 backdrop-blur-sm shadow-2xl space-y-2">
        {leaderboard.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">No student logs found in database registry.</p>
        ) : (
          leaderboard.map((item, idx) => {
            const completedCount = (item.completedModules || []).length;
            
            return (
              <div
                key={item.id}
                className={`rounded-xl border p-4 flex items-center justify-between gap-4 transition-colors ${
                  idx === 0
                    ? 'border-yellow-500/30 bg-yellow-500/5'
                    : idx === 1
                    ? 'border-slate-400/20 bg-slate-400/5'
                    : idx === 2
                    ? 'border-amber-600/20 bg-amber-600/5'
                    : 'border-slate-800 bg-slate-950/20 hover:border-slate-700/80'
                }`}
              >
                {/* Rank and Info */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex-shrink-0">
                    {getRankBadge(idx)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-base font-bold text-slate-200 truncate uppercase">{item.name}</h4>
                    <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                      {item.rollNo} • {item.dept}
                    </span>
                  </div>
                </div>

                {/* Score stats */}
                <div className="flex items-center gap-4 flex-shrink-0 text-right">
                  <div className="hidden sm:block">
                    <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Certified</span>
                    <span className="text-xs text-slate-300 font-bold font-mono">{completedCount} / 4 modules</span>
                  </div>
                  <div className="rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 min-w-[70px]">
                    <span className="block text-[8px] font-bold text-slate-500 tracking-wider font-mono">POINTS</span>
                    <span className="font-mono text-sm font-extrabold text-yellow-500">{item.pts}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
