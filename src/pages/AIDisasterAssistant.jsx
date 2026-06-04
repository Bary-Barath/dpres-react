import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Send,
  Sparkles,
  Trash2,
  Phone,
  Siren,
  Flame,
  Shield,
  LifeBuoy,
  User as UserIcon,
  AlertTriangle
} from 'lucide-react';
import { askGemini, isGeminiConfigured } from '../utilities/geminiService';

const STORAGE_KEY = 'dpres_disaster_assistant_chat_v1';

const WELCOME_MESSAGE = {
  role: 'assistant',
  content:
    'Hello! I am your DPRES AI Disaster Assistant. Ask me about disaster preparedness, emergency response, CPR, floods, earthquakes, fire safety, or emergency kits.',
  ts: Date.now()
};

const QUICK_ACTIONS = [
  { emoji: '🌀', label: 'What should I do during a flood?' },
  { emoji: '❤️', label: 'How do I perform CPR?' },
  { emoji: '🎒', label: 'What should be in an emergency kit?' },
  { emoji: '🔥', label: 'Fire safety tips for schools' },
  { emoji: '🌍', label: 'What should I do during an earthquake?' },
  { emoji: '⛈', label: 'Cyclone preparedness checklist' }
];

const EMERGENCY_CONTACTS = [
  { icon: LifeBuoy, label: 'Ambulance', number: '108', color: 'emerald' },
  { icon: Flame, label: 'Fire Service', number: '101', color: 'orange' },
  { icon: Shield, label: 'Police', number: '100 / 112', color: 'blue' },
  { icon: Siren, label: 'Disaster Helpline', number: '1078', color: 'red' }
];

