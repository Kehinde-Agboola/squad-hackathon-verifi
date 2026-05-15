'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { XOctagon, FileX, Banknote } from 'lucide-react';
import ProblemTerminal from './ProblemTerminal';

const PROBLEMS = [
  { icon: XOctagon, label: 'No CAC verification' },
  { icon: Banknote, label: 'No bank account matching' },
  { icon: FileX,    label: 'No document authenticity check' },
];

export const ProblemSection: React.FC = () => {
  return (
    <section
      id="problem"
      className="relative py-32 px-6 overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, #080C10 0%, #0B0F14 50%, #080C10 100%)',
      }}
    >
      {/* Subtle red glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 80% 30%, rgba(248,81,73,0.08), transparent 60%)',
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: terminal */}
          <ProblemTerminal />

          {/* Right: stat */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[11px] uppercase tracking-[0.2em] font-medium text-ts-red mb-5">
              The hidden cost
            </p>
            <h2
              className="font-ts-display font-semibold tracking-tight leading-[0.95] text-[64px] md:text-[88px] mb-2"
              style={{
                color: '#F85149',
                textShadow:
                  '0 0 50px rgba(248,81,73,0.45), 0 0 120px rgba(248,81,73,0.15)',
              }}
            >
              ₦2.3T
            </h2>
            <p className="text-[16px] text-ts-text-pri mb-2 font-medium">
              Lost to business fraud in Nigeria, annually.
            </p>
            <p className="text-[14px] text-ts-text-sec mb-10 max-w-md leading-relaxed">
              The <span className="text-ts-text-pri">Chowdeck incident</span> wasn&apos;t a one-off.
              Manual KYB lets fakes slip through every day — because the underlying checks were
              never run.
            </p>

            <div className="space-y-2.5 max-w-md">
              {PROBLEMS.map((p, i) => {
                const Icon = p.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg"
                    style={{
                      background: 'rgba(248,81,73,0.06)',
                      border: '1px solid rgba(248,81,73,0.18)',
                    }}
                  >
                    <Icon size={16} className="text-ts-red flex-shrink-0" strokeWidth={2.2} />
                    <span className="text-[13.5px] text-ts-text-pri">{p.label}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
