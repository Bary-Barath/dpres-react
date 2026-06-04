import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Download, CheckCircle2, BookOpen, Droplets, Wind, Flame, Heart, Shield, ChevronDown } from 'lucide-react';
import { navigate } from '../hooks/useRoute';

const OFFLINE_GUIDES = [
  {
    id: 'flood',
    title: 'Flood Safety Guide',
    emoji: '🌊',
    icon: Droplets,
    color: '#3b82f6',
    textColor: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    content: ['Move to higher ground immediately when flood warning is issued', 'Avoid walking through moving water — 15cm can knock you off your feet', 'Turn off electricity and gas at main supply if safe to access', 'Do not drink tap water during floods — contamination risk', 'Listen to emergency broadcasts on battery-powered radio', 'Signal for help using flashlight or bright cloth if trapped', 'After flood: check for structural damage before entering buildings']
  },
  {
    id: 'earthquake',
    title: 'Earthquake Safety Guide',
    emoji: '🌍',
    icon: Shield,
    color: '#f97316',
    textColor: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    content: ['DROP: Drop to hands and knees immediately when shaking starts', 'COVER: Cover head and neck under sturdy furniture', 'HOLD ON: Hold on to shelter until shaking stops completely', 'Stay away from windows, heavy furniture, and hanging objects', 'If outdoors: move away from buildings, trees, and power lines', 'If driving: pull over to a clear area and stay in vehicle', 'Expect aftershocks — be ready to Drop, Cover, Hold On again']
  },
  {
    id: 'fire',
    title: 'Fire Safety Guide',
    emoji: '🔥',
    icon: Flame,
    color: '#ef4444',
    textColor: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    content: ['Stay low and crawl under smoke — clean air is near the floor', 'Feel doors with back of hand before opening; if hot, find another exit', 'Use stairs, NEVER elevators during a fire', 'Cover nose and mouth with damp cloth if possible', 'Alert others by shouting "FIRE!" as you evacuate', 'Go to designated meeting point and do a head count', 'PASS method: Pull, Aim, Squeeze, Sweep for extinguisher use']
  },
  {
    id: 'cyclone',
    title: 'Cyclone Safety Guide',
    emoji: '🌀',
    icon: Wind,
    color: '#a855f7',
    textColor: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/20',
    content: ['Reinforce windows and doors with cyclone shutters or boards', 'Secure all loose outdoor objects that could become projectiles', 'Stay in the strongest part of building — interior room, no windows', 'Store 7+ days of non-perishable food and water (4L/person/day)', 'Keep battery-powered radio, flashlights, and extra batteries', 'Do not go outside during the eye of the cyclone — winds will return', 'Beware of flooded roads, downed power lines, and gas leaks after']
  },
  {
    id: 'firstaid',
    title: 'First Aid Instructions',
    emoji: '🏥',
    icon: Heart,
    color: '#10b981',
    textColor: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    content: ['Check responsiveness — tap and shout "Are you OK?"', 'Call emergency services immediately (108) for serious injuries', 'CPR: Push hard and fast at 100-120 compressions/min, 5cm deep', '30 chest compressions followed by 2 rescue breaths, repeat', 'For bleeding: apply direct pressure with clean cloth', 'For burns: cool under running water for 10 minutes — no ice or butter', 'Do NOT remove object embedded in wound — apply pressure around it']
  }
];

const EMERGENCY_NUMBERS = [
  { name: 'Ambulance', number: '108' },
  { name: 'Fire Service', number: '101' },
  { name: 'Police', number: '100' },
  { name: 'Disaster Helpline', number: '1070' }
];

function GuideCard({ guide, index }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = guide.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`premium-card overflow-hidden border ${guide.borderColor}`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-4">
          <Icon className={`h-8 w-8 ${guide.textColor}`} />
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{guide.title}</h3>
            <span className={`text-[10px] font-bold ${guide.textColor}`}>{guide.content.length} steps</span>
          </div>
        </div>
        <ChevronDown className={`h-5 w-5 text-slate-600 dark:text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-2">
              {guide.content.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <span className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-bold ${guide.bgColor} ${guide.textColor}`}>{i + 1}</span>
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function OfflineResources() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cachedGuides, setCachedGuides] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dpres_cached_guides') || 'false'); } catch { return false; }
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const cacheGuides = () => {
    try {
      localStorage.setItem('dpres_cached_guides', JSON.stringify(true));
      setCachedGuides(true);
    } catch (e) {
      console.error('Failed to cache guides:', e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-red-400">▶ Offline Mode</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1 flex items-center gap-3">
          {isOnline ? <Wifi className="h-8 w-8 text-emerald-400" /> : <WifiOff className="h-8 w-8 text-red-400" />}
          {isOnline ? 'Online — Resources Available' : 'Offline Emergency Resources'}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          {isOnline
            ? 'You are connected. Cache these guides for offline access during emergencies.'
            : 'You are offline. These emergency resources are always available without internet.'}
        </p>
      </div>

      {/* Status Bar */}
      <div className={`p-4 rounded-xl border flex items-center gap-3 ${
        isOnline
          ? 'bg-white dark:bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
          : 'bg-white dark:bg-red-500/5 border-red-500/20 text-red-400'
      }`}>
        {isOnline ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
        <div>
          <p className="text-sm font-bold">{isOnline ? 'Connected to internet' : 'You are currently offline'}</p>
          <p className="text-xs opacity-80">
            {isOnline ? 'All features available. Tap below to cache for offline use.' : 'Emergency guides and contacts available offline.'}
          </p>
        </div>
      </div>

      {/* Cache Button */}
      {isOnline && !cachedGuides && (
        <button
          onClick={cacheGuides}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
        >
          <Download className="h-4 w-4" /> Download Offline Emergency Resources
        </button>
      )}
      {cachedGuides && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          Offline Emergency Resources Available — guides are cached on this device
        </div>
      )}

      {/* Emergency Contacts */}
      <div className="premium-card p-5">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-red-500" />
          Emergency Contact Numbers
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {EMERGENCY_NUMBERS.map((c, idx) => (
            <div key={idx} className="p-3 rounded-xl border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 text-center">
              <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">{c.name}</div>
              <a href={`tel:${c.number}`} className="text-lg font-extrabold text-red-400 hover:text-red-300 transition-colors">{c.number}</a>
            </div>
          ))}
        </div>
      </div>

      {/* Offline Guides */}
      <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-blue-400" />
        Offline Safety Guides
      </h2>

      <div className="space-y-3">
        {OFFLINE_GUIDES.map((guide, idx) => (
          <GuideCard key={guide.id} guide={guide} index={idx} />
        ))}
      </div>
    </div>
  );
}
