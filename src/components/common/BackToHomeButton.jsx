import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { navigate } from '../../hooks/useRoute';
import { useThemeContext } from '../../App';
import { useAuth } from '../../App';

export default function BackToHomeButton() {
  const { theme } = useThemeContext();
  const { user } = useAuth();
  const isDark = theme === 'dark';

  const destination = user?.role === 'admin' ? '#/admin' : '#/portal';

  return (
    <motion.button
      onClick={() => navigate(destination)}
      whileHover={{ x: -3 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold border transition-all select-none ${
        isDark
          ? 'bg-[#1e293b] border-[#334155] text-[#f8fafc] hover:border-slate-500 hover:bg-slate-800'
          : 'bg-white border-[#e2e8f0] text-[#334155] hover:border-slate-300 hover:bg-slate-50'
      }`}
      style={{
        boxShadow: isDark
          ? '0 2px 8px rgba(0,0,0,0.3)'
          : '0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)'
      }}
    >
      <ArrowLeft className="h-3.5 w-3.5 flex-shrink-0" />
      Back to Home
    </motion.button>
  );
}
