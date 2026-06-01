import React, { useState } from 'react';
import { Phone, Mail, Send, ShieldAlert, HeartPulse, Shield, Flame, Clock, CheckCircle2 } from 'lucide-react';

const MAX_MESSAGE = 500;

export default function Contact({ onToast }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.message.trim()) e.message = 'Message cannot be empty.';
    else if (form.message.length > MAX_MESSAGE) e.message = `Message must be under ${MAX_MESSAGE} characters.`;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      onToast('Please fix the highlighted fields.', 'error');
      return;
    }
    setSending(true);
    setTimeout(() => {
      onToast('Message sent! Our safety unit will respond shortly.', 'success');
      setForm({ name: '', email: '', message: '' });
      setErrors({});
      setSending(false);
    }, 1000);
  };

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const directory = [
    { name: 'Campus Safety Console', number: '9842410036', desc: 'Central Dispatch Unit', icon: Shield, color: 'text-blue-500 bg-blue-500/10' },
    { name: 'University Medical Center', number: '9875463120', desc: 'Active Triage & First Aid', icon: HeartPulse, color: 'text-green-500 bg-green-500/10' },
    { name: 'Local Authorities Dispatch', number: '100', desc: 'Police Division Dispatcher', icon: ShieldAlert, color: 'text-orange-500 bg-orange-500/10' },
    { name: 'State Fire Service', number: '101', desc: 'Emergency Fire Containment', icon: Flame, color: 'text-red-500 bg-red-500/10' }
  ];

  const fieldClass = (field) =>
    `w-full rounded-lg border bg-white dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none transition-colors ${
      errors[field]
        ? 'border-red-500/60 focus:border-red-500'
        : 'border-slate-200 dark:border-slate-800 focus:border-red-500'
    }`;

  return (
    <section id="contacts" className="py-24 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white relative transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-red-500">
            ▶ Emergency Support & Feedback
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Get in touch with Safety Units
          </h2>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            Have questions about drill schedules, administrative registrations, or custom integrations? Contact us directly.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-stretch">
          {/* Quick Contact Form */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 p-8 backdrop-blur-sm flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Mail className="h-5 w-5 text-red-500" aria-hidden="true" /> Send a Message
              </h3>
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-300">
                <Clock className="h-3 w-3" aria-hidden="true" /> Replies in ~2h
              </span>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Your Name</label>
                <input
                  id="contact-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="e.g. Alex Smith"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'contact-name-err' : undefined}
                  className={fieldClass('name')}
                />
                {errors.name && <p id="contact-name-err" className="mt-1.5 text-xs text-red-500 dark:text-red-400">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Email Address</label>
                <input
                  id="contact-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="you@campus.edu"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'contact-email-err' : undefined}
                  className={fieldClass('email')}
                />
                {errors.email && <p id="contact-email-err" className="mt-1.5 text-xs text-red-500 dark:text-red-400">{errors.email}</p>}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Message</label>
                  <span className={`text-[10px] font-mono ${form.message.length > MAX_MESSAGE ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'}`}>
                    {form.message.length}/{MAX_MESSAGE}
                  </span>
                </div>
                <textarea
                  id="contact-message"
                  rows={4}
                  value={form.message}
                  maxLength={MAX_MESSAGE + 50}
                  onChange={(e) => update('message', e.target.value)}
                  placeholder="Describe your inquiry..."
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'contact-message-err' : undefined}
                  className={`${fieldClass('message')} resize-none`}
                />
                {errors.message && <p id="contact-message-err" className="mt-1.5 text-xs text-red-500 dark:text-red-400">{errors.message}</p>}
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed py-3 text-sm font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-950"
              >
                {sending ? (
                  <>
                    <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>Send Message <Send className="h-4 w-4" aria-hidden="true" /></>
                )}
              </button>
              <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" aria-hidden="true" />
                Your details are only used to respond to this message.
              </p>
            </form>
          </div>

          {/* Emergency Call list */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 p-8 backdrop-blur-sm flex flex-col justify-between shadow-sm">
            <div>
              <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white flex items-center gap-2">
                <Phone className="h-5 w-5 text-red-500 animate-pulse" aria-hidden="true" /> Emergency Hotline Directory
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                If there is an active fire or safety hazard, call these lines immediately from your mobile device.
              </p>

              <div className="space-y-4">
                {directory.map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <a
                      key={idx}
                      href={`tel:${item.number}`}
                      className="group flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-red-500/40 hover:bg-white dark:hover:bg-slate-900/40 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${item.color}`}>
                          <IconComp className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
                            {item.name}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block font-mono text-sm font-bold text-red-500">{item.number}</span>
                        <span className="inline-block mt-1 rounded bg-red-500/10 px-2 py-0.5 text-[10px] font-extrabold tracking-widest text-red-500 dark:text-red-400 uppercase">
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
