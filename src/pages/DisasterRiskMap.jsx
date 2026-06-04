import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Info, X, Navigation, Shield, ExternalLink } from 'lucide-react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useThemeContext } from '../App';
import { DISASTER_ZONES, MAP_CENTER, MAP_ZOOM, LEGEND_ITEMS, PREVENTION_TIPS } from '../data/disasterZones';

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

const ZONE_STYLES = {
  flood: { color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.2, weight: 2, dashArray: '5, 8' },
  cyclone: { color: '#f97316', fillColor: '#f97316', fillOpacity: 0.2, weight: 2, dashArray: '5, 8' },
  earthquake: { color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.2, weight: 2, dashArray: '5, 8' },
  tsunami: { color: '#a855f7', fillColor: '#a855f7', fillOpacity: 0.2, weight: 2, dashArray: '5, 8' }
};

const MARKER_TYPES = {
  flood: { emoji: '💧', label: 'Flood Zone' },
  cyclone: { emoji: '🌀', label: 'Cyclone Zone' },
  earthquake: { emoji: '🌋', label: 'Earthquake Zone' },
  tsunami: { emoji: '🌊', label: 'Tsunami Zone' }
};

const RISK_COLORS = { Extreme: '#ef4444', Critical: '#f97316', High: '#eab308', Moderate: '#3b82f6' };

function MapController({ activeType }) {
  const map = useMap();
  useEffect(() => {
    if (activeType) {
      const zones = DISASTER_ZONES[activeType];
      if (zones && zones.length > 0) {
        const bounds = L.latLngBounds(zones.map(z => [z.lat, z.lng]));
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 7 });
      }
    } else {
      map.setView(MAP_CENTER, MAP_ZOOM);
    }
  }, [activeType, map]);
  return null;
}

