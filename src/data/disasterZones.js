// Disaster risk zones data for the interactive map
// Coordinates centered on India for context, representing real high-risk zones

export const DISASTER_ZONES = {
  flood: [
    { id: 'f1', name: 'Bihar Flood Region', lat: 25.5, lng: 86.5, radius: 120000, risk: 'Extreme', desc: 'Annual monsoon flooding affects 70% of the region. Multiple major river systems overflow regularly.' },
    { id: 'f2', name: 'Assam Flood Zone', lat: 26.5, lng: 92.5, radius: 100000, risk: 'Critical', desc: 'Brahmaputra river floods displace millions annually. Heavy rainfall causes widespread inundation.' },
    { id: 'f3', name: 'Uttar Pradesh Floodplain', lat: 26.0, lng: 81.0, radius: 90000, risk: 'High', desc: 'Ganges basin flooding affects large agricultural areas and numerous towns.' },
    { id: 'f4', name: 'West Bengal Delta', lat: 22.5, lng: 88.5, radius: 80000, risk: 'High', desc: 'Coastal and river delta flooding from monsoon rains and storm surges.' },
    { id: 'f5', name: 'Mumbai Coastal Flood Zone', lat: 19.0, lng: 72.8, radius: 50000, risk: 'Extreme', desc: 'High tide and monsoon flooding affect low-lying areas of the city.' }
  ],
  cyclone: [
    { id: 'c1', name: 'Odisha Coast', lat: 20.0, lng: 86.0, radius: 100000, risk: 'Extreme', desc: 'One of India\'s most cyclone-prone regions. Frequent super cyclones make landfall here.' },
    { id: 'c2', name: 'Andhra Pradesh Coast', lat: 16.0, lng: 82.0, radius: 90000, risk: 'High', desc: 'Bay of Bengal cyclones regularly impact this coastline with storm surges.' },
    { id: 'c3', name: 'Tamil Nadu Coast', lat: 11.5, lng: 80.0, radius: 80000, risk: 'High', desc: 'Northeast monsoon brings cyclonic storms, particularly during October-December.' },
    { id: 'c4', name: 'Gujarat Coast', lat: 21.5, lng: 70.0, radius: 70000, risk: 'Moderate', desc: 'Arabian Sea cyclones impact the coastline with high winds and heavy rainfall.' },
    { id: 'c5', name: 'West Bengal Coast', lat: 21.8, lng: 88.0, radius: 60000, risk: 'High', desc: 'Sundarbans delta region highly vulnerable to cyclone storm surges.' }
  ],
  earthquake: [
    { id: 'e1', name: 'Himalayan Seismic Zone', lat: 30.0, lng: 80.0, radius: 150000, risk: 'Extreme', desc: 'Zone V — Highest seismic risk. Collision zone of Indian and Eurasian plates.' },
    { id: 'e2', name: 'Northeast India', lat: 26.0, lng: 93.0, radius: 100000, risk: 'Extreme', desc: 'Zone V — Intense seismic activity from complex tectonic plate interactions.' },
    { id: 'e3', name: 'Kutch Region, Gujarat', lat: 23.5, lng: 70.0, radius: 80000, risk: 'Critical', desc: 'Zone V — Site of the devastating 2001 Bhuj earthquake (Mw 7.7).' },
    { id: 'e4', name: 'Delhi-NCR Region', lat: 28.5, lng: 77.0, radius: 60000, risk: 'High', desc: 'Zone IV — High population density amplifies seismic risk significantly.' },
    { id: 'e5', name: 'Western Ghats', lat: 14.0, lng: 75.0, radius: 50000, risk: 'Moderate', desc: 'Zone III — Moderate seismic activity in the peninsular shield region.' }
  ],
  tsunami: [
    { id: 't1', name: 'Andaman & Nicobar Islands', lat: 10.0, lng: 93.0, radius: 100000, risk: 'Extreme', desc: 'Alert Level 1 — Directly exposed to Sumatra-Andaman subduction zone earthquakes.' },
    { id: 't2', name: 'Tamil Nadu Coast', lat: 10.5, lng: 80.0, radius: 80000, risk: 'High', desc: 'Alert Level 2 — Severely affected by the 2004 Indian Ocean tsunami.' },
    { id: 't3', name: 'Odisha Coast', lat: 19.5, lng: 85.5, radius: 60000, risk: 'High', desc: 'Alert Level 2 — Low-lying coastal areas vulnerable to tsunami inundation.' },
    { id: 't4', name: 'Kerala Coast', lat: 10.0, lng: 76.0, radius: 50000, risk: 'Moderate', desc: 'Alert Level 3 — Arabian Sea seismic activity poses moderate tsunami risk.' }
  ]
};

export const MAP_CENTER = [22.5, 82.5];
export const MAP_ZOOM = 4.5;

export const LEGEND_ITEMS = [
  { type: 'flood', label: 'Flood-Prone Areas', color: '#3b82f6', icon: '💧' },
  { type: 'cyclone', label: 'Cyclone-Prone Areas', color: '#f97316', icon: '🌀' },
  { type: 'earthquake', label: 'Earthquake Zones', color: '#ef4444', icon: '🌋' },
  { type: 'tsunami', label: 'Tsunami Alert Areas', color: '#a855f7', icon: '🌊' }
];

export const PREVENTION_TIPS = {
  flood: [
    'Elevate electrical appliances above potential flood levels',
    'Keep sandbags ready at entry points',
    'Store emergency documents in waterproof containers',
    'Prepare an emergency evacuation kit with essentials',
    'Identify the nearest high ground evacuation point',
    'Install check valves in plumbing to prevent backflow',
    'Maintain a battery-powered radio for weather updates'
  ],
  cyclone: [
    'Reinforce windows and doors with cyclone shutters',
    'Trim trees and secure loose outdoor objects',
    'Store adequate drinking water and non-perishable food for 7 days',
    'Know your nearest cyclone shelter location',
    'Keep emergency lighting and backup power ready',
    'Secure boats and vehicles in designated safe areas',
    'Stay indoors during cyclone passage — avoid windows'
  ],
  earthquake: [
    'Secure heavy furniture to walls with brackets',
    'Identify safe spots: under sturdy tables, against interior walls',
    'Practice Drop, Cover, and Hold On drills regularly',
    'Keep emergency supplies accessible (not trapped in cabinets)',
    'Learn how to shut off gas and electricity mains',
    'Place heavy objects on lower shelves',
    'Know evacuation routes from every room'
  ],
  tsunami: [
    'Know the natural warning signs: receding ocean water, roaring sounds',
    'Move immediately to high ground if near the coast during an earthquake',
    'Never wait for an official warning — act immediately',
    'Plan evacuation routes to areas at least 30m above sea level',
    'Prepare a go-bag with essentials near the exit',
    'Learn designated tsunami evacuation routes and assembly areas',
    'Do not return to coastal areas until authorities declare it safe'
  ]
};
