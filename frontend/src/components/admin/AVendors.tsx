import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';

interface AVendorsProps {
  vendors: any[];
  onSearch?: (query: string) => void;
}

export const AVendors: React.FC<AVendorsProps> = ({ vendors, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const getScoreColor = (score: number): 'green' | 'amber' | 'red' => {
    if (score >= 70) return 'green';
    if (score >= 40) return 'amber';
    return 'red';
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-ink mb-6">All Vendors</h2>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={20} className="absolute left-3 top-3 text-muted" />
        <input
          type="text"
          placeholder="Search vendors..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Vendors List */}
      <div className="space-y-2">
        {vendors.map((vendor: any) => (
          <div key={vendor.id} className="border border-border rounded-lg bg-surface overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === vendor.id ? null : vendor.id)}
              className="w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-4 flex-1">
                <Avatar initials={vendor.avatar} colored size="md" />
                <div className="flex-1">
                  <p className="font-medium text-ink">{vendor.name}</p>
                  <p className="text-xs text-muted">{vendor.type}</p>
                </div>
                <div className="text-right mr-4">
                  <p className="text-xs text-muted">{vendor.date}</p>
                  <p className={`font-bold ${
                    getScoreColor(vendor.score) === 'green'
                      ? 'text-green-600'
                      : getScoreColor(vendor.score) === 'amber'
                      ? 'text-amber-600'
                      : 'text-red-600'
                  }`}>
                    {vendor.score}
                  </p>
                </div>
                <Badge variant={vendor.status as any}>
                  {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                </Badge>
              </div>
              {expanded === vendor.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {expanded === vendor.id && (
              <div className="border-t border-border p-4 bg-gray-50">
                <p className="text-sm text-muted mb-3">Verification Breakdown</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-ink">Document Verification</span>
                    <span className="text-green-600">✓ Passed</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ink">Liveness Check</span>
                    <span className="text-green-600">✓ Passed</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ink">Fraud Detection</span>
                    <span className="text-green-600">✓ Passed</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
