import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, ArrowLeft, Shield } from 'lucide-react';
import { useAuth, useThemeContext } from '../App';
import { navigate } from '../hooks/useRoute';
import Logo from '../components/Logo';

export default function Login({ onToast }) {
  const { login } = useAuth();
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const [view, setView] = useState('signin'); // 'signin' | 'signup' | 'forgot'
  const [form, setForm] = useState({ name: '', email: 'alex.smith@campus.edu', password: 'Student@2026', role: 'student' });
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');

  const handleRoleToggle = (role) => {
    setSelectedRole(role);
    if (role === 'admin') {
      setForm((prev) => ({ ...prev, email: 'director@campus.edu', password: 'Admin@2026', role: 'admin' }));
    } else {
      setForm((prev) => ({ ...prev, email: 'alex.smith@campus.edu', password: 'Student@2026', role: 'student' }));
    }
    setErr('');
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr('');

    if (view === 'forgot') {
      if (!form.email) {
        setErr('Please enter your email address.');
        return;
      }
      setBusy(true);
      setTimeout(() => {
        onToast(`Password reset link sent to ${form.email}`, 'success');
        setView('signin');
        setBusy(false);
      }, 1000);
      return;
    }

    if (!form.email || !form.password || (view === 'signup' && !form.name)) {
      setErr('Please fill all required fields.');
      return;
    }

    setBusy(true);
    try {
      const u = await login(form.email, form.password, view === 'signup', form.name);
      onToast(`Welcome back, ${u.name}!`, 'success');
      navigate(u.role === 'admin' ? '#/admin' : '#/portal');
    } catch (ex) {
      setErr(ex.message || 'Login failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`min-h-screen grid grid-cols-1 lg:grid-cols-2 ${isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      {/* Brand Side Panel */}
      <div className={`relative hidden lg:flex flex-col justify-between p-12 overflow-hidden border-r ${
        isDark ? 'bg-slate-900 border-slate-800/60' : 'bg-gradient-to-br from-blue-600 to-blue-700 border-blue-700/30'
      }`}>
        {/* Abstract lights background */}
        <div className="absolute inset-0 z-0">
          <div className={`absolute -top-40 left-1/4 h-80 w-80 rounded-full blur-[100px] ${isDark ? 'bg-red-500/5' : 'bg-white/10'}`} />
          <div className={`absolute top-60 right-1/4 h-80 w-80 rounded-full blur-[100px] ${isDark ? 'bg-blue-500/5' : 'bg-cyan-400/15'}`} />
        </div>

        {/* Top Header */}
        <div className="relative z-10">
          <Logo size="md" forceDark onClick={() => navigate('#/home')} />
        </div>

        {/* Middle Safety Showcase */}
        <div className="relative z-10 my-auto py-12 max-w-md">
          <span className={`font-mono text-xs font-bold uppercase tracking-widest ${isDark ? 'text-red-500' : 'text-white/60'}`}>
            ▶ Campus Synchronized Security
          </span>
          <h1 className={`mt-4 font-sans text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl ${
            isDark
              ? 'bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent'
              : 'text-white'
          }`}>
            Secure, live connected{' '}
            <span className={isDark ? 'bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent' : 'text-white/80'}>
              crisis modules
            </span>
          </h1>
          <p className={`mt-6 text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-white/70'}`}>
            Welcome to the DPRES environment. Real-time drills, safety progress logs, rankings, and an AI-powered disaster assistant are synchronized across your academic safety network.
          </p>
        </div>

        {/* Footer info */}
        <div className={`relative z-10 text-xs flex justify-between ${isDark ? 'text-slate-500' : 'text-white/50'}`}>
          <span>Security Protocol v2.4.0</span>
          <span>© DPRES Campus Dispatch</span>
        </div>
      </div>

      {/* Authentication Form Panel */}
      <div className={`flex items-center justify-center p-6 md:p-12 relative ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
        {/* Mobile top logo */}
        <div className="absolute top-6 left-6 lg:hidden">
          <Logo size="sm" forceDark={isDark} onClick={() => navigate('#/home')} />
        </div>

        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <span className={`font-mono text-xs font-bold uppercase tracking-wider ${isDark ? 'text-red-500' : 'text-blue-600'}`}>
              {view === 'forgot' ? '▶ Account Recovery' : view === 'signup' ? '▶ Create Registry' : '▶ Secure Access'}
            </span>
            <h2 className={`mt-2 font-sans text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {view === 'forgot' ? 'Reset Password' : view === 'signup' ? 'Sign Up' : 'Sign In'}
            </h2>
          </div>

          <form onSubmit={submit} className="space-y-5">
            {/* Signin Role Selector */}
            {view === 'signin' && (
              <div className={`flex p-1.5 rounded-xl mb-6 border ${isDark ? 'bg-slate-900 border-slate-800/80' : 'bg-slate-100 border-slate-200'}`}>
                <button type="button" onClick={() => handleRoleToggle('student')}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    selectedRole === 'student'
                      ? isDark ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-white text-blue-700 shadow-sm'
                      : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'
                  }`}>
                  Student
                </button>
                <button type="button" onClick={() => handleRoleToggle('admin')}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    selectedRole === 'admin'
                      ? isDark ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-white text-blue-700 shadow-sm'
                      : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'
                  }`}>
                  Administrator
                </button>
              </div>
            )}

            {/* Name (Signup Only) */}
            {view === 'signup' && (
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Full Name</label>
                <div className="relative">
                  <User className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input type="text" required value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Priya Sharma"
                    className={`w-full rounded-xl border px-11 py-3 text-sm focus:outline-none transition-colors ${
                      isDark
                        ? 'border-slate-800 bg-slate-900 text-white placeholder-slate-600 focus:border-blue-500'
                        : 'border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:border-blue-500'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Email Address</label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <input type="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder={view === 'signin' ? (selectedRole === 'admin' ? 'director@campus.edu' : 'alex.smith@campus.edu') : 'your.email@campus.edu'}
                  className={`w-full rounded-xl border px-11 py-3 text-sm focus:outline-none transition-colors ${
                    isDark
                      ? 'border-slate-800 bg-slate-900 text-white placeholder-slate-600 focus:border-blue-500'
                      : 'border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:border-blue-500'
                  }`}
                />
              </div>
            </div>

            {/* Password */}
            {view !== 'forgot' && (
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <label className={`block text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Password</label>
                  {view === 'signin' && (
                    <button type="button" onClick={() => setView('forgot')}
                      className={`text-xs font-semibold focus:outline-none ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input type={showPassword ? 'text' : 'password'} required value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder={view === 'signin' ? (selectedRole === 'admin' ? 'Admin@2026' : 'Student@2026') : '••••••••'}
                    className={`w-full rounded-xl border px-11 py-3 text-sm focus:outline-none transition-colors pr-12 ${
                      isDark
                        ? 'border-slate-800 bg-slate-900 text-white placeholder-slate-600 focus:border-blue-500'
                        : 'border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:border-blue-500'
                    }`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Error */}
            {err && (
              <div className={`rounded-xl px-4 py-3 text-sm font-semibold flex items-center gap-2 ${
                isDark ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                <Shield className="h-4 w-4 flex-shrink-0" />
                <span>{err}</span>
              </div>
            )}

            {/* Submit Button */}
            <motion.button type="submit" disabled={busy} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
              className="w-full rounded-xl py-3.5 text-sm font-bold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #2563EB, #1d4ed8)', boxShadow: '0 4px 14px rgba(37,99,235,0.35)' }}>
              {busy ? 'Verifying...' : view === 'forgot' ? 'Send Link' : view === 'signup' ? 'Create Account' : 'Sign In 🔒'}
            </motion.button>

            {/* View Switch */}
            <div className={`text-center text-sm mt-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {view === 'forgot' ? (
                <button type="button" onClick={() => setView('signin')}
                  className={`font-bold inline-flex items-center gap-1.5 focus:outline-none ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                  <ArrowLeft className="h-4 w-4" /> Back to Sign In
                </button>
              ) : view === 'signup' ? (
                <span>Already have a profile?{' '}
                  <button type="button" onClick={() => setView('signin')}
                    className={`font-bold focus:outline-none ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                    Sign In
                  </button>
                </span>
              ) : (
                <span>Don't have safety logs?{' '}
                  <button type="button" onClick={() => setView('signup')}
                    className={`font-bold focus:outline-none ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                    Register here
                  </button>
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
