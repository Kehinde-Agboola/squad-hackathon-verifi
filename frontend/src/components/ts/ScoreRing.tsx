'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface ScoreRingProps {
  score: number;          // 0–100
  size?: number;
  stroke?: number;
  duration?: number;
  label?: string;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 200,
  stroke = 10,
  duration = 1.6,
  label = 'Trust score',
}) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (score / 100) * circumference;

  const fgRef = useRef<SVGCircleElement | null>(null);
  const numObj = useRef({ v: 0 });
  const [display, setDisplay] = useState(0);

  const color =
    score >= 70 ? '#00D97E' :
    score >= 40 ? '#F0A500' : '#F85149';

  useEffect(() => {
    if (!fgRef.current) return;
    // Animate stroke
    const tween = gsap.fromTo(
      fgRef.current,
      { strokeDashoffset: circumference },
      { strokeDashoffset: targetOffset, duration, ease: 'power3.out' },
    );
    // Animate number
    numObj.current.v = 0;
    const numTween = gsap.to(numObj.current, {
      v: score,
      duration,
      ease: 'power3.out',
      onUpdate: () => setDisplay(numObj.current.v),
    });
    return () => {
      tween.kill();
      numTween.kill();
    };
  }, [score, circumference, targetOffset, duration]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#21262D"
          strokeWidth={stroke}
        />
        {/* Progress */}
        <circle
          ref={fgRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          style={{
            filter: `drop-shadow(0 0 12px ${color}80)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-ts-display font-semibold leading-none tracking-tight"
          style={{
            fontSize: size * 0.32,
            color,
            textShadow: `0 0 24px ${color}66`,
          }}
        >
          {Math.round(display)}
        </span>
        <span className="text-[11px] uppercase tracking-[0.16em] text-ts-text-mut mt-2">
          {label}
        </span>
      </div>
    </div>
  );
};

export default ScoreRing;
