import { useState, useEffect } from 'react';

const STORAGE_KEY = 'dpres_app_data_v2';

function loadData() {
  try {
    const d = localStorage.getItem(STORAGE_KEY);
    if (d) return JSON.parse(d);
  } catch (e) {
    console.error('Failed to load local storage:', e);
  }
  return {
    users: [
      { id: 'admin-1', name: 'Director Console', email: 'director@campus.edu', role: 'admin', status: 'Active' },
      { id: 'student-1', name: 'Alex Smith', rollNo: 'CS21000', dept: 'Computer Science', email: 'alex.smith@campus.edu', role: 'student', completedModules: ['fire', 'flood'], status: 'Active', pts: 400 },
      { id: 'student-2', name: 'Priya Sharma', rollNo: 'CS21005', dept: 'Computer Science', email: 'priya@campus.edu', role: 'student', completedModules: ['fire', 'flood', 'quake', 'threat'], status: 'Active', pts: 800 },
      { id: 'student-3', name: 'Rahul Verma', rollNo: 'EE21012', dept: 'Electronics', email: 'rahul@campus.edu', role: 'student', completedModules: ['fire'], status: 'Active', pts: 200 }
    ],
    drills: [
      { id: 'd-1', title: 'Annual Fire Safety Protocol Test', type: 'fire', timestamp: Date.now() - 86400000 * 3, status: 'Completed' },
      { id: 'd-2', title: 'Monsoon Flood Preparedness', type: 'flood', timestamp: Date.now() - 86400000 * 10, status: 'Completed' }
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
