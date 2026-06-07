/**
 * drillService.js
 * Central service for real-time drill broadcast, participation tracking,
 * and cross-tab synchronisation via BroadcastChannel + localStorage.
 */

const DRILLS_KEY        = 'dpres_drills';
const PARTICIPATION_KEY = 'dpres_drill_participation';
const ACTIVE_DRILL_KEY  = 'dpres_active_drill';
const CHANNEL_NAME      = 'dpres-drills';

// ─── Helpers ────────────────────────────────────────────────────────────────

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_) {
    return fallback;
  }
}

function save(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch (_) {}
}

function broadcast(type, payload) {
  try {
    const ch = new BroadcastChannel(CHANNEL_NAME);
    ch.postMessage({ type, payload, ts: Date.now() });
    ch.close();
  } catch (_) {
    // BroadcastChannel not available — fall back to storage event
  }
  window.dispatchEvent(new CustomEvent('dpres_drill_update', { detail: { type, payload } }));
}

// ─── Drill CRUD ─────────────────────────────────────────────────────────────

export function getDrills() {
  return load(DRILLS_KEY, []);
}

export function saveDrills(drills) {
  save(DRILLS_KEY, drills);
}

/**
 * Create and immediately BROADCAST a drill to all student tabs.
 * Returns the new drill object.
 */
export function broadcastDrill({ title, type, scenario, instructions, severity, duration }) {
  const drill = {
    id:           'd-' + Date.now(),
    title:        title.trim(),
    type:         type.toLowerCase(),
    scenario:     scenario || '',
    instructions: instructions || getDefaultInstructions(type),
    severity:     severity || 'Medium',
    duration:     duration || 5,
    timestamp:    Date.now(),
    status:       'Active',
    broadcastAt:  Date.now(),
    endsAt:       Date.now() + (duration || 5) * 60 * 1000,
  };

  const drills = [drill, ...getDrills()];
  saveDrills(drills);
  save(ACTIVE_DRILL_KEY, drill);
  broadcast('DRILL_BROADCAST', drill);
  return drill;
}

/**
 * Log a drill as completed (Completed status, not broadcast).
 */
export function logDrill({ title, type }) {
  const drill = {
    id:        'd-' + Date.now(),
    title:     title.trim(),
    type:      type.toLowerCase(),
    scenario:  '',
    instructions: getDefaultInstructions(type),
    severity:  'Low',
    duration:  0,
    timestamp: Date.now(),
    status:    'Completed',
  };
  const drills = [drill, ...getDrills()];
  saveDrills(drills);
  broadcast('DRILL_LOGGED', drill);
  return drill;
}

export function completeDrill(drillId) {
  const drills = getDrills().map(d =>
    d.id === drillId ? { ...d, status: 'Completed', completedAt: Date.now() } : d
  );
  saveDrills(drills);
  const active = load(ACTIVE_DRILL_KEY, null);
  if (active?.id === drillId) save(ACTIVE_DRILL_KEY, null);
  broadcast('DRILL_COMPLETED', { drillId });
}

export function cancelDrill(drillId) {
  const drills = getDrills().map(d =>
    d.id === drillId ? { ...d, status: 'Cancelled' } : d
  );
  saveDrills(drills);
  const active = load(ACTIVE_DRILL_KEY, null);
  if (active?.id === drillId) save(ACTIVE_DRILL_KEY, null);
  broadcast('DRILL_CANCELLED', { drillId });
}

export function deleteDrill(drillId) {
  const drills = getDrills().filter(d => d.id !== drillId);
  saveDrills(drills);
  broadcast('DRILL_DELETED', { drillId });
}

export function getActiveDrill() {
  const stored = load(ACTIVE_DRILL_KEY, null);
  if (!stored) return null;
  // Auto-expire if past endsAt
  if (stored.endsAt && Date.now() > stored.endsAt) {
    save(ACTIVE_DRILL_KEY, null);
    return null;
  }
  // Also verify it's still Active in the drills list
  const drill = getDrills().find(d => d.id === stored.id);
  if (!drill || drill.status !== 'Active') {
    save(ACTIVE_DRILL_KEY, null);
    return null;
  }
  return stored;
}

// ─── Participation ────────────────────────────────────────────────────────────

export function getParticipation() {
  return load(PARTICIPATION_KEY, []);
}

