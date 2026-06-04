import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, ChevronDown, ExternalLink, Droplets, Wind,
  Flame, Heart, Activity, Shield, CheckCircle2, Clock, Zap, BarChart2
} from 'lucide-react';
import { useThemeContext } from '../App';
import BackToHomeButton from '../components/common/BackToHomeButton';

const MODULES = [
  {
    id: 'flood', title: 'Flood Safety', emoji: '🌊', icon: Droplets,
    color: '#3B82F6', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20',
    textColor: 'text-blue-500', gradient: 'from-blue-600 to-cyan-500',
    lightBg: 'from-blue-50 to-cyan-50', shadow: 'rgba(59,130,246,0.18)',
    readTime: '12 min', difficulty: 'Intermediate', tips: 21,
    sections: [
      { title: 'Before a Flood', items: ['Monitor weather forecasts and flood warnings regularly', 'Prepare an emergency kit with food, water, medicines, and flashlights', 'Elevate electrical appliances and valuable items above ground level', 'Identify evacuation routes to higher ground in your area', 'Install sandbags and flood barriers at entry points', 'Keep important documents in waterproof containers', 'Plan a family communication strategy in case of separation'] },
      { title: 'During a Flood', items: ['Move to the highest floor or roof immediately', 'Avoid walking or driving through floodwater — 15cm can sweep you off your feet', 'Turn off electricity and gas at the main supply if safe to do so', 'Do NOT drink tap water — it may be contaminated with sewage', 'Stay away from power lines and electrical wires', 'Listen to emergency broadcasts on battery-powered radio', 'Signal for help using a flashlight or bright cloth if trapped'] },
      { title: 'After a Flood', items: ['Return home only when authorities declare it safe', 'Check for structural damage before entering buildings', 'Do not turn on electrical appliances if they got wet', 'Clean and disinfect everything that came in contact with floodwater', 'Watch out for snakes and insects that may have entered your home', 'Discard any food that came in contact with floodwater', 'Document damage with photos for insurance claims'] }
    ]
  },
  {
    id: 'earthquake', title: 'Earthquake Safety', emoji: '🌍', icon: Activity,
    color: '#F97316', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/20',
    textColor: 'text-orange-500', gradient: 'from-orange-600 to-red-500',
    lightBg: 'from-orange-50 to-red-50', shadow: 'rgba(249,115,22,0.18)',
    readTime: '10 min', difficulty: 'Essential', tips: 14,
    sections: [
      { title: 'Drop', items: ['Drop down onto your hands and knees immediately', 'This prevents you from being knocked over by shaking', 'Crawl to a sturdy piece of furniture if not already under one', 'Stay low to reduce the risk of falling debris injury'] },
      { title: 'Cover', items: ['Cover your head and neck with your arms and hands', 'Take shelter under a sturdy desk, table, or bench if possible', 'If no shelter is nearby, crawl next to an interior wall away from windows', 'Stay on your knees and bend over to protect vital organs', 'Avoid windows, heavy furniture, mirrors, and hanging objects'] },
      { title: 'Hold On', items: ['Hold on to your shelter with one hand until shaking stops', 'If you have no shelter, cover your head with both arms and hands', 'Be ready to move with your shelter if it shifts', 'Hold this position until the shaking completely stops', 'Expect aftershocks — be prepared to Drop, Cover, Hold On again'] }
    ]
  },
  {
    id: 'fire', title: 'Fire Safety', emoji: '🔥', icon: Flame,
    color: '#EF4444', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/20',
    textColor: 'text-red-500', gradient: 'from-red-600 to-orange-500',
    lightBg: 'from-red-50 to-orange-50', shadow: 'rgba(239,68,68,0.18)',
    readTime: '15 min', difficulty: 'Essential', tips: 14,
    sections: [
      { title: 'Evacuation Steps', items: ['Stay low and crawl under smoke — clean air is near the floor', 'Feel doors with the back of your hand before opening; if hot, find another way', 'Close doors behind you to slow the spread of fire', 'Use stairs, NEVER elevators during a fire', 'Cover your nose and mouth with a damp cloth if possible', 'Alert others by shouting "FIRE!" as you evacuate', 'Go to your designated meeting point and do a head count'] },
      { title: 'Fire Extinguisher (P.A.S.S.)', items: ['P — PULL the pin at the top of the extinguisher', 'A — AIM the nozzle at the base of the fire, not the flames', 'S — SQUEEZE the handle slowly and evenly', 'S — SWEEP the nozzle from side to side at the base', 'Stand 6-8 feet away from the fire when using the extinguisher', 'If the fire does not go out immediately, evacuate and call the fire department', 'Never use water on electrical or grease fires'] }
    ]
  },
  {
    id: 'cyclone', title: 'Cyclone Safety', emoji: '🌀', icon: Wind,
    color: '#8B5CF6', bgColor: 'bg-violet-500/10', borderColor: 'border-violet-500/20',
    textColor: 'text-violet-500', gradient: 'from-violet-600 to-purple-500',
    lightBg: 'from-violet-50 to-purple-50', shadow: 'rgba(139,92,246,0.18)',
    readTime: '13 min', difficulty: 'Advanced', tips: 13,
    sections: [
      { title: 'Shelter Preparation', items: ['Identify the nearest cyclone shelter and multiple safe routes to it', 'Reinforce windows with cyclone shutters or wooden boards', 'Secure roof structures and remove loose objects from the yard', 'Trim tree branches that could fall on your house', 'Prepare a safe room in the strongest part of your home (interior room, no windows)', 'Know the community warning system and evacuation signals'] },
      { title: 'Emergency Supplies', items: ['Store at least 7 days of non-perishable food and drinking water (4L/person/day)', 'Keep a fully stocked first aid kit and prescription medications', 'Battery-powered radio with extra batteries for emergency broadcasts', 'Flashlights, lanterns, and extra batteries — avoid candles due to gas leak risk', 'Cash, important documents in waterproof bags, and emergency contact list', 'Blankets, warm clothing, rain gear, and sturdy shoes', 'Whistle or horn to signal for help if trapped'] }
    ]
  },
  {
    id: 'firstaid', title: 'First Aid', emoji: '🏥', icon: Heart,
    color: '#10B981', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/20',
    textColor: 'text-emerald-500', gradient: 'from-emerald-600 to-teal-500',
    lightBg: 'from-emerald-50 to-teal-50', shadow: 'rgba(16,185,129,0.18)',
    readTime: '20 min', difficulty: 'Essential', tips: 21,
    sections: [
      { title: 'CPR Basics', items: ['Check responsiveness — tap and shout "Are you OK?"', 'Call emergency services immediately (108) or ask someone to call', 'Open the airway by tilting the head back and lifting the chin', 'Check for breathing for no more than 10 seconds', 'Start chest compressions: push hard and fast (100-120/min, 5-6cm deep)', 'Give 30 compressions followed by 2 rescue breaths, repeat', 'Continue CPR until emergency services arrive or the person shows signs of life'] },
      { title: 'Bleeding Control', items: ['Put on disposable gloves if available for protection', 'Apply direct pressure to the wound using a clean cloth or bandage', 'Elevate the injured area above heart level if possible', 'Do NOT remove an object embedded in the wound — apply pressure around it', 'Apply a tourniquet only for severe, life-threatening limb bleeding', 'Once bleeding stops, secure the bandage firmly but not too tight', 'Monitor for signs of shock: pale skin, rapid breathing, dizziness'] },
      { title: 'Burns Treatment', items: ['Cool the burn under cool (not cold) running water for at least 10 minutes', 'Remove jewelry or tight items near the burned area before swelling', 'Cover the burn loosely with a sterile gauze bandage or clean cloth', 'Do NOT apply ice, butter, toothpaste, or ointments to burns', 'Do not pop blisters — they protect against infection', 'Take over-the-counter pain relievers if needed', 'Seek medical attention for burns larger than 3 inches or on face, hands, genitals'] }
    ]
  }
];

