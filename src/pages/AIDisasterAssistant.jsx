import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, Send, Sparkles, Trash2, Phone, Siren, Flame,
  Shield, LifeBuoy, User as UserIcon, AlertTriangle, Zap
} from 'lucide-react';
import { askGemini, isGeminiConfigured } from '../utilities/geminiService';
import { useThemeContext } from '../App';
import BackToHomeButton from '../components/common/BackToHomeButton';

const STORAGE_KEY = 'dpres_disaster_assistant_chat_v1';
const WELCOME_MESSAGE = {
  role: 'assistant',
  content: 'Hello! I am your DPRES AI Disaster Assistant. Ask me about disaster preparedness, emergency response, CPR, floods, earthquakes, fire safety, or emergency kits.',
  ts: Date.now()
};

const QUICK_ACTIONS = [
  { emoji: '🌊', label: 'What should I do during a flood?' },
  { emoji: '❤️', label: 'How do I perform CPR?' },
  { emoji: '🎒', label: 'What should be in an emergency kit?' },
  { emoji: '🔥', label: 'Fire safety tips for schools' },
  { emoji: '🌍', label: 'What to do during an earthquake?' },
  { emoji: '🌀', label: 'Cyclone preparedness checklist' }
];

const EMERGENCY_CONTACTS = [
  { icon: LifeBuoy, label: 'Ambulance', number: '108', color: '#10B981' },
  { icon: Flame, label: 'Fire Service', number: '101', color: '#F97316' },
  { icon: Shield, label: 'Police', number: '100 / 112', color: '#3B82F6' },
  { icon: Siren, label: 'Disaster Helpline', number: '1078', color: '#EF4444' }
];

function loadMessages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [WELCOME_MESSAGE];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch (_) {}
  return [WELCOME_MESSAGE];
}

