import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Download, CheckCircle2, BookOpen, Droplets, Wind, Flame, Heart, Shield, ChevronDown } from 'lucide-react';
import { useThemeContext } from '../App';
import BackToHomeButton from '../components/common/BackToHomeButton';

const OFFLINE_GUIDES = [
  {
    id: 'flood', title: 'Flood Safety Guide', emoji: '🌊', icon: Droplets,
    accent: '#3B82F6', border: 'border-blue-500/20', light: 'from-blue-50 to-cyan-50/50', lightBorder: 'border-blue-100',
    textColor: 'text-blue-500',
    content: ['Move to higher ground immediately when flood warning is issued', 'Avoid walking through moving water — 15cm can knock you off your feet', 'Turn off electricity and gas at main supply if safe to access', 'Do not drink tap water during floods — contamination risk', 'Listen to emergency broadcasts on battery-powered radio', 'Signal for help using flashlight or bright cloth if trapped', 'After flood: check for structural damage before entering buildings']
  },
  {
    id: 'earthquake', title: 'Earthquake Safety Guide', emoji: '🌍', icon: Shield,
    accent: '#F97316', border: 'border-orange-500/20', light: 'from-orange-50 to-red-50/50', lightBorder: 'border-orange-100',
    textColor: 'text-orange-500',
    content: ['DROP: Drop to hands and knees immediately when shaking starts', 'COVER: Cover head and neck under sturdy furniture', 'HOLD ON: Hold on to shelter until shaking stops completely', 'Stay away from windows, heavy furniture, and hanging objects', 'If outdoors: move away from buildings, trees, and power lines', 'If driving: pull over to a clear area and stay in vehicle', 'Expect aftershocks — be ready to Drop, Cover, Hold On again']
  },
  {
    id: 'fire', title: 'Fire Safety Guide', emoji: '🔥', icon: Flame,
    accent: '#EF4444', border: 'border-red-500/20', light: 'from-red-50 to-orange-50/50', lightBorder: 'border-red-100',
    textColor: 'text-red-500',
    content: ['Stay low and crawl under smoke — clean air is near the floor', 'Feel doors with back of hand before opening; if hot, find another exit', 'Use stairs, NEVER elevators during a fire', 'Cover nose and mouth with damp cloth if possible', 'Alert others by shouting "FIRE!" as you evacuate', 'Go to designated meeting point and do a head count', 'PASS method: Pull, Aim, Squeeze, Sweep for extinguisher use']
  },
  {
    id: 'cyclone', title: 'Cyclone Safety Guide', emoji: '🌀', icon: Wind,
    accent: '#8B5CF6', border: 'border-violet-500/20', light: 'from-violet-50 to-purple-50/50', lightBorder: 'border-violet-100',
    textColor: 'text-violet-500',
    content: ['Reinforce windows and doors with cyclone shutters or boards', 'Secure all loose outdoor objects that could become projectiles', 'Stay in the strongest part of building — interior room, no windows', 'Store 7+ days of non-perishable food and water (4L/person/day)', 'Keep battery-powered radio, flashlights, and extra batteries', 'Do not go outside during the eye of the cyclone — winds will return', 'Beware of flooded roads, downed power lines, and gas leaks after']
  },
  {
    id: 'firstaid', title: 'First Aid Instructions', emoji: '🏥', icon: Heart,
    accent: '#10B981', border: 'border-emerald-500/20', light: 'from-emerald-50 to-teal-50/50', lightBorder: 'border-emerald-100',
    textColor: 'text-emerald-500',
    content: ['Check responsiveness — tap and shout "Are you OK?"', 'Call emergency services immediately (108) for serious injuries', 'CPR: Push hard and fast at 100-120 compressions/min, 5cm deep', '30 chest compressions followed by 2 rescue breaths, repeat', 'For bleeding: apply direct pressure with clean cloth', 'For burns: cool under running water for 10 minutes — no ice or butter', 'Do NOT remove object embedded in wound — apply pressure around it']
  }
];

const EMERGENCY_NUMBERS = [
  { name: 'Ambulance', number: '108', color: '#EF4444' },
  { name: 'Fire Service', number: '101', color: '#F97316' },
  { name: 'Police', number: '100', color: '#3B82F6' },
  { name: 'Disaster Helpline', number: '1070', color: '#8B5CF6' }
];

