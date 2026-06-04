import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Shield, HeartPulse, Flame, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { useThemeContext } from '../App';

export default function Contacts() {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';

  const directory = [
    { name: 'Campus Safety Console', number: '9842410036', desc: 'Central Dispatch Unit', icon: Shield, accent: '#2563EB', bg: 'from-blue-50 to-indigo-50', darkBg: 'bg-blue-500/10', border: 'border-blue-100', darkBorder: 'border-blue-500/20', iconColor: 'bg-blue-500' },
    { name: 'University Medical Center', number: '9875463120', desc: 'Active Triage & First Aid', icon: HeartPulse, accent: '#10B981', bg: 'from-emerald-50 to-teal-50', darkBg: 'bg-emerald-500/10', border: 'border-emerald-100', darkBorder: 'border-emerald-500/20', iconColor: 'bg-emerald-500' },
    { name: 'Local Authorities Dispatch', number: '100', desc: 'Police Division Dispatcher', icon: ShieldAlert, accent: '#F97316', bg: 'from-orange-50 to-amber-50', darkBg: 'bg-orange-500/10', border: 'border-orange-100', darkBorder: 'border-orange-500/20', iconColor: 'bg-orange-500' },
    { name: 'State Fire Service', number: '101', desc: 'Emergency Fire Containment', icon: Flame, accent: '#EF4444', bg: 'from-red-50 to-rose-50', darkBg: 'bg-red-500/10', border: 'border-red-100', darkBorder: 'border-red-500/20', iconColor: 'bg-red-500' }
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <span className="section-label">Support Hotline Index</span>
        <h1 className={`text-2xl font-extrabold tracking-tight mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Emergency Contacts
        </h1>
        <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          In an active crisis — fire, medical emergency, or security threat — call the central dispatcher immediately.
        </p>
      </motion.div>

      <div className="space-y-3">
        {directory.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <motion.a
              key={idx}
              href={`tel:${item.number}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              whileHover={{ y: -3 }}
              className={`group flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                isDark
                  ? `${item.darkBg} ${item.darkBorder} hover:border-opacity-60`
                  : `bg-gradient-to-br ${item.bg} ${item.border} hover:shadow-md`
              }`}
              style={{ boxShadow: isDark ? `0 4px 16px ${item.accent}15` : `0 4px 16px ${item.accent}12` }}
            >
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-2xl ${item.iconColor} flex items-center justify-center flex-shrink-0`}
                  style={{ boxShadow: `0 4px 12px ${item.accent}35` }}>
                  <IconComp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className={`text-sm font-bold transition-colors ${isDark ? 'text-white group-hover:text-white' : 'text-slate-800'}`}>
                    {item.name}
                  </h4>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{item.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="font-mono text-base font-extrabold" style={{ color: item.accent }}>{item.number}</span>
                <div className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                  isDark
                    ? 'bg-white/[0.06] text-white'
                    : 'bg-white border border-slate-200 text-slate-700 shadow-sm'
                }`}>
                  <Phone className="h-3 w-3" /> Call
                </div>
              </div>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}
