import React from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { CheckProgress } from '@/store/useVerifyStore';

interface Step5ProcessingProps {
  checks: CheckProgress[];
  trustScore: number | null;
  processing: boolean;
}

export const Step5Processing: React.FC<Step5ProcessingProps> = ({
  checks,
  trustScore,
  processing,
}) => {
  const allComplete = checks.every((c) => c.status !== 'pending' && c.status !== 'in-progress');
  const allPassed = checks.every((c) => c.status === 'completed');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-ink mb-2">Processing Verification</h2>
        <p className="text-muted">
          {processing ? 'Running AI checks on your documents...' : 'Verification complete'}
        </p>
      </div>

      {/* Checks List */}
      <div className="space-y-3">
        {checks.map((check) => (
          <div
            key={check.id}
            className="p-4 border border-border rounded-lg bg-surface"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-shrink-0 mt-0.5">
                {check.status === 'in-progress' && (
                  <Loader2 size={20} className="text-blue-600 animate-spin" />
                )}
                {check.status === 'completed' && (
                  <CheckCircle size={20} className="text-green-600" />
                )}
                {check.status === 'failed' && (
                  <AlertCircle size={20} className="text-red-600" />
                )}
                {check.status === 'pending' && (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-ink">{check.name}</h3>
                {check.reason && (
                  <p className="text-sm text-red-600 mt-1">{check.reason}</p>
                )}
              </div>
              <Badge
                variant={
                  check.status === 'completed'
                    ? 'verified'
                    : check.status === 'failed'
                    ? 'rejected'
                    : check.status === 'in-progress'
                    ? 'processing'
                    : 'pending'
                }
              >
                {check.status === 'in-progress'
                  ? `${check.percentage}%`
                  : check.status.charAt(0).toUpperCase() + check.status.slice(1)}
              </Badge>
            </div>

            {(check.status === 'in-progress' || check.status === 'pending') && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${check.percentage}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Trust Score */}
      {allComplete && trustScore !== null && (
        <div className="text-center py-6 bg-primary-light rounded-lg">
          <p className="text-sm text-muted mb-4">Your Trust Score</p>
          <ScoreRing score={trustScore} size="lg" animated={true} />
          <p className="text-sm text-muted mt-4">
            {trustScore >= 70
              ? 'Excellent! You are verified for partnership'
              : trustScore >= 40
              ? 'Good performance. Some additional checks may be needed'
              : 'Review needed. Please contact support'}
          </p>
        </div>
      )}

      {/* Actions */}
      {!processing && allComplete && (
        <div className="flex gap-3 pt-4">
          {!allPassed && (
            <Button variant="ghost" className="flex-1">
              Contact support
            </Button>
          )}
          <Button
            onClick={() => {
              window.location.href = '/dashboard/vendor';
            }}
            className="flex-1"
          >
            Go to Dashboard
          </Button>
        </div>
      )}

      {processing && (
        <div className="flex gap-3 pt-4">
          <Button variant="ghost" className="flex-1" disabled>
            Processing...
          </Button>
        </div>
      )}
    </div>
  );
};
