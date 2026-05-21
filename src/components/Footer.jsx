import React from 'react';
import { ShieldAlert, Github, Twitter, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-500 py-12 text-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-900 pb-8">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600">
              <ShieldAlert className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="font-sans text-base font-extrabold tracking-wide text-white">DPRES</span>
              <span className="block font-mono text-[7px] tracking-wider text-slate-600 font-bold uppercase">Campus Security System</span>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-8 text-xs font-semibold text-slate-400">
            <a href="#features" className="hover:text-red-400 transition-colors">Features</a>
            <a href="#faq" className="hover:text-red-400 transition-colors">Support & FAQs</a>
            <a href="#contacts" className="hover:text-red-400 transition-colors">Emergency Protocol</a>
            <a href="#/login" className="hover:text-red-400 transition-colors">Launch Portal</a>
          </div>

          {/* Socials */}
          <div className="flex gap-4">
            <a href="#" className="h-8 w-8 rounded-lg border border-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-800 transition-colors">
              <Github className="h-4 w-4" />
            </a>
            <a href="#" className="h-8 w-8 rounded-lg border border-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-800 transition-colors">
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 text-xs text-slate-600 gap-4">
          <p>© {new Date().getFullYear()} DPRES platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-red-500 fill-current" /> for university emergency preparedness.
          </p>
        </div>
      </div>
    </footer>
  );
}
