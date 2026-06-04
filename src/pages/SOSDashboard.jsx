import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, AlertTriangle, MapPin, Hospital, Navigation, X,
  Heart, Shield, Droplets, Flame, Ambulance, Zap, ArrowRight
} from 'lucide-react';
import { navigate } from '../hooks/useRoute';
import { useThemeContext } from '../App';
import BackToHomeButton from '../components/common/BackToHomeButton';

const EMERGENCY_CONTACTS = [
  { name: 'Ambulance', number: '108', icon: Ambulance, color: '#EF4444', bg: 'from-red-500/10 to-red-500/5', border: 'border-red-500/20', shadow: 'rgba(239,68,68,0.2)' },
  { name: 'Fire Service', number: '101', icon: Flame, color: '#F97316', bg: 'from-orange-500/10 to-orange-500/5', border: 'border-orange-500/20', shadow: 'rgba(249,115,22,0.2)' },
  { name: 'Police', number: '100', icon: Shield, color: '#3B82F6', bg: 'from-blue-500/10 to-blue-500/5', border: 'border-blue-500/20', shadow: 'rgba(59,130,246,0.2)' },
  { name: 'Disaster Helpline', number: '1070', icon: AlertTriangle, color: '#8B5CF6', bg: 'from-violet-500/10 to-violet-500/5', border: 'border-violet-500/20', shadow: 'rgba(139,92,246,0.2)' }
];

const SOS_MESSAGES = [
  'EMERGENCY — Help is being dispatched',
  'YOUR SAFETY IS THE PRIORITY',
  'STAY CALM — HELP IS ON THE WAY',
  'EMERGENCY SERVICES ARE READY'
];

const NEARBY_HOSPITALS = [
  { name: 'City General Hospital', distance: '1.2 km', phone: '+91-22-23456789', address: '123 Healthcare Ave, Downtown' },
  { name: 'University Medical Center', distance: '2.5 km', phone: '+91-22-34567890', address: '456 College Road, University Area' },
  { name: 'Apex Trauma Center', distance: '3.8 km', phone: '+91-22-45678901', address: '789 Emergency Blvd, West Side' }
];

const QUICK_ACTIONS = [
  { label: 'All Contacts', icon: Phone, color: '#2563EB', href: '#/portal/contacts' },
  { label: 'Risk Map', icon: MapPin, color: '#F97316', href: '#/risk-map' },
  { label: 'First Aid', icon: Heart, color: '#10B981', href: '#/learning-hub' },
  { label: 'AI Assistant', icon: Shield, color: '#8B5CF6', href: '#/portal/simulator' }
];

