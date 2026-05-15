import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Wallet, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface ASquadLedgerProps {
  ledgerData: any;
}

export const ASquadLedger: React.FC<ASquadLedgerProps> = ({ ledgerData }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-ink mb-6">Squad Ledger</h2>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-lg p-6">
          <p className="text-sm text-muted mb-2">Total Bonds Held</p>
          <p className="text-2xl font-bold text-primary">
            ₦{ledgerData.totalBondsHeld?.toLocaleString() || '18,700,000'}
          </p>
        </div>

        <div className="bg-surface border border-border rounded-lg p-6">
          <p className="text-sm text-muted mb-2">Released This Month</p>
          <p className="text-2xl font-bold text-green-600">
            ₦{ledgerData.releasedThisMonth?.toLocaleString() || '3,200,000'}
          </p>
        </div>

        <div className="bg-surface border border-border rounded-lg p-6">
          <p className="text-sm text-muted mb-2">Forfeited (Fraud)</p>
          <p className="text-2xl font-bold text-danger">
            ₦{ledgerData.forfeitedFraud?.toLocaleString() || '450,000'}
          </p>
        </div>

        <div className="bg-surface border border-border rounded-lg p-6">
          <p className="text-sm text-muted mb-2">Platform Revenue</p>
          <p className="text-2xl font-bold text-primary">
            ₦{ledgerData.platformRevenue?.toLocaleString() || '2,100,000'}
          </p>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h3 className="text-lg font-bold text-ink mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {(ledgerData.transactions || []).map((txn: any) => (
            <div
              key={txn.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-lg ${
                    txn.icon === 'received'
                      ? 'bg-green-100'
                      : 'bg-red-100'
                  }`}
                >
                  {txn.icon === 'received' ? (
                    <ArrowDownLeft size={20} className="text-green-600" />
                  ) : (
                    <ArrowUpRight size={20} className="text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-ink">{txn.vendorName}</p>
                  <p className="text-xs text-muted">{txn.type} • {txn.date}</p>
                </div>
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
