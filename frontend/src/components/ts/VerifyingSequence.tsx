'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, Clock, X } from 'lucide-react';

export interface CheckItem {
  id: string;
  label: string;
  description?: string;
  delayMs: number;       // when to mark this as "running"
  durationMs: number;    // how long it runs before completing
  failsAt?: boolean;     // if true, ends in red X (rare)
}

type Status = 'waiting' | 'running' | 'done' | 'failed';

interface VerifyingSequenceProps {
  checks: CheckItem[];
  onAllComplete?: () => void;
  startKey?: any; // change to restart
}

export const VerifyingSequence: React.FC<VerifyingSequenceProps> = ({
  checks, onAllComplete, startKey,
}) => {
  const [statuses, setStatuses] = useState<Record<string, Status>>(() =>
    Object.fromEntries(checks.map((c) => [c.id, 'waiting'])),
  );

  useEffect(() => {
    setStatuses(Object.fromEntries(checks.map((c) => [c.id, 'waiting'])));

    const timers: ReturnType<typeof setTimeout>[] = [];
    checks.forEach((c) => {
      timers.push(setTimeout(() => {
        setStatuses((s) => ({ ...s, [c.id]: 'running' }));
      }, c.delayMs));

      timers.push(setTimeout(() => {
        setStatuses((s) => ({ ...s, [c.id]: c.failsAt ? 'failed' : 'done' }));
      }, c.delayMs + c.durationMs));
    });

    // Fire onAllComplete after the last check completes
    const last = checks.reduce((m, c) => Math.max(m, c.delayMs + c.durationMs), 0);
    timers.push(setTimeout(() => onAllComplete?.(), last + 300));

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startKey]);

  return (
    <div className="relative">
      {/* Connector line behind the icons */}
      <div
        aria-hidden
        className="absolute left-[15px] top-3 bottom-3 w-px"
        style={{ background: '#21262D' }}
      />

      <ol className="space-y-3.5 relative">
        {checks.map((check, i) => {
          const status = statuses[check.id];
          return (
            <li key={check.id} className="flex items-start gap-3 relative">
              <StatusIcon status={status} />
              <div className="flex-1 min-w-0 pt-0.5">
                <p
                  className="text-[13.5px] font-medium transition-colors"
                  style={{
                    color:
                      status === 'done'    ? '#E6EDF3' :
                      status === 'running' ? '#E6EDF3' :
                      status === 'failed'  ? '#F85149' : '#484F58',
                  }}
                >
                  {check.label}
                </p>
                {check.description && (
                  <p
                    className="text-[11.5px] mt-0.5 transition-colors"
                    style={{
                      color: status === 'waiting' ? '#484F58' : '#8B949E',
                    }}
                  >
                    {check.description}
                  </p>
                )}
              </div>
              <StatusBadge status={status} />
            </li>
          );
        })}
      </ol>
    </div>
  );
};

const StatusIcon: React.FC<{ status: Status }> = ({ status }) => {
  return (
    <div className="relative w-[31px] flex-shrink-0 flex justify-center">
      <AnimatePresence mode="wait">
        {status === 'waiting' && (
          <motion.div
            key="waiting"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1,    opacity: 0.45 }}
            exit={{    scale: 0.85, opacity: 0 }}
            className="w-[22px] h-[22px] rounded-full flex items-center justify-center"
            style={{ background: '#0D1117', border: '1px solid #21262D' }}
          >
            <Clock size={11} className="text-ts-text-mut" />
          </motion.div>
        )}

        {status === 'running' && (
          <motion.div
            key="running"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            className="w-[22px] h-[22px] rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(0,217,126,0.10)',
              border: '1px solid rgba(0,217,126,0.4)',
              boxShadow: '0 0 12px rgba(0,217,126,0.3)',
            }}
          >
            <Loader2 size={12} className="text-ts-green animate-spin" strokeWidth={2.5} />
          </motion.div>
        )}

        {status === 'done' && (
          <motion.div
            key="done"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.25, 1] }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-[22px] h-[22px] rounded-full flex items-center justify-center"
            style={{
              background: '#00D97E',
              boxShadow: '0 0 16px rgba(0,217,126,0.5)',
            }}
          >
            <Check size={13} strokeWidth={3} className="text-[#080C10]" />
          </motion.div>
        )}

        {status === 'failed' && (
          <motion.div
            key="failed"
            initial={{ scale: 0, x: 0 }}
            animate={{ scale: [0, 1.2, 1], x: [0, -3, 3, -2, 2, 0] }}
            transition={{ duration: 0.55 }}
            className="w-[22px] h-[22px] rounded-full flex items-center justify-center"
            style={{
              background: '#F85149',
              boxShadow: '0 0 16px rgba(248,81,73,0.5)',
            }}
          >
            <X size={13} strokeWidth={3} className="text-[#080C10]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  if (status === 'waiting') return null;
  const map = {
    running: { color: '#F0A500', label: 'Running' },
    done:    { color: '#00D97E', label: 'Done' },
    failed:  { color: '#F85149', label: 'Failed' },
  } as const;
  const m = map[status];
  return (
    <span
      className="text-[10.5px] font-ts-mono px-2 py-0.5 rounded font-medium"
      style={{
        color: m.color,
        background: `${m.color}1A`,
        border: `1px solid ${m.color}40`,
      }}
    >
      {m.label}
    </span>
  );
};

export default VerifyingSequence;
