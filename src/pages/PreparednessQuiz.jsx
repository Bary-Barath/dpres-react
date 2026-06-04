import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertCircle, CheckCircle2, XCircle, Award, BookOpen, RotateCcw, Share2, ArrowRight, Trophy, Zap, Target } from 'lucide-react';
import { navigate } from '../hooks/useRoute';
import { useAuth } from '../App';

const QUESTIONS = [
  { id: 1, q: 'What is the correct action during an earthquake?', options: ['Run outside immediately', 'Hide under sturdy furniture', 'Use elevator', 'Stand near windows'], answer: 1, explanation: 'During an earthquake, Drop, Cover, and Hold On under sturdy furniture protects you from falling debris.' },
  { id: 2, q: 'What does R.A.C.E stand for in fire emergencies?', options: ['Run, Alert, Call, Evacuate', 'Rescue, Alert, Contain, Extinguish/Evacuate', 'React, Alarm, Contain, Escape', 'Report, Assess, Call, Exit'], answer: 1, explanation: 'R.A.C.E: Rescue anyone in danger, Alert others by activating the alarm, Contain the fire by closing doors, and Extinguish/Evacuate.' },
  { id: 3, q: 'How deep can moving floodwater sweep a person off their feet?', options: ['6 inches (15 cm)', '12 inches (30 cm)', '24 inches (60 cm)', '36 inches (90 cm)'], answer: 0, explanation: 'Just 6 inches of moving water can knock you off your feet. Never attempt to walk through floodwater.' },
  { id: 4, q: 'What should you do first when a fire alarm sounds?', options: ['Gather your belongings', 'Feel the door handle for heat', 'Use the elevator', 'Call your friends'], answer: 1, explanation: 'Always feel the door handle first. If it is hot, do not open the door — find another exit route.' },
  { id: 5, q: 'Which fire extinguisher type is safe for electrical fires?', options: ['Water', 'Foam', 'CO₂ or dry powder', 'Wet chemical'], answer: 2, explanation: 'CO₂ and dry powder extinguishers are safe for electrical fires. Never use water on electrical fires.' },
  { id: 6, q: 'What is the first step in performing CPR?', options: ['Give rescue breaths', 'Check responsiveness', 'Start chest compressions', 'Call emergency services'], answer: 1, explanation: 'First check if the person is responsive — tap and shout "Are you OK?" Then call emergency services.' },
  { id: 7, q: 'Where is the safest place during a cyclone?', options: ['Near windows', 'Outdoors in open space', 'Interior room without windows', 'On the rooftop'], answer: 2, explanation: 'An interior room without windows provides the best protection from flying debris and glass during a cyclone.' },
  { id: 8, q: 'What is the correct compression rate for adult CPR?', options: ['60-80 per minute', '80-100 per minute', '100-120 per minute', '120-140 per minute'], answer: 2, explanation: 'Push hard and fast at 100-120 compressions per minute, at least 5 cm deep.' },
  { id: 9, q: 'What does "Run, Hide, Fight" refer to?', options: ['Fire safety protocol', 'Active threat lockdown', 'Flood evacuation', 'Earthquake response'], answer: 1, explanation: '"Run, Hide, Fight" is the national protocol for active threat situations. Run if safe, Hide if not, Fight as last resort.' },
  { id: 10, q: 'How should you treat a minor burn?', options: ['Apply ice directly', 'Apply butter or oil', 'Cool under cool running water', 'Pop any blisters'], answer: 2, explanation: 'Cool the burn under cool (not cold) running water for at least 10 minutes. Do not apply ice or butter.' },
  { id: 11, q: 'What should be in an emergency kit?', options: ['Only food and water', 'Water, food, first aid, flashlight, radio, documents', 'Only medical supplies', 'Cash and phone charger only'], answer: 1, explanation: 'A complete emergency kit includes water (4L/person/day), non-perishable food, first aid, flashlight, radio, and important documents.' },
  { id: 12, q: 'If caught in a rip current, you should:', options: ['Swim directly against the current', 'Swim parallel to the shore', 'Stand still and wait', 'Dive under the waves'], answer: 1, explanation: 'Swim parallel to the shore to escape the rip current, then swim back to shore at an angle.' },
  { id: 13, q: 'What is the first step when you see someone bleeding severely?', options: ['Clean the wound with water', 'Apply direct pressure', 'Apply a tourniquet', 'Elevate the wound'], answer: 1, explanation: 'Apply firm, direct pressure to the wound using a clean cloth or bandage. This is the most effective way to control bleeding.' },
  { id: 14, q: 'How far should an evacuation assembly point be from buildings?', options: ['At least 10 meters', 'At least 15 meters', 'At least 25 meters', 'At least 50 meters'], answer: 2, explanation: 'Assembly points should be at least 25 meters from buildings to ensure safety from falling debris and explosions.' },
  { id: 15, q: 'What should you do if your clothes catch fire?', options: ['Run to find water', 'Stop, Drop, and Roll', 'Remove the burning clothes', 'Wrap in a blanket'], answer: 1, explanation: 'Stop, Drop, and Roll: Stop moving, drop to the ground, and roll back and forth to smother the flames.' }
];

