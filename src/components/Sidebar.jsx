import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Bell,
  Map,
  Trophy,
  Phone,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bot,
  BookOpen,
  MapPin,
  AlertTriangle,
  Shield,
  FileText,
  Award,
  Wifi,
  BarChart2,
  Sun,
  Moon,
  GraduationCap
} from 'lucide-react';
import { navigate, useRoute } from '../hooks/useRoute';
import { useThemeContext } from '../App';
import Logo from './Logo';

export default function Sidebar({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(true);
  const hash = useRoute();
  const role = user?.role || 'student';
  const { theme, toggleTheme } = useThemeContext();
  const isDark = theme === 'dark';

  const adminLinks = [
    { hash: '#/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { hash: '#/admin/students', icon: Users, label: 'Students DB' },
    { hash: '#/admin/drills', icon: Bell, label: 'Drill Manager' },
    { hash: '#/portal/map', icon: Map, label: 'Campus Map' },
    { hash: '#/preparedness-dashboard', icon: BarChart2, label: 'School Dashboard' },
    { hash: '#/risk-map', icon: MapPin, label: 'Risk Map' }
  ];

  const studentLinks = [
    { hash: '#/portal', icon: LayoutDashboard, label: 'Overview' },
    { hash: '#/portal/simulator', icon: Bot, label: 'AI Assistant' },
    { hash: '#/portal/map', icon: Map, label: 'Evacuation Map' },
    { hash: '#/risk-map', icon: MapPin, label: 'Risk Map' },
    { hash: '#/learning-hub', icon: BookOpen, label: 'Learning Hub' },
    { hash: '#/sos', icon: AlertTriangle, label: 'SOS Dashboard' },
    { hash: '#/preparedness-quiz', icon: FileText, label: 'Preparedness Quiz' },
    { hash: '#/preparedness-dashboard', icon: BarChart2, label: 'School Dashboard' },
    { hash: '#/certificate', icon: Award, label: 'Certificate' },
    { hash: '#/offline-resources', icon: Wifi, label: 'Offline Resources' },
    { hash: '#/portal/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { hash: '#/portal/contacts', icon: Phone, label: 'Contacts' },
    { hash: '#/portal/settings', icon: Settings, label: 'Settings' }
  ];

  const links = role === 'admin' ? adminLinks : studentLinks;

  const lightActive = 'bg-[#eff6ff] border-l-[3px] border-[#2563eb] text-[#2563eb] pl-[10px]';
  const lightInactive = 'text-slate-500 hover:bg-[#f3f4f6] hover:text-slate-800 border-l-[3px] border-transparent';
  const darkActive = 'bg-red-500/10 border-l-[3px] border-red-500 text-red-400 pl-[10px]';
  const darkInactive = 'text-slate-400 hover:bg-slate-800 hover:text-white border-l-[3px] border-transparent';

  return (
    <motion.aside
      animate={{ width: isOpen ? 260 : 72 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={`sticky top-0 h-screen border-r flex flex-col flex-shrink-0 z-40 overflow-hidden smooth-theme ${
        isDark
          ? 'bg-slate-900 border-slate-800 text-white'
          : 'bg-white border-slate-200 text-slate-900 shadow-[1px_0_4px_rgba(0,0,0,0.02),2px_0_8px_rgba(0,0,0,0.04)]'
      }`}
    >
      {/* Sidebar Header */}
      <div className={`px-4 py-4 border-b flex items-center justify-between ${
        isDark ? 'border-slate-800' : 'border-slate-100'
      }`}>
        {isOpen ? (
          <Logo size="sm" forceDark={isDark} onClick={() => navigate('#/home')} />
        ) : (
          <div className="mx-auto">
            <Logo size="sm" showText={false} forceDark={isDark} onClick={() => navigate('#/home')} />
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`rounded-lg p-1.5 flex-shrink-0 transition-colors ${
            isDark
              ? 'text-slate-500 hover:bg-slate-800 hover:text-white'
              : 'text-slate-400 hover:bg-[#f3f4f6] hover:text-slate-700'
          }`}
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>

      {/* User Info */}
      <div className={`px-4 py-5 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        {isOpen ? (
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm ${
              isDark
                ? 'bg-gradient-to-br from-red-500 to-red-700 text-white'
                : 'bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white shadow-sm shadow-blue-500/20'
            }`}>
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>{user?.name}</h4>
              <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${
                role === 'admin'
                  ? isDark ? 'text-red-400' : 'text-[#2563eb]'
                  : isDark ? 'text-orange-400' : 'text-[#059669]'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${
                  role === 'admin'
                    ? isDark ? 'bg-red-500' : 'bg-[#2563eb]'
                    : isDark ? 'bg-orange-500' : 'bg-[#059669]'
                }`} />
                {role === 'admin' ? 'Administrator' : 'Student'}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold text-sm ${
              isDark
                ? 'bg-gradient-to-br from-red-500 to-red-700 text-white'
                : 'bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white'
            }`}>
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>

      {/* Menu Links */}
      <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
        {links.map((link) => {
          const IconComp = link.icon;
          const isExact = link.hash === '#/admin' || link.hash === '#/portal';
          const active = isExact
            ? hash === link.hash
            : hash === link.hash || hash.startsWith(link.hash + '/');

          return (
            <button
              key={link.hash}
              onClick={() => navigate(link.hash)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                active
                  ? isDark ? darkActive : lightActive
                  : isDark ? darkInactive : lightInactive
              }`}
              title={!isOpen ? link.label : undefined}
            >
              <IconComp className={`h-5 w-5 flex-shrink-0 transition-colors ${
                active
                  ? isDark ? 'text-red-400' : 'text-[#2563eb]'
                  : isDark ? 'text-slate-500 group-hover:text-white' : 'text-slate-400 group-hover:text-slate-700'
              }`} />
              {isOpen && <span className="truncate">{link.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Theme Toggle + Logout */}
      <div className={`px-2.5 py-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        {isOpen ? (
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-[#f3f4f6] hover:text-slate-700'
            }`}
          >
            {isDark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-400 hover:bg-[#f3f4f6]'
              }`}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        )}

        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mt-1 ${
            isDark
              ? 'text-slate-500 hover:bg-red-500/10 hover:text-red-400'
              : 'text-slate-400 hover:bg-red-50 hover:text-red-600'
          }`}
          title={!isOpen ? 'Sign Out' : undefined}
        >
          <LogOut className="h-4.5 w-4.5 flex-shrink-0" />
          {isOpen && <span>Sign Out</span>}
        </button>
      </div>
    </motion.aside>
  );
}
