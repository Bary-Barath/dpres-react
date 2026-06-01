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
  Bot
} from 'lucide-react';
import { navigate, useRoute } from '../hooks/useRoute';
import Logo from './Logo';

export default function Sidebar({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(true);
  const hash = useRoute();
  const role = user?.role || 'student';

  const links = role === 'admin'
    ? [
        { hash: '#/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { hash: '#/admin/students', icon: Users, label: 'Students DB' },
        { hash: '#/admin/drills', icon: Bell, label: 'Drill Manager' },
        { hash: '#/portal/map', icon: Map, label: 'Demo Campus Map' }
      ]
    : [
        { hash: '#/portal', icon: LayoutDashboard, label: 'Overview' },
        { hash: '#/portal/simulator', icon: Bot, label: 'AI Disaster Assistant 🤖' },
        { hash: '#/portal/map', icon: Map, label: 'Evacuation Map' },
        { hash: '#/portal/leaderboard', icon: Trophy, label: 'Leaderboard' },
        { hash: '#/portal/contacts', icon: Phone, label: 'Emergency Contacts' },
        { hash: '#/portal/settings', icon: Settings, label: 'Profile Settings' }
      ];

  return (
    <motion.aside
      animate={{ width: isOpen ? 260 : 76 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="sticky top-0 h-screen bg-slate-900 border-r border-slate-800 text-white flex flex-col flex-shrink-0 z-40 overflow-hidden"
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        {isOpen ? (
          <Logo size="sm" forceDark onClick={() => navigate('#/home')} />
        ) : (
          <div className="mx-auto">
            <Logo size="sm" showText={false} forceDark onClick={() => navigate('#/home')} />
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white focus:outline-none ml-auto"
        >
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>

      {/* User Information */}
      <div className="p-4 border-b border-slate-800 flex flex-col items-center md:items-start gap-2">
        {isOpen ? (
          <>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold tracking-widest uppercase border ${
              role === 'admin' ? 'border-red-500/30 bg-red-500/10 text-red-400' : 'border-orange-500/30 bg-orange-500/10 text-orange-400'
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${role === 'admin' ? 'bg-red-500' : 'bg-orange-500'}`} />
              {role === 'admin' ? 'Administrator' : 'Student'}
            </span>
            <div className="w-full mt-2">
              <h4 className="text-sm font-bold text-white truncate">{user?.name}</h4>
              <p className="font-mono text-[10px] text-slate-500 truncate">{user?.email}</p>
            </div>
          </>
        ) : (
          <div className={`h-3 w-3 rounded-full border ${role === 'admin' ? 'border-red-500/50 bg-red-500 shadow-lg shadow-red-500/40' : 'border-orange-500/50 bg-orange-500 shadow-lg shadow-orange-500/40'}`} title={role === 'admin' ? 'Administrator' : 'Student'} />
        )}
      </div>

      {/* Menu Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => {
          const IconComp = link.icon;
          const active = hash === link.hash || (link.hash !== '#/admin' && link.hash !== '#/portal' && hash.startsWith(link.hash));

          return (
            <button
              key={link.hash}
              onClick={() => navigate(link.hash)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                active
                  ? 'bg-red-500/10 border-l-4 border-red-500 text-red-400 pl-2'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white border-l-4 border-transparent'
              }`}
              title={!isOpen ? link.label : undefined}
            >
              <IconComp className={`h-5 w-5 flex-shrink-0 transition-colors ${active ? 'text-red-400' : 'text-slate-400 group-hover:text-white'}`} />
              {isOpen && <span className="truncate">{link.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Cloud Sync Status Indicator */}
      <div className="p-3 mt-auto">
        {isOpen ? (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[9px] font-extrabold tracking-widest text-emerald-400 uppercase">Cloud Synced</span>
            </div>
            <span className="text-xs font-bold text-slate-300">Live Connected</span>
            <span className="text-[10px] text-slate-500">Secure localStorage v2</span>
          </div>
        ) : (
          <div className="flex justify-center p-2 cursor-help rounded-xl border border-emerald-500/20 bg-emerald-500/5" title="Cloud Synced - Active">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        )}
      </div>

      {/* Logout button */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          title={!isOpen ? "Sign Out" : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {isOpen && <span>Sign Out</span>}
        </button>
      </div>
    </motion.aside>
  );
}
