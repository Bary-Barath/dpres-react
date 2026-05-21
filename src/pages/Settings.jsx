import React, { useState } from 'react';
import { Save, User, Mail, ShieldAlert, Award } from 'lucide-react';
import { useAuth } from '../App';

export default function Settings({ onToast }) {
  const { user, updateUser } = useAuth();
  
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
    if (!form.name.trim()) {
      onToast('Please enter your name.', 'warn');
      return;
    }
    setSaving(true);
    try {
      await updateUser({
        name: form.name.trim(),
        dept: form.dept,
        rollNo: form.rollNo.trim()
      });
      onToast('Profile configurations updated successfully!', 'success');
    } catch (e) {
      onToast('Failed to save settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto text-white">
      {/* Header */}
      <div>
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-500">▶ Registry Configurations</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 mt-1 font-sans">Profile Settings</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Form fields card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm shadow-xl space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Email Address (Locked)</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full rounded-xl border border-slate-800/80 bg-slate-950 px-11 py-3 text-sm text-slate-600 cursor-not-allowed select-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Priya Sharma"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-11 py-3 text-sm text-white focus:border-red-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Roll Number</label>
              <input
                type="text"
                value={form.rollNo}
                onChange={e => setForm({ ...form, rollNo: e.target.value })}
                placeholder="e.g. EE21012"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-red-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Department</label>
              <select
                value={form.dept}
                onChange={e => setForm({ ...form, dept: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-red-500 focus:outline-none transition-colors cursor-pointer"
              >
                <option>Computer Science</option>
                <option>Electronics</option>
                <option>Mechanical</option>
                <option>Civil Eng.</option>
                <option>Information Tech</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications Checkboxes Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm shadow-xl space-y-4">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500 block">▶ Emergency Alerts Subscriptions</span>
          
          <div className="space-y-3.5">
            <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950/20 hover:border-slate-700/80 transition-all cursor-pointer">
              <div>
                <span className="text-sm font-bold block">SMS Emergency Warnings</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Deploy immediate alerts to your registered mobile number.</span>
              </div>
              <input
                type="checkbox"
                checked={form.smsAlerts}
                onChange={e => setForm({ ...form, smsAlerts: e.target.checked })}
                className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-red-600 focus:ring-red-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950/20 hover:border-slate-700/80 transition-all cursor-pointer">
              <div>
                <span className="text-sm font-bold block">Email Safety Reports</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Receive notifications about upcoming safety drills and assessments.</span>
              </div>
              <input
                type="checkbox"
                checked={form.emailDrills}
                onChange={e => setForm({ ...form, emailDrills: e.target.checked })}
                className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-red-600 focus:ring-red-500 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-start">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-red-600 hover:bg-red-500 px-6 py-3 text-sm font-bold text-white transition-all flex items-center gap-1.5 shadow-lg shadow-red-600/20 disabled:opacity-50"
          >
            <Save className="h-4.5 w-4.5" /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
