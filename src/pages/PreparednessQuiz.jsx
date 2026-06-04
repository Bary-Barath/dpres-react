import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertCircle, CheckCircle2, XCircle, Award, BookOpen, RotateCcw, ArrowRight, Trophy, Target, Zap } from 'lucide-react';
import { navigate } from '../hooks/useRoute';
import { useAuth } from '../App';
import { useThemeContext } from '../App';
import BackToHomeButton from '../components/common/BackToHomeButton';

const QUESTIONS = [
  { id: 1, q: 'What is the correct action during an earthquake?', options: ['Run outside immediately', 'Hide under sturdy furniture', 'Use elevator', 'Stand near windows'], answer: 1, explanation: 'During an earthquake, Drop, Cover, and Hold On under sturdy furniture protects you from falling debris.' },
  { id: 2, q: 'What does R.A.C.E stand for in fire emergencies?', options: ['Run, Alert, Call, Evacuate', 'Rescue, Alert, Contain, Extinguish/Evacuate', 'React, Alarm, Contain, Escape', 'Report, Assess, Call, Exit'], answer: 1, explanation: 'R.A.C.E: Rescue anyone in danger, Alert others by activating the alarm, Contain the fire by closing doors, and Extinguish/Evacuate.' },
  { id: 3, q: 'How deep can moving floodwater sweep a person off their feet?', options: ['6 inches (15 cm)', '12 inches (30 cm)', '24 inches (60 cm)', '36 inches (90 cm)'], answer: 0, explanation: 'Just 6 inches of moving water can knock you off your feet. Never attempt to walk through floodwater.' },
  { id: 4, q: 'What should you do first when a fire alarm sounds?', options: ['Gather your belongings', 'Feel the door handle for heat', 'Use the elevator', 'Call your friends'], answer: 1, explanation: 'Always feel the door handle first. If it is hot, do not open the door — find another exit route.' },
  { id: 5, q: 'Which fire extinguisher type is safe for electrical fires?', options: ['Water', 'Foam', 'CO₂ or dry powder', 'Wet chemical'], answer: 2, explanation: 'CO₂ and dry powder extinguishers are safe for electrical fires. Never use water on electrical fires.' },
  { id: 6, q: 'What is the first step in performing CPR?', options: ['Give rescue breaths', 'Check responsiveness', 'Start chest compressions', 'Call emergency services'], answer: 1, explanation: 'First check if the person is responsive — tap and shout "Are you OK?" Then call emergency services.' },
  { id: 7, q: 'Where is the safest place during a cyclone?', options: ['Near windows', 'Outdoors in open space', 'Interior room without windows', 'On the rooftop'], answer: 2, explanation: 'An interior room without windows provides the best protection from flying debris during a cyclone.' },
  { id: 8, q: 'What is the correct compression rate for adult CPR?', options: ['60-80 per minute', '80-100 per minute', '100-120 per minute', '120-140 per minute'], answer: 2, explanation: 'Push hard and fast at 100-120 compressions per minute, at least 5 cm deep.' },
  { id: 9, q: 'What does "Run, Hide, Fight" refer to?', options: ['Fire safety protocol', 'Active threat lockdown', 'Flood evacuation', 'Earthquake response'], answer: 1, explanation: '"Run, Hide, Fight" is the national protocol for active threat situations.' },
  { id: 10, q: 'How should you treat a minor burn?', options: ['Apply ice directly', 'Apply butter or oil', 'Cool under cool running water', 'Pop any blisters'], answer: 2, explanation: 'Cool the burn under cool (not cold) running water for at least 10 minutes. Do not apply ice or butter.' },
  { id: 11, q: 'What should be in an emergency kit?', options: ['Only food and water', 'Water, food, first aid, flashlight, radio, documents', 'Only medical supplies', 'Cash and phone charger only'], answer: 1, explanation: 'A complete emergency kit includes water (4L/person/day), non-perishable food, first aid, flashlight, radio, and important documents.' },
  { id: 12, q: 'If caught in a rip current, you should:', options: ['Swim directly against the current', 'Swim parallel to the shore', 'Stand still and wait', 'Dive under the waves'], answer: 1, explanation: 'Swim parallel to the shore to escape the rip current, then swim back to shore at an angle.' },
  { id: 13, q: 'What is the first step when you see someone bleeding severely?', options: ['Clean the wound with water', 'Apply direct pressure', 'Apply a tourniquet', 'Elevate the wound'], answer: 1, explanation: 'Apply firm, direct pressure to the wound using a clean cloth or bandage.' },
  { id: 14, q: 'How far should an evacuation assembly point be from buildings?', options: ['At least 10 meters', 'At least 15 meters', 'At least 25 meters', 'At least 50 meters'], answer: 2, explanation: 'Assembly points should be at least 25 meters from buildings to ensure safety from falling debris.' },
  { id: 15, q: 'What should you do if your clothes catch fire?', options: ['Run to find water', 'Stop, Drop, and Roll', 'Remove the burning clothes', 'Wrap in a blanket'], answer: 1, explanation: 'Stop, Drop, and Roll: Stop moving, drop to the ground, and roll to smother the flames.' }
];

