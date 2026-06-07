import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, X, Check, Search, Edit2,
  Users, Award, ShieldCheck, TrendingUp,
  ChevronDown, Filter, AlertTriangle
} from 'lucide-react';
import { useAppData } from '../hooks/useAppData';
import { useThemeContext } from '../App';

const DEPTS = [
  'All Departments',
  'AI & Data Science',
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Biotechnology',
];
const YEARS = ['All Years', '1st Year', '2nd Year', '3rd Year', '4th Year'];
const STATUSES = ['All Status', 'Active', 'Inactive'];
const MODS = ['fire', 'flood', 'quake', 'cyclone'];
const MOD_COLORS = { fire: '#EF4444', flood: '#3B82F6', quake: '#F97316', cyclone: '#06B6D4' };
const CERT_STYLES = {
  Certified:    { light: 'bg-emerald-50 text-emerald-700 border-emerald-200',   dark: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  'In Progress':{ light: 'bg-blue-50 text-blue-700 border-blue-200',           dark: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  'Not Started':{ light: 'bg-slate-100 text-slate-500 border-slate-200',        dark: 'bg-slate-800 text-slate-500 border-slate-700' },
};

const EMPTY_FORM = { name: '', rollNo: '', dept: 'Computer Science', year: '1st Year', email: '', prepScore: '50', status: 'Active', completedModules: [] };

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, delay, isDark }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`relative overflow-hidden rounded-2xl p-5 stat-card ${
        isDark ? 'bg-[#0f172a] border border-white/[0.06]' : 'bg-white border border-slate-100'
      }`}
      style={{ boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : `0 4px 20px ${color}18` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
      </div>
      <p className={`text-3xl font-extrabold tabular-nums ${isDark ? 'text-white' : 'text-slate-800'}`}>{value}</p>
      <p className={`text-xs font-semibold mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</p>
    </motion.div>
  );
}

// ── Delete Confirmation Modal ──────────────────────────────────────────────
function DeleteModal({ student, onConfirm, onCancel, isDark }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 12 }}
        transition={{ duration: 0.18 }}
        onClick={e => e.stopPropagation()}
        className={`w-full max-w-sm rounded-2xl p-6 shadow-2xl ${
          isDark ? 'bg-[#0f172a] border border-white/[0.08]' : 'bg-white border border-slate-200'
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Delete Student?</h3>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>This action cannot be undone.</p>
          </div>
        </div>
        <p className={`text-sm mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          Are you sure you want to permanently remove <strong>{student?.name}</strong> ({student?.rollNo}) from the registry?
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className={`flex-1 rounded-xl py-2.5 text-sm font-bold border transition-all ${
              isDark ? 'border-white/[0.08] text-slate-300 hover:bg-white/[0.05]' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}>
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 rounded-xl py-2.5 text-sm font-bold text-white transition-all"
            style={{ background: 'linear-gradient(135deg,#EF4444,#DC2626)', boxShadow: '0 4px 14px rgba(239,68,68,0.35)' }}>
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Student Form Modal (Add / Edit) ────────────────────────────────────────
function StudentModal({ mode, initial, allRollNos, onSave, onCancel, isDark }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Name is required.';
    if (!form.rollNo.trim())  e.rollNo  = 'Roll number is required.';
    else if (
      mode === 'add' && allRollNos.includes(form.rollNo.trim().toUpperCase())
    ) e.rollNo = 'Roll number already exists.';
    if (!form.email.trim())   e.email   = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email.';
    const ps = Number(form.prepScore);
    if (isNaN(ps) || ps < 0 || ps > 100) e.prepScore = 'Score must be 0–100.';
    return e;
  };

  const submit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({
      ...form,
      rollNo: form.rollNo.trim().toUpperCase(),
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      prepScore: Number(form.prepScore),
      pts: form.completedModules.length * 200,
      certStatus: form.completedModules.length === 4
        ? 'Certified' : form.completedModules.length > 0
        ? 'In Progress' : 'Not Started',
    });
  };

  const inputCls = (field) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
      errors[field]
        ? 'border-red-400 focus:ring-red-500/15'
        : isDark
          ? 'bg-slate-900 border-white/[0.08] text-white placeholder-slate-600 focus:border-blue-500 focus:ring-blue-500/15'
          : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/15'
    }`;

  const labelCls = `block text-[10px] font-bold uppercase tracking-widest mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 12 }}
        transition={{ duration: 0.2 }}
        onClick={e => e.stopPropagation()}
        className={`w-full max-w-lg rounded-2xl shadow-2xl ${
          isDark ? 'bg-[#0f172a] border border-white/[0.08]' : 'bg-white border border-slate-200'
        }`}
        style={{ boxShadow: isDark ? '0 24px 64px rgba(0,0,0,0.6)' : '0 24px 64px rgba(0,0,0,0.15)' }}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'border-white/[0.07]' : 'border-slate-100'}`}>
          <div>
            <span className="section-label">{mode === 'add' ? 'New Record' : 'Update Record'}</span>
            <h2 className={`text-base font-bold mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {mode === 'add' ? 'Add Student' : 'Edit Student'}
            </h2>
          </div>
          <button onClick={onCancel}
            className={`p-2 rounded-xl transition-colors ${isDark ? 'text-slate-500 hover:bg-white/[0.07] hover:text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-800'}`}>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Name + Roll */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Full Name</label>
              <input value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="e.g. Priya Sharma" className={inputCls('name')} />
              {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className={labelCls}>Roll Number</label>
              <input value={form.rollNo} onChange={e => set('rollNo', e.target.value)}
                placeholder="e.g. CS22045" className={inputCls('rollNo')}
                readOnly={mode === 'edit'} />
              {errors.rollNo && <p className="text-red-500 text-[10px] mt-1">{errors.rollNo}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className={labelCls}>Email Address</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
              placeholder="e.g. priya@campus.edu" className={inputCls('email')} />
            {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
          </div>

          {/* Dept + Year */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Department</label>
              <select value={form.dept} onChange={e => set('dept', e.target.value)} className={inputCls('dept')}>
                {DEPTS.slice(1).map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Year</label>
              <select value={form.year} onChange={e => set('year', e.target.value)} className={inputCls('year')}>
                {YEARS.slice(1).map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
          </div>

          {/* Score + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Preparedness Score (0–100)</label>
              <input type="number" min="0" max="100" value={form.prepScore}
                onChange={e => set('prepScore', e.target.value)} className={inputCls('prepScore')} />
              {errors.prepScore && <p className="text-red-500 text-[10px] mt-1">{errors.prepScore}</p>}
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)} className={inputCls('status')}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          {/* Training Modules */}
          <div>
            <label className={labelCls}>Completed Training Modules</label>
            <div className="flex gap-2 flex-wrap mt-1">
              {MODS.map(m => {
                const done = form.completedModules.includes(m);
                return (
                  <button key={m} type="button"
                    onClick={() => set('completedModules', done
                      ? form.completedModules.filter(x => x !== m)
                      : [...form.completedModules, m])}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all"
                    style={done
                      ? { background: `${MOD_COLORS[m]}20`, borderColor: `${MOD_COLORS[m]}60`, color: MOD_COLORS[m] }
                      : { background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0', color: isDark ? '#94a3b8' : '#64748b' }
                    }>
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex gap-3 px-6 py-4 border-t ${isDark ? 'border-white/[0.07]' : 'border-slate-100'}`}>
          <button onClick={onCancel}
            className={`flex-1 rounded-xl py-2.5 text-sm font-bold border transition-all ${
              isDark ? 'border-white/[0.08] text-slate-300 hover:bg-white/[0.05]' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}>
            Cancel
          </button>
          <motion.button onClick={submit} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
            className="flex-1 rounded-xl py-2.5 text-sm font-bold text-white flex items-center justify-center gap-2 transition-all"
            style={{ background: 'linear-gradient(135deg,#2563EB,#1d4ed8)', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}>
            <Check className="h-4 w-4" />
            {mode === 'add' ? 'Add Student' : 'Save Changes'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Filter Pill ────────────────────────────────────────────────────────────
function FilterSelect({ value, onChange, options, isDark }) {
  return (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)}
        className={`appearance-none pl-3 pr-8 py-2 rounded-xl border text-xs font-semibold transition-all focus:outline-none cursor-pointer ${
          isDark
            ? 'bg-slate-900 border-white/[0.08] text-slate-300 focus:border-blue-500'
            : 'bg-white border-slate-200 text-slate-700 focus:border-blue-400 shadow-sm'
        }`}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown className={`absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function StudentsDB({ onToast }) {
  const { data, updateUsers } = useAppData();
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';

  const students = data.users.filter(u => u.role === 'student');

  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('All Departments');
  const [filterYear, setFilterYear] = useState('All Years');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [modalMode, setModalMode] = useState(null);   // 'add' | 'edit' | null
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Restore search from AdminDashboard
  useEffect(() => {
    const q = sessionStorage.getItem('dpres_student_search');
    if (q) { setSearch(q); sessionStorage.removeItem('dpres_student_search'); }
  }, []);

  // ── Stats ────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total  = students.length;
    const active = students.filter(s => s.status === 'Active').length;
    const certs  = students.filter(s => s.certStatus === 'Certified').length;
    const avgScore = total
      ? Math.round(students.reduce((a, s) => a + (s.prepScore ?? 0), 0) / total)
      : 0;
    return { total, active, certs, avgScore };
  }, [students]);

  // ── Filtered list ────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return students.filter(s => {
      const matchQ = !q || [s.name, s.rollNo, s.dept, s.email].some(v => (v ?? '').toLowerCase().includes(q));
      const matchD = filterDept === 'All Departments' || s.dept === filterDept;
      const matchY = filterYear === 'All Years'       || s.year === filterYear;
      const matchS = filterStatus === 'All Status'    || s.status === filterStatus;
      return matchQ && matchD && matchY && matchS;
    });
  }, [students, search, filterDept, filterYear, filterStatus]);

  // ── CRUD handlers ────────────────────────────────────────────────────────
  const handleAdd = (form) => {
    updateUsers(prev => [...prev, { ...form, id: 'student-' + Date.now(), role: 'student' }]);
    setModalMode(null);
    onToast('Student added to registry!', 'success');
  };

  const handleEdit = (form) => {
    updateUsers(prev => prev.map(u => u.id === editTarget.id ? { ...u, ...form } : u));
    setModalMode(null); setEditTarget(null);
    onToast('Student updated successfully.', 'success');
  };

  const handleDelete = () => {
    updateUsers(prev => prev.filter(u => u.id !== deleteTarget.id));
    setDeleteTarget(null);
    onToast('Student record removed.', 'info');
  };

  const openEdit = (s) => {
    setEditTarget(s);
    setModalMode('edit');
  };

  const allRollNos = students.map(s => (s.rollNo ?? '').toUpperCase());

  const card = isDark ? 'bg-[#0f172a] border border-white/[0.06]' : 'bg-white border border-slate-100';
  const cardShadow = isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.05)';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <span className="section-label">Live Database</span>
        <h1 className={`text-2xl font-extrabold tracking-tight mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Student Registry
        </h1>
      </motion.div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatCard label="Total Students"       value={stats.total}        icon={Users}       color="#2563EB" delay={0}    isDark={isDark} />
        <StatCard label="Active Students"      value={stats.active}       icon={TrendingUp}  color="#10B981" delay={0.06} isDark={isDark} />
        <StatCard label="Certificates Earned"  value={stats.certs}        icon={Award}       color="#F59E0B" delay={0.12} isDark={isDark} />
        <StatCard label="Avg Preparedness"     value={`${stats.avgScore}%`} icon={ShieldCheck} color="#8B5CF6" delay={0.18} isDark={isDark} />
      </div>

      {/* ── Search + Filters + Add Button ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3 items-start sm:items-center"
      >
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <input
            type="text" placeholder="Search by name, roll no, department, email…"
            value={search} onChange={e => setSearch(e.target.value)}
            className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition-all ${
              isDark ? 'bg-slate-900 border-white/[0.08] text-white placeholder-slate-600 focus:border-blue-500'
                     : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-400 shadow-sm'
            }`}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className={`h-3.5 w-3.5 flex-shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <FilterSelect value={filterDept}   onChange={setFilterDept}   options={DEPTS}    isDark={isDark} />
          <FilterSelect value={filterYear}   onChange={setFilterYear}   options={YEARS}    isDark={isDark} />
          <FilterSelect value={filterStatus} onChange={setFilterStatus} options={STATUSES} isDark={isDark} />
        </div>

        {/* Add button */}
        <motion.button
          whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
          onClick={() => setModalMode('add')}
          className="flex-shrink-0 rounded-xl px-5 py-2.5 text-sm font-bold text-white flex items-center gap-2 transition-all"
          style={{ background: 'linear-gradient(135deg,#2563EB,#1d4ed8)', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}
        >
          <Plus className="h-4 w-4" /> Add Student
        </motion.button>
      </motion.div>

      {/* ── Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
        className={`rounded-2xl overflow-hidden ${card}`}
        style={{ boxShadow: cardShadow }}
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className={`text-[10px] font-bold tracking-widest uppercase border-b ${
                isDark ? 'bg-slate-950/60 border-white/[0.06] text-slate-500' : 'bg-slate-50 border-slate-100 text-slate-400'
              }`}>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-5 py-3.5">Roll No</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Year</th>
                <th className="px-5 py-3.5">Progress</th>
                <th className="px-5 py-3.5">Score</th>
                <th className="px-5 py-3.5">Certificate</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-white/[0.04]' : 'divide-slate-50'}`}>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="9" className={`px-5 py-12 text-center text-sm font-medium ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                    No students match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((s, idx) => {
                  const certStyle = CERT_STYLES[s.certStatus] ?? CERT_STYLES['Not Started'];
                  const score = s.prepScore ?? 0;
                  const scoreColor = score >= 80 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444';
                  return (
                    <motion.tr
                      key={s.id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: Math.min(idx * 0.02, 0.3) }}
                      className={`transition-colors group ${isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50/80'}`}
                    >
                      {/* Student name + email */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-xl flex items-center justify-center font-bold text-xs text-white flex-shrink-0"
                            style={{ background: `linear-gradient(135deg, #2563EB, #3B82F6)` }}>
                            {s.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className={`text-sm font-semibold truncate ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{s.name}</p>
                            <p className={`text-[10px] truncate ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{s.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className={`px-5 py-3.5 font-mono text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{s.rollNo}</td>
                      <td className={`px-5 py-3.5 text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{s.dept}</td>
                      <td className={`px-5 py-3.5 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{s.year ?? '—'}</td>

                      {/* Progress bars */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {MODS.map(m => {
                              const done = (s.completedModules || []).includes(m);
                              return (
                                <div key={m} title={`${m}: ${done ? 'Done' : 'Pending'}`}
                                  className="h-1.5 w-5 rounded-sm"
                                  style={done
                                    ? { background: MOD_COLORS[m], boxShadow: `0 0 5px ${MOD_COLORS[m]}60` }
                                    : { background: isDark ? '#1e293b' : '#e2e8f0' }
                                  } />
                              );
                            })}
                          </div>
                          <span className={`text-[10px] font-mono ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                            {(s.completedModules || []).length}/4
                          </span>
                        </div>
                      </td>

                      {/* Preparedness score */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-16 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            <div className="h-full rounded-full" style={{ width: `${score}%`, background: scoreColor }} />
                          </div>
                          <span className="text-xs font-bold" style={{ color: scoreColor }}>{score}%</span>
                        </div>
                      </td>

                      {/* Certificate */}
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isDark ? certStyle.dark : certStyle.light}`}>
                          {s.certStatus ?? 'Not Started'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          s.status === 'Active'
                            ? isDark ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : isDark ? 'border-white/[0.08] bg-white/[0.04] text-slate-500'       : 'border-slate-200 bg-slate-100 text-slate-500'
                        }`}>
                          {s.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(s)} title="Edit student"
                            className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-slate-600 hover:bg-blue-500/10 hover:text-blue-400' : 'text-slate-400 hover:bg-blue-50 hover:text-blue-600'}`}>
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => setDeleteTarget(s)} title="Delete student"
                            className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-slate-600 hover:bg-red-500/10 hover:text-red-400' : 'text-slate-400 hover:bg-red-50 hover:text-red-500'}`}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className={`px-5 py-3 flex items-center justify-between border-t text-xs ${isDark ? 'border-white/[0.05] text-slate-600' : 'border-slate-50 text-slate-400'}`}>
          <span>Showing <strong className={isDark ? 'text-slate-400' : 'text-slate-600'}>{filtered.length}</strong> of {students.length} students</span>
          {(filterDept !== 'All Departments' || filterYear !== 'All Years' || filterStatus !== 'All Status' || search) && (
            <button onClick={() => { setSearch(''); setFilterDept('All Departments'); setFilterYear('All Years'); setFilterStatus('All Status'); }}
              className="text-blue-500 font-semibold hover:underline">
              Clear filters
            </button>
          )}
        </div>
      </motion.div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {modalMode === 'add' && (
          <StudentModal key="add" mode="add" initial={EMPTY_FORM} allRollNos={allRollNos}
            onSave={handleAdd} onCancel={() => setModalMode(null)} isDark={isDark} />
        )}
        {modalMode === 'edit' && editTarget && (
          <StudentModal key="edit" mode="edit"
            initial={{ ...EMPTY_FORM, ...editTarget, prepScore: String(editTarget.prepScore ?? 50) }}
            allRollNos={allRollNos}
            onSave={handleEdit} onCancel={() => { setModalMode(null); setEditTarget(null); }} isDark={isDark} />
        )}
        {deleteTarget && (
          <DeleteModal key="del" student={deleteTarget}
            onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} isDark={isDark} />
        )}
      </AnimatePresence>
    </div>
  );
}
