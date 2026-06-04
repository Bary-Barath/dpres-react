import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Sparkles, Trash2, MessageSquare } from 'lucide-react';
import { askGemini, isGeminiConfigured } from '../utilities/geminiService';

const STORAGE_KEY = 'dpres_floating_ai_chat_v1';
const WELCOME = { role: 'assistant', content: 'Hello! I am DPRES AI Disaster Assistant. Ask me anything about emergency preparedness!', ts: Date.now() };

const QUICK_ACTIONS = [
  'What to do during a flood?',
  'How to perform CPR?',
  'Earthquake safety tips',
  'Emergency kit checklist'
];

function loadMessages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) { const parsed = JSON.parse(raw); if (Array.isArray(parsed) && parsed.length) return parsed; }
  } catch (_) {}
  return [WELCOME];
}

export default function FloatingAIButton() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(loadMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const configured = useMemo(() => isGeminiConfigured(), []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch (_) {}
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const userMsg = { role: 'user', content: trimmed, ts: Date.now() };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput('');
    setLoading(true);
    try {
      const apiHistory = nextHistory.filter(m => !m.error).map(({ role, content }) => ({ role, content }));
      const reply = configured ? await askGemini(apiHistory) : 'I am running in offline mode. For full AI features, configure the Gemini API key. For emergencies, please call your local emergency services.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply, ts: Date.now() }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', ts: Date.now(), error: true }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => { e.preventDefault(); sendMessage(input); };
  const handleClear = () => setMessages([{ ...WELCOME, ts: Date.now() }]);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-red-600 to-red-700 text-white shadow-2xl hover:from-red-500 hover:to-red-600 transition-all hover:scale-105 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
        aria-label="Toggle AI Disaster Assistant"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span key="bot" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <Bot className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] premium-card overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-red-600/20 to-transparent">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-red-400" />
                <span className="text-sm font-bold text-white">AI Assistant</span>
              </div>
              <button onClick={handleClear} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-red-400 transition-colors">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="h-80 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-red-600 text-white rounded-tr-sm'
                      : m.error
                      ? 'bg-red-500/10 border border-red-500/30 text-red-200'
                      : 'bg-slate-200/60 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 rounded-tl-sm'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-200/60 dark:bg-slate-800/60 rounded-xl rounded-tl-sm px-3 py-2 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-2 border-t border-slate-200/60 dark:border-slate-800/60 flex gap-1.5 overflow-x-auto">
              {QUICK_ACTIONS.map(q => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  disabled={loading}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 text-[10px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-red-500/40 transition-colors disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t border-slate-200 dark:border-slate-800 p-3 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={loading}
                placeholder="Ask about disasters..."
                className="flex-1 rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-600 focus:border-red-500 focus:outline-none transition-colors disabled:opacity-50 shadow-sm"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-lg bg-red-600 hover:bg-red-500 px-3 py-2 text-white disabled:opacity-50 transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
