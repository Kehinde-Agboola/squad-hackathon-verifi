import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';

interface VOverviewProps {
  vendorData: any;
}

export const VOverview: React.FC<VOverviewProps> = ({ vendorData }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink">
            Good morning, {vendorData.firstName}
          </h1>
          <p className="text-muted mt-1">Here&apos;s your verification status</p>
        </div>
        <Link href="/verify">
          <Button>New Verification</Button>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-lg p-6">
          <p className="text-sm text-muted mb-2">Trust Score</p>
          <p
            className={`text-3xl font-bold ${
              vendorData.trustScore >= 70
                ? 'text-primary'
                : vendorData.trustScore >= 40
                ? 'text-amber'
                : 'text-danger'
            }`}
          >
            {vendorData.trustScore}
          </p>
          <p className="text-xs text-muted mt-2">
            {vendorData.trustScore >= 70
              ? 'Excellent'
              : vendorData.trustScore >= 40
              ? 'Good'
              : 'Needs review'}
          </p>
        </div>

        <div className="bg-surface border border-border rounded-lg p-6">
          <p className="text-sm text-muted mb-2">Total Verifications</p>
          <p className="text-3xl font-bold text-primary">
            {vendorData.totalVerifications || 3}
          </p>
          <p className="text-xs text-muted mt-2">completed</p>
        </div>

        <div className="bg-surface border border-border rounded-lg p-6">
          <p className="text-sm text-muted mb-2">Bond in Escrow</p>
          <p className="text-3xl font-bold text-primary">
            ₦{vendorData.bondInEscrow?.toLocaleString() || '180,000'}
          </p>
          <p className="text-xs text-muted mt-2">via Squad</p>
        </div>

        <div className="bg-surface border border-border rounded-lg p-6">
          <p className="text-sm text-muted mb-2">Badge Status</p>
          <Badge variant={vendorData.badgeStatus === 'verified' ? 'verified' : 'pending'}>
            {vendorData.badgeStatus === 'verified' ? 'Verified' : 'Pending'}
          </Badge>
          <p className="text-xs text-muted mt-2">public profile</p>
        </div>
      </div>

      {/* Recent Verifications */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h2 className="text-lg font-bold text-ink mb-4">Recent Verifications</h2>
        <div className="space-y-4">
          {(vendorData.recentVerifications || []).map((v: any) => (
            <div key={v.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p className="font-medium text-ink">{v.type}</p>
                <p className="text-sm text-muted">{v.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-bold text-primary">{v.score}</p>
                <Badge variant={v.status as any}>
                  {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Document Status */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h2 className="text-lg font-bold text-ink mb-4">Uploaded Documents</h2>
        <div className="space-y-3">
          {(vendorData.documentStatus || []).map((doc: any) => (
            <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-ink text-sm">{doc.name}</p>
                <p className="text-xs text-muted">{doc.size}</p>
              </div>
              <Badge variant={doc.status as any}>
                {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