function CustomMarker({ zone, type }) {
  const colors = { flood: '#3b82f6', cyclone: '#f97316', earthquake: '#ef4444', tsunami: '#a855f7' };
  const color = colors[type];
  const markerInfo = MARKER_TYPES[type];

  const icon = L.divIcon({
    className: 'custom-marker-icon',
    html: `<div style="
      width: 36px; height: 36px; border-radius: 50%;
      background: ${color}; color: white;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; box-shadow: 0 2px 8px ${color}80;
      border: 3px solid white; cursor: pointer;
    ">${markerInfo.emoji}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20]
  });

  return (
    <Marker position={[zone.lat, zone.lng]} icon={icon}>
      <Popup>
        <div style={{ minWidth: '220px', fontFamily: 'system-ui, sans-serif' }}>
          <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700, color }}>
            {markerInfo.label}
          </h3>
          <h4 style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: 600 }}>{zone.name}</h4>
          <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>{zone.desc}</p>
          <div style={{
            display: 'inline-block', padding: '2px 10px', borderRadius: '999px',
            fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
            background: `${RISK_COLORS[zone.risk]}20`, color: RISK_COLORS[zone.risk],
            border: `1px solid ${RISK_COLORS[zone.risk]}40`
          }}>Risk: {zone.risk}</div>
        </div>
      </Popup>
    </Marker>
  );
}

export default function DisasterRiskMap() {
  const { theme } = useThemeContext();
  const [activeType, setActiveType] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [showTips, setShowTips] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => { setReady(true); }, []);

  const tileUrl = theme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const tileAttribution = theme === 'dark'
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

  const toggleFilter = useCallback((type) => {
    setActiveType(prev => prev === type ? null : type);
    setSelectedZone(null);
  }, []);

  const totalZones = Object.values(DISASTER_ZONES).flat().length;
  const activeTips = activeType ? PREVENTION_TIPS[activeType] : null;

  if (!ready) {
    return <div className="min-h-[400px] flex items-center justify-center text-slate-600 dark:text-slate-500">Loading map...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-red-400">▶ Interactive Risk Assessment</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1 flex items-center gap-3">
          <MapPin className="h-8 w-8 text-red-500" />
          Disaster Risk Map
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
          Explore disaster-prone regions across India. Click markers to view risk details and prevention guidelines.
        </p>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-3">
        {LEGEND_ITEMS.map(item => {
          const isActive = activeType === item.type;
          const count = DISASTER_ZONES[item.type].length;
          return (
            <button
              key={item.type}
              onClick={() => toggleFilter(item.type)}
              className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                isActive
                  ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white shadow-lg'
                  : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 shadow-sm'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                isActive ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-500'
              }`}>
                {count}
              </span>
              {isActive && (
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white dark:border-slate-900" />
              )}
            </button>
          );
        })}
        <button
          onClick={() => setShowTips(prev => !prev)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${
            showTips
              ? 'bg-emerald-900/30 border-emerald-700 text-emerald-400'
              : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
          }`}
        >
          <Shield className="h-4 w-4" />
          Prevention Tips
        </button>
      </div>

      {/* Prevention Tips Panel */}
      <AnimatePresence>
        {showTips && activeTips && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-xl premium-card border border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-400" />
                Prevention Tips — {activeType.charAt(0).toUpperCase() + activeType.slice(1)}
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <span className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold">
                      {i + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
        {showTips && !activeTips && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="premium-card p-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Click a disaster category above to view relevant prevention tips.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map */}
      <div className="rounded-2xl overflow-hidden border-slate-200 dark:border-slate-800 shadow-2xl relative">
        <MapContainer
          center={MAP_CENTER}
          zoom={MAP_ZOOM}
          style={{ height: '550px', width: '100%' }}
          zoomControl={false}
          className="z-0"
        >
          <TileLayer
            attribution={tileAttribution}
            url={tileUrl}
          />
          <MapController activeType={activeType} />

          {Object.entries(DISASTER_ZONES).map(([type, zones]) => {
            if (activeType && activeType !== type) return null;
            return zones.map(zone => (
              <React.Fragment key={zone.id}>
                <Circle
                  center={[zone.lat, zone.lng]}
                  pathOptions={ZONE_STYLES[type]}
                  radius={zone.radius}
                  eventHandlers={{
                    click: () => setSelectedZone({ ...zone, type }),
                    mouseover: (e) => {
                      const target = e.target;
                      target.setStyle({ fillOpacity: 0.35, weight: 3 });
                    },
                    mouseout: (e) => {
                      const target = e.target;
                      target.setStyle({ fillOpacity: 0.2, weight: 2 });
                    }
                  }}
                />
                <CustomMarker zone={zone} type={type} />
              </React.Fragment>
            ));
          })}
        </MapContainer>

        {/* Bottom legend overlay */}
        <div className="absolute bottom-4 left-4 right-4 z-[1000] flex flex-wrap gap-2 pointer-events-none">
          <div className="bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm rounded-xl border-slate-200 dark:border-slate-800 p-3 pointer-events-auto">
            <div className="flex flex-wrap items-center gap-3">
              {LEGEND_ITEMS.map(item => (
                <div key={item.type} className="flex items-center gap-1.5 text-xs">
                  <span className="text-base">{item.icon}</span>
                  <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                </div>
              ))}
              <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
              <span className="text-[10px] text-slate-600 dark:text-slate-500">{totalZones} risk zones mapped</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Zone Info Panel */}
      <AnimatePresence>
        {selectedZone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="premium-card p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{MARKER_TYPES[selectedZone.type]?.emoji}</span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedZone.name}</h3>
                  <span className="text-xs text-slate-600 dark:text-slate-400">{MARKER_TYPES[selectedZone.type]?.label}</span>
                </div>
              </div>
              <button onClick={() => setSelectedZone(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">{selectedZone.desc}</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{
                background: `${RISK_COLORS[selectedZone.risk]}20`,
                color: RISK_COLORS[selectedZone.risk],
                border: `1px solid ${RISK_COLORS[selectedZone.risk]}40`
              }}
            >
              Risk Level: {selectedZone.risk}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
