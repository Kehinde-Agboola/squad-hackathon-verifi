'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ArrowRight, PlayCircle } from 'lucide-react';
import LiveTicker from './LiveTicker';

export const HeroContent: React.FC = () => {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        gsap.set('.hero-anim', { opacity: 1, y: 0 });
        return;
      }
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.hero-overline', { opacity: 0, y: 12, duration: 0.6 })
        .from(
          '.hero-line',
          { opacity: 0, y: 22, stagger: 0.12, duration: 0.85 },
          '-=0.3',
        )
        .from(
          '.hero-sub',
          { opacity: 0, y: 16, duration: 0.7 },
          '-=0.55',
        )
        .from(
          '.hero-cta',
          { opacity: 0, y: 14, stagger: 0.08, duration: 0.55 },
          '-=0.45',
        )
        .from(
          '.hero-ticker',
          { opacity: 0, y: 18, duration: 0.7 },
          '-=0.25',
        );
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="relative z-[2] mx-auto max-w-5xl px-6 pt-40 md:pt-52 pb-20 text-center"
    >
      {/* Overline */}
      <div className="hero-overline hero-anim flex justify-center mb-8">
        <span
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] font-medium text-ts-green px-3.5 py-1.5 rounded-full"
          style={{
            background: 'rgba(0,217,126,0.08)',
            border: '1px solid rgba(0,217,126,0.25)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-ts-green animate-ts-pulse-dot" />
          Squad Hackathon 3.0
        </span>
      </div>

      {/* Headline */}
      <h1 className="font-ts-display font-semibold tracking-[-0.03em] leading-[1.02] text-[44px] sm:text-[64px] md:text-[84px]">
        <span className="hero-line hero-anim block">Verify every vendor.</span>
        <span className="hero-line hero-anim block">Before they go live.</span>
        <span className="hero-line hero-anim block text-ts-green">
          Instantly<span className="ts-cursor inline-block" />
        </span>
      </h1>

      {/* Subhead */}
      <p
        className="hero-sub hero-anim mt-8 mx-auto max-w-[540px] text-[16px] md:text-[17px] leading-relaxed text-ts-text-sec"
      >
        VendorShield catches fake vendors before they reach your platform — using AI document
        analysis and Squad&apos;s financial trust rails.
      </p>

      {/* CTAs */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/register"
          className="hero-cta hero-anim group inline-flex items-center gap-2 px-5 py-3 rounded-md text-[14px] font-medium transition-all duration-150 hover:-translate-y-px"
          style={{
            background: '#00D97E',
            color: '#080C10',
            boxShadow:
              '0 0 0 1px rgba(0,217,126,0.6), 0 12px 36px -10px rgba(0,217,126,0.55)',
          }}
        >
          Start verifying free
          <ArrowRight
            size={16}
            strokeWidth={2.4}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>

        <a
          href="#live"
          className="hero-cta hero-anim inline-flex items-center gap-2 px-5 py-3 rounded-md text-[14px] font-medium text-ts-text-pri transition-all duration-150 hover:-translate-y-px"
          style={{
            background: 'rgba(13,17,23,0.6)',
            border: '1px solid #30363D',
            backdropFilter: 'blur(8px)',
          }}
        >
          <PlayCircle size={16} strokeWidth={2.2} className="text-ts-green" />
          See it in action
        </a>
      </div>

      {/* Live ticker */}
      <div className="hero-ticker hero-anim mt-16 flex justify-center">
        <LiveTicker />
      </div>
    </div>
  );
};

export default HeroContent;
