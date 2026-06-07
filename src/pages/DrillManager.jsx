import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Bell, Trash2, Sparkles, CheckCircle2, Clock,
  Radio, Users, Activity, Zap, AlertTriangle, Send,
  TrendingUp, Shield, XCircle, BarChart2
} from 'lucide-react';
import {
  getDrills, broadcastDrill, logDrill, completeDrill, cancelDrill,
  deleteDrill as svcDeleteDrill, getParticipationForDrill,
  subscribe, getDrillMeta, SEVERITY_META
} from '../services/drillService';
import { useAppData } from '../hooks/useAppData';
import { useThemeContext } from '../App';
import { mockGemini } from '../utilities/mockGemini';

// ── hook: keep drill list fresh via service ────────────────────────────────
function useDrills() {
  const [drills, setDrills] = useState(getDrills);
  const refresh = useCallback(() => setDrills(getDrills()), []);
  useEffect(() => {
    const unsub = subscribe(() => refresh());
    window.addEventListener('focus', refresh);
    return () => { unsub(); window.removeEventListener('focus', refresh); };
  }, [refresh]);
  return { drills, refresh };
}

// ── participation stats for one drill ─────────────────────────────────────
function DrillStats({ drillId, totalStudents, isDark }) {
  const [stats, setStats] = useState(() => {
    const p = getParticipationForDrill(drillId);
    return {
      acked:     p.filter(x => x.status === 'acknowledged' || x.status === 'completed').length,
      completed: p.filter(x => x.status === 'completed').length,
    };
  });

  useEffect(() => {
    const unsub = subscribe(({ type }) => {
      if (type === 'PARTICIPATION_UPDATE') {
        const p = getParticipationForDrill(drillId);
        setStats({
          acked:     p.filter(x => x.status === 'acknowledged' || x.status === 'completed').length,
          completed: p.filter(x => x.status === 'completed').length,
        });
      }
    });
    return unsub;
  }, [drillId]);

  const ackPct  = totalStudents ? Math.round((stats.acked / totalStudents) * 100) : 0;
  const compPct = totalStudents ? Math.round((stats.completed / totalStudents) * 100) : 0;

  return (
    <div className="mt-3 space-y-2">
      <StatBar label="Acknowledged" value={stats.acked} total={totalStudents} pct={ackPct} color="#3B82F6" isDark={isDark} />
      <StatBar label="Completed"    value={stats.completed} total={totalStudents} pct={compPct} color="#10B981" isDark={isDark} />
    </div>
  );
}

function StatBar({ label, value, total, pct, color, isDark }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] font-semibold mb-1">
        <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{label}</span>
        <span style={{ color }}>{value}/{total} ({pct}%)</span>
      </div>
      <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ background: color, boxShadow: `0 0 6px ${color}60` }}
        />
      </div>
    </div>
  );
}

