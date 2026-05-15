import React, { useEffect, useState } from 'react';

interface ScoreRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 'md',
  animated = true,
}) => {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);

  useEffect(() => {
    if (!animated) return;

    let current = 0;
    const increment = score / 30;
    const interval = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(interval);
      } else {
        setDisplayScore(Math.round(current));
      }
    }, 30);

    return () => clearInterval(interval);
  }, [score, animated]);

  const sizeMap = {
    sm: { width: 80, circumference: 251.2, radius: 40 },
    md: { width: 120, circumference: 376.8, radius: 60 },
    lg: { width: 160, circumference: 502.4, radius: 80 },
  };

  const config = sizeMap[size];
  const offset = config.circumference - (displayScore / 100) * config.circumference;

  const getColor = (score: number) => {
    if (score >= 70) return '#0B3D2E';
    if (score >= 40) return '#C8793A';
    return '#C0392B';
  };

  return (
    <div className="flex flex-col items-center">
      <svg width={config.width} height={config.width} className="transform -rotate-90">
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={config.radius}
          fill="none"
          stroke="#E6F4EF"
          strokeWidth="8"
        />
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={config.radius}
          fill="none"
          stroke={getColor(displayScore)}
          strokeWidth="8"
          strokeDasharray={config.circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.3s ease' }}
        />
        <text
          x={config.width / 2}
          y={config.width / 2}
          textAnchor="middle"
          dy="0.3em"
          className="text-2xl font-bold"
          fill={getColor(displayScore)}
          style={{ fontSize: size === 'sm' ? 16 : size === 'md' ? 24 : 32 }}
        >
          {displayScore}
        </text>
      </svg>
      <p className="text-xs text-muted mt-2">Trust Score</p>
    </div>
  );
};
