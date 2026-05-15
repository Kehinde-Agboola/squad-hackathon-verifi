'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

/**
 * LandingNav — fixed, blurred dark navigation. Scoped to the landing page;
 * does not replace the existing dashboard TopNav.
 */
export const LandingNav: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 inset-x-0 z-[200] transition-colors duration-300 border-b"
      style={{
        backgroundColor: scrolled ? 'rgba(13,17,23,0.92)' : 'rgba(8,12,16,0.55)',
        borderBottomColor: scrolled ? '#21262D' : 'transparent',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.div
            initial={{ rotate: -45, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-7 h-7 flex items-center justify-center rounded-md"
            style={{
              background: 'linear-gradient(135deg, rgba(0,217,126,0.25), rgba(0,217,126,0.05))',
              boxShadow: '0 0 16px rgba(0,217,126,0.25), inset 0 0 0 1px rgba(0,217,126,0.35)',
            }}
          >
            <ShieldCheck size={16} className="text-ts-green" strokeWidth={2.4} />
          </motion.div>
          <span className="font-ts-display text-[15px] font-semibold tracking-tight text-ts-text-pri">
            VendorShield
          </span>
        </Link>

        {/* Center links — desktop */}
        <ul className="hidden md:flex items-center gap-7 text-[13px] text-ts-text-sec">
          <li><a href="#how" className="hover:text-ts-text-pri transition-colors">How it works</a></li>
          <li><a href="#problem" className="hover:text-ts-text-pri transition-colors">The problem</a></li>
          <li><a href="#live" className="hover:text-ts-text-pri transition-colors">Live demo</a></li>
          <li><a href="#pricing" className="hover:text-ts-text-pri transition-colors">Pricing</a></li>
        </ul>

        {/* Right CTAs */}
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="text-[13px] text-ts-text-sec hover:text-ts-text-pri transition-colors px-3 py-1.5"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-[13px] font-medium px-3.5 py-1.5 rounded-md transition-all duration-150 hover:-translate-y-px"
            style={{
              backgroundColor: '#00D97E',
              color: '#080C10',
              boxShadow: '0 0 0 1px rgba(0,217,126,0.6), 0 6px 18px -4px rgba(0,217,126,0.4)',
            }}
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default LandingNav;
