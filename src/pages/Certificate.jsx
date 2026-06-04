import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Download, Shield, CheckCircle2, BookOpen, FileText, Info, Share2 } from 'lucide-react';
import { useAuth } from '../App';
import { useThemeContext } from '../App';
import { navigate } from '../hooks/useRoute';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const LEARNING_MODULES = [
  { id: 'flood', label: 'Flood Safety', emoji: '🌊' },
  { id: 'earthquake', label: 'Earthquake Safety', emoji: '🌍' },
  { id: 'fire', label: 'Fire Safety', emoji: '🔥' },
  { id: 'cyclone', label: 'Cyclone Safety', emoji: '🌀' },
  { id: 'firstaid', label: 'First Aid', emoji: '🏥' }
];

function generateCertificateId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'DPRES-';
  for (let i = 0; i < 12; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
    if (i === 3 || i === 7) id += '-';
  }
  return id;
}

function CertificatePreview({ userName, institution, date, certId, score, isDark }) {
  return (
    <div id="certificate-content" className="relative w-full max-w-3xl mx-auto p-1">
      <div className={`relative rounded-2xl border-2 overflow-hidden shadow-2xl ${
        isDark ? 'border-amber-500/25 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900' : 'border-amber-400/30 bg-gradient-to-br from-amber-50/30 via-white to-blue-50/20'
      }`}>
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-amber-500/12 to-transparent rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-amber-500/12 to-transparent rounded-tl-full" />
        <div className="absolute top-5 left-5 right-5 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
        <div className="absolute bottom-5 left-5 right-5 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

        <div className={`m-6 p-8 rounded-xl border relative ${
          isDark ? 'border-amber-500/10 bg-slate-950/60' : 'border-amber-300/20 bg-white/80'
        }`}>
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/25 mb-3">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>

          <div className="text-center mb-5">
            <p className="text-[10px] font-mono font-bold tracking-[0.3em] text-amber-500/70 uppercase mb-2">Certificate of Achievement</p>
            <h1 className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Disaster Preparedness</h1>
            <h2 className="text-xl font-bold text-amber-500 mt-1">Awareness Certificate</h2>
          </div>

          <div className="text-center mb-5">
            <p className={`text-xs mb-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>This is to certify that</p>
            <p className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{userName}</p>
            <p className={`text-xs mb-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>of</p>
            <p className="text-base font-semibold text-blue-600 dark:text-blue-400">{institution}</p>
            <p className={`text-xs mt-2 max-w-md mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              has successfully completed the Disaster Preparedness Awareness Program,
              demonstrating knowledge of emergency response and safety protocols.
            </p>
          </div>

          <div className="flex justify-center mb-5">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">
              <Award className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-bold text-amber-500">Preparedness Score: {score}/15</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center text-[10px]">
            {[
              { label: 'Certificate ID', value: certId },
              { label: 'Date Issued', value: date },
              { label: 'Issued By', value: 'DPRES Platform' }
            ].map(({ label, value }) => (
              <div key={label}>
                <p className={`mb-1 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{label}</p>
                <p className={`font-mono font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{value}</p>
              </div>
            ))}
          </div>

          <div className="absolute bottom-4 right-4 opacity-[0.04]">
            <Shield className={`h-24 w-24 ${isDark ? 'text-white' : 'text-slate-900'}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Certificate() {
  const { user } = useAuth();
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const certRef = useRef(null);
  const [generating, setGenerating] = useState(false);
  const [certId] = useState(generateCertificateId);
  const [downloaded, setDownloaded] = useState(false);

  const userName = user?.name || 'Student';
  const institution = 'DPRES Campus Safety Program';
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const completedModules = user?.completedModules || [];
  const isEligible = completedModules.length >= 3 || user?.quizCompleted;

  const downloadPDF = async () => {
    setGenerating(true);
    try {
      const element = document.getElementById('certificate-content');
      if (!element) return;
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: isDark ? '#020617' : '#ffffff', logging: false });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`DPRES-Certificate-${certId}.pdf`);
      setDownloaded(true);
    } catch (err) { console.error('PDF generation failed:', err); }
    finally { setGenerating(false); }
  };

  const card = isDark ? 'bg-[#0f172a] border border-white/[0.06]' : 'bg-white border border-slate-100';
  const cardShadow = isDark ? '0 4px 24px rgba(0,0,0,0.35)' : '0 4px 24px rgba(0,0,0,0.06)';

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <span className="section-label">Certification</span>
        <h1 className={`text-2xl font-extrabold tracking-tight mt-1 flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center"
            style={{ boxShadow: '0 6px 20px rgba(245,158,11,0.3)' }}>
            <Award className="h-5 w-5 text-white" />
          </div>
          Disaster Preparedness Certification
        </h1>
        <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Complete learning modules and the quiz to earn your official certificate.
        </p>
      </motion.div>

      {!isEligible ? (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className={`rounded-2xl p-6 ${card}`} style={{ boxShadow: cardShadow }}
        >
          <div className="flex items-start gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <Info className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h3 className={`text-base font-bold mb-1 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>Not Yet Eligible</h3>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Complete at least 3 learning modules or finish the preparedness quiz to unlock your certificate.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            <button onClick={() => navigate('#/learning-hub')}
              className="px-4 py-2 rounded-xl btn-primary text-xs font-bold flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" /> Visit Learning Hub
            </button>
            <button onClick={() => navigate('#/preparedness-quiz')}
              className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all text-white"
              style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', boxShadow: '0 4px 12px rgba(239,68,68,0.3)' }}>
              <FileText className="h-3.5 w-3.5" /> Take Quiz
            </button>
          </div>

          <div className="mb-4">
            <div className={`flex justify-between text-xs mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <span>Modules: {completedModules.length}/5</span>
              <span>Quiz: {user?.quizCompleted ? '✓ Done' : 'Pending'}</span>
            </div>
            <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <motion.div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (completedModules.length / 3) * 100)}%` }}
                transition={{ duration: 0.8 }} />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {LEARNING_MODULES.map(mod => {
              const done = completedModules.includes(mod.id);
              return (
                <div key={mod.id} className={`p-2.5 rounded-xl text-center text-[10px] border transition-all ${
                  done
                    ? isDark ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : isDark ? 'bg-white/[0.03] border-white/[0.06] text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}>
                  <span className="block text-xl mb-1">{mod.emoji}</span>
                  <span className="font-semibold leading-tight block">{mod.label}</span>
                  {done && <CheckCircle2 className="h-3 w-3 mx-auto mt-1 text-emerald-500" />}
                </div>
              );
            })}
          </div>
        </motion.div>
      ) : (
        <>
          <div ref={certRef}>
            <CertificatePreview userName={userName} institution={institution} date={today} certId={certId}
              score={user?.quizScore || completedModules.length * 3} isDark={isDark} />
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={downloadPDF} disabled={generating}
              className="px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 text-white disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #D97706, #F59E0B)', boxShadow: '0 6px 20px rgba(245,158,11,0.3)' }}>
              {generating
                ? <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                : <Download className="h-4 w-4" />
              }
              {downloaded ? 'Downloaded!' : 'Download PDF Certificate'}
            </button>
            <button onClick={() => navigate('#/portal')}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border ${
                isDark ? 'border-white/[0.08] bg-white/[0.04] text-slate-300 hover:bg-white/[0.07]' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-sm'
              }`}>
              <Share2 className="h-4 w-4" /> Back to Portal
            </button>
          </div>

          {downloaded && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center text-xs text-emerald-500">
              Certificate saved! Your unique ID: {certId}
            </motion.p>
          )}
        </>
      )}
    </div>
  );
}
