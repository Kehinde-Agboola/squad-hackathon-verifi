import React from 'react';

type Variant = 'verified' | 'pending' | 'review' | 'rejected' | 'processing' | 'failed';

interface BadgeProps {
  variant?: Variant;
  children: React.ReactNode;
  withDot?: boolean;
}

const VARIANT_META: Record<Variant, { color: string; bg: string; border: string; pulse?: boolean }> = {
  verified:   { color: '#00D97E', bg: 'rgba(0,217,126,0.10)', border: 'rgba(0,217,126,0.35)' },
  pending:    { color: '#F0A500', bg: 'rgba(240,165,0,0.10)', border: 'rgba(240,165,0,0.35)', pulse: true },
  processing: { color: '#F0A500', bg: 'rgba(240,165,0,0.10)', border: 'rgba(240,165,0,0.35)', pulse: true },
  review:     { color: '#8B5CF6', bg: 'rgba(139,92,246,0.10)', border: 'rgba(139,92,246,0.35)' },
  rejected:   { color: '#F85149', bg: 'rgba(248,81,73,0.10)', border: 'rgba(248,81,73,0.35)' },
  failed:     { color: '#F85149', bg: 'rgba(248,81,73,0.10)', border: 'rgba(248,81,73,0.35)' },
};

export const Badge: React.FC<BadgeProps> = ({ variant = 'pending', children, withDot = true }) => {
  const meta = VARIANT_META[variant];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border"
      style={{
        background: meta.bg,
        color: meta.color,
        borderColor: meta.border,
      }}
    >
      {withDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${meta.pulse ? 'animate-ts-pulse-dot' : ''}`}
          style={{ background: meta.color, boxShadow: `0 0 6px ${meta.color}` }}
        />
      )}
      {children}
    </span>
  );
};
