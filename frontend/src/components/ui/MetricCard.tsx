import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  subtext?: string;
  colored?: boolean;
  scoreColor?: 'green' | 'amber' | 'red';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon: Icon,
  subtext,
  colored = false,
  scoreColor = 'green',
}) => {
  const scoreColors = {
    green: 'text-primary',
    amber: 'text-amber',
    red: 'text-danger',
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted mb-2">{label}</p>
          <p className={`text-2xl font-bold ${colored ? scoreColors[scoreColor] : 'text-ink'}`}>
            {value}
          </p>
          {subtext && <p className="text-xs text-muted mt-2">{subtext}</p>}
        </div>
        {Icon && <Icon size={24} className="text-primary ml-3" />}
      </div>
    </div>
  );
};
