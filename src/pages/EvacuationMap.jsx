import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, MapPin, ShieldAlert, Award, FileText, ChevronRight, Compass, Maximize2, ShieldCheck, Flame, HeartPulse, HelpCircle, ZoomIn, ZoomOut } from 'lucide-react';
import { CAMPUS_BUILDINGS, getFloorDetails, getRoomLabels, getRoomHazardDetails } from '../data/campusData';

export default function EvacuationMap() {
  const [bld, setBld] = useState(CAMPUS_BUILDINGS[0]); // Current building
  const [floor, setFloor] = useState(0); // Current floor (0 to 3)
  const [selectedRoom, setSelectedRoom] = useState(null); // Clicked room label
  const [activeLegend, setActiveLegend] = useState({ exit: true, ext: true, hazard: true, firstaid: true });
  const [zoomScale, setZoomScale] = useState(1);

  const toggleLegend = (type) => {
    setActiveLegend(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const handleBuildingChange = (b) => {
    setBld(b);
    setFloor(0);
    setSelectedRoom(null);
  };

  const handleFloorChange = (fIdx) => {
    if (fIdx >= bld.floors) return;
    setFloor(fIdx);
    setSelectedRoom(null);
  };

  const items = getFloorDetails(bld.id, floor);
  const rooms = getRoomLabels(bld.id, floor);
  
  // Coordinates for 6 rooms in a grid inside the blueprint map (width 800, height 500)
  // Grid layout coordinates for rooms:
  // Top row: Room 0, 1, 2
  // Bottom row: Room 3, 4, 5
  const roomLayouts = [
    { x: 50, y: 50, w: 220, h: 140 },
    { x: 290, y: 50, w: 220, h: 140 },
    { x: 530, y: 50, w: 220, h: 140 },
    { x: 50, y: 270, w: 220, h: 140 },
    { x: 290, y: 270, w: 220, h: 140 },
    { x: 530, y: 270, w: 220, h: 140 }
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-stretch max-w-7xl mx-auto text-white">
      {/* Building Sidebar */}
      <div className="xl:col-span-1 space-y-4">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-red-500">▶ Campus Layouts</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 mt-1 font-sans">Evacuation Map</h1>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 backdrop-blur-sm space-y-2.5">
          {CAMPUS_BUILDINGS.map((b) => (
            <button
              key={b.id}
              onClick={() => handleBuildingChange(b)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                bld.id === b.id
                  ? 'bg-red-500/10 border-red-500 text-red-400 font-bold'
                  : 'bg-slate-950/20 border-slate-800 hover:border-slate-700/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div>
                <h4 className="text-sm font-bold truncate">{b.label}</h4>
                <span className="text-[10px] text-slate-500 font-medium block mt-0.5">{b.sub}</span>
              </div>
              <ChevronRight className={`h-4 w-4 transition-transform ${bld.id === b.id ? 'translate-x-0.5 text-red-400' : 'text-slate-600 group-hover:text-slate-400'}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Canvas */}
      <div className="xl:col-span-3 space-y-6 flex flex-col justify-between">
        {/* Top controls: Floor selection */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
            {Array.from({ length: bld.floors }).map((_, fIdx) => (
              <button
                key={fIdx}
                onClick={() => handleFloorChange(fIdx)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                  floor === fIdx
                    ? 'bg-red-600 text-white shadow-md shadow-red-500/10'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {fIdx === 0 ? 'G' : `${fIdx}F`}
              </button>
            ))}
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoomScale(Math.max(0.75, zoomScale - 0.25))}
              className="p-2 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white focus:outline-none"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="font-mono text-xs text-slate-500 px-1 font-bold">{Math.round(zoomScale * 100)}%</span>
            <button
              onClick={() => setZoomScale(Math.min(1.75, zoomScale + 0.25))}
              className="p-2 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white focus:outline-none"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Blueprint display */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* SVG Map container */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-800/80 bg-slate-950 p-4 relative overflow-hidden min-h-[380px] flex items-center justify-center">
            <motion.div
              animate={{ scale: zoomScale }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-full h-full flex items-center justify-center"
            >
              <svg viewBox="0 0 800 500" className="w-full max-h-[380px]">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.01)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Building Main Hallway/Corridor */}
                <rect x="40" y="210" width="720" height="40" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="4 4" className="pointer-events-none" />

                {/* Render Rooms */}
                {roomLayouts.map((r, idx) => {
                  const label = rooms[idx] || `Room ${idx + 1}`;
                  const isSelected = selectedRoom === label;
                  const profile = getRoomHazardDetails(label);

                  return (
                    <g
                      key={idx}
                      className="cursor-pointer group"
                      onClick={() => setSelectedRoom(label)}
                    >
                      <rect
                        x={r.x}
                        y={r.y}
                        width={r.w}
                        height={r.h}
                        rx="8"
                        fill={isSelected ? `${profile.bg}` : 'rgba(30, 41, 59, 0.4)'}
                        stroke={isSelected ? profile.color : '#334155'}
                        strokeWidth={isSelected ? '2.5' : '1.5'}
                        className="transition-all duration-200 group-hover:fill-slate-800/30 group-hover:stroke-slate-500"
                      />
                      <text
                        x={r.x + r.w / 2}
                        y={r.y + r.h / 2}
                        textAnchor="middle"
                        fill={isSelected ? '#ffffff' : '#cbd5e1'}
                        fontSize="12"
                        fontWeight="bold"
                        className="select-none pointer-events-none transition-colors"
                      >
                        {label}
                      </text>
                      <text
                        x={r.x + r.w / 2}
                        y={r.y + r.h / 2 + 18}
                        textAnchor="middle"
                        fill={profile.textColor.split(' ')[0]} // extract tailwind color class prefix
                        fontSize="8"
                        fontWeight="extrabold"
                        letterSpacing="1"
                        className="select-none pointer-events-none uppercase opacity-80"
                      >
                        {profile.status}
                      </text>
                    </g>
                  );
                })}

                {/* Legend item markers */}
                {activeLegend.exit && items.filter(i => i.type === 'exit').map((item, idx) => (
                  <g key={`exit-${idx}`} className="animate-pulse">
                    <rect x={item.x - 25} y={item.y - 12} width="50" height="24" rx="4" fill="#10b981" />
                    <text x={item.x} y={item.y + 4} textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="extrabold">{item.label}</text>
                  </g>
                ))}

                {activeLegend.ext && items.filter(i => i.type === 'ext').map((item, idx) => (
                  <g key={`ext-${idx}`}>
                    <circle cx={item.x} cy={item.y} r="16" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                    <Flame className="h-4 w-4 text-white" style={{ transform: `translate(${item.x - 8}px, ${item.y - 8}px)` }} />
                  </g>
                ))}

                {activeLegend.firstaid && items.filter(i => i.type === 'firstaid').map((item, idx) => (
                  <g key={`fa-${idx}`}>
                    <circle cx={item.x} cy={item.y} r="16" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                    <HeartPulse className="h-4 w-4 text-white" style={{ transform: `translate(${item.x - 8}px, ${item.y - 8}px)` }} />
                  </g>
                ))}

                {activeLegend.hazard && items.filter(i => i.type === 'hazard').map((item, idx) => (
                  <g key={`hazard-${idx}`} className="animate-pulse">
                    <polygon points={`${item.x},${item.y-18} ${item.x-18},${item.y+14} ${item.x+18},${item.y+14}`} fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
                    <text x={item.x} y={item.y + 10} textAnchor="middle" fill="#000000" fontSize="9" fontWeight="black">!</text>
                  </g>
                ))}
              </svg>
            </motion.div>

            <div className="absolute bottom-4 left-4 bg-slate-900/80 border border-slate-800 rounded-full px-3 py-1 text-[9px] font-bold tracking-widest text-slate-500 uppercase flex items-center gap-1.5 font-mono">
              <Compass className="h-3.5 w-3.5 text-red-500 animate-spin" style={{ animationDuration: '6s' }} /> NORTH COMPASS ACTIVE
            </div>
          </div>

          {/* Right side Detail panel / Legend switches */}
          <div className="space-y-6 flex flex-col justify-between">
            {/* Interactive Room Details */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-sm flex-1 flex flex-col justify-between min-h-[220px]">
              <AnimatePresence mode="wait">
                {selectedRoom ? (
                  <motion.div
                    key={selectedRoom}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-4"
                  >
                    <div>
                      <span className="font-mono text-[9px] font-extrabold tracking-widest text-slate-500 uppercase">Room Profile</span>
                      <h4 className="text-lg font-extrabold text-slate-100 mt-0.5">{selectedRoom}</h4>
                    </div>

                    {/* Hazard Category Badge */}
                    <div>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-extrabold tracking-wider border uppercase ${
                        getRoomHazardDetails(selectedRoom).textColor
                      }`}>
                        {getRoomHazardDetails(selectedRoom).status}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Identified Hazards</span>
                        <ul className="mt-1 space-y-1 list-disc list-inside text-xs text-slate-400">
                          {getRoomRoomHazards(selectedRoom).map((hz, idx) => (
                            <li key={idx} className="truncate">{hz}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Emergency Equipment</span>
                        <ul className="mt-1 space-y-1 list-disc list-inside text-xs text-slate-400">
                          {getRoomSafetyEq(selectedRoom).map((eq, idx) => (
                            <li key={idx} className="truncate">{eq}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="my-auto text-center space-y-2">
                    <Info className="h-8 w-8 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-500 font-bold">Select any room on the blueprint to review hazards & equipment profile.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Legend Toggles */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-sm space-y-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500 block">▶ Safety Overlay Layers</span>
              
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'exit', label: 'Stairs / Exits', color: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' },
                  { key: 'ext', label: 'Extinguisher', color: 'border-red-500/20 bg-red-500/10 text-red-400' },
                  { key: 'firstaid', label: 'First Aid Kit', color: 'border-green-500/20 bg-green-500/10 text-green-400' },
                  { key: 'hazard', label: 'Hazard Zone', color: 'border-amber-500/20 bg-amber-500/10 text-amber-400' }
                ].map((leg) => {
                  const active = activeLegend[leg.key];
                  return (
                    <button
                      key={leg.key}
                      onClick={() => toggleLegend(leg.key)}
                      className={`px-3 py-2 rounded-xl text-center text-xs font-bold border transition-all ${
                        active
                          ? `${leg.color} font-extrabold border`
                          : 'bg-slate-950/20 border-slate-800/80 text-slate-600'
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

// Helpers for detail strings
function getRoomRoomHazards(label) {
  return getRoomHazardDetails(label).hazards;
}

function getRoomSafetyEq(label) {
  return getRoomHazardDetails(label).eq;
}