export default function SOSDashboard() {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const [sosActive, setSosActive] = useState(false);
  const [currentMsg, setCurrentMsg] = useState(0);
  const [showHospitals, setShowHospitals] = useState(false);
  const [locationStatus, setLocationStatus] = useState('idle');

  useEffect(() => {
    if (!sosActive) return;
    const interval = setInterval(() => {
      setCurrentMsg(prev => (prev + 1) % SOS_MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [sosActive]);

  const handleSOS = useCallback(() => {
    setSosActive(prev => !prev);
    if (!sosActive) {
      setCurrentMsg(0);
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          () => setLocationStatus('success'),
          () => setLocationStatus('denied'),
          { enableHighAccuracy: true, timeout: 10000 }
        );
        setShowHospitals(true);
      } else {
        setLocationStatus('unsupported');
        setShowHospitals(true);
      }
    } else {
      setShowHospitals(false);
      setLocationStatus('idle');
    }
  }, [sosActive]);

  return (
    <div className="space-y-7">
      <BackToHomeButton />
      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        <span className="section-label">Emergency Response</span>
        <h1 className={`text-2xl font-extrabold tracking-tight mt-1 flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center emergency-ring"
            style={{ boxShadow: '0 6px 20px rgba(239,68,68,0.4)' }}>
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          Emergency SOS Dashboard
        </h1>
        <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          One-tap access to emergency services. All numbers are directly dialable from this dashboard.
        </p>
      </motion.div>

      {/* ── SOS Hero Section ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.08 }}
        className={`relative overflow-hidden rounded-2xl ${
          sosActive
            ? 'bg-gradient-to-br from-red-600 via-red-700 to-red-800'
            : isDark
              ? 'bg-[#0f172a] border border-white/[0.06]'
              : 'bg-gradient-to-br from-red-50 via-white to-rose-50 border border-red-100'
        }`}
        style={{ boxShadow: sosActive
          ? '0 20px 60px rgba(239,68,68,0.45), 0 6px 20px rgba(239,68,68,0.3)'
          : isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(239,68,68,0.1)'
        }}
      >
        {/* Decorative rings when active */}
        {sosActive && (
          <>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute w-64 h-64 rounded-full border-2 border-white/10 animate-ping" />
              <div className="absolute w-80 h-80 rounded-full border border-white/5 animate-pulse" />
            </div>
          </>
        )}
        {!sosActive && !isDark && (
          <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-bl from-red-100/60 to-transparent rounded-full blur-3xl pointer-events-none" />
        )}

        <div className="relative flex flex-col items-center py-10 px-6">
          <motion.button
            onClick={handleSOS}
            whileTap={{ scale: 0.94 }}
            className={`relative w-40 h-40 rounded-full font-extrabold text-2xl tracking-widest transition-all duration-500 ${
              sosActive
                ? 'bg-white/[0.15] text-white ring-4 ring-white/20 backdrop-blur-sm'
                : 'text-white'
            }`}
            style={!sosActive ? {
              background: 'linear-gradient(135deg, #EF4444, #DC2626)',
              boxShadow: '0 12px 40px rgba(239,68,68,0.5), 0 4px 16px rgba(239,68,68,0.3)'
            } : {
              boxShadow: '0 8px 32px rgba(255,255,255,0.15)'
            }}
          >
            <div className="flex flex-col items-center justify-center h-full gap-1">
              <AlertTriangle className={`h-10 w-10 ${sosActive ? 'animate-bounce' : ''}`} />
              <span className="text-xl tracking-widest">SOS</span>
              <span className="text-[10px] font-medium opacity-70">{sosActive ? 'TAP TO CANCEL' : 'TAP TO ACTIVATE'}</span>
            </div>
            {!sosActive && (
              <div className="absolute -inset-3 rounded-full border-2 border-red-400/20 animate-pulse pointer-events-none" />
            )}
            {sosActive && (
              <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping pointer-events-none" />
            )}
          </motion.button>

          <div className="mt-6 text-center min-h-[2.5rem]">
            <AnimatePresence mode="wait">
              {sosActive ? (
                <motion.p
                  key={currentMsg}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="text-base font-bold text-white tracking-wide"
                >
                  {SOS_MESSAGES[currentMsg]}
                </motion.p>
              ) : (
                <motion.p
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}
                >
                  Tap the SOS button to activate emergency response
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* ── Emergency Contacts (shown when SOS active) ── */}
      <AnimatePresence>
        {sosActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Phone className="h-4.5 w-4.5 text-red-500" />
              <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Emergency Contacts</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EMERGENCY_CONTACTS.map((contact, idx) => {
                const Icon = contact.icon;
                return (
                  <motion.a
                    key={contact.number}
                    href={`tel:${contact.number}`}
                    onClick={e => { e.preventDefault(); window.location.href = `tel:${contact.number}`; }}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.07 }}
                    className={`group flex items-center justify-between p-4 rounded-2xl border bg-gradient-to-br ${contact.bg} ${contact.border} transition-all cursor-pointer hover:-translate-y-1`}
                    style={{ boxShadow: `0 4px 16px ${contact.shadow}` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ background: `${contact.color}20` }}>
                        <Icon className="h-6 w-6" style={{ color: contact.color }} />
                      </div>
                      <div>
                        <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{contact.name}</h4>
                        <p className="text-lg font-extrabold font-mono tracking-wider" style={{ color: contact.color }}>{contact.number}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all group-hover:scale-105"
                      style={{ borderColor: `${contact.color}30`, color: contact.color, background: `${contact.color}10` }}>
                      <Phone className="h-3.5 w-3.5" /> CALL
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Nearby Hospitals ── */}
      <AnimatePresence>
        {sosActive && showHospitals && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.15 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Hospital className="h-4.5 w-4.5 text-emerald-500" />
              <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Nearby Hospitals
              </h2>
              <span className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {locationStatus === 'success' ? '(Using your location)' : '(Sample data)'}
              </span>
            </div>
            <div className="space-y-2.5">
              {NEARBY_HOSPITALS.map((h, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className={`flex items-center justify-between p-4 rounded-2xl border ${
                    isDark ? 'bg-[#0f172a] border-white/[0.06]' : 'bg-white border-emerald-100'
                  }`}
                  style={{ boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(16,185,129,0.08)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Hospital className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{h.name}</h4>
                      <p className={`text-xs flex items-center gap-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        <Navigation className="h-3 w-3" /> {h.distance} · {h.address}
                      </p>
                    </div>
                  </div>
                  <a href={`tel:${h.phone}`}
                    className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20 transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {QUICK_ACTIONS.map((action, idx) => (
          <motion.button
            key={idx}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(action.href)}
            className={`flex flex-col items-center gap-2.5 p-5 rounded-2xl border transition-all ${
              isDark
                ? 'bg-[#0f172a] border-white/[0.06] hover:border-white/[0.12]'
                : 'bg-white border-slate-100 hover:border-slate-200'
            }`}
            style={{ boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.04)' }}
          >
            <div className="h-10 w-10 rounded-xl flex items-center justify-center"
              style={{ background: `${action.color}15` }}>
              <action.icon className="h-5 w-5" style={{ color: action.color }} />
            </div>
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{action.label}</span>
          </motion.button>
        ))}
      </div>

      {/* ── Safety reminder ── */}
      {!sosActive && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`relative overflow-hidden rounded-2xl p-5 ${
            isDark
              ? 'bg-amber-500/5 border border-amber-500/15'
              : 'bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
              <Zap className="h-4.5 w-4.5 text-amber-500" />
            </div>
            <div>
              <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>Emergency Reminder</h4>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                In a real emergency, always call official services first. This dashboard provides quick access to all emergency numbers and nearby hospitals.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
