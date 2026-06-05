import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Bell, Trash2, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { useAppData } from '../hooks/useAppData';
import { useThemeContext } from '../App';
import { mockGemini } from '../utilities/mockGemini';

export default function DrillManager({ onToast }) {
  const { data, updateDrills } = useAppData();
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const drills = data.drills;
  const [form, setForm] = useState({ title: '', type: 'Fire' });
  const [generating, setGenerating] = useState(false);

  const scheduleDrill = (e) => {
    e.preventDefault();
    if (!form.title.trim()) { onToast('Please enter a drill title.', 'warn'); return; }
    updateDrills(prev => [{
      id: 'd-' + Date.now(),
      title: form.title.trim(),
      type: form.type.toLowerCase(),
      timestamp: Date.now(),
      status: 'Completed'
    }, ...prev]);
    onToast('Drill safety record logged successfully!', 'success');
    setForm({ title: '', type: 'Fire' });
  };

  const deleteDrill = (id) => {
    if (window.confirm('Are you sure you want to delete this drill log from history?')) {
      updateDrills(prev => prev.filter(d => d.id !== id));
      onToast('Drill safety log deleted.', 'info');
    }
  };

  const handleAiGenerate = async () => {
    setGenerating(true);
    try {
      const prompt = `Generate a realistic 1-sentence emergency drill alert title for a university campus for a ${form.type} emergency. Keep it under 60 characters. Do not use quotes or prefixes.`;
      const result = await mockGemini.generate(prompt, 'You are a campus safety officer writing drill alerts.');
      setForm(prev => ({ ...prev, title: result.trim().replace(/^"|"$/g, '') }));
      onToast('Dynamic scenario alert generated!', 'success');
    } catch (e) {
      onToast('AI generation failed.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const card = isDark ? 'bg-[#0f172a] border border-white/[0.06]' : 'bg-white border border-slate-100';
  const cardShadow = isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.05)';
  const inputCls = isDark
    ? 'bg-slate-900 border-white/[0.08] text-white placeholder-slate-600 focus:border-blue-500'
    : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <span className="section-label">Safety Coordinator</span>
        <h1 className={`text-2xl font-extrabold tracking-tight mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Drill Manager
        </h1>
      </motion.div>

      {/* Record Form */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        className={`relative rounded-2xl p-6 ${card}`}
        style={{ boxShadow: cardShadow, borderLeft: '4px solid #EF4444' }}
      >
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Bell className="h-4 w-4 text-red-500" />
            </div>
            <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Record New Drill</h3>
          </div>
          <button
            onClick={handleAiGenerate}
            disabled={generating}
            className="text-xs font-bold text-red-500 hover:text-red-400 inline-flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {generating ? 'Generating...' : 'Auto-Generate Alert'}
          </button>
        </div>

        <form onSubmit={scheduleDrill} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className={`block text-[10px] font-bold uppercase tracking-widest mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Drill Title
            </label>
            <input
              type="text" required value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Science Annex Evacuation Path Testing"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/15 transition-all ${inputCls}`}
            />
          </div>
          <div className="w-full md:w-48">
            <label className={`block text-[10px] font-bold uppercase tracking-widest mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Hazard Type
            </label>
            <select
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none transition-all cursor-pointer ${inputCls}`}
            >
              <option>Fire</option>
              <option>Flood</option>
              <option>Quake</option>
              <option>Threat</option>
            </select>
          </div>
          <motion.button
            type="submit"
            whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
            className="w-full md:w-auto rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-all flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', boxShadow: '0 4px 14px rgba(239,68,68,0.3)' }}
          >
            <Plus className="h-4 w-4" /> Schedule Drill
          </motion.button>
        </form>
      </motion.div>

      {/* Drill History */}
      <div className="space-y-3">
        <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Safety Drill Timeline Logs
        </span>

        {drills.length === 0 ? (
          <div className={`rounded-2xl border p-12 text-center text-sm font-medium ${isDark ? 'border-white/[0.06] bg-[#0f172a] text-slate-500' : 'border-slate-100 bg-white text-slate-400'}`}
            style={{ boxShadow: cardShadow }}>
            No safety drills logged yet.
          </div>
        ) : (
          drills.map((d, idx) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }}
              className={`rounded-xl border p-4 flex items-center justify-between gap-4 transition-all ${
                isDark
                  ? 'bg-[#0f172a] border-white/[0.06] hover:border-white/[0.1]'
                  : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm hover:shadow'
              }`}
            >
              <div className="min-w-0 flex items-start gap-3">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  d.status === 'Completed' ? 'bg-emerald-500/10' : 'bg-amber-500/10'
                }`}>
                  {d.status === 'Completed'
                    ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    : <Clock className="h-4 w-4 text-amber-500" />
                  }
                </div>
                <div className="min-w-0">
                  <h4 className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>{d.title}</h4>
                  <span className={`text-[10px] font-mono mt-0.5 block ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                    {new Date(d.timestamp).toLocaleString()} · {d.type.toUpperCase()} DRILL
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-extrabold tracking-wider uppercase border ${
                  d.status === 'Completed'
                    ? isDark ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : isDark ? 'border-orange-500/20 bg-orange-500/10 text-orange-400' : 'border-orange-200 bg-orange-50 text-orange-700'
                }`}>
                  {d.status === 'Completed' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                  {d.status}
                </span>
                <button
                  onClick={() => deleteDrill(d.id)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isDark ? 'text-slate-600 hover:bg-red-500/10 hover:text-red-400' : 'text-slate-400 hover:bg-red-50 hover:text-red-500'
                  }`}
                  title="Delete drill log"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
