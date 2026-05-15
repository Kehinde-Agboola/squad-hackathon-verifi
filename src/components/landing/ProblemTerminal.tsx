'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface Line {
  text: string;
  color?: string;
  isCommand?: boolean;
  delay?: number;
}

const LINES: Line[] = [
  { text: '$ Techpoint Africa Investigation, May 2026', color: '#8B949E', isCommand: true },
  { text: '> Journalist created fake restaurant',         color: '#E6EDF3' },
  { text: '> Used fabricated CAC: RC-XXXXXXX',            color: '#E6EDF3' },
  { text: '> Uploaded stolen food photos',                color: '#E6EDF3' },
  { text: '> Entered false Lagos address',                color: '#E6EDF3' },
  { text: '> Submitted for Chowdeck onboarding...',       color: '#E6EDF3' },
  { text: '',                                             color: '#E6EDF3' },
  { text: '[████████████████████] 100%',                  color: '#F0A500' },
  { text: '',                                             color: '#E6EDF3' },
  { text: '✓ Restaurant approved.',                       color: '#00D97E' },
  { text: '✓ Listed on platform.',                        color: '#00D97E' },
  { text: '✓ First order received.',                      color: '#00D97E' },
  { text: '✗ Business does not exist.',                   color: '#F85149' },
  { text: '',                                             color: '#E6EDF3' },
  { text: 'Time elapsed: 00:58:22',                       color: '#8B949E' },
];

export const ProblemTerminal: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    const reveal = async () => {
      for (let i = 1; i <= LINES.length; i++) {
        if (cancelled) return;
        setVisibleLines(i);
        const line = LINES[i - 1];
        // Variable pacing: command faster, alerts slower
        const delay = line.text.startsWith('✗')
          ? 600
          : line.text.startsWith('✓')
          ? 280
          : line.text.startsWith('[')
          ? 800
          : 180;
        await new Promise((r) => setTimeout(r, delay));
      }
    };
    reveal();
    return () => {
      cancelled = true;
    };
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: '#0D1117',
        border: '1px solid #21262D',
        boxShadow: '0 30px 80px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,217,126,0.05)',
      }}
    >
      {/* Terminal header bar */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 border-b"
        style={{ background: '#161B22', borderColor: '#21262D' }}
      >
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#F85149' }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#F0A500' }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#00D97E' }} />
        <span className="ml-3 text-[11px] uppercase tracking-wider text-ts-text-mut font-ts-mono">
          incident-report.log
        </span>
      </div>

      {/* Body */}
      <div className="p-6 font-ts-mono text-[13px] leading-relaxed min-h-[420px]">
        {LINES.slice(0, visibleLines).map((line, i) => (
          <div
            key={i}
            style={{ color: line.color }}
            className={`whitespace-pre ${i === visibleLines - 1 ? 'ts-cursor' : ''}`}
          >
            {line.text || ' '}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProblemTerminal;
