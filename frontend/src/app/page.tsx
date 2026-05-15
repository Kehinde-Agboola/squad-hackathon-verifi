'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

import LandingNav    from '@/components/landing/LandingNav';
import HeroContent   from '@/components/landing/HeroContent';
import ProblemSection from '@/components/landing/ProblemSection';
import HowItWorks    from '@/components/landing/HowItWorks';
import LiveDemoFeed  from '@/components/landing/LiveDemoFeed';
import Pricing       from '@/components/landing/Pricing';
import FinalCTA      from '@/components/landing/FinalCTA';

// Load Three.js scene client-side only (it touches window/document)
const TrustNetwork = dynamic(
  () => import('@/components/three/TrustNetwork').then((m) => m.TrustNetwork),
  { ssr: false },
);

export default function LandingPage() {
  // Apply landing-scope class to <html> so the body background stays dark
  // even outside the .ts-landing wrapper (e.g. above the fold rubber-band).
  useEffect(() => {
    document.documentElement.classList.add('ts-landing-html');
    return () => {
      document.documentElement.classList.remove('ts-landing-html');
    };
  }, []);

  return (
    <div className="ts-landing relative min-h-screen overflow-x-hidden">
      <LandingNav />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Three.js network — fixed full-viewport */}
        <TrustNetwork className="fixed inset-0 z-0 pointer-events-none" />

        {/* Grid overlay */}
        <div aria-hidden className="absolute inset-0 z-[1] ts-grid-bg pointer-events-none" />

        {/* Top spotlight */}
        <div aria-hidden className="absolute inset-0 z-[1] ts-spotlight pointer-events-none" />

        {/* Bottom fade — blends Three.js scene into next section */}
        <div
          aria-hidden
          className="absolute bottom-0 inset-x-0 h-48 z-[1] pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, #080C10 100%)',
          }}
        />

        <HeroContent />
      </section>

      {/* ── PROBLEM ───────────────────────────────────────────────────── */}
      <div className="relative z-[2] bg-ts-base">
        <ProblemSection />
      </div>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
      <div className="relative z-[2] bg-ts-base">
        <HowItWorks />
      </div>

      {/* ── LIVE DEMO FEED ────────────────────────────────────────────── */}
      <div
        className="relative z-[2]"
        style={{
          background:
            'linear-gradient(180deg, #080C10 0%, #0B0F14 50%, #080C10 100%)',
        }}
      >
        <LiveDemoFeed />
      </div>

      {/* ── PRICING ───────────────────────────────────────────────────── */}
      <div className="relative z-[2] bg-ts-base">
        <Pricing />
      </div>

      {/* ── FINAL CTA ─────────────────────────────────────────────────── */}
      <div className="relative z-[2]">
        <FinalCTA />
      </div>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer
        className="relative z-[2] border-t py-10 px-6"
        style={{ background: '#080C10', borderColor: '#21262D' }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(0,217,126,0.25), rgba(0,217,126,0.05))',
                boxShadow: 'inset 0 0 0 1px rgba(0,217,126,0.35)',
              }}
            >
              <ShieldCheck size={15} className="text-ts-green" />
            </div>
            <span className="font-ts-display text-[14px] font-semibold text-ts-text-pri">
              VendorShield
            </span>
          </div>

          <nav className="flex items-center gap-6 text-[12.5px] text-ts-text-sec">
            <a href="#how" className="hover:text-ts-text-pri transition-colors">How it works</a>
            <a href="#problem" className="hover:text-ts-text-pri transition-colors">Problem</a>
            <a href="#pricing" className="hover:text-ts-text-pri transition-colors">Pricing</a>
            <Link href="/login" className="hover:text-ts-text-pri transition-colors">Sign in</Link>
          </nav>

          <p className="text-[11px] text-ts-text-mut font-ts-mono">
            © 2026 VendorShield · Built for Squad Hackathon
          </p>
        </div>
      </footer>
    </div>
  );
}
