export const QUIZ_DATA = {
  fire: {
    title: 'Fire Safety',
    color: '#dc2626',
    emoji: '🔥',
    textColor: 'text-red-500',
    borderColor: 'border-red-500/20',
    bgColor: 'bg-red-500/10',
    hoverBg: 'hover:bg-red-500/5',
    questions: [
      { id: 1, q: 'What does R.A.C.E stand for in fire emergencies?', options: ['Run, Alert, Call, Evacuate', 'Rescue, Alert, Contain, Extinguish/Evacuate', 'React, Alarm, Contain, Escape', 'Report, Assess, Call, Exit'], answer: 1 },
      { id: 2, q: 'When a fire alarm sounds, you should first:', options: ['Gather belongings then exit', 'Use elevator to evacuate faster', 'Feel door handle for heat before opening', 'Call friends to warn them'], answer: 2 },
      { id: 3, q: 'A Class B fire involves which fuel type?', options: ['Wood and paper', 'Flammable liquids and gases', 'Electrical equipment', 'Cooking oils'], answer: 1 },
      { id: 4, q: 'Which fire extinguisher type is safe for electrical fires?', options: ['Water', 'Foam', 'CO₂ or dry powder', 'Wet chemical'], answer: 2 },
      { id: 5, q: 'How far should assembly point be from any building?', options: ['At least 10 m', 'At least 15 m', 'At least 25 m', 'At least 50 m'], answer: 2 }
    ]
  },
  flood: {
    title: 'Flood Protocol',
    color: '#3b82f6',
    emoji: '🌊',
    textColor: 'text-blue-500',
    borderColor: 'border-blue-500/20',
    bgColor: 'bg-blue-500/10',
    hoverBg: 'hover:bg-blue-500/5',
    questions: [
      { id: 1, q: 'During a flood warning, your first action should be:', options: ['Go to basement for shelter', 'Move to higher ground immediately', 'Attempt to drive through floodwater', 'Wade through water to reach others'], answer: 1 },
      { id: 2, q: 'How deep can moving floodwater be to sweep a person off their feet?', options: ['6 inches (15 cm)', '12 inches (30 cm)', '24 inches (60 cm)', '36 inches (90 cm)'], answer: 0 },
      { id: 3, q: 'Which disease is commonly spread through floodwater contact?', options: ['Influenza', 'Leptospirosis', 'Malaria', 'Dengue'], answer: 1 },
      { id: 4, q: 'If trapped inside a flooded vehicle, you should:', options: ['Stay calm and wait for help', 'Break the window after water equalizes pressure', 'Use horn to alert people', 'Call emergency services and stay still'], answer: 1 }
    ]
  },
  quake: {
    title: 'Earthquake',
    color: '#f97316',
    emoji: '🌍',
    textColor: 'text-orange-500',
    borderColor: 'border-orange-500/20',
    bgColor: 'bg-orange-500/10',
    hoverBg: 'hover:bg-orange-500/5',
    questions: [
      { id: 1, q: 'During an earthquake, the "Drop, Cover, Hold On" posture means:', options: ['Drop to knees, cover head under sturdy table, hold on until shaking stops', 'Drop belongings, cover eyes, hold doorframe', 'Drop outside, cover in open space, hold onto each other', 'Drop to floor, cover face, hold breath'], answer: 0 },
      { id: 2, q: 'The safest place to be during an indoor earthquake is:', options: ['Doorframe', 'Open field outdoors', 'Under a sturdy desk/table away from windows', 'Next to an interior wall'], answer: 2 },
      { id: 3, q: 'After the main earthquake, you should expect:', options: ['No further danger', 'Aftershocks for hours to weeks', 'Only one minor aftershock', 'Immediate all-clear from authorities'], answer: 1 },
      { id: 4, q: 'If outdoors during an earthquake, move away from:', options: ['Open fields', 'Buildings, streetlights, and power lines', 'Parks and trees', 'Other people'], answer: 1 }
    ]
  },
  cyclone: {
    title: 'Cyclone Safety',
    color: '#06b6d4',
    emoji: '🌀',
    textColor: 'text-cyan-500',
    borderColor: 'border-cyan-500/20',
    bgColor: 'bg-cyan-500/10',
    hoverBg: 'hover:bg-cyan-500/5',
    questions: [
      { id: 1, q: 'Which warning signal indicates an imminent severe cyclone?', options: ['Yellow advisory — monitor the situation', 'Orange watch — prepare to evacuate', 'Red alert — move to cyclone shelter immediately', 'Green all-clear — no action needed'], answer: 2 },
      { id: 2, q: 'The safest shelter during a cyclone is:', options: ['A room with large windows for visibility', 'An interior room on the lowest floor with no windows', 'An interior room away from windows, preferably reinforced', 'The rooftop to avoid storm surge flooding'], answer: 2 },
      { id: 3, q: 'A complete emergency kit for a cyclone should include water supply of:', options: ['1 litre per person per day for 3 days', '4 litres per person per day for at least 7 days', '2 litres per person per day for 2 days', 'Bottled water for 1 day only'], answer: 1 },
      { id: 4, q: 'During a cyclone evacuation order, you should:', options: ['Wait to see if the storm path changes', 'Follow designated evacuation routes to official shelters', 'Drive to the nearest shopping centre', 'Stay home if you live in a concrete building'], answer: 1 },
      { id: 5, q: 'After a cyclone, which action is most important before re-entering your home?', options: ['Turn on all electrical appliances to check if they work', 'Check for structural damage and gas leaks before entering', 'Open windows immediately to air out the building', 'Resume normal activities as soon as the rain stops'], answer: 1 }
    ]
  }
};
