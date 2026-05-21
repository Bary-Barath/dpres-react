import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'react'; // wait, import from react directly? No, import from framer-motion! Let's import correctly.
import { Plus, Trash2, X, Check, Search, ShieldAlert, Award } from 'lucide-react';
import { useAppData } from '../hooks/useAppData';

export default function StudentsDB({ onToast }) {
  const { data, updateUsers } = useAppData();
  const students = data.users.filter(u => u.role === 'student');

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', rollNo: '', dept: 'Computer Science', status: 'Active' });
  const [searchFilter, setSearchFilter] = useState('');

  // Handle incoming search query from AdminDashboard (sessionStorage)
  useEffect(() => {
    const savedSearch = sessionStorage.getItem('dpres_student_search');
    if (savedSearch) {
      setSearchFilter(savedSearch);
      sessionStorage.removeItem('dpres_student_search');
    }
  }, []);

  const MODS = ['fire', 'flood', 'quake', 'threat'];
  const MOD_COLORS = {
    fire: 'bg-red-500 border-red-500/20',
    flood: 'bg-blue-500 border-blue-500/20',
    quake: 'bg-orange-500 border-orange-500/20',
    threat: 'bg-purple-500 border-purple-500/20'
  };

  const handleAdd = () => {
    if (!form.name.trim() || !form.rollNo.trim()) {
      onToast('Please fill all required fields.', 'error');
      return;
    }
    const newId = 'student-' + Date.now();
    updateUsers(prev => [
      ...prev,
      {
        ...form,
        id: newId,
        role: 'student',
        email: `${form.name.toLowerCase().replace(/\s+/g, '.')}@campus.edu`,
        completedModules: [],
        pts: 0
      }
    ]);
    setShowAdd(false);
    setForm({ name: '', rollNo: '', dept: 'Computer Science', status: 'Active' });
    onToast('Student added to live safety registry!', 'success');
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from DPRES safety logs?`)) {
      updateUsers(prev => prev.filter(u => u.id !== id));
      onToast('Student record removed successfully.', 'success');
    }
  };

  const filteredStudents = students.filter(s => {
    const q = searchFilter.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q) || s.dept.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-red-500">▶ Live Database</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">Student Registry</h1>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search registry list..."
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            className="w-full rounded-full border border-slate-800 bg-slate-900 px-11 py-2 text-sm text-white placeholder-slate-500 focus:border-red-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-mono text-[10px] font-bold tracking-widest uppercase">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Roll No</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Training Progress</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500 font-medium">
                    No student logs found matching current criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(s => (
                  <tr key={s.id} className="hover:bg-slate-900/25 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-100">{s.name}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-300">{s.rollNo}</td>
                    <td className="px-6 py-4 text-slate-300">{s.dept}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                          {MODS.map(m => {
                            const completed = (s.completedModules || []).includes(m);
                            return (
                              <div
                                key={m}
                                title={`${m.toUpperCase()} Module: ${completed ? 'Completed' : 'Pending'}`}
                                className={`h-1.5 w-6 rounded-sm border ${
                                  completed ? `${MOD_COLORS[m]}` : 'bg-slate-950 border-slate-800'
                                }`}
                              />
                            );
                          })}
                        </div>
                        <span className="font-mono text-xs text-slate-500">{(s.completedModules || []).length}/4</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-extrabold tracking-wider uppercase ${
                        s.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(s.id, s.name)}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                        title="Delete student log entry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Button to show modal */}
      <div className="flex justify-start pt-2">
        <button
          onClick={() => setShowAdd(true)}
          className="rounded-xl bg-red-600 hover:bg-red-500 px-6 py-3 text-sm font-bold text-white transition-all flex items-center gap-2 shadow-lg shadow-red-600/20"
        >
          <Plus className="h-4.5 w-4.5" /> Add New Student
        </button>
      </div>

      {/* Add Student Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAdd(false)}
              className="absolute right-4 top-4 p-1 rounded-lg text-slate-500 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-red-500">▶ Registry Database Entry</span>
            <h2 className="text-xl font-extrabold text-white mt-1 mb-6">Add Student</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Priya Sharma"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Roll Number</label>
                <input
                  type="text"
                  value={form.rollNo}
                  onChange={e => setForm({ ...form, rollNo: e.target.value })}
                  placeholder="e.g. CS22045"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Department</label>
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
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-red-500 focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  onClick={() => setShowAdd(false)}
                  className="rounded-xl border border-slate-800 bg-slate-950 px-5 py-3 text-sm font-bold text-slate-300 hover:bg-slate-900 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  className="rounded-xl bg-red-600 hover:bg-red-500 px-5 py-3 text-sm font-bold text-white transition-all flex items-center gap-1.5 shadow-lg shadow-red-600/10"
                >
                  <Check className="h-4 w-4" /> Save Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
