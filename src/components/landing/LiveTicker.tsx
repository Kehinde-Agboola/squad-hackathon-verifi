'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const ITEMS = [
  '1,247 verifications run',
  '78% pass rate',
  '₦18.7M bonds processed',
  '12 platforms protected',
  '53ms average latency',
  'Backed by Squad Financial',
  'CAC registry integrated',
  '94 vendors verified today',
];

export const LiveTicker: React.FC = () => {
  // Duplicate the items so the marquee loop is seamless
  const loop = [...ITEMS, ...ITEMS];
  return (
    <div
      className="overflow-hidden rounded-full px-1 py-1 inline-flex max-w-full"
      style={{
        background: 'rgba(13,17,23,0.65)',
        border: '1px solid rgba(0,217,126,0.25)',
        boxShadow: '0 0 24px rgba(0,217,126,0.10)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="ts-marquee-track">
        {loop.map((label, i) => (
          <div
            key={i}
            className="flex items-center gap-2 whitespace-nowrap px-5 py-1.5 text-[12px] text-ts-text-sec"
          >
            <CheckCircle2 size={13} className="text-ts-green flex-shrink-0" />
            <span className="font-medium text-ts-text-pri">{label}</span>
            <span className="text-ts-text-mut mx-2">·</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveTicker;
