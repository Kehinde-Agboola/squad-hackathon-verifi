import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AlertTriangle } from 'lucide-react';

interface AFlaggedProps {
  flaggedItems: any[];
  onReview?: (itemId: string) => void;
  onSuspend?: (vendorId: string) => void;
  onReverify?: (vendorId: string) => void;
}

export const AFlagged: React.FC<AFlaggedProps> = ({
  flaggedItems,
  onReview,
  onSuspend,
  onReverify,
}) => {
  const [confirmSuspend, setConfirmSuspend] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-ink">{flaggedItems.length} need review</h2>
        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
          {flaggedItems.length} pending
        </span>
      </div>

      {flaggedItems.length === 0 ? (
        <div className="text-center py-12 bg-surface border border-border rounded-lg">
          <AlertTriangle size={48} className="mx-auto text-green-600 mb-4" />
          <p className="text-muted">No flagged vendors</p>
        </div>
      ) : (
        <div className="space-y-4">
          {flaggedItems.map((item: any) => (
            <div key={item.id} className="bg-surface border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-ink text-lg">{item.vendorName}</h3>
                  <p className="text-muted text-sm mt-1">{item.reason}</p>
                </div>
                <Badge
                  variant={item.riskLevel === 'High' ? 'rejected' : 'pending'}
                >
                  {item.riskLevel} Risk
                </Badge>
              </div>

              {confirmSuspend === item.id ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-red-900 mb-3">
                    Are you sure? This will forfeit the bond and suspend the vendor account.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        onSuspend?.(item.id);
                        setConfirmSuspend(null);
                      }}
                    >
                      Yes, suspend
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setConfirmSuspend(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onReview?.(item.id)}
                  >
                    Review
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => setConfirmSuspend(item.id)}
                  >
                    Suspend & forfeit bond
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onReverify?.(item.id)}
                  >
                    Trigger re-verification
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
