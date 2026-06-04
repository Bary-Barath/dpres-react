import React, { useState } from 'react';
import { Save, User, Mail, Bell, Shield } from 'lucide-react';
import { useAuth } from '../App';
import { useThemeContext } from '../App';
import BackToHomeButton from '../components/common/BackToHomeButton';
import { motion } from 'framer-motion';

export default function Settings({ onToast }) {
  const { user, updateUser } = useAuth();
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';

  const [form, setForm] = useState({
    name: user?.name || '',
    dept: user?.dept || 'Computer Science',
    rollNo: user?.rollNo || '',
    smsAlerts: true,
    emailDrills: true
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { onToast('Please enter your name.', 'warn'); return; }
    setSaving(true);
    try {
      await updateUser({ name: form.name.trim(), dept: form.dept, rollNo: form.rollNo.trim() });
      onToast('Profile updated successfully!', 'success');
    } catch { onToast('Failed to save settings.', 'error'); }
    finally { setSaving(false); }
  };

  const card = isDark ? 'bg-[#0f172a] border border-white/[0.06]' : 'bg-white border border-slate-100';
  const cardShadow = isDark ? '0 4px 24px rgba(0,0,0,0.35)' : '0 4px 24px rgba(0,0,0,0.06)';
  const inputCls = isDark
    ? 'bg-slate-900 border-white/[0.08] text-white placeholder-slate-600 focus:border-blue-500'
    : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500';

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <BackToHomeButton />
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <span className="section-label">Registry Configurations</span>
        <h1 className={`text-2xl font-extrabold tracking-tight mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Profile Settings
        </h1>
      </motion.div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Profile Fields */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className={`rounded-2xl p-6 space-y-4 ${card}`}
          style={{ boxShadow: cardShadow }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <User className="h-3.5 w-3.5 text-blue-500" />
            </div>
            <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>Personal Information</span>
          </div>

          <div>
            <label className={`block text-[10px] font-bold uppercase tracking-widest mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Email Address (Locked)
            </label>
            <div className="relative">
              <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
              <input
                type="email" disabled value={user?.email || ''}
                className={`w-full rounded-xl border pl-10 px-4 py-2.5 text-sm cursor-not-allowed opacity-60 ${inputCls}`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-[10px] font-bold uppercase tracking-widest mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Full Name
            </label>
            <div className="relative">
              <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                type="text" required value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Priya Sharma"
                className={`w-full rounded-xl border pl-10 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition-all ${inputCls}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-[10px] font-bold uppercase tracking-widest mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Roll Number
              </label>
              <input
                type="text" value={form.rollNo}
                onChange={e => setForm({ ...form, rollNo: e.target.value })}
                placeholder="e.g. EE21012"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition-all ${inputCls}`}
              />
            </div>
            <div>
              <label className={`block text-[10px] font-bold uppercase tracking-widest mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Department
              </label>
              <select
                value={form.dept}
                onChange={e => setForm({ ...form, dept: e.target.value })}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition-all cursor-pointer ${inputCls}`}
              >
                <option>Computer Science</option>
                <option>Electronics</option>
                <option>Mechanical</option>
                <option>Civil Eng.</option>
                <option>Information Tech</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
          className={`rounded-2xl p-6 space-y-4 ${card}`}
          style={{ boxShadow: cardShadow }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Bell className="h-3.5 w-3.5 text-emerald-500" />
            </div>
            <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>Emergency Alert Subscriptions</span>
          </div>

          {[
            { key: 'smsAlerts', label: 'SMS Emergency Warnings', desc: 'Deploy immediate alerts to your registered mobile number.' },
            { key: 'emailDrills', label: 'Email Safety Reports', desc: 'Receive notifications about upcoming safety drills.' }
          ].map(({ key, label, desc }) => (
            <label
              key={key}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                isDark
                  ? 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
                  : 'border-slate-100 bg-slate-50 hover:border-blue-200'
              }`}
            >
              <div>
                <span className={`text-sm font-bold block ${isDark ? 'text-white' : 'text-slate-800'}`}>{label}</span>
                <span className={`text-[11px] mt-0.5 block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{desc}</span>
              </div>
              <div className="relative flex-shrink-0 ml-4">
                <input
                  type="checkbox"
                  checked={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.checked })}
                  className="sr-only peer"
                />
                <div className={`w-10 h-6 rounded-full transition-colors peer-checked:bg-blue-600 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
              </div>
            </label>
          ))}
        </motion.div>

        <motion.button
          type="submit" disabled={saving}
          whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
          className="btn-primary btn-ripple rounded-xl px-6 py-2.5 text-sm flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Settings'}
        </motion.button>
      </form>
    </div>
  );
}
