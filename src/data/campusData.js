export const CAMPUS_BUILDINGS = [
  { id: 'a', label: 'Block A', sub: 'Academic Wing', x: 180, y: 80, w: 180, h: 120, floors: 4 },
  { id: 'b', label: 'Block B', sub: 'Science Labs', x: 400, y: 80, w: 160, h: 100, floors: 4 },
  { id: 'c', label: 'Block C', sub: 'Administration', x: 120, y: 230, w: 150, h: 140, floors: 4 },
  { id: 'l', label: 'Library', sub: 'Resource Center', x: 310, y: 250, w: 180, h: 110, floors: 4 },
  { id: 'k', label: 'Canteen', sub: 'Food Court', x: 520, y: 270, w: 140, h: 120, floors: 2 }
];

export function getFloorDetails(bId, floor) {
  const items = [];
  // Standard emergency exits on the floor boundaries
  items.push({ type: 'exit', x: 40, y: 250, label: floor === 0 ? 'EXIT' : 'STAIRS' });
  items.push({ type: 'exit', x: 760, y: 250, label: floor === 0 ? 'EXIT' : 'STAIRS' });
  items.push({ type: 'ext', x: 400, y: 180, label: 'FIRE EXT' });
  
  if (floor > 0) {
    items.push({ type: 'ext', x: 200, y: 320, label: 'FIRE EXT' });
  }
  items.push({ type: 'firstaid', x: 600, y: 180, label: 'FIRST AID' });

  // Specific hazards depending on building and floor
  if (bId === 'b') {
    if (floor === 1) {
      items.push({ type: 'hazard', x: 180, y: 80, label: 'CHEMICAL LAB', desc: 'Flammable Storage' });
    }
    if (floor === 2) {
      items.push({ type: 'hazard', x: 550, y: 360, label: 'BIO LAB', desc: 'Biohazard Materials' });
    }
  }
  if (bId === 'a' && floor === 3) {
    items.push({ type: 'hazard', x: 400, y: 80, label: 'SERVER ROOM', desc: 'High Voltage / Halon System' });
  }
  if (bId === 'k' && floor === 0) {
    items.push({ type: 'hazard', x: 250, y: 360, label: 'KITCHEN', desc: 'Gas Lines & Oils' });
  }
  if (bId === 'c' && floor === 0) {
    items.push({ type: 'hazard', x: 150, y: 80, label: 'MAIN ELEC PANEL', desc: 'High Voltage' });
  }

  return items;
}

export function getRoomLabels(bId, floor) {
  const f = floor === 0 ? '1' : floor === 1 ? '2' : floor === 2 ? '3' : '4';
  if (bId === 'a') {
    const topMid = floor === 3 ? 'SERVER ROOM' : `LECTURE HALL ${f}A`;
    return [`CLASS ${f}01`, topMid, `CLASS ${f}02`, `CLASS ${f}03`, `STAFF ${f}01`, `CLASS ${f}04`];
  }
  if (bId === 'b') {
    const topLeft = floor === 1 ? 'CHEMICAL LAB' : `PHYSICS LAB ${f}`;
    const botRight = floor === 2 ? 'BIO LAB' : `COMPUTER LAB ${f}B`;
    return [topLeft, `MAIN LAB ${f}`, `PREP ROOM ${f}`, `WORKSHOP ${f}`, `STORAGE ${f}`, botRight];
  }
  if (bId === 'c') {
    const topLeft = floor === 0 ? 'ELEC ROOM' : `ADMIN ${f}01`;
    return floor === 0
      ? [topLeft, 'MAIN OFFICE', 'ACCOUNTS', 'ADMISSIONS', 'PANTRY', 'MEETING ROOM']
      : [topLeft, `CONFERENCE ${f}`, `ADMIN ${f}02`, 'HR DEPT', 'RECORDS', 'IT SUPPORT'];
  }
  if (bId === 'l') {
    return floor === 0
      ? ['CIRCULATION', 'MAIN READING', 'NEW ARRIVALS', 'PERIODICALS', 'OFFICE', 'REFERENCE']
      : [`QUIET ZONE ${f}`, `STACKS ${f}A`, `STACKS ${f}B`, 'DIGITAL LAB', 'STUDY ROOMS', 'ARCHIVES'];
  }
  if (bId === 'k') {
    const botLeft = floor === 0 ? 'KITCHEN' : 'PREP KITCHEN';
    return floor === 0
      ? ['WASHING', 'MAIN DINING', 'SNACK COUNTER', botLeft, 'STORE', 'STAFF DINING']
      : ['TERRACE DINING', 'EVENT HALL', 'BALCONY SEATING', botLeft, 'STORAGE', 'RESTROOMS'];
  }
  return ['ROOM 1', 'ROOM 2', 'ROOM 3', 'ROOM 4', 'ROOM 5', 'ROOM 6'];
}

