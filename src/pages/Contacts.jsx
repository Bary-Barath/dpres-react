import React from 'react';
import { Phone, Shield, HeartPulse, Flame, ShieldAlert } from 'lucide-react';

export default function Contacts() {
  const directory = [
    { name: 'Campus Safety Console', number: '9842410036', desc: 'Central Dispatch Unit', icon: Shield, color: 'text-blue-500 bg-blue-500/10' },
    { name: 'University Medical Center', number: '9875463120', desc: 'Active Triage & First Aid', icon: HeartPulse, color: 'text-green-500 bg-green-500/10' },
    { name: 'Local Authorities Dispatch', number: '100', desc: 'Police Division Dispatcher', icon: ShieldAlert, color: 'text-orange-500 bg-orange-500/10' },
    { name: 'State Fire Service', number: '101', desc: 'Emergency Fire Containment', icon: Flame, color: 'text-red-500 bg-red-500/10' }
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto text-white">
      {/* Header */}
      <div>
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-red-500">▶ Support Hotline Index</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 mt-1 font-sans">Emergency Contacts</h1>
      </div>

      <p className="text-sm text-slate-400 leading-relaxed">
        If there is an active crisis (fire, medical emergency, security threat), please call the central dispatcher immediately.
      </p>

      {/* Directory cards */}
      <div className="space-y-3.5">
        {directory.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <a
              key={idx}
              href={`tel:${item.number}`}
              className="group flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-red-500/40 hover:bg-slate-900/70 transition-all cursor-pointer shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${item.color}`}>
                  <IconComp className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="block font-mono text-sm font-bold text-red-500">{item.number}</span>
                <span className="inline-block mt-1 rounded bg-red-500/10 px-2.5 py-0.5 text-[9px] font-extrabold tracking-widest text-red-400 uppercase font-mono">
                  CALL
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
