import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown, ExternalLink, Droplets, Wind, Flame, Heart, Activity, Shield, CheckCircle2 } from 'lucide-react';

const MODULES = [
  {
    id: 'flood',
    title: 'Flood Safety',
    emoji: '🌊',
    icon: Droplets,
    color: '#3b82f6',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    textColor: 'text-blue-400',
    gradient: 'from-blue-600 to-cyan-600',
    sections: [
      { title: 'Before a Flood', items: ['Monitor weather forecasts and flood warnings regularly', 'Prepare an emergency kit with food, water, medicines, and flashlights', 'Elevate electrical appliances and valuable items above ground level', 'Identify evacuation routes to higher ground in your area', 'Install sandbags and flood barriers at entry points', 'Keep important documents in waterproof containers', 'Plan a family communication strategy in case of separation'] },
      { title: 'During a Flood', items: ['Move to the highest floor or roof immediately', 'Avoid walking or driving through floodwater — 15cm can sweep you off your feet', 'Turn off electricity and gas at the main supply if safe to do so', 'Do NOT drink tap water — it may be contaminated with sewage', 'Stay away from power lines and electrical wires', 'Listen to emergency broadcasts on battery-powered radio', 'Signal for help using a flashlight or bright cloth if trapped'] },
      { title: 'After a Flood', items: ['Return home only when authorities declare it safe', 'Check for structural damage before entering buildings', 'Do not turn on electrical appliances if they got wet', 'Clean and disinfect everything that came in contact with floodwater', 'Watch out for snakes and insects that may have entered your home', 'Discard any food that came in contact with floodwater', 'Document damage with photos for insurance claims'] }
    ]
  },
  {
    id: 'earthquake',
    title: 'Earthquake Safety',
    emoji: '🌍',
    icon: Activity,
    color: '#f97316',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    textColor: 'text-orange-400',
    gradient: 'from-orange-600 to-red-600',
    sections: [
      { title: 'Drop', items: ['Drop down onto your hands and knees immediately', 'This prevents you from being knocked over by shaking', 'Crawl to a sturdy piece of furniture if not already under one', 'Stay low to reduce the risk of falling debris injury'] },
      { title: 'Cover', items: ['Cover your head and neck with your arms and hands', 'Take shelter under a sturdy desk, table, or bench if possible', 'If no shelter is nearby, crawl next to an interior wall away from windows', 'Stay on your knees and bend over to protect vital organs', 'Avoid windows, heavy furniture, mirrors, and hanging objects'] },
      { title: 'Hold On', items: ['Hold on to your shelter with one hand until shaking stops', 'If you have no shelter, cover your head with both arms and hands', 'Be ready to move with your shelter if it shifts', 'Hold this position until the shaking completely stops', 'Expect aftershocks — be prepared to Drop, Cover, Hold On again'] }
    ]
  },
  {
    id: 'fire',
    title: 'Fire Safety',
    emoji: '🔥',
    icon: Flame,
    color: '#ef4444',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    textColor: 'text-red-400',
    gradient: 'from-red-600 to-orange-600',
    sections: [
      { title: 'Evacuation Steps', items: ['Stay low and crawl under smoke — clean air is near the floor', 'Feel doors with the back of your hand before opening; if hot, find another way', 'Close doors behind you to slow the spread of fire', 'Use stairs, NEVER elevators during a fire', 'Cover your nose and mouth with a damp cloth if possible', 'Alert others by shouting "FIRE!" as you evacuate', 'Go to your designated meeting point and do a head count'] },
      { title: 'Fire Extinguisher Usage (P.A.S.S.)', items: ['P — PULL the pin at the top of the extinguisher', 'A — AIM the nozzle at the base of the fire, not the flames', 'S — SQUEEZE the handle slowly and evenly', 'S — SWEEP the nozzle from side to side at the base', 'Stand 6-8 feet away from the fire when using the extinguisher', 'If the fire does not go out immediately, evacuate and call the fire department', 'Never use water on electrical or grease fires'] }
    ]
  },
  {
    id: 'cyclone',
    title: 'Cyclone Safety',
    emoji: '🌀',
    icon: Wind,
    color: '#8b5cf6',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/20',
    textColor: 'text-violet-400',
    gradient: 'from-violet-600 to-purple-600',
    sections: [
      { title: 'Shelter Preparation', items: ['Identify the nearest cyclone shelter and multiple safe routes to it', 'Reinforce windows with cyclone shutters or wooden boards', 'Secure roof structures and remove loose objects from the yard', 'Trim tree branches that could fall on your house', 'Prepare a safe room in the strongest part of your home (interior room, no windows)', 'Know the community warning system and evacuation signals'] },
      { title: 'Emergency Supplies', items: ['Store at least 7 days of non-perishable food and drinking water (4L/person/day)', 'Keep a fully stocked first aid kit and prescription medications', 'Battery-powered radio with extra batteries for emergency broadcasts', 'Flashlights, lanterns, and extra batteries — avoid candles due to gas leak risk', 'Cash, important documents in waterproof bags, and emergency contact list', 'Blankets, warm clothing, rain gear, and sturdy shoes', 'Whistle or horn to signal for help if trapped'] }
    ]
  },
  {
    id: 'firstaid',
    title: 'First Aid',
    emoji: '🏥',
    icon: Heart,
    color: '#10b981',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    textColor: 'text-emerald-400',
    gradient: 'from-emerald-600 to-teal-600',
    sections: [
      { title: 'CPR Basics', items: ['Check responsiveness — tap and shout "Are you OK?"', 'Call emergency services immediately (108) or ask someone to call', 'Open the airway by tilting the head back and lifting the chin', 'Check for breathing for no more than 10 seconds', 'Start chest compressions: push hard and fast (100-120/min, 5-6cm deep)', 'Give 30 compressions followed by 2 rescue breaths, repeat', 'Continue CPR until emergency services arrive or the person shows signs of life'] },
      { title: 'Bleeding Control', items: ['Put on disposable gloves if available for protection', 'Apply direct pressure to the wound using a clean cloth or bandage', 'Elevate the injured area above heart level if possible', 'Do NOT remove an object embedded in the wound — apply pressure around it', 'Apply a tourniquet only for severe, life-threatening limb bleeding', 'Once bleeding stops, secure the bandage firmly but not too tight', 'Monitor for signs of shock: pale skin, rapid breathing, dizziness'] },
      { title: 'Burns Treatment', items: ['Cool the burn under cool (not cold) running water for at least 10 minutes', 'Remove jewelry or tight items near the burned area before swelling', 'Cover the burn loosely with a sterile gauze bandage or clean cloth', 'Do NOT apply ice, butter, toothpaste, or ointments to burns', 'Do not pop blisters — they protect against infection', 'Take over-the-counter pain relievers if needed', 'Seek medical attention for burns larger than 3 inches or on face, hands, genitals'] }
    ]
  }
];