export function getRoomHazardDetails(label) {
  const lbl = label.toUpperCase();

  if (lbl.includes('LAB') || lbl.includes('WORKSHOP') || lbl.includes('PREP')) {
    return {
      status: 'HIGH HAZARD',
      color: 'var(--red-500)',
      textColor: 'text-red-500 border-red-500/20 bg-red-500/10',
      bg: 'rgba(220,38,38,0.08)',
      hazards: ['Toxic chemical agents & acids', 'Bunsen burners & live gas valves', 'Biological hazardous materials'],
      eq: ['Chemical Spill Kit inside', 'Emergency Eye Wash Station', 'Class D / CO2 Fire Extinguisher']
    };
  } else if (lbl.includes('SERVER') || lbl.includes('IT') || lbl.includes('ELEC') || lbl.includes('PANEL')) {
    return {
      status: 'CRITICAL RISK',
      color: 'var(--red-500)',
      textColor: 'text-red-600 border-red-600/30 bg-red-500/10',
      bg: 'rgba(220,38,38,0.08)',
      hazards: ['Extreme High Voltage (480V+)', 'Severe overheating & electrical fire risk', 'Arc flash danger'],
      eq: ['Clean Agent (Halon) Extinguisher', 'Main Emergency Power Cutoff (EPO)', 'DO NOT USE WATER!']
    };
  } else if (lbl.includes('KITCHEN') || lbl.includes('PANTRY') || lbl.includes('DINING')) {
    return {
      status: 'MEDIUM RISK',
      color: 'var(--orange-500)',
      textColor: 'text-orange-500 border-orange-500/20 bg-orange-500/10',
      bg: 'rgba(249,115,22,0.08)',
      hazards: ['Open stove flames & hot surfaces', 'Boiling cooking oils', 'Pressurized commercial gas lines'],
      eq: ['Class K (Wet Chemical) Extinguisher', 'Heavy Duty Fire Blanket', 'Gas Shutoff Valve']
    };
  } else if (lbl.includes('ADMIN') || lbl.includes('OFFICE') || lbl.includes('STAFF') || lbl.includes('RECORDS')) {
    return {
      status: 'LOW RISK',
      color: 'var(--blue-400)',
      textColor: 'text-blue-500 border-blue-500/20 bg-blue-500/10',
      bg: 'rgba(59,130,246,0.08)',
      hazards: ['Daisy-chained power strips', 'Combustible paper archives', 'Trip hazards in tight cubicles'],
      eq: ['Standard ABC Fire Extinguisher', 'First Aid Kit at Reception']
    };
  } else {
    return {
      status: 'SAFE ZONE',
      color: 'var(--green-500)',
      textColor: 'text-green-500 border-green-500/20 bg-green-500/10',
      bg: 'rgba(34,197,94,0.08)',
      hazards: ['Standard classroom environment', 'Minimal physical hazards present', 'Maintain clear path to exit doors'],
      eq: ['Follow corridor signs to main exit', 'Fire alarm pull station in hallway', 'Evacuation map posted near door']
    };
  }
}
