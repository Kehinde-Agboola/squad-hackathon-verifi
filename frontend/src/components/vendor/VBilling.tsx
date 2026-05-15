import React from 'react';
import { Badge } from '@/components/ui/Badge';

interface VBillingProps {
  billingData: any;
}

export const VBilling: React.FC<VBillingProps> = ({ billingData }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-ink mb-6">Billing</h2>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-lg p-6">
          <p className="text-sm text-muted mb-2">Current Plan</p>
          <p className="text-lg font-bold text-primary">{billingData.currentPlan}</p>
        </div>

        <div className="bg-surface border border-border rounded-lg p-6">
          <p className="text-sm text-muted mb-2">Verifications This Month</p>
          <p className="text-lg font-bold text-ink">{billingData.verificationsThisMonth}</p>
        </div>

        <div className="bg-surface border border-border rounded-lg p-6">
          <p className="text-sm text-muted mb-2">Bond in Escrow</p>
          <p className="text-lg font-bold text-ink">{billingData.bondInEscrow}</p>
        </div>

        <div className="bg-surface border border-border rounded-lg p-6">
          <p className="text-sm text-muted mb-2">Next Billing Date</p>
          <p className="text-lg font-bold text-ink">{billingData.nextBillingDate}</p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h3 className="text-lg font-bold text-ink mb-4">Transaction History</h3>
        <div className="space-y-3">
          {billingData.transactions.map((txn: any, idx: number) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-ink text-sm">{txn.description}</p>
                <p className="text-xs text-muted">{txn.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-bold text-ink">₦{txn.amount.toLocaleString()}</p>
                <Badge variant={txn.status as any}>
                  {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
