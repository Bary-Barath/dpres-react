import { useState, useEffect } from 'react';

const STORAGE_KEY = 'dpres_app_data_v3';

const DEFAULT_STUDENTS = [
  { id: 'admin-1', name: 'Director Console', email: 'director@campus.edu', role: 'admin', status: 'Active' },

  // Computer Science
  { id: 's-001', name: 'Alex Smith',       rollNo: 'CS21001', dept: 'Computer Science',            year: '3rd Year', email: 'alex.smith@campus.edu',      role: 'student', completedModules: ['fire','flood'],                    status: 'Active',   pts: 400, prepScore: 72, certStatus: 'In Progress' },
  { id: 's-002', name: 'Priya Sharma',     rollNo: 'CS21002', dept: 'Computer Science',            year: '3rd Year', email: 'priya.sharma@campus.edu',    role: 'student', completedModules: ['fire','flood','quake','cyclone'],  status: 'Active',   pts: 800, prepScore: 96, certStatus: 'Certified'    },
  { id: 's-003', name: 'Rohan Mehta',      rollNo: 'CS22001', dept: 'Computer Science',            year: '2nd Year', email: 'rohan.mehta@campus.edu',     role: 'student', completedModules: ['fire','flood','quake'],            status: 'Active',   pts: 600, prepScore: 81, certStatus: 'In Progress' },
  { id: 's-004', name: 'Sneha Pillai',     rollNo: 'CS24001', dept: 'Computer Science',            year: '1st Year', email: 'sneha.pillai@campus.edu',    role: 'student', completedModules: [],                                 status: 'Active',   pts: 0,   prepScore: 20, certStatus: 'Not Started'  },

  // AI & Data Science
  { id: 's-005', name: 'Arjun Nair',       rollNo: 'AI22001', dept: 'AI & Data Science',           year: '2nd Year', email: 'arjun.nair@campus.edu',      role: 'student', completedModules: ['fire','flood','quake','cyclone'],  status: 'Active',   pts: 800, prepScore: 95, certStatus: 'Certified'    },
  { id: 's-006', name: 'Divya Krishnan',   rollNo: 'AI22002', dept: 'AI & Data Science',           year: '2nd Year', email: 'divya.krishnan@campus.edu',  role: 'student', completedModules: ['fire','flood'],                    status: 'Active',   pts: 400, prepScore: 68, certStatus: 'In Progress' },
  { id: 's-007', name: 'Kabir Anand',      rollNo: 'AI23001', dept: 'AI & Data Science',           year: '1st Year', email: 'kabir.anand@campus.edu',     role: 'student', completedModules: ['fire'],                            status: 'Active',   pts: 200, prepScore: 45, certStatus: 'In Progress' },

  // Information Technology
  { id: 's-008', name: 'Meera Joshi',      rollNo: 'IT21001', dept: 'Information Technology',      year: '3rd Year', email: 'meera.joshi@campus.edu',     role: 'student', completedModules: ['fire','flood','quake','cyclone'],  status: 'Active',   pts: 800, prepScore: 92, certStatus: 'Certified'    },
  { id: 's-009', name: 'Vikram Patel',     rollNo: 'IT21002', dept: 'Information Technology',      year: '3rd Year', email: 'vikram.patel@campus.edu',    role: 'student', completedModules: ['fire','flood','quake'],            status: 'Active',   pts: 600, prepScore: 78, certStatus: 'In Progress' },
  { id: 's-010', name: 'Anjali Singh',     rollNo: 'IT22001', dept: 'Information Technology',      year: '2nd Year', email: 'anjali.singh@campus.edu',    role: 'student', completedModules: ['fire'],                            status: 'Inactive', pts: 200, prepScore: 40, certStatus: 'In Progress' },

  // Electronics & Communication
  { id: 's-011', name: 'Rahul Verma',      rollNo: 'EC21001', dept: 'Electronics & Communication', year: '3rd Year', email: 'rahul.verma@campus.edu',     role: 'student', completedModules: ['fire','flood'],                    status: 'Active',   pts: 400, prepScore: 65, certStatus: 'In Progress' },
  { id: 's-012', name: 'Pooja Iyer',       rollNo: 'EC21002', dept: 'Electronics & Communication', year: '3rd Year', email: 'pooja.iyer@campus.edu',      role: 'student', completedModules: ['fire','flood','quake','cyclone'],  status: 'Active',   pts: 800, prepScore: 98, certStatus: 'Certified'    },
  { id: 's-013', name: 'Suresh Kumar',     rollNo: 'EC22001', dept: 'Electronics & Communication', year: '2nd Year', email: 'suresh.kumar@campus.edu',    role: 'student', completedModules: ['fire','flood','quake'],            status: 'Active',   pts: 600, prepScore: 80, certStatus: 'In Progress' },
  { id: 's-014', name: 'Ananya Reddy',     rollNo: 'EC24001', dept: 'Electronics & Communication', year: '1st Year', email: 'ananya.reddy@campus.edu',    role: 'student', completedModules: [],                                 status: 'Active',   pts: 0,   prepScore: 18, certStatus: 'Not Started'  },

  // Mechanical Engineering
  { id: 's-015', name: 'Manish Tiwari',    rollNo: 'ME21001', dept: 'Mechanical Engineering',      year: '3rd Year', email: 'manish.tiwari@campus.edu',   role: 'student', completedModules: ['fire','flood','quake','cyclone'],  status: 'Active',   pts: 800, prepScore: 88, certStatus: 'Certified'    },
  { id: 's-016', name: 'Riya Gupta',       rollNo: 'ME22001', dept: 'Mechanical Engineering',      year: '2nd Year', email: 'riya.gupta@campus.edu',      role: 'student', completedModules: ['fire','flood'],                    status: 'Active',   pts: 400, prepScore: 62, certStatus: 'In Progress' },
  { id: 's-017', name: 'Sanjay Rao',       rollNo: 'ME23001', dept: 'Mechanical Engineering',      year: '1st Year', email: 'sanjay.rao@campus.edu',      role: 'student', completedModules: ['fire'],                            status: 'Active',   pts: 200, prepScore: 38, certStatus: 'In Progress' },

  // Civil Engineering
  { id: 's-018', name: 'Kavya Nambiar',    rollNo: 'CE21001', dept: 'Civil Engineering',           year: '3rd Year', email: 'kavya.nambiar@campus.edu',   role: 'student', completedModules: ['fire','flood','quake','cyclone'],  status: 'Active',   pts: 800, prepScore: 90, certStatus: 'Certified'    },
  { id: 's-019', name: 'Deepak Chauhan',   rollNo: 'CE21002', dept: 'Civil Engineering',           year: '3rd Year', email: 'deepak.chauhan@campus.edu',  role: 'student', completedModules: ['fire','flood'],                    status: 'Inactive', pts: 400, prepScore: 55, certStatus: 'In Progress' },
  { id: 's-020', name: 'Neha Bose',        rollNo: 'CE22001', dept: 'Civil Engineering',           year: '2nd Year', email: 'neha.bose@campus.edu',       role: 'student', completedModules: [],                                 status: 'Active',   pts: 0,   prepScore: 22, certStatus: 'Not Started'  },

  // Biotechnology
  { id: 's-021', name: 'Ishaan Malhotra',  rollNo: 'BT21001', dept: 'Biotechnology',              year: '3rd Year', email: 'ishaan.malhotra@campus.edu', role: 'student', completedModules: ['fire','flood','quake','cyclone'],  status: 'Active',   pts: 800, prepScore: 94, certStatus: 'Certified'    },
  { id: 's-022', name: 'Tanvi Desai',      rollNo: 'BT22001', dept: 'Biotechnology',              year: '2nd Year', email: 'tanvi.desai@campus.edu',     role: 'student', completedModules: ['fire','flood'],                    status: 'Active',   pts: 400, prepScore: 70, certStatus: 'In Progress' },
  { id: 's-023', name: 'Amit Saxena',      rollNo: 'BT22002', dept: 'Biotechnology',              year: '2nd Year', email: 'amit.saxena@campus.edu',     role: 'student', completedModules: ['fire'],                            status: 'Active',   pts: 200, prepScore: 48, certStatus: 'In Progress' },
  { id: 's-024', name: 'Farida Sheikh',    rollNo: 'BT23001', dept: 'Biotechnology',              year: '1st Year', email: 'farida.sheikh@campus.edu',   role: 'student', completedModules: [],                                 status: 'Active',   pts: 0,   prepScore: 15, certStatus: 'Not Started'  },
  { id: 's-025', name: 'Nikhil Jain',      rollNo: 'CS23001', dept: 'Computer Science',            year: '1st Year', email: 'nikhil.jain@campus.edu',     role: 'student', completedModules: ['fire','flood','quake','cyclone'],  status: 'Active',   pts: 800, prepScore: 91, certStatus: 'Certified'    },
];

