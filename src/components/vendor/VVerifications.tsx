import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface VVerificationsProps {
  verifications: any[];
}

export const VVerifications: React.FC<VVerificationsProps> = ({ verifications }) => {
  const [expanded, setExpanded] = React.useState<string | null>(null);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-ink mb-6">All Verifications</h2>

      {verifications.length === 0 ? (
        <div className="text-center py-12 bg-surface border border-border rounded-lg">
          <AlertCircle size={48} className="mx-auto text-muted mb-4" />
          <p className="text-muted">No verifications yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {verifications.map((v: any) => (
            <div
              key={v.id}
              className="border border-border rounded-lg bg-surface overflow-hidden cursor-pointer hover:border-primary transition-colors"
            >
              <button
                onClick={() => setExpanded(expanded === v.id ? null : v.id)}
                className="w-full p-6 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-ink">{v.type}</h3>
                    <p className="text-sm text-muted">{v.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {v.score && (
                      <div className="text-right">
                        <p className="font-bold text-primary text-xl">{v.score}</p>
                        <p className="text-xs text-muted">Score</p>
                      </div>
                    )}
                    <Badge variant={v.status as any}>
                      {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </button>

              {/* Expanded Details */}
              {expanded === v.id && v.checks && (
                <div className="border-t border-border p-6 bg-gray-50 space-y-3">
                  {v.checks.map((check: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {check.status === 'completed' && (
                          <CheckCircle size={20} className="text-green-600" />
                        )}
                        {check.status !== 'completed' && (
                          <AlertCircle size={20} className="text-amber-600" />
                        )}
                        <span className="text-sm text-ink">{check.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-primary rounded-full"
                            style={{ width: `${check.percentage}%` }}
                          />
                        </div>
                        <Badge
                          variant={check.status === 'completed' ? 'verified' : 'processing'}
                        >
                          {check.percentage}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
