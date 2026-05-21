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
  threat: {
    title: 'Active Threat',
    color: '#8b5cf6',
    emoji: '🛡️',
    textColor: 'text-violet-500',
    borderColor: 'border-violet-500/20',
    bgColor: 'bg-violet-500/10',
    hoverBg: 'hover:bg-violet-500/5',
    questions: [
      { id: 1, q: 'The national protocol for active threat situations is:', options: ['Hide, Fight, Flee', 'Run, Hide, Fight', 'Alert, Shelter, Evacuate', 'Freeze, Report, Comply'], answer: 1 },
      { id: 2, q: '"Run" is the first option. When should you run?', options: ['Only when instructed by police', 'When a safe path is available and evacuation is possible', 'After confirming the threat location', 'Only if you are near an exit'], answer: 1 },
      { id: 3, q: 'When hiding from a threat, you should:', options: ['Turn on lights to see clearly', 'Unlock doors for police access', 'Silence phones and block doors', 'Group in hallways for faster escape'], answer: 2 },
      { id: 4, q: 'As a last resort, fighting back means:', options: ['One person confronts the threat', 'Act aggressively as a group using any item as improvised weapon', 'Wait and observe before acting', 'Call for help loudly first'], answer: 1 }
    ]
  }
};
