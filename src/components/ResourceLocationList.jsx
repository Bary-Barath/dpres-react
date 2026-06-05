import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Layers } from 'lucide-react';

export default function ResourceLocationList({ locations, isDark, statusConfig }) {
  return locations.map((loc, idx) => {
    const StatusCfg = statusConfig[loc.status] ?? statusConfig.Available;
    const StatusIcon = StatusCfg.icon;

    return (
      <motion.div
        key={loc.id}
        role="listitem"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.035, duration: 0.18 }}
        className={`rounded-xl px-4 py-3.5 border flex items-start gap-3 ${
          isDark ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06]' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
        } transition-colors`}
      >
        <div className="flex-shrink-0 mt-0.5">
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center"
            style={{ background: `${StatusCfg.color}15` }}
            aria-hidden="true"
          >
            <Building2 className="h-3.5 w-3.5" style={{ color: StatusCfg.color }} />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {loc.room}
            </p>
            <span
              className="flex-shrink-0 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: `${StatusCfg.color}15`, color: StatusCfg.color }}
              aria-label={`Status: ${loc.status}`}
            >
              <StatusIcon className="h-2.5 w-2.5" aria-hidden="true" />
              {StatusCfg.label}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`flex items-center gap-1 text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <Building2 className="h-3 w-3" aria-hidden="true" />
              {loc.building}
            </span>
            <span className={`text-[11px] ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>•</span>
            <span className={`flex items-center gap-1 text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <Layers className="h-3 w-3" aria-hidden="true" />
              {loc.floor}
            </span>
          </div>

          {loc.description && (
            <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {loc.description}
            </p>
          )}
        </div>
      </motion.div>
    );
  });
}
