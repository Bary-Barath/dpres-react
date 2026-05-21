import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, ShieldAlert, HeartPulse, Shield, Flame } from 'lucide-react';

export default function Contact({ onToast }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      onToast('Please fill all form fields.', 'error');
      return;
    }
    setSending(true);
    setTimeout(() => {
      onToast('Message sent! Our safety unit will respond shortly.', 'success');
      setForm({ name: '', email: '', message: '' });
      setSending(false);
    }, 1000);
  };

  const directory = [
    { name: 'Campus Safety Console', number: '9842410036', desc: 'Central Dispatch Unit', icon: Shield, color: 'text-blue-500 bg-blue-500/10' },
    { name: 'University Medical Center', number: '9875463120', desc: 'Active Triage & First Aid', icon: HeartPulse, color: 'text-green-500 bg-green-500/10' },
    { name: 'Local Authorities Dispatch', number: '100', desc: 'Police Division Dispatcher', icon: ShieldAlert, color: 'text-orange-500 bg-orange-500/10' },
    { name: 'State Fire Service', number: '101', desc: 'Emergency Fire Containment', icon: Flame, color: 'text-red-500 bg-red-500/10' }
  ];

  return (
    <section id="contacts" className="py-24 bg-slate-950 text-white relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-red-500">
            ▶ Emergency Support & Feedback
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Get in touch with Safety Units
          </h2>
          <p className="mt-4 text-sm text-slate-400">
            Have questions about drill schedules, administrative registrations, or custom integrations? Contact us directly.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-stretch">
          {/* Quick Contact Form */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-8 backdrop-blur-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                <Mail className="h-5 w-5 text-red-500" /> Send a Message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Your Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Alex Smith"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-red-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@campus.edu"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-red-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Message</label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Describe your inquiry..."
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-red-500 focus:outline-none transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full rounded-lg bg-red-600 hover:bg-red-500 py-3 text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
                >
                  {sending ? 'Sending...' : <>Send Message <Send className="h-4 w-4" /></>}
                </button>
              </form>
            </div>
          </div>

          {/* Emergency Call list */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-8 backdrop-blur-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2 text-white flex items-center gap-2">
                <Phone className="h-5 w-5 text-red-500 animate-pulse" /> Emergency Hotline Directory
              </h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                If there is an active fire or safety hazard, call these lines immediately from your mobile device.
              </p>

              <div className="space-y-4">
                {directory.map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <a
                      key={idx}
                      href={`tel:${item.number}`}
                      className="group flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-red-500/40 hover:bg-slate-900/40 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${item.color}`}>
                          <IconComp className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                            {item.name}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block font-mono text-sm font-bold text-red-500">{item.number}</span>
                        <span className="inline-block mt-1 rounded bg-red-500/10 px-2 py-0.5 text-[10px] font-extrabold tracking-widest text-red-400 uppercase">
                          CALL
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
