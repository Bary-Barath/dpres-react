import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, ShieldAlert } from 'lucide-react';
import { useRoute, navigate } from './hooks/useRoute';
import { useAppData } from './hooks/useAppData';
import { useTheme } from './hooks/useTheme';
import ShortcutsHelp from './components/ShortcutsHelp';

// Landing Page Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';

// Portal Page Components
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import StudentsDB from './pages/StudentsDB';
import DrillManager from './pages/DrillManager';
import StudentPortal from './pages/StudentPortal';
import Quiz from './pages/Quiz';
import EvacuationMap from './pages/EvacuationMap';
import AIDisasterAssistant from './pages/AIDisasterAssistant';
import Leaderboard from './pages/Leaderboard';
import Contacts from './pages/Contacts';
import Settings from './pages/Settings';

const AuthContext = createContext(null);
const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {}, setTheme: () => {} });

export function useAuth() {
  return useContext(AuthContext);
}

export function useThemeContext() {
  return useContext(ThemeContext);
}

export default function App() {
  const hash = useRoute();
  const { data, updateUsers, updateDrills } = useAppData();
  const { theme, toggleTheme, setTheme } = useTheme();
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [activeUser, setActiveUser] = useState(() => {
    try {
      const u = sessionStorage.getItem('dpres_active_user');
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  });

  const [toast, setToast] = useState(null); // { message, type }
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Auth helper methods
  const login = async (email, password, isSignup = false, name = '') => {
    const emailLower = email.toLowerCase();
    
    if (isSignup) {
      const exists = data.users.find(u => u.email.toLowerCase() === emailLower);
      if (exists) throw new Error('Email is already registered in registry.');
      
      const newRoll = 'CS' + (22000 + Math.floor(Math.random() * 900));
      const newUser = {
        id: 'student-' + Date.now(),
        name: name.trim(),
        rollNo: newRoll,
        dept: 'Computer Science',
        email: emailLower,
        role: 'student',
        completedModules: [],
        status: 'Active',
        pts: 0
      };

      updateUsers(prev => [...prev, newUser]);
      sessionStorage.setItem('dpres_active_user', JSON.stringify(newUser));
      setActiveUser(newUser);
      return newUser;
    } else {
      // Find matching user credentials (mock database)
      const u = data.users.find(x => x.email.toLowerCase() === emailLower);
      if (!u) throw new Error('Account credentials not found.');
      
      // Basic mock credentials matches
      if (u.role === 'admin' && password !== 'Admin@2026') {
        throw new Error('Incorrect password for administrator access.');
      }
      if (u.role === 'student' && u.email === 'alex.smith@campus.edu' && password !== 'Student@2026') {
        throw new Error('Incorrect password for student access.');
      }

      sessionStorage.setItem('dpres_active_user', JSON.stringify(u));
      setActiveUser(u);
      return u;
    }
  };

  const logout = () => {
    sessionStorage.removeItem('dpres_active_user');
    setActiveUser(null);
    showToast('Signed out successfully.', 'info');
    navigate('#/login');
  };

  const updateUser = async (updates) => {
    if (!activeUser) return;
    const updated = { ...activeUser, ...updates };
    
    // Sync update in the main users database
    updateUsers(prev => prev.map(u => u.id === activeUser.id ? { ...u, ...updates } : u));
    
    // Sync session cache
    sessionStorage.setItem('dpres_active_user', JSON.stringify(updated));
    setActiveUser(updated);
  };

  // Find if there is an active broadcast alert scheduled recently (last 3 minutes)
  const activeDrill = data.drills.find(d => d.status === 'Active' && Date.now() - d.timestamp < 180000);
  const isAlertVisible = activeDrill && !dismissedAlerts.includes(activeDrill.id);

  const handleDismissAlert = (id) => {
    setDismissedAlerts(prev => [...prev, id]);
    showToast('Drill warning acknowledged.', 'info');
  };

  // Core router render switcher
  const renderContent = () => {
    // 1. Landing Page
    if (hash === '#/home' || hash === '#/' || !hash) {
      return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-white transition-colors">
          <Navbar activeUser={activeUser} onLogout={logout} onOpenShortcuts={() => setShortcutsOpen(true)} />
          <Hero />
          <Features />
          <HowItWorks />
          <Testimonials />
          <FAQ />
          <Contact onToast={showToast} />
          <Footer />
        </div>
      );
    }

    // 2. Authentication view
    if (hash === '#/login') {
      return <Login onToast={showToast} />;
    }

    // 3. Authenticated layouts
    if (!activeUser) {
      // Force signin redirect
      setTimeout(() => navigate('#/login'), 50);
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">
          Redirecting to authentication portal...
        </div>
      );
    }

    // Layout configuration for dashboard routes
    let pageComponent = null;

    if (activeUser.role === 'admin') {
      if (hash === '#/admin') pageComponent = <AdminDashboard onToast={showToast} />;
      else if (hash === '#/admin/students') pageComponent = <StudentsDB onToast={showToast} />;
      else if (hash === '#/admin/drills') pageComponent = <DrillManager onToast={showToast} />;
      else if (hash === '#/portal/map') pageComponent = <EvacuationMap />;
      else {
        setTimeout(() => navigate('#/admin'), 50);
        return null;
      }
    } else {
      if (hash === '#/portal') pageComponent = <StudentPortal user={activeUser} />;
      else if (hash.startsWith('#/portal/quiz/')) pageComponent = <Quiz />;
      else if (hash === '#/portal/simulator') pageComponent = <AIDisasterAssistant onToast={showToast} />;
      else if (hash === '#/portal/map') pageComponent = <EvacuationMap />;
      else if (hash === '#/portal/leaderboard') pageComponent = <Leaderboard />;
      else if (hash === '#/portal/contacts') pageComponent = <Contacts />;
      else if (hash === '#/portal/settings') pageComponent = <Settings onToast={showToast} />;
      else {
        setTimeout(() => navigate('#/portal'), 50);
        return null;
      }
    }

    return (
      <div className="flex bg-slate-950 min-h-screen">
        <Sidebar user={activeUser} onLogout={logout} />
        <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen">
          {pageComponent}
        </main>
      </div>
    );
  };

  // Global keyboard shortcuts (landing only — avoid stealing keys in forms/portal)
  useEffect(() => {
    const isLanding = hash === '#/home' || hash === '#/' || !hash;
    if (!isLanding) return;
    const onKey = (e) => {
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return;
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setShortcutsOpen((s) => !s);
      } else if (e.key === 'Escape') {
        setShortcutsOpen(false);
      } else if (e.key === 'g') {
        e.preventDefault();
        const next = (ev) => {
          window.removeEventListener('keydown', next);
          const map = { h: '#/home', f: '#features', q: '#faq', c: '#contacts', l: '#/login' };
          if (map[ev.key]) window.location.hash = map[ev.key];
        };
        window.addEventListener('keydown', next, { once: true });
      } else if (e.key === 't') {
        toggleTheme();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hash, toggleTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
    <AuthContext.Provider value={{ user: activeUser, login, logout, updateUser }}>
      {renderContent()}
      <ShortcutsHelp open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />

      {/* Floating Active Emergency warning overlay (for Students only) */}
      {isAlertVisible && activeUser && activeUser.role === 'student' && (
        <div className="fixed inset-x-0 top-0 z-50 p-4 bg-red-600 text-white flex items-center justify-between shadow-2xl animate-bounce">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-800 text-white animate-pulse">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <span className="font-mono text-[9px] font-extrabold tracking-widest text-red-200 block uppercase">CRITICAL CAMPUS BROADCAST</span>
              <strong className="text-sm md:text-base">{activeDrill.title}</strong>
            </div>
          </div>
          <button
            onClick={() => handleDismissAlert(activeDrill.id)}
            className="p-1 rounded-lg hover:bg-red-700 text-white focus:outline-none"
            title="Acknowledge alert broadcast"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Dynamic Floating Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-50 rounded-xl px-5 py-3.5 shadow-2xl border text-sm font-bold flex items-center gap-3 ${
              toast.type === 'error'
                ? 'bg-red-500/10 border-red-500/20 text-red-400'
                : toast.type === 'info'
                ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}
          >
            <ShieldAlert className="h-4.5 w-4.5 flex-shrink-0" />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
