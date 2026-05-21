import React, { useState } from 'react';
import { HelpCircle, ChevronRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../App';
import { useRoute, navigate } from '../hooks/useRoute';
import { QUIZ_DATA } from '../data/quizData';

export default function Quiz() {
  const { user, updateUser } = useAuth();
  const hash = useRoute();
  
  // Extract topic from route e.g. "#/portal/quiz/fire" -> "fire"
  const topic = hash.split('/').pop();
  const quiz = QUIZ_DATA[topic] || QUIZ_DATA.fire;
  
  const [qIdx, setQIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  
  const currentQuestion = quiz.questions[qIdx];
  const progressPct = ((qIdx + 1) / quiz.questions.length) * 100;

  const handleNext = async () => {
    if (selectedOption === null) return;

    if (qIdx < quiz.questions.length - 1) {
      setQIdx(qIdx + 1);
      setSelectedOption(null);
    } else {
      // Completed last question! Sync completed modules to the profile
      if (user && !(user.completedModules || []).includes(topic)) {
        const newCompleted = [...(user.completedModules || []), topic];
        await updateUser({ completedModules: newCompleted });
      }
      navigate('#/portal');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto text-white">
      {/* Header */}
      <div>
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-500">▶ Safety Certification Quiz</span>
        <h1 className={`text-3xl font-extrabold tracking-tight mt-1 flex items-center gap-2 ${quiz.textColor}`}>
          <span>{quiz.emoji}</span> {quiz.title.toUpperCase()} TEST
        </h1>
      </div>

      {/* Progress tracker bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold text-slate-500 font-mono">
          <span>Progress Log</span>
          <span>{qIdx + 1} of {quiz.questions.length} Questions</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%`, backgroundColor: quiz.color }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm shadow-xl space-y-6">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-wider" style={{ color: quiz.color }}>
            Question 0{qIdx + 1}
          </span>
          <h3 className="text-lg font-bold text-slate-200 mt-2 leading-relaxed">
            {currentQuestion.q}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedOption(idx)}
                className={`w-full text-left p-4 rounded-xl border text-sm font-semibold transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-red-500/10 border-red-500 text-red-400 font-bold shadow-md shadow-red-500/5'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/20 text-slate-300'
                }`}
              >
                <span>{opt}</span>
                <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'border-red-500' : 'border-slate-800'
                }`}>
                  {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-red-500" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
          <button
            onClick={() => navigate('#/portal')}
            className="text-xs font-bold text-slate-500 hover:text-white flex items-center gap-1.5 focus:outline-none"
          >
            <ArrowLeft className="h-4 w-4" /> Cancel Quiz
          </button>

          <button
            onClick={handleNext}
            disabled={selectedOption === null}
            className="rounded-xl px-5 py-3 text-sm font-bold text-white transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: selectedOption !== null ? quiz.color : 'rgba(255, 255, 255, 0.05)' }}
          >
            {qIdx < quiz.questions.length - 1 ? 'Next Question' : 'Finish Certification'}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
