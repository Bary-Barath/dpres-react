import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Download, Shield, CheckCircle2, BookOpen, FileText, Info, Share2 } from 'lucide-react';
import { useAuth } from '../App';
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

function CertificatePreview({ userName, institution, date, certId, score }) {
  return (
    <div id="certificate-content" className="relative w-full max-w-3xl mx-auto p-1">
      <div className="relative rounded-2xl border-2 border-yellow-500/30 bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 overflow-hidden shadow-2xl">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-yellow-500/10 to-transparent rounded-tl-full" />
        <div className="absolute top-4 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent" />

        {/* Border frame */}
        <div className="m-6 p-8 border border-yellow-500/10 rounded-xl bg-white/80 dark:bg-slate-950/80 relative">
          {/* Top Seal */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 shadow-lg shadow-yellow-500/20 mb-3">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <p className="text-[10px] font-mono font-bold tracking-[0.3em] text-yellow-500/60 uppercase mb-2">Certificate of Achievement</p>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Disaster Preparedness</h1>
            <h2 className="text-xl font-bold text-yellow-400 mt-1">Awareness Certificate</h2>
          </div>

          {/* Body */}
          <div className="text-center mb-6">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">This is to certify that</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white mb-1">{userName}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">of</p>
            <p className="text-base font-semibold text-blue-600 dark:text-blue-300">{institution}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 max-w-md mx-auto">
              has successfully completed the Disaster Preparedness Awareness Program,
              demonstrating knowledge of emergency response and safety protocols.
            </p>
          </div>

          {/* Score */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20">
              <Award className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-bold text-yellow-400">Preparedness Score: {score}/15</span>
            </div>
          </div>

          {/* Footer */}
          <div className="grid grid-cols-3 gap-4 text-center text-[10px]">
            <div>
              <p className="text-slate-600 dark:text-slate-500 mb-1">Certificate ID</p>
              <p className="font-mono font-bold text-slate-700 dark:text-slate-300">{certId}</p>
            </div>
            <div>
              <p className="text-slate-600 dark:text-slate-500 mb-1">Date Issued</p>
              <p className="font-mono font-bold text-slate-700 dark:text-slate-300">{date}</p>
            </div>
            <div>
              <p className="text-slate-600 dark:text-slate-500 mb-1">Issued By</p>
              <p className="font-bold text-slate-700 dark:text-slate-300">DPRES Platform</p>
            </div>
          </div>

          {/* Bottom watermark */}
          <div className="absolute bottom-4 right-4 opacity-[0.03]">
            <Shield className="h-24 w-24 text-slate-900 dark:text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Certificate() {
  const { user } = useAuth();
  const certRef = useRef(null);
  const [generating, setGenerating] = useState(false);
  const [certId] = useState(generateCertificateId);
  const [downloaded, setDownloaded] = useState(false);

  const userName = user?.name || 'Student';
  const institution = 'DPRES Campus Safety Program';
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Check eligibility: completed at least 3 modules or scored on quiz
  const completedModules = user?.completedModules || [];
  const isEligible = completedModules.length >= 3 || user?.quizCompleted;

  const downloadPDF = async () => {
    setGenerating(true);
    try {
      const element = document.getElementById('certificate-content');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#020617',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`DPRES-Certificate-${certId}.pdf`);
      setDownloaded(true);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-red-400">▶ Certification</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1 flex items-center gap-3">
          <Award className="h-8 w-8 text-yellow-500" />
          Disaster Preparedness Certification
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          Earn your official Disaster Preparedness Awareness Certificate by completing the learning modules and quiz.
        </p>
      </div>

      {/* Eligibility Check */}
      {!isEligible ? (
        <div className="p-6 rounded-2xl border border-orange-500/20 bg-white dark:bg-orange-500/5 shadow-sm">
          <div className="flex items-start gap-3">
            <Info className="h-6 w-6 text-orange-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-bold text-orange-300 mb-2">Not Yet Eligible</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Complete at least 3 learning modules or finish the preparedness quiz to unlock your certificate.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => navigate('#/learning-hub')}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <BookOpen className="h-3.5 w-3.5" /> Visit Learning Hub
                </button>
                <button
                  onClick={() => navigate('#/portal/quiz/fire')}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <FileText className="h-3.5 w-3.5" /> Take Quiz
                </button>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-500 mb-2">
              <span>Modules completed: {completedModules.length}/5</span>
              <span>Quiz completed: {user?.quizCompleted ? 'Yes' : 'No'}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-yellow-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (completedModules.length / 3) * 100)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Module status */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
            {LEARNING_MODULES.map(mod => {
              const done = completedModules.includes(mod.id);
              return (
                <div key={mod.id} className={`p-2 rounded-lg text-center text-[10px] border ${
                  done
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-500 shadow-sm'
                }`}>
                  <span className="block text-base">{mod.emoji}</span>
                  <span className="font-bold">{mod.label}</span>
                  {done && <CheckCircle2 className="h-3 w-3 mx-auto mt-1 text-emerald-400" />}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          {/* Certificate Preview */}
          <div ref={certRef}>
            <CertificatePreview
              userName={userName}
              institution={institution}
              date={today}
              certId={certId}
              score={user?.quizScore || completedModules.length * 3}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={downloadPDF}
              disabled={generating}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-yellow-600/20 disabled:opacity-50"
            >
              {generating ? (
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {downloaded ? 'Downloaded!' : 'Download PDF Certificate'}
            </button>
            <button
              onClick={() => navigate('#/portal')}
              className="px-6 py-3 rounded-xl premium-card hover:bg-[#f3f4f6] dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm transition-colors flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" /> Back to Portal
            </button>
          </div>

          {downloaded && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-xs text-emerald-400"
            >
              Certificate downloaded! Your unique ID: {certId}
            </motion.p>
          )}
        </>
      )}
    </div>
  );
}
