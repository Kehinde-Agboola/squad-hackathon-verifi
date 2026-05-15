'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export const FinalCTA: React.FC = () => {
  return (
    <section
      className="relative py-32 px-6 overflow-hidden"
      style={{
        background:
          'linear-gradient(160deg, #0D1117 0%, #0D2B1E 60%, #00D97E11 100%)',
      }}
    >
      {/* Glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 70% at 50% 100%, rgba(0,217,126,0.18), transparent 60%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-3xl mx-auto text-center"
      >
        <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full text-[11px] uppercase tracking-[0.2em] text-ts-green font-medium"
          style={{
            background: 'rgba(0,217,126,0.10)',
            border: '1px solid rgba(0,217,126,0.30)',
          }}
        >
          <ShieldCheck size={13} />
          Ship trust, not patches
        </div>

        <h2 className="font-ts-display font-semibold tracking-[-0.025em] leading-[1.05] text-[44px] md:text-[64px] mb-6">
          The Chowdeck problem is solved.
          <br />
          <span className="text-ts-green">Is your platform next?</span>
        </h2>

        <p className="text-[16px] text-ts-text-sec max-w-xl mx-auto mb-10">
          Wire VendorShield into your onboarding in under an hour. The next vendor that signs up
          gets verified before they go live.
        </p>

        <Link
          href="/register"
          className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-md text-[15px] font-medium transition-all duration-150 hover:-translate-y-px"
          style={{
            background: '#D29922',
            color: '#080C10',
            boxShadow:
              '0 0 0 1px rgba(210,153,34,0.6), 0 16px 44px -12px rgba(210,153,34,0.6)',
          }}
        >
          Start protecting your platform
          <ArrowRight
            size={17}
            strokeWidth={2.4}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>

        <p className="text-[12px] text-ts-text-mut mt-6">
          No credit card required · 10 free verifications · Live in under an hour
        </p>
      </motion.div>
    </section>
  );
};

export default FinalCTA;
