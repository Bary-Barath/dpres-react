import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ShieldAlert, Award, FileText, CheckCircle2, AlertTriangle, Send, ChevronRight, Users } from 'lucide-react';
import { useAppData } from '../hooks/useAppData';
import { navigate } from '../hooks/useRoute';

export default function AdminDashboard({ onToast }) {
  const { data, updateDrills } = useAppData();
  const [drillMsg, setDrillMsg] = useState('');
  const [drillType, setDrillType] = useState('general');
  const [broadcasting, setBroadcasting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const students = data.users.filter(u => u.role === 'student');
  const drills = data.drills;

  // Compute statistics
  const modCounts = { fire: 0, flood: 0, quake: 0, threat: 0 };
  let trainedCount = 0;
  students.forEach(u => {
    const completed = u.completedModules || [];
    completed.forEach(m => {
      if (modCounts[m] !== undefined) modCounts[m]++;
    });
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
    { label: 'Fire Safety', value: Math.round((modCounts.fire / maxStudents) * 100), color: 'bg-red-500', text: 'text-red-500' },
    { label: 'Flood Safety', value: Math.round((modCounts.flood / maxStudents) * 100), color: 'bg-blue-500', text: 'text-blue-500' },
    { label: 'Earthquake', value: Math.round((modCounts.quake / maxStudents) * 100), color: 'bg-orange-500', text: 'text-orange-500' },
    { label: 'Active Threat', value: Math.round((modCounts.threat / maxStudents) * 100), color: 'bg-purple-500', text: 'text-purple-500' }
  ];

  const broadcastAlert = (e) => {
    e.preventDefault();
    if (!drillMsg.trim()) return;

    setBroadcasting(true);
    setTimeout(() => {
      updateDrills(prev => [
        {
          id: 'd-' + Date.now(),
          title: drillMsg.trim(),
          type: drillType,
          timestamp: Date.now(),
          status: 'Active'
        },
        ...prev
      ]);
      onToast('Drill alert broadcast to all connected devices!', 'success');
      setDrillMsg('');
      setBroadcasting(false);
    }, 600);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onToast(`Searching student records for "${searchQuery}"...`, 'info');
      // Pass the search query via sessionStorage so the StudentsDB page can filter on it
      sessionStorage.setItem('dpres_student_search', searchQuery.trim());
      setTimeout(() => navigate('#/admin/students'), 400);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header and Search bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-red-500">▶ Administrator Panel</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">Command Center</h1>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search student or roll no..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-11 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:border-red-500 focus:outline-none transition-colors pr-20 shadow-sm"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 rounded-full bg-red-600 hover:bg-red-500 px-4 text-xs font-bold text-white transition-all shadow-md shadow-red-500/10"
          >
            Find
          </button>
        </form>
      </div>

      {/* Statistics Cards grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Students', value: stats.total, color: 'text-blue-500', desc: 'Registered in database', icon: Users },
          { label: 'Fully Trained', value: stats.trained, color: 'text-green-500', desc: 'Completed all 4 modules', icon: Award },
          { label: 'Drills Conducted', value: stats.drills, color: 'text-orange-500', desc: 'This academic semester', icon: FileText },
          { label: 'Pending Assessment', value: stats.pending, color: 'text-red-500', desc: 'Requires further safety logs', icon: AlertTriangle }
        ].map((s, idx) => {
          const IconComp = s.icon;
          return (
            <div key={idx} className="premium-card p-6 relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{s.label}</p>
                  <p className={`mt-2 text-4xl font-extrabold ${s.color}`}>{s.value}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 group-hover:text-white transition-colors">
                  <IconComp className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-400 font-medium">{s.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Broadcast Alert */}
      <div className="rounded-2xl border-l-4 border-l-red-500 border-y border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/20 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <ShieldAlert className="h-5 w-5 text-red-500 animate-pulse" /> Broadcast Emergency Drill Alert
        </h3>
        <form onSubmit={broadcastAlert} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Alert Message</label>
            <input
              type="text"
              required
              value={drillMsg}
              onChange={e => setDrillMsg(e.target.value)}
              placeholder="e.g. FIRE DRILL — Evacuate via East exit doors immediately"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-600 focus:border-red-500 focus:outline-none transition-colors"
            />
          </div>
          <div className="w-full md:w-48">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Emergency Type</label>
            <select
              value={drillType}
              onChange={e => setDrillType(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-red-500 focus:outline-none transition-colors cursor-pointer"
            >
              <option value="general">General Warning</option>
              <option value="fire">Fire Protocol</option>
              <option value="flood">Flood Warning</option>
              <option value="quake">Earthquake Warning</option>
              <option value="threat">Active Threat Lockdown</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={broadcasting || !drillMsg.trim()}
            className="w-full md:w-auto rounded-xl bg-red-600 hover:bg-red-500 px-6 py-3 text-sm font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 disabled:opacity-50"
          >
            <Send className="h-4 w-4" /> {broadcasting ? 'Sending...' : 'Broadcast'}
          </button>
        </form>
      </div>

      {/* Map, Completion Chart & Recents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Live campus status map */}
        <div className="lg:col-span-2 premium-card-static overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-slate-800/60 flex justify-between items-center bg-slate-950/20">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-red-500">▶ Live Campus status</span>
            <button
              onClick={() => navigate('#/portal/map')}
              className="text-xs font-bold text-red-500 hover:text-red-400 flex items-center gap-1"
            >
              Open Full Map <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="relative flex-1 bg-slate-950/60 min-h-[300px] flex items-center justify-center p-4">
            <svg viewBox="0 0 800 450" className="w-full max-h-[350px]">
              <defs>
                <pattern id="adminGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#adminGrid)" />

              {/* Roads / Pathways */}
              <path d="M 40 210 Q 280 200 760 230" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="20" strokeLinecap="round" />
              <path d="M 270 40 Q 290 200 280 410" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="20" strokeLinecap="round" />

              {/* Buildings */}
              {[
                { label: 'Block A', x: 90, y: 60, w: 180, h: 120 },
                { label: 'Block B', x: 290, y: 90, w: 160, h: 100 },
                { label: 'Block C', x: 120, y: 230, w: 150, h: 140 },
                { label: 'Library', x: 310, y: 250, w: 180, h: 110 },
                { label: 'Canteen', x: 520, y: 270, w: 140, h: 120 }
              ].map((b, idx) => (
                <g key={idx}>
                  <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="8" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                  <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 5} textAnchor="middle" fill="#f8fafc" fontSize="14" fontWeight="bold" className="pointer-events-none select-none">{b.label}</text>
                </g>
              ))}

              {/* Sensor Nodes */}
              <circle cx="180" cy="120" r="6" fill="#10b981" className="animate-pulse" />
              <circle cx="370" cy="140" r="6" fill="#10b981" className="animate-pulse" />
              <circle cx="200" cy="300" r="6" fill="#ef4444" className="animate-pulse" />
            </svg>
            <div className="absolute top-4 left-4 flex gap-1.5 items-center rounded-full bg-slate-900/80 border border-slate-800 px-3 py-1 text-[10px] font-bold text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SENSORS ONLINE
            </div>
          </div>
        </div>

        {/* Completion Charts & Recent activity */}
        <div className="space-y-6 flex flex-col">
          {/* Completion Chart */}
          <div className="premium-card-static p-6 flex-1 flex flex-col justify-between">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-red-500 mb-6 block">▶ Module Completion Rate</span>
            
            <div className="space-y-4">
              {chartData.map((d, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-baseline text-xs font-bold">
                    <span className="text-slate-300">{d.label}</span>
                    <span className={d.text}>{d.value}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${d.value}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full rounded-full ${d.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Drill Activity Log */}
          <div className="premium-card-static p-6 flex-1 flex flex-col justify-between">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-red-500 mb-4 block">▶ Recent Safety Drills</span>
            
            <div className="divide-y divide-slate-800 flex-1 flex flex-col justify-center">
              {drills.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No drills recorded in cloud storage.</p>
              ) : (
                drills.slice(0, 3).map((d) => (
                  <div key={d.id} className="py-3 first:pt-0 last:pb-0 flex gap-3 items-start">
                    <CheckCircle2 className={`h-4.5 w-4.5 mt-0.5 flex-shrink-0 ${d.status === 'Completed' ? 'text-emerald-500' : 'text-orange-500'}`} />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-200 truncate">{d.title}</p>
                      <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                        {new Date(d.timestamp).toLocaleString()} • {d.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => navigate('#/admin/drills')}
              className="text-xs font-bold text-red-500 hover:text-red-400 text-left mt-4"
            >
              View Drill History ↗
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