function difficultyStyle(level, isDark) {
  if (level === 'Essential') return isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-200';
  if (level === 'Intermediate') return isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-200';
  return isDark ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' : 'bg-violet-50 text-violet-600 border-violet-200';
}

function ModuleCard({ module, index, isDark }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
        isDark
          ? 'bg-[#0f172a] border-white/[0.06]'
          : `border ${module.borderColor} bg-white`
      }`}
      style={{ boxShadow: expanded
        ? isDark ? '0 12px 40px rgba(0,0,0,0.4)' : `0 12px 40px ${module.shadow}`
        : isDark ? '0 4px 20px rgba(0,0,0,0.3)' : `0 4px 20px ${module.shadow}`
      }}
    >
      {/* Card Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-2xl bg-gradient-to-br ${module.gradient} flex-shrink-0`}
              style={{ boxShadow: `0 6px 20px ${module.shadow}` }}>
              {module.emoji}
            </div>
            <div>
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{module.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${difficultyStyle(module.difficulty, isDark)}`}>
                  {module.difficulty}
                </span>
                <span className={`flex items-center gap-1 text-[11px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  <Clock className="h-3 w-3" /> {module.readTime}
                </span>
                <span className={`flex items-center gap-1 text-[11px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  <Zap className="h-3 w-3" style={{ color: module.color }} />
                  <span className={module.textColor}>{module.tips} tips</span>
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className={`p-2.5 rounded-xl transition-all border ${
              expanded
                ? `border-[${module.color}30] ${module.textColor}`
                : isDark ? 'border-white/[0.08] text-slate-500 hover:text-white hover:border-white/[0.15]' : 'border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <ChevronDown className={`h-4.5 w-4.5 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <p className={`text-sm leading-relaxed mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {module.sections.map(s => s.title).join(' · ')} — Essential safety procedures for schools and colleges.
        </p>

        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setExpanded(!expanded)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
            expanded
              ? `border-transparent text-white`
              : isDark
                ? `${module.borderColor} ${module.textColor} hover:bg-white/[0.05]`
                : `${module.borderColor} ${module.textColor} hover:bg-slate-50`
          }`}
          style={expanded ? {
            background: `linear-gradient(135deg, ${module.gradient.includes('blue') ? '#2563EB,#06B6D4' : module.gradient.includes('orange') ? '#F97316,#EF4444' : module.gradient.includes('red') ? '#EF4444,#F97316' : module.gradient.includes('violet') ? '#8B5CF6,#A78BFA' : '#10B981,#06B6D4'})`,
            boxShadow: `0 4px 12px ${module.shadow}`
          } : {}}
        >
          {expanded ? 'Collapse Module' : 'Expand Module'}
          <ExternalLink className="h-3 w-3" />
        </motion.button>
      </div>

      {/* Expandable Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className={`px-6 pb-6 pt-5 space-y-6 ${
              isDark ? 'bg-white/[0.02] border-t border-white/[0.05]' : `bg-gradient-to-br ${module.lightBg} border-t ${module.borderColor}`
            }`}>
              {module.sections.map((section, si) => (
                <div key={si}>
                  <h4 className={`text-sm font-bold mb-3 flex items-center gap-2 ${module.textColor}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current flex-shrink-0" />
                    {section.title}
                  </h4>
                  <ul className="space-y-2">
                    {section.items.map((item, ii) => (
                      <motion.li
                        key={ii}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: ii * 0.03 }}
                        className={`flex items-start gap-2.5 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                      >
                        <CheckCircle2 className={`h-4 w-4 flex-shrink-0 mt-0.5 ${module.textColor}`} />
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function LearningHub() {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const totalTips = MODULES.reduce((acc, m) => acc + m.sections.reduce((a, s) => a + s.items.length, 0), 0);

  return (
    <div className="space-y-8">
      <BackToHomeButton />
      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        <span className="section-label">Knowledge Center</span>
        <h1 className={`text-2xl font-extrabold tracking-tight mt-1 flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center"
            style={{ boxShadow: '0 6px 16px rgba(37,99,235,0.3)' }}>
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          Disaster Awareness Learning Hub
        </h1>
        <p className={`text-sm mt-2 max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Comprehensive safety guides for every disaster scenario. Expand each module to access detailed step-by-step instructions.
        </p>
      </motion.div>

      {/* ── Overview Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {[
          { label: 'Total Modules', value: MODULES.length, icon: BookOpen, color: '#2563EB', bg: isDark ? 'bg-blue-500/10' : 'bg-blue-50' },
          { label: 'Safety Tips', value: totalTips, icon: Zap, color: '#10B981', bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50' },
          { label: 'Sections', value: MODULES.reduce((a, m) => a + m.sections.length, 0), icon: BarChart2, color: '#F59E0B', bg: isDark ? 'bg-amber-500/10' : 'bg-amber-50' },
          { label: 'Avg Read Time', value: '14 min', icon: Clock, color: '#8B5CF6', bg: isDark ? 'bg-violet-500/10' : 'bg-violet-50' }
        ].map((s, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}
            className={`rounded-2xl p-4 border ${
              isDark ? 'bg-[#0f172a] border-white/[0.06]' : `${s.bg} border-white`
            }`}
            style={{ boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.04)' }}
          >
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

      {/* ── Module Quick Nav ── */}
      <div className="flex flex-wrap gap-2">
        {MODULES.map((mod) => (
          <span key={mod.id} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
            isDark ? `bg-white/[0.04] border-white/[0.08] text-slate-300` : `${mod.bgColor} ${mod.borderColor} ${mod.textColor}`
          }`}>
            {mod.emoji} {mod.title}
          </span>
        ))}
      </div>

      {/* ── Module Cards ── */}
      <div className="space-y-4">
        {MODULES.map((module, index) => (
          <ModuleCard key={module.id} module={module} index={index} isDark={isDark} />
        ))}
      </div>

      {/* ── CTA Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`relative overflow-hidden rounded-2xl p-8 text-center ${
          isDark ? 'bg-gradient-to-br from-blue-900/30 to-slate-900 border border-blue-500/15' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50 border border-blue-100'
        }`}
        style={{ boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(37,99,235,0.08)' }}
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4"
            style={{ boxShadow: '0 6px 20px rgba(37,99,235,0.3)' }}>
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>Knowledge Saves Lives</h3>
          <p className={`text-sm max-w-md mx-auto mb-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Complete all learning modules and take the preparedness quiz to earn your Disaster Preparedness Certificate.
          </p>
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary btn-ripple px-6 py-2.5 text-sm rounded-xl inline-flex items-center gap-2"
          >
            Take the Quiz <Zap className="h-4 w-4" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