function ModuleCard({ module, index }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = module.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`premium-card overflow-hidden transition-all duration-300 hover:shadow-2xl border ${module.borderColor}`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={`h-14 w-14 rounded-xl flex items-center justify-center text-2xl ${module.bgColor} border ${module.borderColor}`}>
              {module.emoji}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{module.title}</h3>
              <span className={`text-xs font-bold ${module.textColor}`}>
                {module.sections.length} {module.sections.length === 1 ? 'Section' : 'Sections'} · {module.sections.reduce((acc, s) => acc + s.items.length, 0)} Safety Tips
              </span>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className={`p-2 rounded-lg transition-all border ${module.borderColor} ${expanded ? `bg-white dark:bg-white/10 ${module.textColor}` : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          {module.sections.map(s => s.title).join(' · ')} — Essential safety procedures for schools and colleges.
        </p>

        <div className="flex items-center gap-2 text-xs font-bold">
          <span className={`px-3 py-1 rounded-full border ${module.borderColor} ${module.textColor}`}>
            {module.sections.reduce((acc, s) => acc + s.items.length, 0)} steps
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className={`px-3 py-1 rounded-full border ${module.borderColor} ${module.textColor} hover:bg-[#f3f4f6] dark:hover:bg-slate-800 transition-colors flex items-center gap-1`}
          >
            {expanded ? 'Collapse' : 'Learn More'} <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-200/60 dark:border-slate-800/60 px-6 py-5 space-y-6 bg-white dark:bg-black/20">
              {module.sections.map((section, si) => (
                <div key={si}>
                  <h4 className={`text-sm font-bold ${module.textColor} mb-3 flex items-center gap-2`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {section.title}
                  </h4>
                  <ul className="space-y-2">
                    {section.items.map((item, ii) => (
                      <li key={ii} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className={`h-4 w-4 ${module.textColor} flex-shrink-0 mt-0.5`} />
                        {item}
                      </li>
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
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-red-400">▶ Knowledge Center</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1 flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-blue-500" />
          Disaster Awareness Learning Hub
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-3xl">
          Comprehensive safety guides for every disaster scenario. Expand each module to access detailed step-by-step instructions.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {MODULES.map((mod, i) => (
          <div key={mod.id} className={`p-3 rounded-xl border ${mod.borderColor} ${mod.bgColor} text-center`}>
            <span className="text-2xl block mb-1">{mod.emoji}</span>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${mod.textColor}`}>{mod.title}</span>
          </div>
        ))}
      </div>

      {/* Module Cards */}
      <div className="grid grid-cols-1 gap-6">
        {MODULES.map((module, index) => (
          <ModuleCard key={module.id} module={module} index={index} />
        ))}
      </div>

      {/* CTA */}
      <div className="text-center p-8 rounded-2xl border-slate-200 dark:border-slate-800 bg-gradient-to-br from-blue-500/5 via-white dark:via-slate-900 to-transparent">
        <Shield className="h-10 w-10 text-red-500 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Knowledge Saves Lives</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
          Complete all learning modules and take the preparedness quiz to earn your Disaster Preparedness Certificate.
        </p>
      </div>
    </div>
  );
}
