import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, ShieldAlert } from 'lucide-react';
import { useRoute, navigate } from './hooks/useRoute';
import { useAppData } from './hooks/useAppData';
import { useTheme } from './hooks/useTheme';
import ShortcutsHelp from './components/ShortcutsHelp';
import FloatingAIButton from './components/FloatingAIButton';

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

// NEW Feature Pages
import DisasterRiskMap from './pages/DisasterRiskMap';
import LearningHub from './pages/LearningHub';
import SOSDashboard from './pages/SOSDashboard';
import PreparednessQuiz from './pages/PreparednessQuiz';
import PreparednessDashboard from './pages/PreparednessDashboard';
import Certificate from './pages/Certificate';
import OfflineResources from './pages/OfflineResources';

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

  const [toast, setToast] = useState(null);
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

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
      const u = data.users.find(x => x.email.toLowerCase() === emailLower);
      if (!u) throw new Error('Account credentials not found.');
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
    updateUsers(prev => prev.map(u => u.id === activeUser.id ? { ...u, ...updates } : u));
    sessionStorage.setItem('dpres_active_user', JSON.stringify(updated));
    setActiveUser(updated);
  };

  const activeDrill = data.drills.find(d => d.status === 'Active' && Date.now() - d.timestamp < 180000);
  const isAlertVisible = activeDrill && !dismissedAlerts.includes(activeDrill.id);

  const handleDismissAlert = (id) => {
    setDismissedAlerts(prev => [...prev, id]);
    showToast('Drill warning acknowledged.', 'info');
  };

  /** Routes that use landing page layout (navbar + hero + etc.) */
  const isLandingRoute = hash === '#/home' || hash === '#/' || !hash;

  /** Routes that use no sidebar (login, public pages, standalone pages) */
  const isPublicRoute = isLandingRoute || hash === '#/login' ||
    hash === '#/risk-map' || hash === '#/learning-hub' ||
    hash === '#/sos' || hash === '#/preparedness-dashboard' ||
    hash === '#/preparedness-quiz' || hash === '#/offline-resources';

  const renderContent = () => {
    // Landing Page
    if (isLandingRoute) {
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

    // Authentication
    if (hash === '#/login') {
      return <Login onToast={showToast} />;
    }

    // Public standalone pages (no sidebar needed, but visible to visitors)
    if (hash === '#/risk-map') return <StandaloneLayout><DisasterRiskMap /></StandaloneLayout>;
    if (hash === '#/learning-hub') return <StandaloneLayout><LearningHub /></StandaloneLayout>;
    if (hash === '#/sos') return <StandaloneLayout><SOSDashboard /></StandaloneLayout>;
    if (hash === '#/preparedness-quiz') return <StandaloneLayout><PreparednessQuiz /></StandaloneLayout>;
    if (hash === '#/preparedness-dashboard') return <StandaloneLayout><PreparednessDashboard /></StandaloneLayout>;
    if (hash === '#/offline-resources') return <StandaloneLayout><OfflineResources /></StandaloneLayout>;

    // Authenticated layouts — require login
    if (!activeUser) {
      setTimeout(() => navigate('#/login'), 50);
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">
          Redirecting to authentication portal...
        </div>
      );
    }

    // Certificate (standalone, no sidebar)
    if (hash === '#/certificate') {
      return <StandaloneLayout><Certificate /></StandaloneLayout>;
    }

    // Admin routes
    if (activeUser.role === 'admin') {
      let pageComponent = null;
      if (hash === '#/admin') pageComponent = <AdminDashboard onToast={showToast} />;
      else if (hash === '#/admin/students') pageComponent = <StudentsDB onToast={showToast} />;
      else if (hash === '#/admin/drills') pageComponent = <DrillManager onToast={showToast} />;
      else if (hash === '#/portal/map') pageComponent = <EvacuationMap />;
      else { setTimeout(() => navigate('#/admin'), 50); return null; }
      return (
        <div className="flex page-bg smooth-theme min-h-screen">
          <Sidebar user={activeUser} onLogout={logout} />
          <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen smooth-theme">{pageComponent}</main>
        </div>
      );
    }

    // Student routes
    let pageComponent = null;
    if (hash === '#/portal') pageComponent = <StudentPortal user={activeUser} />;
    else if (hash.startsWith('#/portal/quiz/')) pageComponent = <Quiz />;
    else if (hash === '#/portal/simulator') pageComponent = <AIDisasterAssistant onToast={showToast} />;
    else if (hash === '#/portal/map') pageComponent = <EvacuationMap />;
    else if (hash === '#/portal/leaderboard') pageComponent = <Leaderboard />;
    else if (hash === '#/portal/contacts') pageComponent = <Contacts />;
    else if (hash === '#/portal/settings') pageComponent = <Settings onToast={showToast} />;
    else { setTimeout(() => navigate('#/portal'), 50); return null; }

    return (
      <div className="flex page-bg smooth-theme min-h-screen">
        <Sidebar user={activeUser} onLogout={logout} />
        <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen smooth-theme">{pageComponent}</main>
      </div>
    );
  };

  // Global keyboard shortcuts (landing only)
  useEffect(() => {
    if (!isLandingRoute) return;
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
  }, [hash, toggleTheme, isLandingRoute]);

  const showFloatingAI = !isLandingRoute && hash !== '#/login';

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
    <AuthContext.Provider value={{ user: activeUser, login, logout, updateUser }}>
      {renderContent()}
      <ShortcutsHelp open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      {showFloatingAI && <FloatingAIButton />}

      {/* Floating Active Emergency warning overlay */}
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
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Toast notifications */}
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

/** Standalone layout for public pages (theme-aware, centered content, no sidebar) */
function StandaloneLayout({ children }) {
  return (
    <div className="min-h-screen smooth-theme" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-slate-900 dark:text-white">
        {children}
      </div>
    </div>
  );
}