const QUIZ_TIME = 600;
const SORTED_LEVELS = [
  { name: 'Expert', min: 13, color: '#10b981', emoji: '🏆', desc: 'Outstanding! You are well-prepared for emergency situations.' },
  { name: 'Advanced', min: 9, color: '#eab308', emoji: '⭐', desc: 'Strong knowledge. Consider taking the certification.' },
  { name: 'Intermediate', min: 5, color: '#f97316', emoji: '📚', desc: 'Good foundation. Practice with the learning hub to improve.' },
  { name: 'Beginner', min: 0, color: '#ef4444', emoji: '🌱', desc: 'Start your journey by reviewing the learning hub modules.' }
];

function QuestionCard({ question, selected, onSelect, showResult, onNext, isLast, questionNumber, totalQuestions, isDark }) {
  const card = isDark ? 'bg-[#0f172a] border border-white/[0.06]' : 'bg-white border border-slate-100';
  return (
    <motion.div key={question.id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-5">
      <div className="flex items-center justify-between">
        <span className={`text-xs font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Question <strong className={isDark ? 'text-white' : 'text-slate-800'}>{questionNumber}</strong> of {totalQuestions}
        </span>
        <span className={`text-[10px] font-mono ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Q-{String(question.id).padStart(3, '0')}</span>
      </div>

      <h3 className={`text-lg font-bold leading-relaxed ${isDark ? 'text-white' : 'text-slate-800'}`}>{question.q}</h3>

      <div className="space-y-2.5">
        {question.options.map((opt, idx) => {
          const isCorrect = idx === question.answer;
          const isSelected = selected === idx;
          const showCorrect = showResult && isCorrect;
          const showWrong = showResult && isSelected && !isCorrect;

          let cls = isDark
            ? 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.04]'
            : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 shadow-sm';

          if (isSelected && !showResult) cls = isDark ? 'border-blue-500/50 bg-blue-500/10' : 'border-blue-400 bg-blue-50';
          if (showCorrect) cls = isDark ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-emerald-400 bg-emerald-50';
          if (showWrong) cls = isDark ? 'border-red-500/50 bg-red-500/10' : 'border-red-400 bg-red-50';

          return (
            <button key={idx} onClick={() => !showResult && onSelect(idx)} disabled={showResult}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${cls} ${!showResult ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div className="flex items-center gap-3 flex-1">
                <span className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  showCorrect ? isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700' :
                  showWrong ? isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700' :
                  isSelected && !showResult ? isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700' :
                  isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className={`text-sm ${
                  showCorrect ? 'text-emerald-600 dark:text-emerald-400 font-semibold' :
                  showWrong ? 'text-red-600 dark:text-red-400' :
                  isDark ? 'text-slate-200' : 'text-slate-700'
                }`}>{opt}</span>
              </div>
              {showCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />}
              {showWrong && <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {showResult && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className={`p-4 rounded-xl border ${
              selected === question.answer
                ? isDark ? 'border-emerald-500/25 bg-emerald-500/8' : 'border-emerald-200 bg-emerald-50'
                : isDark ? 'border-red-500/25 bg-red-500/8' : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex items-start gap-2">
              {selected === question.answer
                ? <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                : <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              }
              <div>
                <p className={`text-sm font-bold mb-1 ${selected === question.answer ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {selected === question.answer ? 'Correct!' : 'Incorrect'}
                </p>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{question.explanation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showResult && (
        <button onClick={onNext}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
          style={{ boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}
        >
          {isLast ? 'View Results' : 'Next Question'} <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  );
}

function ResultScreen({ score, total, timeTaken, onRetry, isDark }) {
  const percent = Math.round((score / total) * 100);
  const earnedLevel = SORTED_LEVELS.find(l => score >= l.min) || SORTED_LEVELS[SORTED_LEVELS.length - 1];
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;

  const card = isDark ? 'bg-[#0f172a] border border-white/[0.06]' : 'bg-white border border-slate-100';
  const cardShadow = isDark ? '0 4px 24px rgba(0,0,0,0.35)' : '0 4px 24px rgba(0,0,0,0.06)';

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center space-y-7">
      <div className="relative inline-flex">
        <div className="h-36 w-36 rounded-full flex items-center justify-center border-4"
          style={{ borderColor: earnedLevel.color, background: `${earnedLevel.color}12` }}>
          <div>
            <div className={`text-4xl font-extrabold ${isDark ? 'text-white' : 'text-slate-800'}`}>{score}</div>
            <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>/ {total}</div>
          </div>
        </div>
        <div className="absolute -top-2 -right-2 text-3xl">{earnedLevel.emoji}</div>
      </div>

      <div>
        <h2 className={`text-2xl font-extrabold ${isDark ? 'text-white' : 'text-slate-800'}`}>{earnedLevel.name}</h2>
        <p className={`text-sm mt-2 max-w-sm mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{earnedLevel.desc}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Trophy, color: '#F59E0B', label: 'Score', value: `${percent}%` },
          { icon: Clock, color: '#3B82F6', label: 'Time', value: `${minutes}:${seconds.toString().padStart(2,'0')}` },
          { icon: Target, color: '#10B981', label: 'Accuracy', value: `${percent}%` }
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl p-4 ${card}`} style={{ boxShadow: cardShadow }}>
            <s.icon className="h-5 w-5 mx-auto mb-1.5" style={{ color: s.color }} />
            <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{s.value}</div>
            <div className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <button onClick={onRetry}
          className="w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 text-white"
          style={{ background: 'linear-gradient(135deg, #2563EB, #1d4ed8)', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}
        >
          <RotateCcw className="h-4 w-4" /> Retake Quiz
        </button>
        <button onClick={() => navigate('#/learning-hub')}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 border ${
            isDark ? 'border-white/[0.08] bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-sm'
          }`}
        >
          <BookOpen className="h-4 w-4" /> Review Learning Hub
        </button>
      </div>
    </motion.div>
  );
}

export default function PreparednessQuiz() {
  const { user, updateUser } = useAuth();
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME);
  const [startTime] = useState(Date.now());

  const finishQuiz = useCallback(() => {
    setFinished(true);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    if (user) updateUser({ quizCompleted: true, quizScore: score, quizTime: timeTaken }).catch(() => {});
  }, [score, user, updateUser, startTime]);

  useEffect(() => {
    if (finished) return;
    if (timeLeft <= 0) { finishQuiz(); return; }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, finished, finishQuiz]);

  const handleNext = () => {
    if (selected === QUESTIONS[qIdx].answer) setScore(s => s + 1);
    if (qIdx < QUESTIONS.length - 1) { setQIdx(qIdx + 1); setSelected(null); setShowResult(false); }
    else finishQuiz();
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((qIdx + 1) / QUESTIONS.length) * 100;

  const card = isDark ? 'bg-[#0f172a] border border-white/[0.06]' : 'bg-white border border-slate-100';
  const cardShadow = isDark ? '0 4px 24px rgba(0,0,0,0.35)' : '0 4px 24px rgba(0,0,0,0.06)';

  if (finished) {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    return <ResultScreen score={score} total={QUESTIONS.length} timeTaken={timeTaken} isDark={isDark}
      onRetry={() => { setQIdx(0); setSelected(null); setShowResult(false); setScore(0); setFinished(false); setTimeLeft(QUIZ_TIME); }} />;
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <BackToHomeButton />
      <div className="flex items-center justify-between">
        <div>
          <span className="section-label">Preparedness Assessment</span>
          <h1 className={`text-xl font-extrabold mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>Disaster Preparedness Quiz</h1>
        </div>
        <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold border ${
          timeLeft < 60 ? 'bg-red-500/10 text-red-500 border-red-500/25 animate-pulse' :
          timeLeft < 180 ? isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/25' : 'bg-amber-50 text-amber-600 border-amber-200' :
          isDark ? 'bg-white/[0.04] text-slate-300 border-white/[0.08]' : 'bg-white text-slate-700 border-slate-200 shadow-sm'
        }`}>
          <Clock className="h-4 w-4" /> {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-1.5">
        <div className={`flex justify-between text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          <span>Question {qIdx + 1} of {QUESTIONS.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <motion.div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
            initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }}
            style={{ boxShadow: '0 0 8px rgba(37,99,235,0.4)' }} />
        </div>
      </div>

      {/* Question card */}
      <div className={`rounded-2xl p-6 ${card}`} style={{ boxShadow: cardShadow }}>
        <AnimatePresence mode="wait">
          <QuestionCard key={qIdx} question={QUESTIONS[qIdx]} selected={selected} onSelect={setSelected}
            showResult={showResult} onNext={handleNext} isLast={qIdx === QUESTIONS.length - 1}
            questionNumber={qIdx + 1} totalQuestions={QUESTIONS.length} isDark={isDark} />
        </AnimatePresence>
      </div>

      {selected !== null && !showResult && (
        <button onClick={() => setShowResult(true)}
          className="w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 text-white"
          style={{ background: 'linear-gradient(135deg, #2563EB, #1d4ed8)', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}
        >
          Submit Answer <ArrowRight className="h-4 w-4" />
        </button>
      )}

      {/* Progress dots */}
      <div className="flex justify-center gap-1.5">
        {QUESTIONS.map((_, idx) => (
          <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${
            idx === qIdx ? 'w-6 bg-blue-500' :
            idx < qIdx ? 'w-1.5 bg-emerald-500' :
            isDark ? 'w-1.5 bg-slate-700' : 'w-1.5 bg-slate-200'
          }`} />
        ))}
      </div>
    </div>
  );
}
