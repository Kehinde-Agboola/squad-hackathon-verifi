import React from 'react';
import { Copy, CheckCircle, Clock, Badge as BadgeIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ScoreRing } from '@/components/ui/ScoreRing';
import QRCode from 'react-qr-code';

interface VBadgeProps {
  badgeData: any;
}

export const VBadge: React.FC<VBadgeProps> = ({ badgeData }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(badgeData.embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-ink mb-6">Trust Badge</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Badge Preview */}
        <div className="lg:col-span-1 bg-surface border border-border rounded-lg p-8 text-center">
          <p className="text-xs text-muted mb-4">PUBLIC BADGE</p>

          {/* Badge Card */}
          <div className="bg-gradient-to-br from-primary-light to-white p-6 rounded-lg border-2 border-primary mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BadgeIcon size={24} className="text-primary" />
              <p className="font-display font-bold text-primary text-lg">TrustShield</p>
            </div>

            <p className="font-medium text-ink text-sm mb-3">{badgeData.vendorName}</p>

            <div className="bg-white p-4 rounded mb-4 border border-border">
              <p className="text-xs text-muted mb-1">Business ID</p>
              <p className="font-mono text-sm font-bold text-primary">{badgeData.businessId}</p>
            </div>

            <div className="flex justify-center mb-4">
              <ScoreRing score={badgeData.trustScore} size="md" animated={false} />
            </div>

            {badgeData.verified && (
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                <CheckCircle size={14} />
                Verified
              </div>
            )}
          </div>

          {/* QR Code */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <QRCode value={badgeData.qrCode} size={128} className="mx-auto" />
          </div>

          <p className="text-xs text-muted">Scan to verify publicly</p>
        </div>

        {/* Right: Embed Code & Checks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Embed Code */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <h3 className="font-bold text-ink mb-3">Embed Badge on Your Site</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4 font-mono text-xs text-gray-700 overflow-x-auto">
              <code>{badgeData.embedCode}</code>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopyEmbed}
              className="w-full"
            >
              <Copy size={16} />
              {copied ? 'Copied!' : 'Copy code'}
            </Button>
          </div>

          {/* Check Breakdown */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <h3 className="font-bold text-ink mb-4">Verification Status</h3>
            <div className="space-y-2">
              {badgeData.checks.map((check: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3 p-2">
                  {check.status === 'passed' ? (
                    <CheckCircle size={18} className="text-green-600" />
                  ) : (
                    <Clock size={18} className="text-amber-600" />
                  )}
                  <span className="text-sm text-ink">{check.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
