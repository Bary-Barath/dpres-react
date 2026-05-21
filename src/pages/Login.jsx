import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Mail, Lock, Eye, EyeOff, User, ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '../App';
import { navigate } from '../hooks/useRoute';

export default function Login({ onToast }) {
  const { login } = useAuth();
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
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-950 text-white">
      {/* Brand Side Panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-slate-900 border-r border-slate-800/60 overflow-hidden">
        {/* Abstract lights background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-40 left-1/4 h-80 w-80 rounded-full bg-red-500/5 blur-[100px]" />
          <div className="absolute top-60 right-1/4 h-80 w-80 rounded-full bg-blue-500/5 blur-[100px]" />
        </div>

        {/* Top Header */}
        <div className="relative z-10 flex items-center gap-2 cursor-pointer" onClick={() => navigate('#/home')}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-800 shadow-lg shadow-red-500/20">
            <ShieldAlert className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-sans text-xl font-extrabold tracking-wider bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">DPRES</span>
            <span className="block font-mono text-[8px] tracking-widest text-red-500 font-bold uppercase">Campus Safety</span>
          </div>
        </div>

        {/* Middle Safety Showcase */}
        <div className="relative z-10 my-auto py-12 max-w-md">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-red-500">
            ▶ Campus Synchronized Security
          </span>
          <h1 className="mt-4 font-sans text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            Secure, live connected <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">crisis modules</span>
          </h1>
          <p className="mt-6 text-sm leading-relaxed text-slate-400">
            Welcome to the DPRES environment. Real-time drills, safety progress logs, rankings, and AI-powered simulator reflex testing are synchronized across your academic safety network.
          </p>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-slate-500 flex justify-between">
          <span>Security Protocol v2.4.0</span>
          <span>© DPRES Campus Dispatch</span>
        </div>
      </div>

      {/* Authentication Form Panel */}
      <div className="flex items-center justify-center p-6 md:p-12 relative">
        {/* Mobile top logo */}
        <div className="absolute top-6 left-6 flex lg:hidden items-center gap-2" onClick={() => navigate('#/home')}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 shadow-md">
            <ShieldAlert className="h-4 w-4 text-white" />
          </div>
          <span className="font-sans text-base font-extrabold tracking-wider">DPRES</span>
        </div>

        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-red-500">
              {view === 'forgot' ? '▶ Account Recovery' : view === 'signup' ? '▶ Create Registry' : '▶ Secure Access'}
            </span>
            <h2 className="mt-2 font-sans text-3xl font-extrabold tracking-tight">
              {view === 'forgot' ? 'Reset Password' : view === 'signup' ? 'Sign Up' : 'Sign In'}
            </h2>
          </div>

          <form onSubmit={submit} className="space-y-5">
            {/* Signin Role Selector */}
            {view === 'signin' && (
              <div className="flex bg-slate-900 border border-slate-800/80 p-1.5 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => handleRoleToggle('student')}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    selectedRole === 'student'
                      ? 'bg-red-600 text-white shadow-md shadow-red-500/10'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleToggle('admin')}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    selectedRole === 'admin'
                      ? 'bg-red-600 text-white shadow-md shadow-red-500/10'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Administrator
                </button>
              </div>
            )}

            {/* Name (Signup Only) */}
            {view === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Priya Sharma"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-11 py-3 text-sm text-white placeholder-slate-600 focus:border-red-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder={view === 'signin' ? (selectedRole === 'admin' ? 'director@campus.edu' : 'alex.smith@campus.edu') : 'your.email@school.edu'}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-11 py-3 text-sm text-white placeholder-slate-600 focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password (except Forgot View) */}
            {view !== 'forgot' && (
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
                  {view === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setView('forgot')}
                      className="text-xs font-semibold text-red-500 hover:text-red-400 focus:outline-none"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder={view === 'signin' ? (selectedRole === 'admin' ? 'Admin@2026' : 'Student@2026') : '••••••••'}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-11 py-3 text-sm text-white placeholder-slate-600 focus:border-red-500 focus:outline-none transition-colors pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Error Message banner */}
            {err && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4 flex-shrink-0" />
                <span>{err}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-red-600 hover:bg-red-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2"
            >
              {busy ? 'Verifying...' : view === 'forgot' ? 'Send Link' : view === 'signup' ? 'Create Account' : 'Authenticate 🔒'}
            </button>

            {/* View Switch Link */}
            <div className="text-center text-sm mt-4 text-slate-400">
              {view === 'forgot' ? (
                <button
                  type="button"
                  onClick={() => setView('signin')}
                  className="text-red-500 font-bold hover:text-red-400 inline-flex items-center gap-1.5 focus:outline-none"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to Sign In
                </button>
              ) : view === 'signup' ? (
                <span>
                  Already have a profile?{' '}
                  <button
                    type="button"
                    onClick={() => setView('signin')}
                    className="text-red-500 font-bold hover:text-red-400 focus:outline-none"
                  >
                    Sign In
                  </button>
                </span>
              ) : (
                <span>
                  Don't have safety logs?{' '}
                  <button
                    type="button"
                    onClick={() => setView('signup')}
                    className="text-red-500 font-bold hover:text-red-400 focus:outline-none"
                  >
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
