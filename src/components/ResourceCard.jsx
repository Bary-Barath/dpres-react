import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

export default function ResourceCard({ resource, isDark, cardBase, idx, onViewLocations }) {
  const Icon = resource.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: idx * 0.05 }}
      className={`p-4 rounded-2xl border text-center group cursor-pointer relative overflow-hidden ${cardBase}`}
      style={{
        boxShadow: isDark ? '0 2px 10px rgba(0,0,0,0.25)' : `0 2px 10px ${resource.color}15`
      }}
      onClick={() => onViewLocations(resource)}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      role="button"
      tabIndex={0}
      aria-label={`View locations for ${resource.name}. ${resource.count} units. Status: ${resource.status}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onViewLocations(resource); } }}
    >
      {/* Glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 1px ${resource.color}40, 0 0 20px ${resource.color}20` }}
        aria-hidden="true"
      />

      <div
        className="h-8 w-8 rounded-xl flex items-center justify-center mx-auto mb-2.5 transition-transform duration-200 group-hover:scale-110"
        style={{ background: `${resource.color}15` }}
        aria-hidden="true"
      >
        <Icon className="h-4 w-4" style={{ color: resource.color }} />
      </div>

      <div className="text-2xl font-extrabold" style={{ color: resource.color }}>{resource.count}</div>

      <div className={`text-[10px] font-medium mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        {resource.name}
      </div>

      <span
        className="text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1.5 inline-block"
        style={{ background: `${resource.color}12`, color: resource.color }}
      >
        {resource.status}
      </span>

      {/* View Locations button — appears on hover */}
      <div
        className="mt-2.5 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200"
        aria-hidden="true"
      >
        <MapPin className="h-3 w-3" style={{ color: resource.color }} />
        <span className="text-[10px] font-bold" style={{ color: resource.color }}>
          View Locations
        </span>
      </div>
    </motion.div>
  );
}