const colorMap = {
  emerald: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400',
  orange: 'border-orange-500/20 bg-orange-500/5 text-orange-400',
  blue: 'border-blue-500/20 bg-blue-500/5 text-blue-400',
  red: 'border-red-500/20 bg-red-500/5 text-red-400'
};

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
  // Simple **bold** and *italic* renderer for assistant replies.
  const parts = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  let match;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith('**')) {
      parts.push(<strong key={`b${key++}`} className="text-slate-900 dark:text-white">{token.slice(2, -2)}</strong>);
    } else {
      parts.push(<em key={`i${key++}`} className="text-slate-800 dark:text-slate-200">{token.slice(1, -1)}</em>);
    }
    last = match.index + token.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function MessageBubble({ message }) {
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

      <div
        className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg ${
          isUser
            ? 'bg-gradient-to-br from-red-600 to-red-500 text-white rounded-tr-sm shadow-red-600/20'
            : message.error
            ? 'bg-red-500/10 border border-red-500/30 text-red-200 rounded-tl-sm'
            : 'bg-slate-100/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-sm'
        }`}
      >
        {lines.map((line, idx) => (
          <p key={idx} className={idx > 0 ? 'mt-2' : ''}>
            {renderInline(line)}
          </p>
        ))}
      </div>

      {isUser && (
        <div className="h-8 w-8 rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0">
          <UserIcon className="h-4 w-4 text-slate-700 dark:text-slate-300" />
        </div>
      )}
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex gap-3 justify-start"
    >
      <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/20">
        <Bot className="h-4 w-4 text-white" />
      </div>
      <div className="bg-slate-100/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-red-400 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="h-2 w-2 rounded-full bg-red-400 animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="h-2 w-2 rounded-full bg-red-400 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </motion.div>
  );
}

export default function AIDisasterAssistant({ onToast }) {
  const [messages, setMessages] = useState(loadMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const configured = useMemo(() => isGeminiConfigured(), []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (_) {}
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
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
      const apiHistory = nextHistory
        .filter((m) => !m.error)
        .map(({ role, content }) => ({ role, content }));
      const reply = await askGemini(apiHistory);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply, ts: Date.now() }]);
    } catch (err) {
      const msg = err?.message || 'Something went wrong contacting the AI service.';
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: msg, ts: Date.now(), error: true }
      ]);
      onToast?.(msg, 'error');
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleClear = () => {
    setMessages([{ ...WELCOME_MESSAGE, ts: Date.now() }]);
    onToast?.('Chat cleared.', 'info');
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-red-500">▶ DPRES Intelligence</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-2 font-sans">
            <Bot className="h-7 w-7 text-red-500" /> AI Disaster Assistant 🤖
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5 max-w-2xl">
            Get instant disaster preparedness guidance, first-aid assistance, and emergency safety information powered by AI.
          </p>
        </div>

        <button
          onClick={handleClear}
          className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-red-400 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Trash2 className="h-3.5 w-3.5" /> Clear chat
        </button>
      </div>

      {!configured && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-200">
            <strong className="text-amber-300">Gemini API key not configured.</strong>{' '}
            Add <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-900 text-amber-700 dark:text-amber-300 font-mono text-xs">VITE_GEMINI_API_KEY</code> to a <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-900 text-amber-700 dark:text-amber-300 font-mono text-xs">.env</code> file in the project root, then restart the dev server.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Chat panel */}
          <div className="premium-card-static overflow-hidden flex flex-col h-[560px]">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="font-mono text-[9px] font-extrabold tracking-widest text-red-400 uppercase flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-red-400 animate-pulse" /> Live conversation
              </span>
              <span className="font-mono text-[9px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest">
                {messages.filter((m) => m.role !== 'assistant' || m.ts !== WELCOME_MESSAGE.ts).length} messages
              </span>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
              {messages.map((m, idx) => (
                <MessageBubble key={`${m.ts}-${idx}`} message={m} />
              ))}
              <AnimatePresence>
                {loading && <TypingIndicator key="typing" />}
              </AnimatePresence>
            </div>

            <form
              onSubmit={handleSubmit}
              className="border-t border-slate-200 dark:border-slate-800 p-3 bg-white dark:bg-slate-950/40 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                placeholder="Ask about floods, CPR, emergency kits, earthquakes, fire safety..."
                className="flex-1 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-600 focus:border-red-500 focus:outline-none transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-xl bg-gradient-to-br from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 px-5 py-3 text-sm font-bold text-white transition-all flex items-center gap-2 shadow-lg shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" /> Ask AI
              </button>
            </form>
          </div>

          {/* Quick actions */}
          <div className="premium-card-static p-5">
            <span className="font-mono text-[9px] font-extrabold tracking-widest text-slate-600 dark:text-slate-400 uppercase">
              Quick starters
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
              {QUICK_ACTIONS.map((q) => (
                <button
                  key={q.label}
                  onClick={() => sendMessage(q.label)}
                  disabled={loading}
                  className="text-left rounded-xl border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 hover:border-red-500/40 hover:bg-red-500/5 px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-lg">{q.emoji}</span>
                  <span className="flex-1">{q.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right info panel */}
        <aside className="space-y-4">
          <div className="premium-card-static p-5">
            <span className="font-mono text-[9px] font-extrabold tracking-widest text-red-400 uppercase flex items-center gap-1.5">
              <Siren className="h-3 w-3" /> Emergency Resources
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1.5">National helplines (India)</h3>
            <div className="mt-4 space-y-2.5">
              {EMERGENCY_CONTACTS.map((c) => {
                const Icon = c.icon;
                return (
                  <div
                    key={c.label}
                    className={`rounded-xl border p-3 flex items-center gap-3 ${colorMap[c.color]}`}
                  >
                    <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-950/40 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-mono uppercase tracking-widest opacity-80">{c.label}</p>
                      <p className="text-base font-extrabold text-white truncate">{c.number}</p>
                    </div>
                    <a
                      href={`tel:${c.number.split('/')[0].trim()}`}
                      className="rounded-lg bg-white/60 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-950 border-slate-200 dark:border-slate-800 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="h-3 w-3" /> Call
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border-slate-200 dark:border-slate-800 bg-gradient-to-br from-red-500/5 via-slate-50 dark:via-slate-900/40 to-transparent p-5 backdrop-blur-sm">
            <span className="font-mono text-[9px] font-extrabold tracking-widest text-red-400 uppercase">Safety note</span>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
              The AI Disaster Assistant provides educational guidance only. For any life-threatening emergency, call local emergency services immediately.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
