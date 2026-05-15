'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface CountUpProps {
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  format?: (n: number) => string;
  className?: string;
  startOnMount?: boolean;
}

/**
 * Animates a number from 0 → `to` using GSAP. Defaults to 1.2s ease-out.
 */
export const CountUp: React.FC<CountUpProps> = ({
  to,
  duration = 1.2,
  prefix = '',
  suffix = '',
  format,
  className,
  startOnMount = true,
}) => {
  const [display, setDisplay] = useState(0);
  const obj = useRef({ v: 0 });
  const target = useRef(to);

  useEffect(() => {
    target.current = to;
    if (!startOnMount) return;
    const tween = gsap.to(obj.current, {
      v: to,
      duration,
      ease: 'power3.out',
      onUpdate: () => setDisplay(obj.current.v),
    });
    return () => {
      tween.kill();
    };
  }, [to, duration, startOnMount]);

  const isInt = Number.isInteger(to);
  const rendered = format
    ? format(display)
    : isInt
    ? Math.round(display).toLocaleString()
    : display.toFixed(2);

  return (
    <span className={className}>
      {prefix}
      {rendered}
      {suffix}
    </span>
  );
};

export default CountUp;
