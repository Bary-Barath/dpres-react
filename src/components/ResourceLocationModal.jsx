import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, MapPin, CheckCircle, AlertCircle, Wrench, Building2 } from 'lucide-react';
import { useThemeContext } from '../App';
import ResourceLocationList from './ResourceLocationList';

const STATUS_CONFIG = {
  Available: { icon: CheckCircle, color: '#10B981', label: 'Available' },
  Maintenance: { icon: Wrench, color: '#F59E0B', label: 'Maintenance' },
  Depleted: { icon: AlertCircle, color: '#EF4444', label: 'Depleted' }
};

export default function ResourceLocationModal({ resource, onClose }) {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const [query, setQuery] = useState('');
  const searchRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Focus trap
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;
    const focusable = modal.querySelectorAll(
      'button, input, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const trap = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      }
    };
    modal.addEventListener('keydown', trap);
    return () => modal.removeEventListener('keydown', trap);
  }, []);

  const filtered = useMemo(() => {
    if (!resource) return [];
    const q = query.toLowerCase();
    return resource.locations.filter(
      (loc) =>
        loc.building.toLowerCase().includes(q) ||
        loc.floor.toLowerCase().includes(q) ||
        loc.room.toLowerCase().includes(q) ||
        loc.description.toLowerCase().includes(q)
    );
  }, [resource, query]);

  const availableCount = resource?.locations.filter((l) => l.status === 'Available').length ?? 0;

  if (!resource) return null;

  const cardBg = isDark ? 'bg-[#0f172a] border-white/[0.08]' : 'bg-white border-slate-200';
  const overlayBg = isDark ? 'bg-[#080f1e]/90' : 'bg-slate-950/60';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className={`fixed inset-0 z-[70] flex items-center justify-center p-4 ${overlayBg} backdrop-blur-sm`}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="resource-modal-title"
      >
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          onClick={(e) => e.stopPropagation()}
          className={`w-full max-w-xl rounded-2xl border shadow-2xl flex flex-col max-h-[90vh] ${cardBg}`}
          style={{
            boxShadow: isDark
              ? `0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)`
              : `0 24px 64px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.04)`
          }}
        >
          {/* Header */}
          <div className={`flex-shrink-0 px-6 py-5 border-b ${isDark ? 'border-white/[0.07]' : 'border-slate-100'}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${resource.color}18`, boxShadow: `0 0 0 1px ${resource.color}30` }}
                  aria-hidden="true"
                >
                  <MapPin className="h-5 w-5" style={{ color: resource.color }} />
                </div>
                <div className="min-w-0">
                  <h2
                    id="resource-modal-title"
                    className={`text-base font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}
                  >
                    {resource.name}
                  </h2>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    <span className={`text-[11px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {resource.count} total units
                    </span>
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${resource.color}15`, color: resource.color }}
                    >
                      {resource.status}
                    </span>
                    <span className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      <span className="font-bold text-emerald-500">{availableCount}</span> available
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close location modal"
                className={`flex-shrink-0 rounded-xl p-2 transition-colors ${
                  isDark
                    ? 'text-slate-500 hover:text-white hover:bg-white/[0.07]'
                    : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Search */}
            <div className={`mt-4 flex items-center gap-2.5 rounded-xl px-3 py-2.5 border ${
              isDark ? 'bg-white/[0.04] border-white/[0.07]' : 'bg-slate-50 border-slate-200'
            }`}>
              <Search className={`h-4 w-4 flex-shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} aria-hidden="true" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search by building, floor, or room…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search locations"
                className={`flex-1 text-sm bg-transparent outline-none min-w-0 ${
                  isDark ? 'text-slate-200 placeholder-slate-600' : 'text-slate-700 placeholder-slate-400'
                }`}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className={`flex-shrink-0 rounded-lg p-0.5 transition-colors ${
                    isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Location list */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2.5" role="list" aria-label={`Locations for ${resource.name}`}>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Building2 className={`h-8 w-8 mb-3 ${isDark ? 'text-slate-700' : 'text-slate-300'}`} aria-hidden="true" />
                <p className={`text-sm font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {query ? 'No locations match your search' : 'No locations available'}
                </p>
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="mt-3 text-xs font-semibold text-blue-500 hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <ResourceLocationList locations={filtered} isDark={isDark} statusConfig={STATUS_CONFIG} />
            )}
          </div>

          {/* Footer */}
          <div className={`flex-shrink-0 px-6 py-3 border-t flex items-center justify-between ${
            isDark ? 'border-white/[0.07]' : 'border-slate-100'
          }`}>
            <span className={`text-[11px] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
              Showing <span className={`font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{filtered.length}</span> of {resource.locations.length} locations
            </span>
            <div className="flex items-center gap-3">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                const Icon = cfg.icon;
                return (
                  <span key={key} className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: cfg.color }}>
                    <Icon className="h-3 w-3" aria-hidden="true" /> {cfg.label}
                  </span>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
