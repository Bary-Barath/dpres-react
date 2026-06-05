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
  AlertTriangle,
  Shield,
  FileText,
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
    { hash: '#/preparedness-dashboard', icon: BarChart2, label: 'Campus Dashboard' }
  ];

  const studentLinks = [
    { hash: '#/portal', icon: LayoutDashboard, label: 'Overview' },
    { hash: '#/portal/simulator', icon: Bot, label: 'AI Assistant' },
    { hash: '#/portal/map', icon: Map, label: 'Evacuation Map' },
    { hash: '#/learning-hub', icon: BookOpen, label: 'Learning Hub' },
    { hash: '#/sos', icon: AlertTriangle, label: 'SOS Dashboard' },
    { hash: '#/preparedness-quiz', icon: FileText, label: 'Preparedness Quiz' },
    { hash: '#/preparedness-dashboard', icon: BarChart2, label: 'Campus Dashboard' },
    { hash: '#/offline-resources', icon: Wifi, label: 'Offline Resources' },
    { hash: '#/portal/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { hash: '#/portal/contacts', icon: Phone, label: 'Contacts' },
    { hash: '#/portal/settings', icon: Settings, label: 'Settings' }
  ];

  const links = role === 'admin' ? adminLinks : studentLinks;

  return (
    <motion.aside
      animate={{ width: isOpen ? 264 : 72 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={`sticky top-0 h-screen flex flex-col flex-shrink-0 z-40 overflow-hidden smooth-theme ${
        isDark
          ? 'bg-[#080f1e] border-r border-white/[0.06] text-white'
          : 'bg-white border-r border-slate-100 text-slate-900'
      }`}
      style={!isDark ? { boxShadow: '4px 0 24px rgba(0,0,0,0.04)' } : {}}
    >
      {/* Sidebar Header */}
      <div className={`px-4 py-4 flex items-center justify-between flex-shrink-0 ${
        isDark ? 'border-b border-white/[0.05]' : 'border-b border-slate-100'
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
          className={`rounded-xl p-1.5 flex-shrink-0 transition-all ${
            isDark
              ? 'text-slate-500 hover:bg-white/[0.05] hover:text-white'
              : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
          }`}
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>

      {/* User Info */}
      <div className={`px-3 py-4 flex-shrink-0 ${isDark ? 'border-b border-white/[0.05]' : 'border-b border-slate-100'}`}>
        {isOpen ? (
          <div className={`flex items-center gap-3 p-2.5 rounded-xl ${
            isDark ? 'bg-white/[0.04]' : 'bg-slate-50'
          }`}>
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
              isDark
                ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white'
                : 'bg-gradient-to-br from-[#2563EB] to-[#1d4ed8] text-white'
            }`}
              style={!isDark ? { boxShadow: '0 4px 12px rgba(37,99,235,0.3)' } : {}}>
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={`text-sm font-semibold truncate leading-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>{user?.name}</h4>
              <span className={`inline-flex items-center gap-1 text-[10px] font-semibold mt-0.5 ${
                role === 'admin'
                  ? isDark ? 'text-blue-400' : 'text-[#2563EB]'
                  : isDark ? 'text-emerald-400' : 'text-emerald-600'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${
                  role === 'admin'
                    ? isDark ? 'bg-blue-400' : 'bg-[#2563EB]'
                    : isDark ? 'bg-emerald-400' : 'bg-emerald-500'
                }`} />
                {role === 'admin' ? 'Administrator' : 'Student'}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-sm ${
              isDark
                ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white'
                : 'bg-gradient-to-br from-[#2563EB] to-[#1d4ed8] text-white'
            }`}>
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Label */}
      {isOpen && (
        <div className="px-5 pt-4 pb-1">
          <span className={`text-[9px] font-bold tracking-widest uppercase ${
            isDark ? 'text-slate-600' : 'text-slate-400'
          }`}>Navigation</span>
        </div>
      )}

      {/* Menu Links */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
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
                  ? isDark
                    ? 'bg-white/[0.07] text-white border border-white/[0.08]'
                    : 'text-white'
                  : isDark
                    ? 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
              style={active && !isDark ? {
                background: 'linear-gradient(90deg, #2563EB, #3B82F6)',
                boxShadow: '0 4px 14px rgba(37,99,235,0.3)'
              } : {}}
              title={!isOpen ? link.label : undefined}
            >
              <IconComp className={`h-[18px] w-[18px] flex-shrink-0 transition-colors ${
                active
                  ? isDark ? 'text-blue-400' : 'text-white'
                  : isDark ? 'text-slate-500 group-hover:text-white' : 'text-slate-400 group-hover:text-slate-700'
              }`} />
              {isOpen && <span className="truncate">{link.label}</span>}
              {isOpen && active && !isDark && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/70 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Theme Toggle + Logout */}
      <div className={`px-3 py-3 flex-shrink-0 ${isDark ? 'border-t border-white/[0.05]' : 'border-t border-slate-100'}`}>
        {isOpen ? (
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isDark
                ? 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            {isDark
              ? <Sun className="h-[18px] w-[18px] text-amber-400" />
              : <Moon className="h-[18px] w-[18px]" />
            }
            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        ) : (
          <div className="flex justify-center mb-1">
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl transition-colors ${
                isDark
                  ? 'text-slate-400 hover:bg-white/[0.05]'
                  : 'text-slate-400 hover:bg-slate-100'
              }`}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark
                ? <Sun className="h-[18px] w-[18px] text-amber-400" />
                : <Moon className="h-[18px] w-[18px]" />
              }
            </button>
          </div>
        )}

        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mt-0.5 ${
            isDark
              ? 'text-slate-500 hover:bg-red-500/10 hover:text-red-400'
              : 'text-slate-400 hover:bg-red-50 hover:text-red-600'
          }`}
          title={!isOpen ? 'Sign Out' : undefined}
        >
          <LogOut className="h-[18px] w-[18px] flex-shrink-0" />
          {isOpen && <span>Sign Out</span>}
        </button>
      </div>
    </motion.aside>
  );
}
