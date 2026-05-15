'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Upload, ShieldCheck, Award, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    icon: Upload,
    label: 'SUBMIT',
    title: 'Organisation submits vendor',
    body:
      'Business name, bank account, and CAC document uploaded through our dashboard or REST API.',
  },
  {
    icon: ShieldCheck,
    label: 'VERIFY',
    title: 'AI + Squad runs the checks',
    body:
      'CAC registry lookup, bank name match via Squad, document authenticity analysis — all in parallel.',
  },
  {
    icon: Award,
    label: 'RESULT',
    title: 'Trust score issued instantly',
    body:
      'Verified vendors get a trust badge. Fakes never make it through. Average decision: 53s.',
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-ts-green font-medium mb-4">
            How it works
          </p>
          <h2 className="text-4xl md:text-5xl font-ts-display font-semibold tracking-tight">
            From submission to verified <span className="text-ts-text-sec">in minutes</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -4 }}
                  className="relative rounded-2xl p-7 group transition-colors"
                  style={{
                    background: '#0D1117',
                    border: '1px solid #21262D',
                  }}
                >
                  {/* Step number watermark */}
                  <div className="absolute top-5 right-6 text-[11px] font-ts-mono tracking-widest text-ts-text-mut">
                    0{i + 1}
                  </div>

                  {/* Icon tile */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-6"
                    style={{
                      background: 'rgba(0,217,126,0.10)',
                      border: '1px solid rgba(0,217,126,0.25)',
                    }}
                  >
                    <Icon size={20} className="text-ts-green" />
                  </div>

                  <p className="text-[10px] uppercase tracking-[0.18em] text-ts-text-mut font-medium mb-2">
                    {step.label}
                  </p>
                  <h3 className="text-lg font-ts-display font-semibold mb-2.5">
                    {step.title}
                  </h3>
                  <p className="text-[14px] text-ts-text-sec leading-relaxed">
                    {step.body}
                  </p>
                </motion.div>

                {/* Arrow between cards (hidden on mobile, last) */}
                {i < STEPS.length - 1 && (
                  <div className="hidden md:flex absolute items-center pointer-events-none"
                    style={{
                      // crude but reliable: position arrows between columns
                      // by leveraging grid column gap visual midpoints
                      top: '50%',
                      left: `${(100 / 3) * (i + 1)}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <ArrowRight size={16} className="text-ts-text-mut" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
