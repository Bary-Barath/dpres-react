import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, Check, Search } from 'lucide-react';
import { useAppData } from '../hooks/useAppData';
import { useThemeContext } from '../App';

export default function StudentsDB({ onToast }) {
  const { data, updateUsers } = useAppData();
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const students = data.users.filter(u => u.role === 'student');

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', rollNo: '', dept: 'Computer Science', status: 'Active' });
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    const savedSearch = sessionStorage.getItem('dpres_student_search');
    if (savedSearch) { setSearchFilter(savedSearch); sessionStorage.removeItem('dpres_student_search'); }
  }, []);

  const MODS = ['fire', 'flood', 'quake', 'threat'];
  const MOD_COLORS = {
    fire: '#EF4444', flood: '#3B82F6', quake: '#F97316', threat: '#8B5CF6'
  };

  const handleAdd = () => {
    if (!form.name.trim() || !form.rollNo.trim()) { onToast('Please fill all required fields.', 'error'); return; }
    updateUsers(prev => [...prev, {
      ...form,
      id: 'student-' + Date.now(),
      role: 'student',
      email: `${form.name.toLowerCase().replace(/\s+/g, '.')}@campus.edu`,
      completedModules: [],
      pts: 0
    }]);
    setShowAdd(false);
    setForm({ name: '', rollNo: '', dept: 'Computer Science', status: 'Active' });
    onToast('Student added to live safety registry!', 'success');
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Remove ${name} from DPRES safety logs?`)) {
      updateUsers(prev => prev.filter(u => u.id !== id));
      onToast('Student record removed successfully.', 'success');
    }
  };

  const filteredStudents = students.filter(s => {
    const q = searchFilter.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q) || s.dept.toLowerCase().includes(q);
  });

  const card = isDark ? 'bg-[#0f172a] border border-white/[0.06]' : 'bg-white border border-slate-100';
  const inputCls = isDark
    ? 'bg-slate-900 border-white/[0.08] text-white placeholder-slate-600 focus:border-blue-500'
    : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="section-label">Live Database</span>
            <h1 className={`text-2xl font-extrabold tracking-tight mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Student Registry
            </h1>
          </div>
          <div className="relative w-full max-w-sm">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="Search by name, roll no, or department..."
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition-all ${inputCls}`}
            />
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        className={`rounded-2xl overflow-hidden ${card}`}
        style={{ boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.05)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className={`text-[10px] font-bold tracking-widest uppercase border-b ${
                isDark ? 'bg-slate-950/60 border-white/[0.06] text-slate-500' : 'bg-slate-50 border-slate-100 text-slate-400'
              }`}>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Roll No</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Training Progress</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-white/[0.04]' : 'divide-slate-50'}`}>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className={`px-6 py-10 text-center text-sm font-medium ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                    No student logs found matching current criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s, idx) => (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}
                    className={`transition-colors ${isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50/80'}`}
                  >
                    <td className={`px-6 py-4 font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{s.name}</td>
                    <td className={`px-6 py-4 font-mono text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{s.rollNo}</td>
                    <td className={`px-6 py-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{s.dept}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                          {MODS.map(m => {
                            const done = (s.completedModules || []).includes(m);
                            return (
                              <div
                                key={m}
                                title={`${m.toUpperCase()}: ${done ? 'Completed' : 'Pending'}`}
                                className="h-1.5 w-6 rounded-sm"
                                style={done
                                  ? { background: MOD_COLORS[m], boxShadow: `0 0 6px ${MOD_COLORS[m]}60` }
                                  : { background: isDark ? '#1e293b' : '#e2e8f0' }
                                }
                              />
                            );
                          })}
                        </div>
                        <span className={`font-mono text-xs ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                          {(s.completedModules || []).length}/4
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-extrabold tracking-wider uppercase border ${
                        s.status === 'Active'
                          ? isDark ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : isDark ? 'border-white/[0.08] bg-white/[0.04] text-slate-400' : 'border-slate-200 bg-slate-100 text-slate-500'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(s.id, s.name)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isDark ? 'text-slate-600 hover:bg-red-500/10 hover:text-red-400' : 'text-slate-400 hover:bg-red-50 hover:text-red-500'
                        }`}
                        title="Delete student log"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add Button */}
      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.16 }}
        onClick={() => setShowAdd(true)}
        whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
        className="rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-all flex items-center gap-2"
        style={{ background: 'linear-gradient(135deg, #2563EB, #1d4ed8)', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}
      >
        <Plus className="h-4 w-4" /> Add New Student
      </motion.button>

      {/* Add Student Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setShowAdd(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2 }}
              onClick={e => e.stopPropagation()}
              className={`w-full max-w-md rounded-2xl p-6 shadow-2xl relative ${
                isDark ? 'bg-[#0f172a] border border-white/[0.08]' : 'bg-white border border-slate-200'
              }`}
              style={{ boxShadow: isDark ? '0 24px 64px rgba(0,0,0,0.6)' : '0 24px 64px rgba(0,0,0,0.15)' }}
            >
              <button
                onClick={() => setShowAdd(false)}
                className={`absolute right-4 top-4 p-1.5 rounded-xl transition-colors ${
                  isDark ? 'text-slate-500 hover:bg-white/[0.07] hover:text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                <X className="h-4 w-4" />
              </button>

              <span className="section-label">Registry Database Entry</span>
              <h2 className={`text-xl font-extrabold mt-1 mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Add Student
              </h2>

              <div className="space-y-4">
                <div>
                  <label className={`block text-[10px] font-bold uppercase tracking-widest mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Full Name
                  </label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Priya Sharma"
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition-all ${inputCls}`}
                  />
                </div>
                <div>
                  <label className={`block text-[10px] font-bold uppercase tracking-widest mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Roll Number
                  </label>
                  <input type="text" value={form.rollNo} onChange={e => setForm({ ...form, rollNo: e.target.value })}
                    placeholder="e.g. CS22045"
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition-all ${inputCls}`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-[10px] font-bold uppercase tracking-widest mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      Department
                    </label>
                    <select value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })}
                      className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none transition-all cursor-pointer ${inputCls}`}>
                      <option>Computer Science</option>
                      <option>Electronics</option>
                      <option>Mechanical</option>
                      <option>Civil Eng.</option>
                      <option>Information Tech</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-[10px] font-bold uppercase tracking-widest mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      Status
                    </label>
                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                      className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none transition-all cursor-pointer ${inputCls}`}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button onClick={() => setShowAdd(false)}
                    className={`rounded-xl border px-5 py-2.5 text-sm font-bold transition-all ${
                      isDark ? 'border-white/[0.08] bg-white/[0.03] text-slate-300 hover:bg-white/[0.07]' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-sm'
                    }`}>
                    Cancel
                  </button>
                  <motion.button onClick={handleAdd} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                    className="rounded-xl px-5 py-2.5 text-sm font-bold text-white flex items-center gap-1.5 transition-all"
                    style={{ background: 'linear-gradient(135deg, #2563EB, #1d4ed8)', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}>
                    <Check className="h-4 w-4" /> Save Student
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
