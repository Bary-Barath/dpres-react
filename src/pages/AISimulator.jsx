import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, BrainCircuit, RefreshCw, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import { mockGemini } from '../utilities/mockGemini';

export default function AISimulator({ onToast }) {
  const [scenario, setScenario] = useState('');
  const [response, setResponse] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null); // { text, rating }
  const [generating, setGenerating] = useState(false);

  const fetchScenario = async () => {
    setGenerating(true);
    setScenario('');
    setResponse('');
    setEvaluation(null);
    try {
      const result = await mockGemini.generate(
        "Generate a brief, highly realistic safety scenario that happens in a campus lab or facility. Limit to 2 sentences. Focus on an immediate danger like smoke, flood, earthquake tremor, or lockdown alert. Do not include choices or questions.",
        "You are a disaster safety coordinator."
      );
      setScenario(result);
    } catch (e) {
      onToast('Simulated AI Scenario Generation failed.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchScenario();
  }, []);

  const handleEvaluate = async (e) => {
    e.preventDefault();
    if (!response.trim()) {
      onToast('Please enter your action response.', 'warn');
      return;
    }
    setEvaluating(true);
    setEvaluation(null);
    try {
      const result = await mockGemini.generate(
        `Evaluate this student action response for the scenario.
        Scenario: "${scenario}"
        Student Response: "${response}"
        
        Provide constructive feedback, highlight critical hazards or errors (like using elevators), and conclude with: "Safety Rating: X/10"`,
        "You are an expert safety evaluator."
      );

      // Parse rating score from result (looks like "Safety Rating: 8.5/10" or similar)
      const matches = result.match(/Safety Rating:\s*([\d.]+)\/10/);
      const rating = matches ? parseFloat(matches[1]) : 7.5;

      setEvaluation({
        text: result.replace(/Safety Rating:\s*[\d.]+\/10/, '').trim(),
        rating: rating
      });
      onToast('Crisis evaluation computed successfully!', 'success');
    } catch (err) {
      onToast('Simulated AI Evaluation failed.', 'error');
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-blue-500">▶ Reflex Testing Console</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 mt-1 flex items-center gap-2 font-sans">
            <BrainCircuit className="h-7 w-7 text-blue-500" /> AI Safety Simulator
          </h1>
        </div>

        <button
          onClick={fetchScenario}
          disabled={generating || evaluating}
          className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800 transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${generating ? 'animate-spin' : ''}`} /> Generate Scenario
        </button>
      </div>

      {/* Main Grid */}
      <div className="space-y-6">
        {/* Scenario Box */}
        <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 via-slate-900/40 to-transparent p-6 backdrop-blur-sm shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-16 w-16 rounded-full bg-blue-500/5 blur-xl pointer-events-none" />
          <span className="font-mono text-[9px] font-extrabold tracking-widest text-blue-400 uppercase flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-blue-400 animate-pulse" /> Active Scenario Generator
          </span>

          <div className="mt-4 min-h-[50px] flex items-center justify-center">
            {generating ? (
              <div className="space-y-2 w-full animate-pulse">
                <div className="h-4 w-3/4 rounded bg-slate-800" />
                <div className="h-4 w-1/2 rounded bg-slate-800" />
              </div>
            ) : (
              <p className="text-base md:text-lg font-bold text-slate-100 leading-relaxed font-sans">
                {scenario || 'Press Generate to create a disaster scenario.'}
              </p>
            )}
          </div>
        </div>

        {/* Input Form & Evaluation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Action response submission */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm flex flex-col justify-between min-h-[300px]">
            <form onSubmit={handleEvaluate} className="h-full flex flex-col justify-between">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Your Escape Plan</label>
                <textarea
                  rows={6}
                  required
                  disabled={evaluating || generating}
                  value={response}
                  onChange={e => setResponse(e.target.value)}
                  placeholder="Describe your step-by-step escape plan (e.g. drop cover hold on, alert room wardens, follow signs, avoid elevator)..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none transition-colors resize-none disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={evaluating || !response.trim() || generating}
                className="w-full mt-4 rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-sm font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-50"
              >
                <Send className="h-4 w-4" /> {evaluating ? 'Analyzing response...' : 'Submit escape action'}
              </button>
            </form>
          </div>

          {/* AI Evaluation report card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm flex flex-col justify-center min-h-[300px] relative overflow-hidden">
            <AnimatePresence mode="wait">
              {evaluating ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 w-full animate-pulse"
                >
                  <span className="font-mono text-[9px] font-extrabold tracking-widest text-slate-500 uppercase">Evaluation processing</span>
                  <div className="h-6 w-1/3 rounded bg-slate-800" />
                  <div className="space-y-2">
                    <div className="h-3 w-full rounded bg-slate-800" />
                    <div className="h-3 w-5/6 rounded bg-slate-800" />
                    <div className="h-3 w-2/3 rounded bg-slate-800" />
                  </div>
                </motion.div>
              ) : evaluation ? (
                <motion.div
                  key="evaluation"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 h-full flex flex-col justify-between"
                >
                  <div>
                    <span className="font-mono text-[9px] font-extrabold tracking-widest text-slate-500 uppercase block">Reflex Feedback</span>
                    <h4 className="text-xl font-bold mt-1 mb-4 flex items-center gap-1.5">
                      {evaluation.rating >= 8 ? (
                        <ShieldCheck className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      )}
                      <span>Safety Rating: </span>
                      <strong className={evaluation.rating >= 8 ? 'text-emerald-400' : 'text-amber-500'}>
                        {evaluation.rating}/10
                      </strong>
                    </h4>
                    <p className="text-xs md:text-sm text-slate-350 leading-relaxed font-sans">
                      {evaluation.text}
                    </p>
                  </div>

                  <div className="border-t border-slate-800/80 pt-4 mt-4">
                    <span className="inline-block text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">Simulated Gemini 3.5 Engine</span>
                  </div>
                </motion.div>
              ) : (
                <div key="placeholder" className="text-center space-y-2">
                  <HelpCircle className="h-8 w-8 text-slate-650 mx-auto" />
                  <p className="text-xs text-slate-550 font-bold">Write out your escape plan and submit it to receive safety evaluations.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
