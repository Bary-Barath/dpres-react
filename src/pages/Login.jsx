import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, Eye, EyeOff, User, ArrowLeft,
  ShieldCheck, AlertTriangle, Flame, Waves, Globe, Activity
} from 'lucide-react';
import { useAuth, useThemeContext } from '../App';
import { navigate } from '../hooks/useRoute';
import Logo from '../components/Logo';

const FEATURE_PILLS = [
  { icon: Flame,       label: 'Fire Safety'       },
  { icon: Waves,       label: 'Flood Protocol'     },
  { icon: Globe,       label: 'Earthquake Safety'  },
  { icon: Activity,    label: 'Live Drills'        },
  { icon: ShieldCheck, label: 'AI Assistant'       },
];

export default function Login({ onToast }) {
  const { login }  = useAuth();
  const { theme }  = useThemeContext();
  const isDark     = theme === 'dark';

  const [view,           setView]           = useState('signin');
  const [selectedRole,   setSelectedRole]   = useState('student');
  const [form,           setForm]           = useState({ name: '', email: 'alex.smith@campus.edu', password: 'Student@2026', role: 'student' });
  const [showPassword,   setShowPassword]   = useState(false);
  const [busy,           setBusy]           = useState(false);
  const [err,            setErr]            = useState('');

  const handleRoleToggle = (role) => {
    setSelectedRole(role);
    setErr('');
    setForm(prev => ({
      ...prev,
      role,
      email:    role === 'admin' ? 'director@campus.edu'   : 'alex.smith@campus.edu',
      password: role === 'admin' ? 'Admin@2026'            : 'Student@2026',
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (view === 'forgot') {
      if (!form.email) { setErr('Please enter your email address.'); return; }
      setBusy(true);
      setTimeout(() => { onToast(`Reset link sent to ${form.email}`, 'success'); setView('signin'); setBusy(false); }, 1000);
      return;
    }
    if (!form.email || !form.password || (view === 'signup' && !form.name)) {
      setErr('Please fill all required fields.'); return;
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

  /* ── shared field style ── */
  const inputCls = `w-full rounded-xl border px-11 py-3 text-sm focus:outline-none transition-all ${
    isDark
      ? 'border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/15'
      : 'border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/15 shadow-sm'
  }`;
  const iconCls  = `absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`;
  const labelCls = `block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`;

  return (
    <div className={`min-h-screen grid grid-cols-1 lg:grid-cols-2 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>

      {/* ════════════════════════════════════════════════════
          LEFT  —  Red hero panel
      ════════════════════════════════════════════════════ */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 60%, #F87171 100%)' }}>

        {/* decorative glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5  blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-black/10 blur-3xl pointer-events-none" />
        {/* grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" aria-hidden="true">
          <defs>
            <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>

        {/* Logo */}
        <div className="relative z-10">
          <Logo size="lg" forceDark showText onClick={() => navigate('#/home')} />
        </div>

        {/* Headline */}
        <div className="relative z-10 my-auto py-10 max-w-md">
          <span className="inline-block font-mono text-xs font-bold uppercase tracking-widest text-white/60 mb-5">
            ▶ Campus Synchronized Security
          </span>

          <h1 className="font-sans text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            Disaster Preparedness<br />
            <span className="text-white/80">Starts Before</span><br />
            Disaster Strikes
          </h1>

          <p className="mt-6 text-sm leading-relaxed text-white/70 max-w-sm">
            DPRES empowers campuses with real-time emergency drills, AI-powered safety
            guidance, student readiness tracking, and instant disaster response tools —
            all in one unified platform.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mt-8">
            {FEATURE_PILLS.map(({ icon: Icon, label }) => (
              <span key={label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 border border-white/20 text-white backdrop-blur-sm">
                <Icon className="h-3 w-3" />{label}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex justify-between text-[11px] text-white/40 font-mono">
          <span>Security Protocol v2.4.0</span>
          <span>© DPRES Campus Dispatch</span>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          RIGHT  —  Login card
      ════════════════════════════════════════════════════ */}
      <div className={`flex items-center justify-center p-6 md:p-12 relative ${
        isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-slate-50 to-white'
      }`}>

        {/* Mobile logo */}
        <div className="absolute top-6 left-6 lg:hidden">
          <Logo size="md" forceDark={isDark} showText onClick={() => navigate('#/home')} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`w-full max-w-md rounded-3xl p-8 ${
            isDark
              ? 'bg-slate-900/80 border border-white/[0.07] backdrop-blur-sm'
              : 'bg-white border border-slate-200/60 shadow-2xl shadow-slate-200/80'
          }`}
        >
          {/* Card header */}
          <div className="mb-7">
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-red-500 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              {view === 'forgot' ? 'Account Recovery' : view === 'signup' ? 'Create Registry' : 'Secure Access'}
            </span>
            <h2 className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {view === 'forgot' ? 'Reset Password' : view === 'signup' ? 'Create Account' : 'Welcome Back'}
            </h2>
            {view === 'signin' && (
              <p className={`text-sm mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Sign in to your DPRES campus account
              </p>
            )}
          </div>

          <form onSubmit={submit} className="space-y-4">

            {/* Role selector (sign-in only) */}
            {view === 'signin' && (
              <div className={`flex p-1.5 rounded-2xl mb-2 border ${
                isDark ? 'bg-slate-800 border-white/[0.07]' : 'bg-slate-100 border-slate-200'
              }`}>
                {['student', 'admin'].map(role => (
                  <button key={role} type="button" onClick={() => handleRoleToggle(role)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all capitalize ${
                      selectedRole === role
                        ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md shadow-red-500/20'
                        : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'
                    }`}>
                    {role === 'admin' ? 'Administrator' : 'Student'}
                  </button>
                ))}
              </div>
            )}

            {/* Name (sign-up) */}
            {view === 'signup' && (
              <div>
                <label className={labelCls}>Full Name</label>
                <div className="relative">
                  <User className={iconCls} />
                  <input type="text" required value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Priya Sharma" className={inputCls} />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className={labelCls}>Email Address</label>
              <div className="relative">
                <Mail className={iconCls} />
                <input type="email" required value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder={selectedRole === 'admin' ? 'director@campus.edu' : 'alex.smith@campus.edu'}
                  className={inputCls} />
              </div>
            </div>

            {/* Password */}
            {view !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className={labelCls} style={{ marginBottom: 0 }}>Password</label>
                  {view === 'signin' && (
                    <button type="button" onClick={() => setView('forgot')}
                      className="text-xs font-semibold text-red-500 hover:text-red-400 transition-colors">
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className={iconCls} />
                  <input type={showPassword ? 'text' : 'password'} required value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••" className={`${inputCls} pr-12`} />
                  <button type="button" onClick={() => setShowPassword(s => !s)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Error */}
            <AnimatePresence>
              {err && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold flex items-center gap-2 border ${
                    isDark ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-700'
                  }`}>
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  {err}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit" disabled={busy}
              whileHover={{ y: -2, boxShadow: '0 10px 28px rgba(220,38,38,0.45)' }}
              whileTap={{ scale: 0.97 }}
              className="w-full rounded-xl py-3.5 text-sm font-bold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #DC2626, #EF4444)', boxShadow: '0 4px 16px rgba(220,38,38,0.35)' }}>
              {busy
                ? <span className="flex items-center gap-2"><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Verifying…</span>
                : view === 'forgot' ? 'Send Reset Link'
                : view === 'signup' ? 'Create Account'
                : 'Sign In to DPRES'
              }
            </motion.button>

            {/* Switch views */}
            <p className={`text-center text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {view === 'forgot' ? (
                <button type="button" onClick={() => setView('signin')}
                  className="font-semibold text-red-500 hover:text-red-400 inline-flex items-center gap-1">
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
                </button>
              ) : view === 'signup' ? (
                <>Already have an account?{' '}
                  <button type="button" onClick={() => setView('signin')}
                    className="font-semibold text-red-500 hover:text-red-400">Sign In</button>
                </>
              ) : (
                <>New to DPRES?{' '}
                  <button type="button" onClick={() => setView('signup')}
                    className="font-semibold text-red-500 hover:text-red-400">Create account</button>
                </>
              )}
            </p>
          </form>

          {/* Demo credentials hint */}
          {view === 'signin' && (
            <div className={`mt-5 p-3.5 rounded-xl border text-xs ${
              isDark ? 'border-white/[0.06] bg-white/[0.02] text-slate-500' : 'border-slate-100 bg-slate-50 text-slate-400'
            }`}>
              <p className="font-semibold mb-1">Demo credentials pre-filled</p>
              <p>Student: <code className="font-mono">alex.smith@campus.edu</code> / <code className="font-mono">Student@2026</code></p>
              <p>Admin: <code className="font-mono">director@campus.edu</code> / <code className="font-mono">Admin@2026</code></p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