function GuideCard({ guide, index, isDark }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = guide.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className={`overflow-hidden rounded-2xl border transition-all ${
        isDark
          ? `bg-[#0f172a] ${guide.border}`
          : `bg-white ${guide.lightBorder}`
      }`}
      style={{ boxShadow: expanded
        ? isDark ? `0 8px 32px rgba(0,0,0,0.4)` : `0 8px 32px ${guide.accent}15`
        : isDark ? '0 2px 12px rgba(0,0,0,0.3)' : `0 2px 12px ${guide.accent}10`
      }}
    >
      <button onClick={() => setExpanded(!expanded)} className="w-full p-5 flex items-center justify-between text-left">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: `${guide.accent}15` }}>
            {guide.emoji}
          </div>
          <div>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{guide.title}</h3>
            <span className={`text-[11px] font-semibold ${guide.textColor}`}>{guide.content.length} steps</span>
          </div>
        </div>
        <div className={`h-8 w-8 rounded-xl flex items-center justify-center border transition-all ${
          expanded
            ? isDark ? `${guide.border} ${guide.textColor}` : `${guide.lightBorder} ${guide.textColor}`
            : isDark ? 'border-white/[0.06] text-slate-500' : 'border-slate-200 text-slate-400'
        }`}>
          <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }} className="overflow-hidden">
            <div className={`px-5 pb-5 pt-2 space-y-2 border-t ${
              isDark ? 'border-white/[0.05] bg-white/[0.02]' : `${guide.lightBorder} bg-gradient-to-br ${guide.light}`
            }`}>
              {guide.content.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  className="flex items-start gap-3 text-xs">
                  <span className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-bold mt-0.5`}
                    style={{ background: `${guide.accent}15`, color: guide.accent }}>
                    {i + 1}
                  </span>
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function OfflineResources() {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cachedGuides, setCachedGuides] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dpres_cached_guides') || 'false'); } catch { return false; }
  });

  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  const card = isDark ? 'bg-[#0f172a] border border-white/[0.06]' : 'bg-white border border-slate-100';
  const cardShadow = isDark ? '0 4px 24px rgba(0,0,0,0.35)' : '0 4px 24px rgba(0,0,0,0.06)';

  return (
    <div className="space-y-6">
      <BackToHomeButton />
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <span className="section-label">Offline Mode</span>
        <h1 className={`text-2xl font-extrabold tracking-tight mt-1 flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isOnline ? 'bg-emerald-500/15' : 'bg-red-500/15'}`}>
            {isOnline ? <Wifi className="h-5 w-5 text-emerald-500" /> : <WifiOff className="h-5 w-5 text-red-500" />}
          </div>
          {isOnline ? 'Online — Resources Available' : 'Offline Emergency Resources'}
        </h1>
        <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {isOnline ? 'Connected. Cache these guides for offline access during emergencies.' : 'Offline. Emergency resources are always available.'}
        </p>
      </motion.div>

      {/* Status */}
      <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
        isOnline
          ? isDark ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-emerald-200 bg-emerald-50'
          : isDark ? 'border-red-500/20 bg-red-500/5' : 'border-red-200 bg-red-50'
      }`}>
        {isOnline ? <Wifi className="h-5 w-5 text-emerald-500" /> : <WifiOff className="h-5 w-5 text-red-500" />}
        <div>
          <p className={`text-sm font-bold ${isOnline ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            {isOnline ? 'Connected to internet' : 'You are currently offline'}
          </p>
          <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            {isOnline ? 'All features available. Cache for offline use below.' : 'Emergency guides and contacts available.'}
          </p>
        </div>
      </div>

      {isOnline && !cachedGuides && (
        <button onClick={() => { localStorage.setItem('dpres_cached_guides', 'true'); setCachedGuides(true); }}
          className="w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all"
          style={{ background: 'linear-gradient(135deg, #2563EB, #1d4ed8)', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}>
          <Download className="h-4 w-4" /> Download Offline Emergency Resources
        </button>
      )}
      {cachedGuides && (
        <div className={`p-3.5 rounded-xl flex items-center gap-2 text-sm border ${isDark ? 'bg-emerald-500/8 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          Offline resources cached on this device
        </div>
      )}

      {/* Emergency Numbers */}
      <div className={`rounded-2xl p-5 ${card}`} style={{ boxShadow: cardShadow }}>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-4.5 w-4.5 text-red-500" />
          <h2 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Emergency Contact Numbers</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {EMERGENCY_NUMBERS.map((c, idx) => (
            <a key={idx} href={`tel:${c.number}`}
              className={`p-3.5 rounded-xl border text-center transition-all hover:-translate-y-1 ${
                isDark ? 'bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12]' : 'bg-slate-50 border-slate-100 hover:border-slate-200 shadow-sm hover:shadow'
              }`}
              style={{ boxShadow: `0 2px 8px ${c.color}12` }}
            >
              <div className={`text-xs font-medium mb-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{c.name}</div>
              <div className="text-lg font-extrabold font-mono" style={{ color: c.color }}>{c.number}</div>
            </a>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <BookOpen className="h-4.5 w-4.5 text-blue-500" />
        <h2 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Offline Safety Guides</h2>
      </div>

      <div className="space-y-3">
        {OFFLINE_GUIDES.map((guide, idx) => (
          <GuideCard key={guide.id} guide={guide} index={idx} isDark={isDark} />
        ))}
      </div>
    </div>
  );
}