const QUIZ_TIME = 600; // 10 minutes

const LEVELS = [
  { name: 'Beginner', min: 0, color: '#ef4444', emoji: '🌱', desc: 'Start your preparedness journey by reviewing the learning hub modules.' },
  { name: 'Intermediate', min: 5, color: '#f97316', emoji: '📚', desc: 'Good foundational knowledge. Practice with the learning hub to improve.' },
  { name: 'Advanced', min: 9, color: '#eab308', emoji: '⭐', desc: 'Strong disaster preparedness knowledge. Consider taking the certification.' },
  { name: 'Expert', min: 13, color: '#10b981', emoji: '🏆', desc: 'Outstanding! You are well-prepared for emergency situations.' }
];

function QuestionCard({ question, selected, onSelect, showResult, onNext, isLast, questionNumber, totalQuestions }) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-slate-500">
          Question <strong className="text-slate-900 dark:text-white">{questionNumber}</strong> of {totalQuestions}
        </span>
        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-600">
          ID: Q-{String(question.id).padStart(3, '0')}
        </span>
      </div>

      <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-relaxed">{question.q}</h3>

      <div className="space-y-3">
        {question.options.map((opt, idx) => {
          const isCorrect = idx === question.answer;
          const isSelected = selected === idx;
          const showCorrect = showResult && isCorrect;
          const showWrong = showResult && isSelected && !isCorrect;

          let optionStyle = 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-[#f3f4f6] dark:hover:bg-slate-800/60';
          let icon = null;

          if (showCorrect) {
            optionStyle = 'border-emerald-500 bg-emerald-500/10';
            icon = <CheckCircle2 className="h-5 w-5 text-emerald-400" />;
          } else if (showWrong) {
            optionStyle = 'border-red-500 bg-red-500/10';
            icon = <XCircle className="h-5 w-5 text-red-400" />;
          } else if (isSelected && !showResult) {
            optionStyle = 'border-blue-500 bg-blue-500/10';
          }

          return (
            <button
              key={idx}
              onClick={() => !showResult && onSelect(idx)}
              disabled={showResult}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left group ${optionStyle} ${
                !showResult ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <span className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  isCorrect && showResult ? 'bg-emerald-500/20 text-emerald-400' :
                  showWrong ? 'bg-red-500/20 text-red-400' :
                  'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className={`text-sm ${
                  showResult && isCorrect ? 'text-emerald-300 font-bold' :
                  showResult && showWrong ? 'text-red-300' :
                  'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'
                }`}>
                  {opt}
                </span>
              </div>
              {icon}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`p-4 rounded-xl border ${
              selected === question.answer
                ? 'border-emerald-500/20 bg-emerald-500/5'
                : 'border-red-500/20 bg-red-500/5'
            }`}
          >
            <div className="flex items-start gap-2">
              {selected === question.answer
                ? <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                : <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              }
              <div>
                <p className={`text-sm font-bold mb-1 ${selected === question.answer ? 'text-emerald-300' : 'text-red-300'}`}>
                  {selected === question.answer ? 'Correct!' : 'Incorrect'}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">{question.explanation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showResult && (
        <button
          onClick={onNext}
          className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
        >
          {isLast ? 'View Results' : 'Next Question'}
          <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  );
}

function ResultScreen({ score, total, timeTaken, onRetry }) {
  const percent = Math.round((score / total) * 100);
  const level = LEVELS.reverse().find(l => score >= l.min) || LEVELS[0];
  // Fix order
  const sortedLevels = LEVELS.sort((a, b) => b.min - a.min);
  const earnedLevel = sortedLevels.find(l => score >= l.min) || sortedLevels[sortedLevels.length - 1];

  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg mx-auto text-center space-y-8"
    >
      {/* Score Circle */}
      <div className="relative inline-flex">
        <div className={`h-36 w-36 rounded-full flex items-center justify-center border-4`}
          style={{
            borderColor: earnedLevel.color,
            background: `${earnedLevel.color}15`
          }}
        >
          <div>
            <div className="text-4xl font-extrabold text-slate-900 dark:text-white">{score}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">/ {total}</div>
          </div>
        </div>
        <div className="absolute -top-2 -right-2 text-3xl">{earnedLevel.emoji}</div>
      </div>

      {/* Level */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          {earnedLevel.name}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-sm mx-auto">{earnedLevel.desc}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="premium-card p-4">
          <Trophy className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
          <div className="text-lg font-bold text-slate-900 dark:text-white">{percent}%</div>
          <div className="text-[10px] text-slate-600 dark:text-slate-500 uppercase tracking-wider">Score</div>
        </div>
        <div className="premium-card p-4">
          <Clock className="h-5 w-5 text-blue-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-slate-900 dark:text-white">{minutes}:{seconds.toString().padStart(2, '0')}</div>
          <div className="text-[10px] text-slate-600 dark:text-slate-500 uppercase tracking-wider">Time</div>
        </div>
        <div className="premium-card p-4">
          <Target className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-slate-900 dark:text-white">{Math.round((score / total) * 100)}%</div>
          <div className="text-[10px] text-slate-600 dark:text-slate-500 uppercase tracking-wider">Accuracy</div>
        </div>
      </div>

      {/* Recommendations */}
      {earnedLevel.name === 'Beginner' && (
        <div className="p-4 rounded-xl border border-orange-500/20 bg-orange-500/10 text-left">
          <p className="text-sm text-orange-300 font-bold mb-1">Recommendations</p>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Review the Disaster Awareness Learning Hub modules</li>
            <li>• Focus on earthquake, fire, and flood safety basics</li>
            <li>• Practice with the quiz again after studying</li>
          </ul>
        </div>
      )}
      {earnedLevel.name === 'Intermediate' && (
        <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/10 text-left">
          <p className="text-sm text-blue-300 font-bold mb-1">Recommendations</p>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Review topics where you made mistakes</li>
            <li>• Explore the AI Disaster Assistant for detailed guidance</li>
            <li>• Take the certification quiz for official recognition</li>
          </ul>
        </div>
      )}
      {earnedLevel.name === 'Advanced' && (
        <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/10 text-left">
          <p className="text-sm text-yellow-300 font-bold mb-1">Recommendations</p>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Consider taking the certification exam</li>
            <li>• Share your knowledge with fellow students</li>
            <li>• Practice with timed quizzes to improve speed</li>
          </ul>
        </div>
      )}
      {earnedLevel.name === 'Expert' && (
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-left">
          <p className="text-sm text-emerald-300 font-bold mb-1">Outstanding!</p>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• You are ready for the official certification</li>
            <li>• Help train other students in preparedness</li>
            <li>• Continue to stay updated on safety procedures</li>
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={onRetry}
          className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="h-4 w-4" /> Retake Quiz
        </button>
        <button
          onClick={() => navigate('#/learning-hub')}
          className="w-full py-3 rounded-xl premium-card hover:bg-[#f3f4f6] dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
        >
          <BookOpen className="h-4 w-4" /> Review Learning Hub
        </button>
      </div>
    </motion.div>
  );
}

export default function PreparednessQuiz() {
  const { user, updateUser } = useAuth();
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (finished) return;
    if (timeLeft <= 0) {
      finishQuiz();
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, finished]);

  const finishQuiz = useCallback(() => {
    setFinished(true);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    if (user) {
      updateUser({ quizCompleted: true, quizScore: score, quizTime: timeTaken }).catch(() => {});
    }
  }, [score, user, updateUser, startTime]);

  const handleSelect = (idx) => {
    setSelected(idx);
  };

  const handleNext = () => {
    if (selected === QUESTIONS[qIdx].answer) {
      setScore(s => s + 1);
    }
    if (qIdx < QUESTIONS.length - 1) {
      setQIdx(qIdx + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      finishQuiz();
    }
  };

  // Actually compute score after all answers
  const handleNextComplete = () => {
    setShowResult(true);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((qIdx + 1) / QUESTIONS.length) * 100;
  const isLast = qIdx === QUESTIONS.length - 1;

  if (finished) {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    return <ResultScreen score={score} total={QUESTIONS.length} timeTaken={timeTaken} onRetry={() => { setQIdx(0); setSelected(null); setShowResult(false); setScore(0); setFinished(false); setTimeLeft(QUIZ_TIME); }} />;
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-red-400">▶ Preparedness Assessment</span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Disaster Preparedness Quiz</h1>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold ${
          timeLeft < 60 ? 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse' :
          timeLeft < 180 ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
          'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm'
        }`}>
          <Clock className="h-4 w-4" />
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-500">
          <span>Question {qIdx + 1} of {QUESTIONS.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <QuestionCard
          key={qIdx}
          question={QUESTIONS[qIdx]}
          selected={selected}
          onSelect={handleSelect}
          showResult={showResult}
          onNext={handleNext}
          isLast={isLast}
          questionNumber={qIdx + 1}
          totalQuestions={QUESTIONS.length}
        />
      </AnimatePresence>

      {/* Spacer for Answered indicator */}
      {selected !== null && !showResult && (
        <button
          onClick={handleNextComplete}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
        >
          Submit Answer
          <ArrowRight className="h-4 w-4" />
        </button>
      )}

      {/* Progress dots */}
      <div className="flex justify-center gap-1.5">
        {QUESTIONS.map((_, idx) => (
          <div
            key={idx}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === qIdx ? 'w-6 bg-red-500' :
              idx < qIdx ? 'w-2 bg-emerald-500' :
              'w-2 bg-slate-200 dark:bg-slate-800'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