function migrateThreatToCyclone(data) {
  data.users = data.users.map(u => {
    if (!u.completedModules) return u;
    const idx = u.completedModules.indexOf('threat');
    if (idx === -1) return u;
    const updated = [...u.completedModules];
    updated[idx] = 'cyclone';
    return { ...u, completedModules: updated };
  });
  data.drills = data.drills.map(d =>
    d.type === 'threat' ? { ...d, type: 'cyclone' } : d
  );
  return data;
}

function loadData() {
  try {
    const d = localStorage.getItem(STORAGE_KEY);
    if (d) {
      const parsed = JSON.parse(d);
      const migrated = migrateThreatToCyclone(parsed);
      if (JSON.stringify(migrated) !== JSON.stringify(parsed)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      }
      return migrated;
    }
  } catch (e) {
    console.error('Failed to load local storage:', e);
  }
  return {
    users: DEFAULT_STUDENTS,
    drills: [
      { id: 'd-1', title: 'Annual Fire Safety Protocol Test',  type: 'fire',  timestamp: Date.now() - 86400000 * 3,  status: 'Completed' },
      { id: 'd-2', title: 'Monsoon Flood Preparedness Drill',  type: 'flood', timestamp: Date.now() - 86400000 * 10, status: 'Completed' }
    ]
  };
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to local storage:', e);
  }
  window.dispatchEvent(new Event('dpres_update'));
}

export function useAppData() {
  const [data, setData] = useState(loadData);

  useEffect(() => {
    const handleUpdate = () => setData(loadData());
    window.addEventListener('dpres_update', handleUpdate);
    return () => window.removeEventListener('dpres_update', handleUpdate);
  }, []);

  const updateUsers = (updater) => {
    const cur = loadData();
    cur.users = typeof updater === 'function' ? updater(cur.users) : updater;
    saveData(cur);
  };

  const updateDrills = (updater) => {
    const cur = loadData();
    cur.drills = typeof updater === 'function' ? updater(cur.drills) : updater;
    saveData(cur);
  };

  return { data, updateUsers, updateDrills };
}