function renderInline(text) {
  const parts = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0, match, key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith('**')) {
      parts.push(<strong key={`b${key++}`} className="font-bold">{token.slice(2, -2)}</strong>);
    } else {
      parts.push(<em key={`i${key++}`}>{token.slice(1, -1)}</em>);
    }
    last = match.index + token.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function MessageBubble({ message, isDark }) {
  const isUser = message.role === 'user';
  const lines = message.content.split('\n');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/20">
          <Bot className="h-4 w-4 text-white" />
        </div>
      )}
      <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isUser
          ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-tr-sm shadow-lg shadow-blue-600/20'
          : message.error
            ? isDark ? 'bg-red-500/10 border border-red-500/30 text-red-300 rounded-tl-sm' : 'bg-red-50 border border-red-200 text-red-700 rounded-tl-sm'
            : isDark ? 'bg-slate-800 border border-white/[0.06] text-slate-100 rounded-tl-sm' : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-sm'
      }`}>
        {lines.map((line, idx) => (
          <p key={idx} className={idx > 0 ? 'mt-2' : ''}>{renderInline(line)}</p>
        ))}
      </div>
      {isUser && (
        <div className={`h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-slate-800 border border-white/[0.08]' : 'bg-white border border-slate-200 shadow-sm'}`}>
          <UserIcon className={`h-4 w-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
        </div>
      )}
    </motion.div>
  );
}

function TypingIndicator({ isDark }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-3 justify-start">
      <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/20">
        <Bot className="h-4 w-4 text-white" />
      </div>
      <div className={`rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5 border ${isDark ? 'bg-slate-800 border-white/[0.06]' : 'bg-slate-50 border-slate-200'}`}>
        {[0, 150, 300].map((d, i) => (
          <span key={i} className="h-2 w-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
        ))}
      </div>
    </motion.div>
  );
}

export default function AIDisasterAssistant({ onToast }) {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const [messages, setMessages] = useState(loadMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
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
      const reply = await askGemini(apiHistory);
      setMessages(prev => [...prev, { role: 'assistant', content: reply, ts: Date.now() }]);
    } catch (err) {
      const msg = err?.message || 'Something went wrong contacting the AI service.';
      setMessages(prev => [...prev, { role: 'assistant', content: msg, ts: Date.now(), error: true }]);
      onToast?.(msg, 'error');
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const card = isDark ? 'bg-[#0f172a] border border-white/[0.06]' : 'bg-white border border-slate-100';
  const cardShadow = isDark ? '0 4px 24px rgba(0,0,0,0.35)' : '0 4px 24px rgba(0,0,0,0.06)';
  const inputCls = isDark
    ? 'bg-slate-900 border-white/[0.08] text-white placeholder-slate-600 focus:border-blue-500'
    : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500';

  return (
    <div className={`space-y-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
      <BackToHomeButton />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <span className="section-label">DPRES Intelligence</span>
          <h1 className={`text-2xl font-extrabold tracking-tight mt-1 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center"
              style={{ boxShadow: '0 4px 14px rgba(239,68,68,0.3)' }}>
              <Bot className="h-5 w-5 text-white" />
            </div>
            AI Disaster Assistant
          </h1>
          <p className={`text-sm mt-1.5 max-w-xl ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Instant disaster guidance, first-aid assistance, and emergency safety information powered by AI.
          </p>
        </div>
        <button
          onClick={() => { setMessages([{ ...WELCOME_MESSAGE, ts: Date.now() }]); onToast?.('Chat cleared.', 'info'); }}
          className={`rounded-xl px-4 py-2.5 text-xs font-bold flex items-center gap-1.5 self-start transition-all border ${
            isDark ? 'border-white/[0.08] bg-white/[0.04] text-slate-300 hover:text-red-400 hover:border-red-500/30' : 'border-slate-200 bg-white text-slate-600 hover:text-red-500 hover:border-red-200 shadow-sm'
          }`}
        >
          <Trash2 className="h-3.5 w-3.5" /> Clear chat
        </button>
      </div>

      {!configured && (
        <div className={`rounded-2xl border p-4 flex items-start gap-3 ${isDark ? 'border-amber-500/25 bg-amber-500/5' : 'border-amber-200 bg-amber-50'}`}>
          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className={`text-sm ${isDark ? 'text-amber-200' : 'text-amber-800'}`}>
            <strong>Gemini API key not configured.</strong>{' '}
            Add <code className={`px-1.5 py-0.5 rounded font-mono text-xs ${isDark ? 'bg-slate-900 text-amber-300' : 'bg-white border border-amber-200 text-amber-700'}`}>VITE_GEMINI_API_KEY</code> to a <code className={`px-1.5 py-0.5 rounded font-mono text-xs ${isDark ? 'bg-slate-900 text-amber-300' : 'bg-white border border-amber-200 text-amber-700'}`}>.env</code> file.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chat column */}
        <div className="lg:col-span-2 space-y-4">
          <div className={`rounded-2xl overflow-hidden flex flex-col h-[540px] ${card}`} style={{ boxShadow: cardShadow }}>
            <div className={`px-4 py-3 border-b flex items-center justify-between ${isDark ? 'border-white/[0.05]' : 'border-slate-100'}`}>
              <span className={`text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <Sparkles className="h-3 w-3 text-red-400 animate-pulse" /> Live Conversation
              </span>
              <span className={`text-[10px] font-bold font-mono uppercase tracking-widest ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                {messages.length} messages
              </span>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
              {messages.map((m, idx) => <MessageBubble key={`${m.ts}-${idx}`} message={m} isDark={isDark} />)}
              <AnimatePresence>
                {loading && <TypingIndicator key="typing" isDark={isDark} />}
              </AnimatePresence>
            </div>

            <form
              onSubmit={e => { e.preventDefault(); sendMessage(input); }}
              className={`border-t p-3 flex items-center gap-2 ${isDark ? 'border-white/[0.05] bg-slate-950/40' : 'border-slate-100 bg-slate-50/50'}`}
            >
              <input
                ref={inputRef}
                type="text" value={input}
                onChange={e => setInput(e.target.value)}
                disabled={loading}
                placeholder="Ask about floods, CPR, emergency kits..."
                className={`flex-1 rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition-all disabled:opacity-50 ${inputCls}`}
              />
              <button
                type="submit" disabled={loading || !input.trim()}
                className="rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 px-4 py-2.5 text-sm font-bold text-white transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Quick actions */}
          <div className={`rounded-2xl p-5 ${card}`} style={{ boxShadow: cardShadow }}>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Quick Starters</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
              {QUICK_ACTIONS.map((q) => (
                <button key={q.label} onClick={() => sendMessage(q.label)} disabled={loading}
                  className={`text-left rounded-xl border px-4 py-3 text-sm font-medium flex items-center gap-3 transition-all disabled:opacity-50 ${
                    isDark
                      ? 'border-white/[0.06] bg-white/[0.02] text-slate-300 hover:border-blue-500/30 hover:bg-blue-500/5 hover:text-white'
                      : 'border-slate-100 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 shadow-sm hover:shadow'
                  }`}
                >
                  <span className="text-lg flex-shrink-0">{q.emoji}</span>
                  <span className="flex-1 text-xs font-semibold">{q.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <aside className="space-y-4">
          <div className={`rounded-2xl p-5 ${card}`} style={{ boxShadow: cardShadow }}>
            <div className="flex items-center gap-2 mb-4">
              <Siren className="h-4 w-4 text-red-500" />
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>National Helplines</h3>
            </div>
            <div className="space-y-2.5">
              {EMERGENCY_CONTACTS.map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.label} className={`rounded-xl p-3 flex items-center gap-3 border ${
                    isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-slate-50 border-slate-100'
                  }`}>
                    <div className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${c.color}15` }}>
                      <Icon className="h-5 w-5" style={{ color: c.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[10px] font-mono uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{c.label}</p>
                      <p className="text-base font-extrabold" style={{ color: c.color }}>{c.number}</p>
                    </div>
                    <a href={`tel:${c.number.split('/')[0].trim()}`}
                      className={`rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 transition-colors border ${
                        isDark ? 'border-white/[0.08] bg-white/[0.06] text-slate-300 hover:text-white' : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900 shadow-sm'
                      }`}>
                      <Phone className="h-3 w-3" /> Call
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`rounded-2xl p-5 border ${
            isDark ? 'border-amber-500/15 bg-amber-500/5' : 'border-amber-100 bg-gradient-to-br from-amber-50 to-yellow-50'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <span className={`text-xs font-bold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>Safety Note</span>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-amber-800/80'}`}>
              The AI Assistant provides educational guidance only. For any life-threatening emergency, call local emergency services immediately.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
