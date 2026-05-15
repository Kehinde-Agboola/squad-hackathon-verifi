'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Status = 'verified' | 'checking' | 'rejected';

interface FeedEvent {
  id: number;
  business: string;
  status: Status;
  detail: string;
  ts: number; // ms epoch
}

const SAMPLES: Omit<FeedEvent, 'id' | 'ts'>[] = [
  { business: 'Mama Cass Restaurant',  status: 'verified', detail: 'Score: 91/100' },
  { business: 'Spice Route VI',        status: 'checking', detail: 'Checking CAC… RC-1283944' },
  { business: 'Lagos Grills',          status: 'rejected', detail: 'Bank name mismatch' },
  { business: 'TechFix Hub',           status: 'verified', detail: 'Score: 85/100' },
  { business: 'Kilimanjaro Express',   status: 'verified', detail: 'Score: 88/100' },
  { business: 'Naija Bites Ltd',       status: 'checking', detail: 'AI document scan in progress' },
  { business: 'Phantom Logistics',     status: 'rejected', detail: 'CAC document forged' },
  { business: 'Iya Eba Suya Joint',    status: 'verified', detail: 'Score: 94/100' },
  { business: 'Spar Grocery Lekki',    status: 'verified', detail: 'Score: 97/100' },
  { business: 'Bolt Couriers NG',      status: 'checking', detail: 'Bank name match running' },
  { business: 'Eko Pizza Co',          status: 'verified', detail: 'Score: 82/100' },
  { business: 'Ghost Kitchen 247',     status: 'rejected', detail: 'Address does not exist' },
];

const STATUS_STYLES: Record<Status, { dot: string; text: string; bg: string; border: string; label: string }> = {
  verified: {
    dot: '#00D97E', text: '#00D97E', bg: 'rgba(0,217,126,0.06)',
    border: 'rgba(0,217,126,0.25)', label: 'Verified ✓',
  },
  checking: {
    dot: '#F0A500', text: '#F0A500', bg: 'rgba(240,165,0,0.06)',
    border: 'rgba(240,165,0,0.25)', label: 'Checking…',
  },
  rejected: {
    dot: '#F85149', text: '#F85149', bg: 'rgba(248,81,73,0.06)',
    border: 'rgba(248,81,73,0.25)', label: 'Rejected ✗',
  },
};

const formatRelative = (ms: number) => {
  const s = Math.max(0, Math.round((Date.now() - ms) / 1000));
  if (s < 60) return `${s}s ago`;
  return `${Math.floor(s / 60)}m ago`;
};

export const LiveDemoFeed: React.FC = () => {
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let id = 0;
    const push = () => {
      const sample = SAMPLES[Math.floor(Math.random() * SAMPLES.length)];
      const newEv: FeedEvent = { ...sample, id: ++id, ts: Date.now() };
      setEvents((prev) => [newEv, ...prev].slice(0, 6));
    };
    // Seed
    for (let i = 0; i < 4; i++) push();
    const interval = setInterval(push, 2400);
    const tickInterval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => {
      clearInterval(interval);
      clearInterval(tickInterval);
    };
  }, []);

  return (
    <section id="live" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[11px] uppercase tracking-[0.2em] text-ts-green font-medium mb-4">
            <span className="inline-block w-2 h-2 rounded-full bg-ts-green mr-2 animate-ts-pulse-dot" />
            Live network
          </p>
          <h2 className="text-4xl md:text-5xl font-ts-display font-semibold tracking-tight">
            Verifications happening <span className="text-ts-green">right now</span>
          </h2>
        </div>

        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: '#0D1117',
            border: '1px solid #21262D',
            boxShadow: '0 30px 80px -30px rgba(0,0,0,0.6)',
          }}
        >
          {/* Feed header */}
          <div
            className="flex items-center justify-between px-5 py-3 border-b text-[11px] font-ts-mono uppercase tracking-wider text-ts-text-mut"
            style={{ borderColor: '#21262D', background: '#0B0F14' }}
          >
            <span>incoming · live feed</span>
            <span className="flex items-center gap-1.5 text-ts-green">
              <span className="w-1.5 h-1.5 rounded-full bg-ts-green animate-ts-pulse-dot" />
              streaming
            </span>
          </div>

          <div className="p-3 min-h-[420px]">
            <AnimatePresence initial={false} mode="popLayout">
              {events.map((ev) => {
                const s = STATUS_STYLES[ev.status];
                return (
                  <motion.div
                    key={ev.id}
                    layout
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-4 px-4 py-3.5 my-1.5 rounded-lg"
                    style={{ background: s.bg, border: `1px solid ${s.border}` }}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        background: s.dot,
                        boxShadow: `0 0 12px ${s.dot}`,
                        animation: ev.status === 'checking' ? 'ts-blink 1.2s step-end infinite' : undefined,
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] text-ts-text-pri font-medium truncate">
                        {ev.business}
                      </p>
                      <p className="text-[12px] text-ts-text-sec truncate">{ev.detail}</p>
                    </div>
                    <span
                      className="text-[11px] font-ts-mono px-2.5 py-1 rounded-md flex-shrink-0"
                      style={{ color: s.text, border: `1px solid ${s.border}`, background: 'rgba(0,0,0,0.25)' }}
                    >
                      {s.label}
                    </span>
                    <span className="text-[11px] text-ts-text-mut font-ts-mono w-14 text-right flex-shrink-0">
                      {formatRelative(ev.ts)}
                      {/* tick refs to force re-render */}
                      <span className="hidden">{tick}</span>
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveDemoFeed;
