import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Star } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Dr. Arthur Pendelton',
      role: 'Director of Campus Security, State University',
      content: 'Transitioning from PDF manuals to DPRES has changed our entire training standard. The student engagement scores doubled in the first month, and the live drill tool works flawlessly.',
      rating: 5
    },
    {
      name: 'Sarah Jenkins',
      role: 'Student Representative, CS Dept',
      content: 'The quiz modules and the AI simulator make safety training feel interactive. I actually know where the server room fire extinguishers are located now, which could save lives.',
      rating: 5
    },
    {
      name: 'Chief Thomas Reyes',
      role: 'Emergency Services Inspector',
      content: 'The DPRES campus evacuation maps are incredibly precise. Being able to inspect floor plans and locate active chemical labs in real-time is a massive upgrade over paper schematics.',
      rating: 5
    }
  ];

  return (
    <section className="py-24 bg-slate-950 text-white relative">
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-red-500/5 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-red-500">
            ▶ Institutional Reviews
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Trusted by security officers & students
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 backdrop-blur-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-4 text-yellow-500">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 italic leading-relaxed">
                  "{t.content}"
                </p>
              </div>

              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-slate-800/80">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-400">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{t.name}</h4>
                  <span className="text-xs text-slate-400">{t.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
