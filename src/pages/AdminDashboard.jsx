import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, ShieldAlert, Award, FileText, CheckCircle2,
  AlertTriangle, Send, ChevronRight, Users, TrendingUp,
  Activity, ArrowUpRight, Bell, Layers, Shield
} from 'lucide-react';
import { useAppData } from '../hooks/useAppData';
import { navigate } from '../hooks/useRoute';
import { useThemeContext } from '../App';

export default function AdminDashboard({ onToast }) {
  const { data, updateDrills } = useAppData();
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const [drillMsg, setDrillMsg] = useState('');
  const [drillType, setDrillType] = useState('general');
  const [broadcasting, setBroadcasting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const students = data.users.filter(u => u.role === 'student');
  const drills = data.drills;

  const modCounts = { fire: 0, flood: 0, quake: 0, cyclone: 0 };
  let trainedCount = 0;
  students.forEach(u => {
    const completed = u.completedModules || [];
    completed.forEach(m => { if (modCounts[m] !== undefined) modCounts[m]++; });
    if (completed.length >= 4) trainedCount++;
  });

  const maxStudents = students.length || 1;
  const stats = {
    total: students.length,
    trained: trainedCount,
    drills: drills.length,
    pending: students.length - trainedCount
  };

  const chartData = [
    { label: 'Fire Safety', value: Math.round((modCounts.fire / maxStudents) * 100), color: '#EF4444', track: 'bg-red-500', light: 'from-red-50', accent: 'text-red-600' },
    { label: 'Flood Safety', value: Math.round((modCounts.flood / maxStudents) * 100), color: '#3B82F6', track: 'bg-blue-500', light: 'from-blue-50', accent: 'text-blue-600' },
    { label: 'Earthquake', value: Math.round((modCounts.quake / maxStudents) * 100), color: '#F59E0B', track: 'bg-amber-500', light: 'from-amber-50', accent: 'text-amber-600' },
    { label: 'Cyclone Safety', value: Math.round((modCounts.cyclone / maxStudents) * 100), color: '#06B6D4', track: 'bg-cyan-500', light: 'from-cyan-50', accent: 'text-cyan-600' }
  ];

  const statCards = [
    { label: 'Total Students', value: stats.total, icon: Users, accent: '#2563EB', bg: 'from-blue-50 to-indigo-50', shadow: 'rgba(37,99,235,0.12)', desc: 'Registered', trend: '+12%' },
    { label: 'Fully Trained', value: stats.trained, icon: Award, accent: '#10B981', bg: 'from-emerald-50 to-teal-50', shadow: 'rgba(16,185,129,0.12)', desc: 'All 4 modules', trend: '+8%' },
    { label: 'Drills Conducted', value: stats.drills, icon: Bell, accent: '#F59E0B', bg: 'from-amber-50 to-yellow-50', shadow: 'rgba(245,158,11,0.12)', desc: 'This semester', trend: '+3' },
    { label: 'Pending Assessment', value: stats.pending, icon: AlertTriangle, accent: '#EF4444', bg: 'from-red-50 to-rose-50', shadow: 'rgba(239,68,68,0.12)', desc: 'Need completion', trend: '-5%' }
  ];

  const broadcastAlert = (e) => {
    e.preventDefault();
    if (!drillMsg.trim()) return;
    setBroadcasting(true);
    setTimeout(() => {
      updateDrills(prev => [{
        id: 'd-' + Date.now(),
        title: drillMsg.trim(),
        type: drillType,
        timestamp: Date.now(),
        status: 'Active'
      }, ...prev]);
      onToast('Drill alert broadcast to all connected devices!', 'success');
      setDrillMsg('');
      setBroadcasting(false);
    }, 600);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onToast(`Searching student records for "${searchQuery}"...`, 'info');
      sessionStorage.setItem('dpres_student_search', searchQuery.trim());
      setTimeout(() => navigate('#/admin/students'), 400);
    }
  };

  const inputClass = isDark
    ? 'bg-slate-900 border-white/[0.08] text-white placeholder-slate-500 focus:border-blue-500'
    : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500';

  return (
    <div className="space-y-7 max-w-7xl mx-auto">
      {/* ── Command Center Header ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="section-label">Administrator Panel</span>
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
              }`}>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
            <h1 className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Command Center
            </h1>
          </div>
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="Search student or roll no..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full rounded-xl border pl-10 pr-20 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${inputClass}`}
              style={{ boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.04)' }}
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 px-4 text-xs font-bold text-white transition-all"
              style={{ boxShadow: '0 2px 8px rgba(37,99,235,0.3)' }}
            >
              Search
            </button>
          </form>
        </div>
      </motion.div>

      {/* ── Statistics Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s, idx) => {
          const IconComp = s.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className={`relative overflow-hidden rounded-2xl p-5 stat-card ${
                isDark
                  ? 'bg-[#0f172a] border border-white/[0.06]'
                  : `bg-gradient-to-br ${s.bg} border border-white`
              }`}
              style={{ boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : `0 4px 20px ${s.shadow}, 0 1px 4px rgba(0,0,0,0.04)` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${s.accent}15` }}>
                  <IconComp className="h-5 w-5" style={{ color: s.accent }} />
                </div>
                <span className={`text-[10px] font-bold flex items-center gap-0.5 ${
                  s.trend.startsWith('+') && s.label !== 'Pending Assessment' ? 'text-emerald-500' :
                  s.trend.startsWith('-') ? 'text-emerald-500' : 'text-amber-500'
                }`}>
                  <TrendingUp className="h-3 w-3" />{s.trend}
                </span>
              </div>
              <p className={`text-3xl font-extrabold tabular-nums ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {s.value}
              </p>
              <p className={`text-xs font-semibold mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{s.label}</p>
              <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{s.desc}</p>
            </motion.div>
          );
        })}
      </div>

      {/* ── Broadcast Emergency Alert ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        className={`relative overflow-hidden rounded-2xl p-6 ${
          isDark
            ? 'bg-[#0f172a] border border-red-500/20'
            : 'bg-white border border-red-100'
        }`}
        style={{ boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(239,68,68,0.08), 0 2px 8px rgba(0,0,0,0.04)' }}
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-500 to-red-600 rounded-l-2xl" />
        <div className="flex items-center gap-2.5 mb-5">
          <div className="h-9 w-9 rounded-xl bg-red-500/10 flex items-center justify-center">
            <ShieldAlert className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Broadcast Emergency Drill Alert
            </h3>
            <p className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Push real-time alerts to all connected student devices
            </p>
          </div>
        </div>
        <form onSubmit={broadcastAlert} className="flex flex-col md:flex-row gap-3 items-end">
          <div className="flex-1 w-full">
            <label className={`block text-[10px] font-bold uppercase tracking-widest mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Alert Message
            </label>
            <input
              type="text"
              required
              value={drillMsg}
              onChange={e => setDrillMsg(e.target.value)}
              placeholder="e.g. FIRE DRILL — Evacuate via East exit immediately"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 ${inputClass}`}
            />
          </div>
          <div className="w-full md:w-44">
            <label className={`block text-[10px] font-bold uppercase tracking-widest mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Emergency Type
            </label>
            <select
              value={drillType}
              onChange={e => setDrillType(e.target.value)}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-all focus:outline-none focus:border-red-400 cursor-pointer ${inputClass}`}
            >
              <option value="general">General Warning</option>
              <option value="fire">Fire Protocol</option>
              <option value="flood">Flood Warning</option>
              <option value="quake">Earthquake Warning</option>
              <option value="cyclone">Cyclone Evacuation Drill</option>
            </select>
          </div>
          <motion.button
            type="submit"
            disabled={broadcasting || !drillMsg.trim()}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="w-full md:w-auto rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #EF4444, #DC2626)',
              boxShadow: '0 4px 14px rgba(239,68,68,0.35)'
            }}
          >
            <Send className="h-4 w-4" />
            {broadcasting ? 'Sending...' : 'Broadcast'}
          </motion.button>
        </form>
      </motion.div>

      {/* ── Campus Map + Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        {/* Live Campus Map */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
          className={`lg:col-span-2 rounded-2xl overflow-hidden flex flex-col ${
            isDark ? 'bg-[#0f172a] border border-white/[0.06]' : 'bg-white border border-slate-100'
          }`}
          style={{ boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.05)' }}
        >
          <div className={`px-5 py-3.5 flex justify-between items-center flex-shrink-0 ${
            isDark ? 'border-b border-white/[0.05]' : 'border-b border-slate-100'
          }`}>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-500" />
              <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>Live Campus Status</span>
              <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
              }`}>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </span>
            </div>
            <button
              onClick={() => navigate('#/portal/map')}
              className="text-xs font-semibold text-blue-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
            >
              Full Map <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className={`relative flex-1 min-h-[300px] flex items-center justify-center p-4 ${
            isDark ? 'bg-slate-950/50' : 'bg-slate-50/50'
          }`}>
            <svg viewBox="0 0 800 450" className="w-full max-h-[320px]">
              <defs>
                <pattern id="adminGrid" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M 32 0 L 0 0 0 32" fill="none" stroke={isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.04)'} strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#adminGrid)" />
              <path d="M 40 210 Q 280 200 760 230" fill="none" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'} strokeWidth="20" strokeLinecap="round" />
              <path d="M 270 40 Q 290 200 280 410" fill="none" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'} strokeWidth="20" strokeLinecap="round" />
              {[
                { label: 'Block A', x: 90, y: 60, w: 180, h: 120 },
                { label: 'Block B', x: 290, y: 90, w: 160, h: 100 },
                { label: 'Block C', x: 120, y: 230, w: 150, h: 140 },
                { label: 'Library', x: 310, y: 250, w: 180, h: 110 },
                { label: 'Canteen', x: 520, y: 270, w: 140, h: 120 }
              ].map((b, idx) => (
                <g key={idx}>
                  <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="10"
                    fill={isDark ? '#1e293b' : '#EFF6FF'}
                    stroke={isDark ? '#334155' : '#BFDBFE'}
                    strokeWidth="1.5" />
                  <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 5} textAnchor="middle"
                    fill={isDark ? '#94a3b8' : '#2563EB'} fontSize="13" fontWeight="600"
                    className="pointer-events-none select-none">{b.label}</text>
                </g>
              ))}
              <circle cx="180" cy="120" r="6" fill="#10b981" className="animate-pulse" />
              <circle cx="370" cy="140" r="6" fill="#10b981" className="animate-pulse" />
              <circle cx="200" cy="300" r="6" fill="#ef4444" className="animate-pulse" />
            </svg>
            <div className={`absolute top-4 left-4 flex gap-1.5 items-center rounded-full px-3 py-1.5 text-[10px] font-bold ${
              isDark ? 'bg-slate-900/90 border border-white/[0.08] text-slate-400' : 'bg-white border border-slate-200 text-slate-500 shadow-sm'
            }`}>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sensors Online
            </div>
          </div>
        </motion.div>

        {/* Completion Chart + Drill Log */}
        <div className="space-y-5 flex flex-col">
          {/* Module Completion */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36 }}
            className={`rounded-2xl p-5 flex-1 ${
              isDark ? 'bg-[#0f172a] border border-white/[0.06]' : 'bg-white border border-slate-100'
            }`}
            style={{ boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.05)' }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Activity className="h-4 w-4 text-blue-500" />
              <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>Module Completion</span>
            </div>
            <div className="space-y-4">
              {chartData.map((d, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                    <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{d.label}</span>
                    <span className={d.accent + ' dark:text-current'} style={{ color: d.color }}>{d.value}%</span>
                  </div>
                  <div className={`h-2 w-full rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${d.value}%` }}
                      transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 + idx * 0.08 }}
                      className={`h-full rounded-full ${d.track}`}
                      style={{ boxShadow: `0 0 8px ${d.color}50` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Drills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`rounded-2xl p-5 flex-1 flex flex-col ${
              isDark ? 'bg-[#0f172a] border border-white/[0.06]' : 'bg-white border border-slate-100'
            }`}
            style={{ boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.05)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-4 w-4 text-amber-500" />
              <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>Recent Safety Drills</span>
            </div>
            <div className="flex-1 space-y-3">
              {drills.length === 0 ? (
                <p className={`text-xs text-center py-6 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                  No drills recorded yet.
                </p>
              ) : (
                drills.slice(0, 3).map((d) => (
                  <div key={d.id} className="flex gap-3 items-start">
                    <div className={`h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      d.status === 'Completed' ? 'bg-emerald-500/10' : 'bg-amber-500/10'
                    }`}>
                      <CheckCircle2 className={`h-3.5 w-3.5 ${d.status === 'Completed' ? 'text-emerald-500' : 'text-amber-500'}`} />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold truncate ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{d.title}</p>
                      <span className={`text-[10px] font-mono ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                        {new Date(d.timestamp).toLocaleString()} · {d.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => navigate('#/admin/drills')}
              className="text-xs font-semibold text-blue-500 hover:text-blue-600 flex items-center gap-1 mt-4 transition-colors"
            >
              View all drills <ArrowUpRight className="h-3 w-3" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
