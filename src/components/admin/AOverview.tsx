import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { AlertCircle } from 'lucide-react';

interface AOverviewProps {
  overviewData: any;
}

export const AOverview: React.FC<AOverviewProps> = ({ overviewData }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-slow" />
        <h1 className="text-3xl font-bold text-ink">Platform overview</h1>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-lg p-6">
          <p className="text-sm text-muted mb-2">Total Verifications</p>
          <p className="text-3xl font-bold text-primary">
            {overviewData.totalVerifications?.toLocaleString() || 1247}
          </p>
        </div>

        <div className="bg-surface border border-border rounded-lg p-6">
          <p className="text-sm text-muted mb-2">Pass Rate</p>
          <p className="text-3xl font-bold text-primary">{overviewData.passRate || 78}%</p>
        </div>

        <div className="bg-surface border border-border rounded-lg p-6">
          <p className="text-sm text-muted mb-2">Total Bond Escrow</p>
          <p className="text-2xl font-bold text-primary">
            ₦{(overviewData.totalBondEscrow || 18700000)?.toLocaleString()}
          </p>
        </div>

        <div className="bg-surface border border-border rounded-lg p-6">
          <p className="text-sm text-muted mb-2">Flagged Count</p>
          <p className="text-3xl font-bold text-danger">{overviewData.flaggedCount || 14}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h2 className="text-lg font-bold text-ink mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {(overviewData.recentActivity || []).map((activity: any) => (
            <div key={activity.id} className="flex items-center gap-4 p-3 border border-border rounded-lg">
              <Avatar initials={activity.avatar} colored size="md" />
              <div className="flex-1">
                <p className="font-medium text-ink">{activity.vendorName}</p>
                <p className="text-xs text-muted">{activity.type}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted">{activity.timeAgo}</p>
                <Badge variant={activity.status as any}>
                  {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
