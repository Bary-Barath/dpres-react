import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, ChevronRight, CheckCircle, Map, AlertTriangle } from 'lucide-react';
import { getDrillMeta, SEVERITY_META, acknowledge, subscribe, getActiveDrill } from '../services/drillService';
import { navigate } from '../hooks/useRoute';
import { useThemeContext } from '../App';

export default function DrillAlertBanner({ user }) {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const [drill, setDrill]       = useState(() => getActiveDrill());
  const [dismissed, setDismissed] = useState(false);
  const [acked, setAcked]       = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // Subscribe to live broadcasts
  useEffect(() => {
    const unsub = subscribe(({ type, payload }) => {
      if (type === 'DRILL_BROADCAST') {
        setDrill(payload);
        setDismissed(false);
        setAcked(false);
        setShowModal(true);
      }
      if (type === 'DRILL_COMPLETED' || type === 'DRILL_CANCELLED') {
        setDrill(d => (d?.id === payload.drillId ? null : d));
        setShowModal(false);
      }
    });
    return unsub;
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!drill?.endsAt) return;
    const tick = () => {
      const rem = Math.max(0, Math.floor((drill.endsAt - Date.now()) / 1000));
      setTimeLeft(rem);
      if (rem === 0) {
        setDrill(null);
        setShowModal(false);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [drill?.endsAt]);

  // Re-check active drill on window focus
  useEffect(() => {
    const onFocus = () => {
      const active = getActiveDrill();
      if (active && (!drill || active.id !== drill.id)) {
        setDrill(active);
        setDismissed(false);
        setAcked(false);
      }
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [drill]);

  const handleAck = useCallback(() => {
    if (!user?.id || !drill?.id) return;
    acknowledge(drill.id, user.id);
    setAcked(true);
    setShowModal(false);
  }, [drill?.id, user?.id]);

  if (!drill || dismissed) return null;

  const meta = getDrillMeta(drill.type);
  const sevMeta = SEVERITY_META[drill.severity] || SEVERITY_META.Medium;
  const mins = Math.floor(timeLeft / 60);
  const secs = String(timeLeft % 60).padStart(2, '0');

  return (
    <>
      {/* ── Sticky top banner ── */}
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="fixed inset-x-0 top-0 z-[60]"
        style={{ background: `linear-gradient(90deg, ${meta.color}ee, ${meta.color}cc)` }}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 max-w-7xl mx-auto">
          {/* Left */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 animate-pulse">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-black tracking-widest uppercase text-white/70">LIVE CAMPUS DRILL</p>
              <p className="text-sm font-extrabold text-white truncate">{meta.emoji} {drill.title}</p>
            </div>
            {timeLeft > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-white font-mono text-xs font-bold flex-shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                {mins}:{secs}
              </div>
            )}
          </div>
          {/* Right */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {!acked && (
              <button
                onClick={handleAck}
                className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold border border-white/30 transition-all flex items-center gap-1.5"
              >
                <CheckCircle className="h-3.5 w-3.5" /> Acknowledge
              </button>
            )}
            {acked && (
              <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white/70 text-xs font-bold border border-white/20 flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-white" /> Acknowledged
              </span>
            )}
            <button
              onClick={() => setShowModal(true)}
              className="px-3 py-1.5 rounded-xl bg-white text-xs font-bold transition-all flex items-center gap-1.5"
              style={{ color: meta.color }}
            >
              Details <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1.5 rounded-lg bg-black/20 hover:bg-black/30 text-white transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Full-screen emergency modal ── */}
      <AnimatePresence>
        {showModal && (
          <EmergencyDrillModal
            drill={drill}
            meta={meta}
            sevMeta={sevMeta}
            timeLeft={timeLeft}
            acked={acked}
            isDark={isDark}
            onAck={handleAck}
            onClose={() => setShowModal(false)}
            user={user}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function EmergencyDrillModal({ drill, meta, sevMeta, timeLeft, acked, isDark, onAck, onClose, user }) {
  const mins = Math.floor(timeLeft / 60);
  const secs = String(timeLeft % 60).padStart(2, '0');
  const pct  = drill.endsAt ? Math.max(0, ((drill.endsAt - Date.now()) / (drill.duration * 60 * 1000)) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        className={`w-full max-w-lg rounded-3xl overflow-hidden ${isDark ? 'bg-[#0a0f1e]' : 'bg-white'}`}
        style={{ boxShadow: `0 32px 80px ${meta.color}40, 0 8px 24px rgba(0,0,0,0.5)` }}
      >
        {/* Header stripe */}
        <div className="relative px-6 py-5 overflow-hidden" style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color}aa)` }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)', backgroundSize: '8px 8px' }} />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl border border-white/30">
                {meta.emoji}
              </div>
              <div>
                <p className="text-[9px] font-black tracking-widest text-white/70 uppercase">LIVE DRILL ALERT</p>
                <h2 className="text-lg font-extrabold text-white leading-tight">{drill.title}</h2>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl bg-black/20 hover:bg-black/30 text-white transition-all">
              <X className="h-5 w-5" />
            </button>
          </div>
          {/* Countdown */}
          {timeLeft > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-[10px] text-white/70 font-mono mb-1">
                <span>Time Remaining</span>
                <span className="font-bold text-white">{mins}:{secs}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-white"
                  initial={{ width: `${pct}%` }}
                  animate={{ width: `${pct}%` }}
                  style={{ boxShadow: '0 0 8px rgba(255,255,255,0.6)' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Severity + Type chips */}
          <div className="flex gap-2 flex-wrap">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${isDark ? sevMeta.cls.replace('50','500/10').replace('700','400').replace('200','500/20') : sevMeta.cls}`}>
              {drill.severity} Severity
            </span>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${isDark ? meta.dark : meta.light}`}>
              {meta.label}
            </span>
          </div>

          {/* Scenario */}
          {drill.scenario && (
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/[0.03] border-white/[0.07]' : 'bg-slate-50 border-slate-200'}`}>
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Scenario</p>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{drill.scenario}</p>
            </div>
          )}

          {/* Instructions */}
          <div className={`p-4 rounded-xl border-l-4`} style={{ borderColor: meta.color, background: `${meta.color}10` }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: meta.color }}>Emergency Instructions</p>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{drill.instructions}</p>
          </div>

          {/* CTA buttons */}
          <div className="flex gap-3 pt-1">
            {!acked ? (
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={onAck}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color}cc)`, boxShadow: `0 4px 14px ${meta.color}50` }}
              >
                <CheckCircle className="h-4 w-4" /> Acknowledge Drill
              </motion.button>
            ) : (
              <div className="flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border"
                style={{ color: meta.color, borderColor: `${meta.color}40`, background: `${meta.color}10` }}>
                <CheckCircle className="h-4 w-4" /> Acknowledged
              </div>
            )}
            <button
              onClick={() => { onClose(); navigate('#/portal/map'); }}
              className={`px-4 py-3 rounded-xl text-sm font-bold border transition-all flex items-center gap-2 ${
                isDark ? 'border-white/[0.08] bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Map className="h-4 w-4" /> Map
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
