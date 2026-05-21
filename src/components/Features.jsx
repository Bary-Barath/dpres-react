import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Map, BrainCircuit, BellRing, Sparkles, Trophy } from 'lucide-react';

export default function Features() {
  const features = [
    {
      title: 'Interactive Blueprints',
      desc: 'Real-time interactive SVG campus floor plans showing emergency exits, active hazards, and locations of firefighting equipment.',
      icon: Map,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      title: 'AI Crisis Simulator',
      desc: 'Gemini-driven simulation engine that creates customized chemical fires or natural disaster alerts and analyzes students reflexes.',
      icon: BrainCircuit,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      title: 'Live Drill Broadcasts',
      desc: 'Administrators can deploy real-time notifications to all connected devices instantly to test campus-wide responses.',
      icon: BellRing,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20'
    },
    {
      title: 'Safety Quiz Registry',
      desc: 'Standardized assessment logs for Fire safety, Monsoon floods, Earthquakes, and Active Threat lockdowns with automatic grade sync.',
      icon: ShieldCheck,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      title: 'Gamified Leaderboard',
      desc: 'Promotes engagement by showing module point rankings, motivating students to complete safety certifications.',
      icon: Trophy,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20'
    },
    {
      title: 'Fast Cloud Synchronization',
      desc: 'Automatic data sync logs user status changes in real-time. Full student and drill registry available for administrative analysis.',
      icon: Sparkles,
      color: 'text-teal-500',
      bgColor: 'bg-teal-500/10',
      borderColor: 'border-teal-500/20'
    }
  ];

  return (
    <section id="features" className="py-24 bg-slate-900 text-white relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-red-500">
            ▶ Platform Capabilities
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Everything needed for emergency preparedness
          </h2>
          <p className="mt-4 text-base text-slate-400">
            DPRES integrates educational tools, crisis evaluation systems, and mapping grids into a single, high-fidelity school response coordinator.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group relative rounded-2xl border border-slate-800 bg-slate-950 p-8 hover:border-slate-700 hover:bg-slate-950/80 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-red-500/5 hover:-translate-y-1"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bgColor} ${feature.color} mb-6 border ${feature.borderColor} group-hover:scale-110 transition-transform`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="mt-4 text-sm text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