export function acknowledge(drillId, studentId) {
  const list = getParticipation();
  const existing = list.find(p => p.drillId === drillId && p.studentId === studentId);
  if (existing) {
    if (existing.status === 'acknowledged' || existing.status === 'completed') return existing;
    const updated = list.map(p =>
      p.drillId === drillId && p.studentId === studentId
        ? { ...p, status: 'acknowledged', acknowledgedAt: Date.now() }
        : p
    );
    save(PARTICIPATION_KEY, updated);
    broadcast('PARTICIPATION_UPDATE', { drillId, studentId, status: 'acknowledged' });
    return updated.find(p => p.drillId === drillId && p.studentId === studentId);
  }
  const entry = {
    id:             'par-' + Date.now(),
    drillId,
    studentId,
    status:         'acknowledged',
    joinedAt:       Date.now(),
    acknowledgedAt: Date.now(),
    completedAt:    null,
  };
  save(PARTICIPATION_KEY, [...list, entry]);
  broadcast('PARTICIPATION_UPDATE', { drillId, studentId, status: 'acknowledged' });
  return entry;
}

export function completedParticipation(drillId, studentId) {
  const list = getParticipation();
  const existing = list.find(p => p.drillId === drillId && p.studentId === studentId);
  if (existing) {
    const updated = list.map(p =>
      p.drillId === drillId && p.studentId === studentId
        ? { ...p, status: 'completed', completedAt: Date.now() }
        : p
    );
    save(PARTICIPATION_KEY, updated);
    broadcast('PARTICIPATION_UPDATE', { drillId, studentId, status: 'completed' });
  } else {
    const entry = {
      id:          'par-' + Date.now(),
      drillId,
      studentId,
      status:      'completed',
      joinedAt:    Date.now(),
      acknowledgedAt: Date.now(),
      completedAt: Date.now(),
    };
    save(PARTICIPATION_KEY, [...list, entry]);
    broadcast('PARTICIPATION_UPDATE', { drillId, studentId, status: 'completed' });
  }
}

export function getParticipationForDrill(drillId) {
  return getParticipation().filter(p => p.drillId === drillId);
}

export function getStudentParticipation(studentId) {
  return getParticipation().filter(p => p.studentId === studentId);
}

// ─── Subscription ─────────────────────────────────────────────────────────────

/**
 * Subscribe to drill updates.
 * Returns an unsubscribe function.
 */
export function subscribe(callback) {
  let channel = null;
  try {
    channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (e) => callback(e.data);
  } catch (_) {}

  const handler = (e) => callback(e.detail);
  window.addEventListener('dpres_drill_update', handler);

  return () => {
    window.removeEventListener('dpres_drill_update', handler);
    if (channel) { try { channel.close(); } catch (_) {} }
  };
}

// ─── Utilities ────────────────────────────────────────────────────────────────

export const DRILL_META = {
  fire:    { label: 'Fire Drill',           emoji: '🔥', color: '#EF4444', bg: 'bg-red-500',    light: 'bg-red-50 text-red-700 border-red-200',    dark: 'bg-red-500/10 text-red-400 border-red-500/20'    },
  flood:   { label: 'Flood Drill',          emoji: '🌊', color: '#3B82F6', bg: 'bg-blue-500',   light: 'bg-blue-50 text-blue-700 border-blue-200',   dark: 'bg-blue-500/10 text-blue-400 border-blue-500/20'   },
  quake:   { label: 'Earthquake Drill',     emoji: '🌍', color: '#F59E0B', bg: 'bg-amber-500',  light: 'bg-amber-50 text-amber-700 border-amber-200',  dark: 'bg-amber-500/10 text-amber-400 border-amber-500/20'  },
  cyclone: { label: 'Cyclone Drill',        emoji: '🌀', color: '#06B6D4', bg: 'bg-cyan-500',   light: 'bg-cyan-50 text-cyan-700 border-cyan-200',   dark: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'   },
  general: { label: 'General Emergency',    emoji: '🚨', color: '#8B5CF6', bg: 'bg-violet-500', light: 'bg-violet-50 text-violet-700 border-violet-200', dark: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
};

export function getDrillMeta(type) {
  return DRILL_META[type?.toLowerCase()] || DRILL_META.general;
}

export const SEVERITY_META = {
  Low:      { color: '#10B981', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  Medium:   { color: '#F59E0B', cls: 'bg-amber-50 text-amber-700 border-amber-200'       },
  High:     { color: '#EF4444', cls: 'bg-red-50 text-red-700 border-red-200'             },
  Critical: { color: '#7C3AED', cls: 'bg-violet-50 text-violet-700 border-violet-200'    },
};

function getDefaultInstructions(type) {
  const map = {
    fire:    'Evacuate immediately via stairwells. Do NOT use elevators. Proceed to designated assembly point at least 25 m from the building.',
    flood:   'Move to the highest floor. Avoid all floodwater. Do not use electrical appliances. Await all-clear from safety officers.',
    quake:   'Drop, Cover, Hold On. Shelter under sturdy desks. Move away from windows. Do not exit until shaking stops.',
    cyclone: 'Move to an interior room away from windows. Stay low. Keep your emergency kit close. Await official all-clear.',
    general: 'Follow safety officer instructions. Move away from hazard zones. Stay calm and await further broadcast.',
  };
  return map[type?.toLowerCase()] || map.general;
}