export default function DrillManager({ onToast }) {
  const { data } = useAppData();
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const { drills, refresh } = useDrills();
  const totalStudents = data.users.filter(u => u.role === 'student').length;

  const [form, setForm] = useState({
    title: '', type: 'Fire', severity: 'Medium', duration: '5',
    scenario: '', instructions: ''
  });
  const [broadcasting, setBroadcasting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('active');

  const activeDrills    = drills.filter(d => d.status === 'Active');
  const completedDrills = drills.filter(d => d.status === 'Completed' || d.status === 'Cancelled');
  const totalAcked = drills.reduce((sum, d) => {
    const p = getParticipationForDrill(d.id);
    return sum + p.filter(x => x.status === 'acknowledged' || x.status === 'completed').length;
  }, 0);

  // ── AI generation ──────────────────────────────────────────────────────────
  const handleAiGenerate = async () => {
    setGenerating(true);
    try {
      const prompt = `Generate a realistic emergency drill scenario for a university campus for a ${form.type} emergency. Return JSON with fields: title (max 60 chars), scenario (1-2 sentences), instructions (1-2 sentences action steps).`;
      const raw = await mockGemini.generate(
        `Generate a realistic 1-sentence emergency drill alert title for a university campus for a ${form.type} emergency. Keep it under 60 characters. Do not use quotes or prefixes.`,
        'You are a campus safety officer.'
      );
      setForm(prev => ({ ...prev, title: raw.trim().replace(/^"|"$/g, '') }));
      onToast('Drill title generated!', 'success');
    } catch {
      onToast('AI generation failed.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  // ── Broadcast live drill ───────────────────────────────────────────────────
  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!form.title.trim()) { onToast('Please enter a drill title.', 'warn'); return; }
    setBroadcasting(true);
    setTimeout(() => {
      broadcastDrill({
        title:        form.title,
        type:         form.type,
        severity:     form.severity,
        duration:     Number(form.duration) || 5,
        scenario:     form.scenario,
        instructions: form.instructions,
      });
      refresh();
      onToast('🚨 Drill broadcast to all student devices!', 'success');
      setForm({ title: '', type: 'Fire', severity: 'Medium', duration: '5', scenario: '', instructions: '' });
      setBroadcasting(false);
    }, 500);
  };

  // ── Log-only (no broadcast) ────────────────────────────────────────────────
  const handleLog = (e) => {
    e.preventDefault();
    if (!form.title.trim()) { onToast('Please enter a drill title.', 'warn'); return; }
    logDrill({ title: form.title, type: form.type });
    refresh();
    onToast('Drill logged in history.', 'success');
    setForm(prev => ({ ...prev, title: '' }));
  };

  const handleComplete = (id) => {
    completeDrill(id);
    refresh();
    onToast('Drill marked as completed.', 'success');
  };

  const handleCancel = (id) => {
    cancelDrill(id);
    refresh();
    onToast('Drill cancelled.', 'info');
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this drill record?')) return;
    svcDeleteDrill(id);
    refresh();
    onToast('Drill record deleted.', 'info');
  };

  const card      = isDark ? 'bg-[#0f172a] border border-white/[0.06]' : 'bg-white border border-slate-100';
  const shadow    = isDark ? '0 4px 24px rgba(0,0,0,0.3)'             : '0 4px 24px rgba(0,0,0,0.05)';
  const inputCls  = isDark
    ? 'bg-slate-900 border-white/[0.08] text-white placeholder-slate-600 focus:border-blue-500'
    : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500';
  const labelCls  = `block text-[10px] font-bold uppercase tracking-widest mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <span className="section-label">Safety Coordinator</span>
        <h1 className={`text-2xl font-extrabold tracking-tight mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Drill Manager
        </h1>
      </motion.div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {[
          { label: 'Active Drills',    value: activeDrills.length,    icon: Radio,       color: '#EF4444' },
          { label: 'Total Drills',     value: drills.length,          icon: Bell,        color: '#3B82F6' },
          { label: 'Total Responses',  value: totalAcked,             icon: CheckCircle2,color: '#10B981' },
          { label: 'Students',         value: totalStudents,          icon: Users,       color: '#F59E0B' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className={`rounded-2xl p-4 ${card}`}
            style={{ boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.3)' : `0 4px 16px ${s.color}12` }}>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: `${s.color}15` }}>
                <s.icon className="h-4.5 w-4.5" style={{ color: s.color }} />
              </div>
              <div>
                <p className={`text-xl font-extrabold ${isDark ? 'text-white' : 'text-slate-800'}`}>{s.value}</p>
                <p className={`text-[10px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{s.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Live Active Drills ── */}
      <AnimatePresence>
        {activeDrills.map(d => {
          const meta = getDrillMeta(d.type);
          return (
            <motion.div key={d.id}
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="rounded-2xl overflow-hidden border"
              style={{ borderColor: `${meta.color}40`, background: `${meta.color}08`, boxShadow: `0 4px 24px ${meta.color}25` }}>
              <div className="p-5">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center text-xl animate-pulse"
                      style={{ background: `${meta.color}20`, border: `1px solid ${meta.color}40` }}>
                      {meta.emoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black tracking-widest px-2 py-0.5 rounded-full text-white"
                          style={{ background: meta.color }}>LIVE</span>
                        <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{d.title}</span>
                      </div>
                      <p className={`text-[10px] mt-0.5 font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        Broadcast {new Date(d.broadcastAt || d.timestamp).toLocaleTimeString()}
                        {d.severity && <span className="ml-2" style={{ color: meta.color }}>· {d.severity} severity</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleComplete(d.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-400 transition-all flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Complete
                    </button>
                    <button onClick={() => handleCancel(d.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                        isDark ? 'border-white/[0.08] text-slate-400 hover:bg-white/[0.05]' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}>
                      <XCircle className="h-3.5 w-3.5" /> Cancel
                    </button>
                  </div>
                </div>
                <DrillStats drillId={d.id} totalStudents={totalStudents} isDark={isDark} />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* ── Broadcast Form ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className={`relative rounded-2xl p-6 ${card}`}
        style={{ boxShadow: shadow, borderLeft: '4px solid #EF4444' }}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Radio className="h-4.5 w-4.5 text-red-500" />
            </div>
            <div>
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Broadcast New Drill</h3>
              <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Pushes live alert to all student devices instantly</p>
            </div>
          </div>
          <button onClick={handleAiGenerate} disabled={generating}
            className="text-xs font-bold text-red-500 hover:text-red-400 flex items-center gap-1.5 disabled:opacity-50 transition-colors">
            <Sparkles className="h-3.5 w-3.5" />
            {generating ? 'Generating…' : 'AI Generate'}
          </button>
        </div>

        <form onSubmit={handleBroadcast} className="space-y-4">
          {/* Row 1: title */}
          <div>
            <label className={labelCls}>Drill Title</label>
            <input type="text" required value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Block A Fire Evacuation Exercise"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/15 transition-all ${inputCls}`} />
          </div>

          {/* Row 2: type + severity + duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Hazard Type</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none transition-all cursor-pointer ${inputCls}`}>
                <option>Fire</option><option>Flood</option><option>Quake</option><option>Cyclone</option><option>General</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Severity</label>
              <select value={form.severity} onChange={e => setForm(p => ({ ...p, severity: e.target.value }))}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none transition-all cursor-pointer ${inputCls}`}>
                <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Duration (minutes)</label>
              <input type="number" min="1" max="60" value={form.duration}
                onChange={e => setForm(p => ({ ...p, duration: e.target.value }))}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none transition-all ${inputCls}`} />
            </div>
          </div>

          {/* Row 3: scenario */}
          <div>
            <label className={labelCls}>Scenario (optional)</label>
            <input type="text" value={form.scenario}
              onChange={e => setForm(p => ({ ...p, scenario: e.target.value }))}
              placeholder="e.g. Smoke detected in 3rd floor stairwell of Block A"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none transition-all ${inputCls}`} />
          </div>

          {/* Row 4: instructions */}
          <div>
            <label className={labelCls}>Instructions (optional — auto-filled if blank)</label>
            <input type="text" value={form.instructions}
              onChange={e => setForm(p => ({ ...p, instructions: e.target.value }))}
              placeholder="e.g. Evacuate immediately via east stairwell to Assembly Point B"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none transition-all ${inputCls}`} />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <motion.button type="submit" disabled={broadcasting || !form.title.trim()}
              whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
              className="flex-1 rounded-xl py-3 text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
              style={{ background: 'linear-gradient(135deg,#EF4444,#DC2626)', boxShadow: '0 4px 14px rgba(239,68,68,0.35)' }}>
              <Send className="h-4 w-4" />
              {broadcasting ? 'Broadcasting…' : '🚨 Broadcast Live Drill'}
            </motion.button>
            <button type="button" onClick={handleLog} disabled={!form.title.trim()}
              className={`px-5 rounded-xl py-3 text-sm font-bold border transition-all disabled:opacity-40 flex items-center gap-2 ${
                isDark ? 'border-white/[0.08] text-slate-300 hover:bg-white/[0.05]' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}>
              <Plus className="h-4 w-4" /> Log Only
            </button>
          </div>
        </form>
      </motion.div>

      {/* ── Drill History ── */}
      <div>
        <div className={`flex p-1 rounded-2xl mb-4 ${isDark ? 'bg-slate-900 border border-white/[0.06]' : 'bg-slate-100'}`}>
          {[
            { key: 'active', label: 'Active', count: activeDrills.length },
            { key: 'history', label: 'History', count: completedDrills.length },
          ].map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === t.key
                  ? isDark ? 'bg-white/[0.08] text-white border border-white/[0.1]' : 'bg-white text-slate-800 shadow'
                  : isDark ? 'text-slate-500 hover:text-white' : 'text-slate-500'
              }`}>
              {t.label} {t.count > 0 && <span className="ml-1 opacity-60">({t.count})</span>}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {(activeTab === 'active' ? activeDrills : completedDrills).length === 0 ? (
            <div className={`rounded-2xl border p-10 text-center text-sm font-medium ${isDark ? 'border-white/[0.06] bg-[#0f172a] text-slate-500' : 'border-slate-100 bg-white text-slate-400'}`}>
              {activeTab === 'active' ? 'No active drills.' : 'No drill history yet.'}
            </div>
          ) : (
            (activeTab === 'active' ? activeDrills : completedDrills).map((d, idx) => {
              const meta = getDrillMeta(d.type);
              return (
                <motion.div key={d.id}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }}
                  className={`rounded-xl border p-4 ${isDark ? 'bg-[#0f172a] border-white/[0.06]' : 'bg-white border-slate-100 shadow-sm'}`}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                        style={{ background: `${meta.color}15` }}>{meta.emoji}</div>
                      <div className="min-w-0">
                        <h4 className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>{d.title}</h4>
                        <span className={`text-[10px] font-mono ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                          {new Date(d.timestamp).toLocaleString()} · {d.type.toUpperCase()} DRILL
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full border ${
                        d.status === 'Completed'
                          ? isDark ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : d.status === 'Active'
                          ? isDark ? 'border-red-500/20 bg-red-500/10 text-red-400' : 'border-red-200 bg-red-50 text-red-700'
                          : isDark ? 'border-white/[0.07] bg-white/[0.03] text-slate-500' : 'border-slate-200 bg-slate-50 text-slate-500'
                      }`}>{d.status}</span>
                      <button onClick={() => handleDelete(d.id)}
                        className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-slate-600 hover:bg-red-500/10 hover:text-red-400' : 'text-slate-400 hover:bg-red-50 hover:text-red-500'}`}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {d.status !== 'Active' && (
                    <DrillStats drillId={d.id} totalStudents={totalStudents} isDark={isDark} />
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
