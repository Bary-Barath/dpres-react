import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Info, ChevronRight, Compass, Flame, HeartPulse, ZoomIn, ZoomOut } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { CAMPUS_BUILDINGS, getFloorDetails, getRoomLabels, getRoomHazardDetails } from '../data/campusData';
import { useThemeContext } from '../App';

export default function EvacuationMap() {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';

  const [bld, setBld] = useState(CAMPUS_BUILDINGS[0]);
  const [floor, setFloor] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [activeLegend, setActiveLegend] = useState({ exit: true, ext: true, hazard: true, firstaid: true });
  const [zoomScale, setZoomScale] = useState(1);

  const toggleLegend = (type) => setActiveLegend(prev => ({ ...prev, [type]: !prev[type] }));
  const handleBuildingChange = (b) => { setBld(b); setFloor(0); setSelectedRoom(null); };
  const handleFloorChange = (fIdx) => { if (fIdx >= bld.floors) return; setFloor(fIdx); setSelectedRoom(null); };

  const items = getFloorDetails(bld.id, floor);
  const rooms = getRoomLabels(bld.id, floor);

  const roomLayouts = [
    { x: 50, y: 50, w: 220, h: 140 },
    { x: 290, y: 50, w: 220, h: 140 },
    { x: 530, y: 50, w: 220, h: 140 },
    { x: 50, y: 270, w: 220, h: 140 },
    { x: 290, y: 270, w: 220, h: 140 },
    { x: 530, y: 270, w: 220, h: 140 }
  ];

  const card = isDark
    ? 'bg-[#0f172a] border border-white/[0.06]'
    : 'bg-white border border-slate-100';
  const cardShadow = isDark
    ? { boxShadow: '0 4px 24px rgba(0,0,0,0.35)' }
    : { boxShadow: '0 4px 24px rgba(0,0,0,0.06)' };

  return (
    <div className={`grid grid-cols-1 xl:grid-cols-4 gap-5 items-stretch max-w-7xl mx-auto ${isDark ? 'text-white' : 'text-slate-900'}`}>
      {/* ── Building Sidebar ── */}
      <div className="xl:col-span-1 space-y-4">
        <div>
          <span className="section-label">Campus Layouts</span>
          <h1 className={`text-2xl font-extrabold tracking-tight mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Evacuation Map</h1>
        </div>

        <div className={`rounded-2xl p-3 space-y-2 ${card}`} style={cardShadow}>
          {CAMPUS_BUILDINGS.map((b) => (
            <button
              key={b.id}
              onClick={() => handleBuildingChange(b)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                bld.id === b.id
                  ? isDark
                    ? 'bg-blue-500/10 border-blue-500/40 text-blue-400'
                    : 'border-transparent text-white'
                  : isDark
                    ? 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-white/[0.12] hover:text-white'
                    : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:text-slate-800 shadow-sm'
              }`}
              style={bld.id === b.id && !isDark ? {
                background: 'linear-gradient(90deg, #2563EB, #3B82F6)',
                boxShadow: '0 4px 14px rgba(37,99,235,0.3)'
              } : {}}
            >
              <div>
                <h4 className="text-sm font-bold truncate">{b.label}</h4>
                <span className={`text-[10px] font-medium block mt-0.5 ${
                  bld.id === b.id
                    ? isDark ? 'text-blue-300/60' : 'text-white/70'
                    : isDark ? 'text-slate-600' : 'text-slate-400'
                }`}>{b.sub}</span>
              </div>
              <ChevronRight className={`h-4 w-4 transition-transform flex-shrink-0 ${
                bld.id === b.id
                  ? isDark ? 'text-blue-400 translate-x-0.5' : 'text-white/70'
                  : isDark ? 'text-slate-700 group-hover:text-slate-400' : 'text-slate-300 group-hover:text-slate-500'
              }`} />
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Map Area ── */}
      <div className="xl:col-span-3 space-y-5 flex flex-col">
        {/* Floor + Zoom Controls */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b ${isDark ? 'border-white/[0.06]' : 'border-slate-100'}`}>
          <div className={`flex p-1 rounded-xl ${isDark ? 'bg-slate-900 border border-white/[0.06]' : 'bg-slate-100 border border-slate-200'}`}>
            {Array.from({ length: bld.floors }).map((_, fIdx) => (
              <button
                key={fIdx}
                onClick={() => handleFloorChange(fIdx)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                  floor === fIdx
                    ? isDark
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-white text-blue-600 shadow-sm'
                    : isDark ? 'text-slate-500 hover:text-white' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {fIdx === 0 ? 'G' : `${fIdx}F`}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoomScale(Math.max(0.75, zoomScale - 0.25))}
              className={`p-2 rounded-lg border transition-all ${isDark ? 'border-white/[0.08] bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700 shadow-sm'}`}
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className={`font-mono text-xs px-1 font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{Math.round(zoomScale * 100)}%</span>
            <button
              onClick={() => setZoomScale(Math.min(1.75, zoomScale + 0.25))}
              className={`p-2 rounded-lg border transition-all ${isDark ? 'border-white/[0.08] bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700 shadow-sm'}`}
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Blueprint + Right Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch flex-1">
          {/* SVG Blueprint */}
          <div
            className={`lg:col-span-2 rounded-2xl overflow-hidden relative flex items-center justify-center min-h-[360px] ${card}`}
            style={{ ...cardShadow, background: isDark ? '#020617' : '#F8FAFC' }}
          >
            <motion.div
              animate={{ scale: zoomScale }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-full h-full flex items-center justify-center p-4"
            >
              <svg viewBox="0 0 800 500" className="w-full max-h-[360px]">
                <defs>
                  <pattern id="evacGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                    <path d="M 24 0 L 0 0 0 24" fill="none"
                      stroke={isDark ? 'rgba(255,255,255,0.025)' : 'rgba(37,99,235,0.06)'}
                      strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#evacGrid)" />
                {/* Corridor */}
                <rect x="40" y="210" width="720" height="40"
                  fill={isDark ? 'rgba(255,255,255,0.02)' : 'rgba(37,99,235,0.04)'}
                  stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(37,99,235,0.12)'}
                  strokeDasharray="6 4" className="pointer-events-none" />

                {roomLayouts.map((r, idx) => {
                  const label = rooms[idx] || `Room ${idx + 1}`;
                  const isSelected = selectedRoom === label;
                  const profile = getRoomHazardDetails(label);
                  return (
                    <g key={idx} className="cursor-pointer group" onClick={() => setSelectedRoom(label)}>
                      <rect
                        x={r.x} y={r.y} width={r.w} height={r.h} rx="10"
                        fill={isSelected
                          ? isDark ? `${profile.bg}` : `${profile.bg}`
                          : isDark ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.9)'}
                        stroke={isSelected ? profile.color : isDark ? '#334155' : '#CBD5E1'}
                        strokeWidth={isSelected ? '2.5' : '1.5'}
                        style={{ transition: 'all 0.2s' }}
                      />
                      <text x={r.x + r.w / 2} y={r.y + r.h / 2}
                        textAnchor="middle"
                        fill={isSelected ? '#ffffff' : isDark ? '#94a3b8' : '#475569'}
                        fontSize="12" fontWeight="bold" className="select-none pointer-events-none">
                        {label}
                      </text>
                      <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 18}
                        textAnchor="middle"
                        fill={profile.color || '#64748b'}
                        fontSize="8" fontWeight="800" letterSpacing="1"
                        className="select-none pointer-events-none uppercase opacity-80">
                        {profile.status}
                      </text>
                    </g>
                  );
                })}

                {activeLegend.exit && items.filter(i => i.type === 'exit').map((item, idx) => (
                  <g key={`exit-${idx}`} className="animate-pulse">
                    <rect x={item.x - 25} y={item.y - 12} width="50" height="24" rx="6" fill="#10b981" />
                    <text x={item.x} y={item.y + 4} textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="800">{item.label}</text>
                  </g>
                ))}
                {activeLegend.ext && items.filter(i => i.type === 'ext').map((item, idx) => (
                  <g key={`ext-${idx}`}>
                    <circle cx={item.x} cy={item.y} r="16" fill="#ef4444" stroke="white" strokeWidth="2" />
                    <text x={item.x} y={item.y + 5} textAnchor="middle" fill="white" fontSize="14">🔥</text>
                  </g>
                ))}
                {activeLegend.firstaid && items.filter(i => i.type === 'firstaid').map((item, idx) => (
                  <g key={`fa-${idx}`}>
                    <circle cx={item.x} cy={item.y} r="16" fill="#10b981" stroke="white" strokeWidth="2" />
                    <text x={item.x} y={item.y + 5} textAnchor="middle" fill="white" fontSize="14">➕</text>
                  </g>
                ))}
                {activeLegend.hazard && items.filter(i => i.type === 'hazard').map((item, idx) => (
                  <g key={`hazard-${idx}`} className="animate-pulse">
                    <polygon points={`${item.x},${item.y - 18} ${item.x - 18},${item.y + 14} ${item.x + 18},${item.y + 14}`} fill="#f59e0b" stroke="white" strokeWidth="1.5" />
                    <text x={item.x} y={item.y + 10} textAnchor="middle" fill="#000" fontSize="9" fontWeight="900">!</text>
                  </g>
                ))}
              </svg>
            </motion.div>

            <div className={`absolute bottom-4 left-4 flex gap-1.5 items-center rounded-full px-3 py-1.5 text-[9px] font-bold tracking-widest uppercase font-mono ${
              isDark ? 'bg-slate-900/90 border border-white/[0.08] text-slate-500' : 'bg-white border border-slate-200 text-slate-400 shadow-sm'
            }`}>
              <Compass className="h-3.5 w-3.5 text-blue-500 animate-spin" style={{ animationDuration: '8s' }} /> North Active
            </div>
          </div>

          {/* Right Panel: Room Info + Legend */}
          <div className="space-y-4 flex flex-col">
            {/* Room Info */}
            <div className={`rounded-2xl p-5 flex-1 flex flex-col justify-between min-h-[200px] ${card}`} style={cardShadow}>
              <AnimatePresence mode="wait">
                {selectedRoom ? (
                  <motion.div key={selectedRoom} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="space-y-3">
                    <div>
                      <span className={`text-[9px] font-bold tracking-widest uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Room Profile</span>
                      <h4 className={`text-base font-extrabold mt-0.5 ${isDark ? 'text-white' : 'text-slate-800'}`}>{selectedRoom}</h4>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider border ${
                      getRoomHazardDetails(selectedRoom).textColor
                    }`}>
                      {getRoomHazardDetails(selectedRoom).status}
                    </span>
                    <div className="space-y-2.5">
                      <div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Identified Hazards</span>
                        <ul className="space-y-1">
                          {getRoomHazardDetails(selectedRoom).hazards?.map((hz, i) => (
                            <li key={i} className={`text-xs flex items-start gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                              <span className="text-amber-500 mt-0.5">•</span>{hz}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Emergency Equipment</span>
                        <ul className="space-y-1">
                          {getRoomHazardDetails(selectedRoom).eq?.map((eq, i) => (
                            <li key={i} className={`text-xs flex items-start gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                              <span className="text-emerald-500 mt-0.5">✓</span>{eq}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="my-auto text-center space-y-2">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mx-auto ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                      <Info className={`h-6 w-6 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                    </div>
                    <p className={`text-xs font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      Select any room to view its hazards &amp; equipment profile.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Legend Toggles */}
            <div className={`rounded-2xl p-4 ${card}`} style={cardShadow}>
              <span className={`text-[10px] font-bold uppercase tracking-wider block mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Safety Overlay Layers</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'exit', label: 'Stairs / Exits', color: '#10b981', activeCls: 'bg-emerald-50 border-emerald-200 text-emerald-700', darkActiveCls: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' },
                  { key: 'ext', label: 'Extinguisher', color: '#ef4444', activeCls: 'bg-red-50 border-red-200 text-red-700', darkActiveCls: 'bg-red-500/10 border-red-500/30 text-red-400' },
                  { key: 'firstaid', label: 'First Aid', color: '#10b981', activeCls: 'bg-green-50 border-green-200 text-green-700', darkActiveCls: 'bg-green-500/10 border-green-500/30 text-green-400' },
                  { key: 'hazard', label: 'Hazard Zone', color: '#f59e0b', activeCls: 'bg-amber-50 border-amber-200 text-amber-700', darkActiveCls: 'bg-amber-500/10 border-amber-500/30 text-amber-400' }
                ].map((leg) => {
                  const active = activeLegend[leg.key];
                  return (
                    <button
                      key={leg.key}
                      onClick={() => toggleLegend(leg.key)}
                      className={`px-3 py-2.5 rounded-xl text-center text-[11px] font-bold border transition-all ${
                        active
                          ? isDark ? leg.darkActiveCls : leg.activeCls
                          : isDark ? 'bg-white/[0.03] border-white/[0.06] text-slate-600' : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      {leg.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
