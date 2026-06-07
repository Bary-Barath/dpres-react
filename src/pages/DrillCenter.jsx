import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, CheckCircle2, Clock, AlertTriangle, Shield,
  CalendarDays, Activity, XCircle, ChevronRight, Map,
  Zap, Trophy, Radio
} from 'lucide-react';
import {
  getDrills, getStudentParticipation, acknowledge,
  completedParticipation, subscribe, getDrillMeta, SEVERITY_META, getActiveDrill
} from '../services/drillService';
import { useAuth, useThemeContext } from '../App';
import { navigate } from '../hooks/useRoute';
import BackToHomeButton from '../components/common/BackToHomeButton';

function useDrillData(userId) {
  const [drills, setDrills]           = useState(getDrills);
  const [participation, setParticipation] = useState(() => getStudentParticipation(userId));

  const refresh = useCallback(() => {
    setDrills(getDrills());
    setParticipation(getStudentParticipation(userId));
  }, [userId]);

  useEffect(() => {
    const unsub = subscribe(() => refresh());
    window.addEventListener('focus', refresh);
    return () => { unsub(); window.removeEventListener('focus', refresh); };
  }, [refresh]);

  return { drills, participation, refresh };
}

export default function DrillCenter() {
  const { user }  = useAuth();
  const { theme } = useThemeContext();
  const isDark    = theme === 'dark';
  const [tab, setTab] = useState('active');

  const { drills, participation, refresh } = useDrillData(user?.id || '');
  const activeDrill = getActiveDrill();

  const getMyStatus = (drillId) =>
    participation.find(p => p.drillId === drillId)?.status || null;

  const handleAck = (drillId) => {
    acknowledge(drillId, user.id);
    refresh();
  };

  const handleComplete = (drillId) => {
    completedParticipation(drillId, user.id);
    refresh();
  };

  // Categorise
  const active    = drills.filter(d => d.status === 'Active');
  const upcoming  = drills.filter(d => d.status === 'Scheduled');
  const completed = drills.filter(d => d.status === 'Completed' || d.status === 'Cancelled');
  const missed    = completed.filter(d => {
    const myP = getMyStatus(d.id);
    return d.status === 'Completed' && !myP;
  });

  const tabs = [
    { key: 'active',    label: 'Active',    count: active.length,    icon: Radio        },
    { key: 'history',   label: 'History',   count: completed.length, icon: CalendarDays },
    { key: 'missed',    label: 'Missed',    count: missed.length,    icon: XCircle      },
  ];

  const myCompletedCount = participation.filter(p => p.status === 'completed').length;
  const myAckedCount     = participation.filter(p => p.status === 'acknowledged' || p.status === 'completed').length;

  const card       = isDark ? 'bg-[#0f172a] border border-white/[0.06]' : 'bg-white border border-slate-100';
  const cardShadow = isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.05)';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <BackToHomeButton />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <span className="section-label">Safety Participation</span>
        <h1 className={`text-2xl font-extrabold tracking-tight mt-1 flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center"
            style={{ boxShadow: '0 6px 20px rgba(239,68,68,0.3)' }}>
            <Bell className="h-5 w-5 text-white" />
          </div>
          Mock Drills
        </h1>
        <p className={`text-sm mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Participate in campus emergency drills and track your preparedness.
        </p>
      </motion.div>

      {/* Live drill alert */}
      <AnimatePresence>
        {activeDrill && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl overflow-hidden"
            style={{ boxShadow: `0 8px 32px ${getDrillMeta(activeDrill.type).color}40` }}
          >
            <LiveDrillCard drill={activeDrill} myStatus={getMyStatus(activeDrill.id)} onAck={handleAck} onComplete={handleComplete} isDark={isDark} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3.5">
        {[
          { label: 'Drills Acknowledged', value: myAckedCount,     icon: CheckCircle2, color: '#10B981' },
          { label: 'Drills Completed',    value: myCompletedCount, icon: Trophy,       color: '#F59E0B' },
          { label: 'Total Drills',        value: drills.length,    icon: Shield,       color: '#2563EB' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className={`rounded-2xl p-4 ${card}`} style={{ boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.3)' : `0 4px 16px ${s.color}15` }}>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: `${s.color}15` }}>
                <s.icon className="h-4.5 w-4.5" style={{ color: s.color }} />
              </div>
              <div>
                <p className={`text-xl font-extrabold ${isDark ? 'text-white' : 'text-slate-800'}`}>{s.value}</p>
                <p className={`text-[10px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{s.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className={`flex p-1 rounded-2xl ${isDark ? 'bg-slate-900 border border-white/[0.06]' : 'bg-slate-100'}`}>
        {tabs.map(t => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                active
                  ? isDark ? 'bg-white/[0.08] text-white border border-white/[0.1]' : 'bg-white text-slate-800 shadow'
                  : isDark ? 'text-slate-500 hover:text-white' : 'text-slate-500 hover:text-slate-700'
              }`}>
              <Icon className="h-3.5 w-3.5" />
              {t.label}
              {t.count > 0 && (
                <span className={`inline-flex items-center justify-center h-4 min-w-[1rem] rounded-full text-[9px] font-extrabold px-1 ${
                  active ? 'bg-red-500 text-white' : isDark ? 'bg-white/[0.08] text-slate-400' : 'bg-slate-200 text-slate-500'
                }`}>{t.count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
          {tab === 'active' && (
            active.length === 0
              ? <EmptyState icon={Radio} text="No active drills right now." sub="You will be alerted when a new drill is broadcast." isDark={isDark} card={card} cardShadow={cardShadow} />
              : active.map((d, i) => (
                <DrillCard key={d.id} drill={d} myStatus={getMyStatus(d.id)} onAck={handleAck} onComplete={handleComplete} isDark={isDark} idx={i} />
              ))
          )}
          {tab === 'history' && (
            completed.length === 0
              ? <EmptyState icon={CalendarDays} text="No drill history yet." sub="Past drills will appear here." isDark={isDark} card={card} cardShadow={cardShadow} />
              : completed.map((d, i) => (
                <DrillCard key={d.id} drill={d} myStatus={getMyStatus(d.id)} onAck={null} onComplete={null} isDark={isDark} idx={i} />
              ))
          )}
          {tab === 'missed' && (
            missed.length === 0
              ? <EmptyState icon={CheckCircle2} text="No missed drills!" sub="You have participated in all completed drills." isDark={isDark} card={card} cardShadow={cardShadow} color="#10B981" />
              : missed.map((d, i) => (
                <DrillCard key={d.id} drill={d} myStatus="missed" onAck={null} onComplete={null} isDark={isDark} idx={i} />
              ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function LiveDrillCard({ drill, myStatus, onAck, onComplete, isDark }) {
  const meta = getDrillMeta(drill.type);
  const [timeLeft, setTimeLeft] = useState(() =>
    drill.endsAt ? Math.max(0, Math.floor((drill.endsAt - Date.now()) / 1000)) : 0
  );

  useEffect(() => {
    if (!drill.endsAt) return;
    const id = setInterval(() => {
      setTimeLeft(Math.max(0, Math.floor((drill.endsAt - Date.now()) / 1000)));
    }, 1000);
    return () => clearInterval(id);
  }, [drill.endsAt]);

  const mins = Math.floor(timeLeft / 60);
  const secs = String(timeLeft % 60).padStart(2, '0');
  const pct  = drill.endsAt ? Math.max(0, ((drill.endsAt - Date.now()) / (drill.duration * 60 * 1000)) * 100) : 100;

  return (
    <div className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${meta.color}22, ${meta.color}08)`, border: `1px solid ${meta.color}40`, borderRadius: '1rem' }}>
      <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl animate-pulse" style={{ background: meta.color }} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl flex items-center justify-center text-xl border"
              style={{ background: `${meta.color}20`, borderColor: `${meta.color}40` }}>
              {meta.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full text-white animate-pulse"
                  style={{ background: meta.color }}>LIVE</span>
                <span className={`text-[9px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{meta.label}</span>
              </div>
              <h3 className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-800'}`}>{drill.title}</h3>
            </div>
          </div>
          {timeLeft > 0 && (
            <div className="text-right flex-shrink-0">
              <p className={`text-[9px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Ends in</p>
              <p className="text-xl font-black font-mono" style={{ color: meta.color }}>{mins}:{secs}</p>
            </div>
          )}
        </div>

        {timeLeft > 0 && (
          <div className={`h-1.5 rounded-full overflow-hidden mb-3 ${isDark ? 'bg-white/[0.08]' : 'bg-black/[0.08]'}`}>
            <motion.div className="h-full rounded-full" style={{ width: `${pct}%`, background: meta.color }}
              transition={{ duration: 1 }} />
          </div>
        )}

        {drill.instructions && (
          <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{drill.instructions}</p>
        )}

        <div className="flex gap-2">
          {!myStatus && (
            <button onClick={() => onAck(drill.id)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5"
              style={{ background: meta.color, boxShadow: `0 4px 12px ${meta.color}50` }}>
              <CheckCircle2 className="h-3.5 w-3.5" /> Acknowledge
            </button>
          )}
          {myStatus === 'acknowledged' && (
            <button onClick={() => onComplete(drill.id)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5"
              style={{ background: '#10B981', boxShadow: '0 4px 12px rgba(16,185,129,0.4)' }}>
              <Zap className="h-3.5 w-3.5" /> Mark Complete
            </button>
          )}
          {myStatus === 'completed' && (
            <span className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> Completed
            </span>
          )}
          <button onClick={() => navigate('#/portal/map')}
            className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
              isDark ? 'border-white/[0.08] text-slate-300 hover:bg-white/[0.05]' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}>
            <Map className="h-3.5 w-3.5" /> View Map
          </button>
        </div>
      </div>
    </div>
  );
}

function DrillCard({ drill, myStatus, onAck, onComplete, isDark, idx }) {
  const meta = getDrillMeta(drill.type);

  const statusBadge = () => {
    if (drill.status === 'Cancelled') return <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${isDark ? 'bg-slate-800 text-slate-500 border-slate-700' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>Cancelled</span>;
    if (myStatus === 'completed') return <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Completed</span>;
    if (myStatus === 'acknowledged') return <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Acknowledged</span>;
    if (myStatus === 'missed') return <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20">Missed</span>;
    if (drill.status === 'Completed') return <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20">Not Participated</span>;
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }}
      className={`rounded-2xl border p-4 ${isDark ? 'bg-[#0f172a] border-white/[0.06]' : 'bg-white border-slate-100'}`}
      style={{ boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.04)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}30` }}>
            {meta.emoji}
          </div>
          <div className="min-w-0">
            <h4 className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>{drill.title}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[10px] font-mono ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                <Clock className="h-2.5 w-2.5 inline mr-0.5" />
                {new Date(drill.timestamp).toLocaleString()}
              </span>
              <span className="text-[10px] font-bold" style={{ color: meta.color }}>{meta.label}</span>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">{statusBadge()}</div>
      </div>

      {drill.instructions && (
        <p className={`mt-3 text-xs leading-relaxed ${isDark ? 'text-slate-500' : 'text-slate-500'} line-clamp-2`}>{drill.instructions}</p>
      )}

      {drill.status === 'Active' && (
        <div className="flex gap-2 mt-3">
          {!myStatus && onAck && (
            <button onClick={() => onAck(drill.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white"
              style={{ background: meta.color }}>
              Acknowledge
            </button>
          )}
          {myStatus === 'acknowledged' && onComplete && (
            <button onClick={() => onComplete(drill.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-500">
              Mark Complete
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}

function EmptyState({ icon: Icon, text, sub, isDark, card, cardShadow, color = '#64748b' }) {
  return (
    <div className={`rounded-2xl border p-12 text-center flex flex-col items-center gap-3 ${isDark ? 'bg-[#0f172a] border-white/[0.06]' : 'bg-white border-slate-100'}`}
      style={{ boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.05)' }}>
      <div className="h-12 w-12 rounded-2xl flex items-center justify-center" style={{ background: `${color}15` }}>
        <Icon className="h-6 w-6" style={{ color }} />
      </div>
      <div>
        <p className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{text}</p>
        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{sub}</p>
      </div>
    </div>
  );
}
