'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Store, Upload, Wallet as WalletIcon, Settings, Search,
  ChevronDown, RefreshCw, AlertTriangle, CheckCircle2, Clock,
} from 'lucide-react';
import { DashShell } from '@/components/layout/DashShell';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Badge } from '@/components/ui/Badge';
import TsButton from '@/components/ts/TsButton';
import { vendorService } from '@/services/vendorService';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';
import { mockOrgVendors } from '@/mocks/mockData';

const NAV_ITEMS = [
  { label: 'Overview',       href: '/dashboard', icon: Home },
  { label: 'Vendors',        href: '/vendors',   icon: Store },
  { label: 'Submit vendor',  href: '/submit',    icon: Upload },
  { label: 'Wallet',         href: '/wallet',    icon: WalletIcon },
  { label: 'Settings',       href: '/settings',  icon: Settings },
];

const FILTERS = ['all', 'verified', 'pending', 'failed'] as const;
type Filter = typeof FILTERS[number];

const STATUS_COLOR: Record<string, string> = {
  verified: '#00D97E',
  pending:  '#F0A500',
  failed:   '#F85149',
  rejected: '#F85149',
  review:   '#8B5CF6',
};

function VendorCard({ vendor, expanded, onToggle }: { vendor: any; expanded: boolean; onToggle: () => void }) {
  const status   = (vendor.status || 'pending').toLowerCase();
  const accent   = STATUS_COLOR[status] || '#484F58';
  const score    = vendor.trustScore;
  const initials = vendor.businessName?.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() || '?';

  return (
    <motion.div
      layout
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      onClick={onToggle}
      className="rounded-xl px-5 py-4 cursor-pointer"
      style={{
        background: '#0D1117',
        border: '1px solid #21262D',
        borderLeft: `3px solid ${accent}`,
      }}
    >
      <motion.div layout="position" className="flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-md flex items-center justify-center font-ts-display font-semibold text-[12px] flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${accent}33, ${accent}0A)`,
            color: accent,
            border: `1px solid ${accent}40`,
          }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-medium text-ts-text-pri truncate">{vendor.businessName}</p>
          <p className="text-[12px] text-ts-text-sec truncate">
            {vendor.contactEmail}
            {vendor.bankAccount && (
              <span className="text-ts-text-mut font-ts-mono"> · {vendor.bankAccount}</span>
            )}
          </p>
        </div>

        <div className="hidden md:block text-[11.5px] text-ts-text-mut font-ts-mono mr-3">
          {new Date(vendor.createdAt).toLocaleDateString()}
        </div>

        {score != null && (
          <div className="flex items-center gap-2 mr-3 min-w-[110px]">
            <div className="relative w-14 h-1.5 rounded-full overflow-hidden bg-ts-elevated">
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ width: `${Math.min(100, score)}%`, background: accent, boxShadow: `0 0 6px ${accent}` }}
              />
            </div>
            <span className="text-[12.5px] font-ts-display font-semibold" style={{ color: accent }}>
              {score}
            </span>
          </div>
        )}

        <Badge variant={status as any}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>

        <ChevronDown
          size={15}
          className="text-ts-text-mut ml-2 transition-transform duration-200"
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)' }}
        />
      </motion.div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{    opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div
              className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4 text-[12.5px]"
              style={{ borderColor: '#21262D' }}
            >
              <div className="space-y-2.5">
                <h4 className="text-[10.5px] uppercase tracking-[0.14em] text-ts-text-mut font-medium">
                  Verification checks
                </h4>
                {[
                  { label: 'CAC registry match', ok: status === 'verified' },
                  { label: 'Bank account name match', ok: status === 'verified' },
                  { label: 'Document authenticity', ok: status !== 'rejected' },
                  { label: 'Address validation', ok: status === 'verified' },
                ].map((c) => (
                  <div key={c.label} className="flex items-center gap-2">
                    {c.ok ? (
                      <CheckCircle2 size={13} className="text-ts-green" />
                    ) : status === 'pending' ? (
                      <Clock size={13} className="text-ts-amber" />
                    ) : (
                      <AlertTriangle size={13} className="text-ts-red" />
                    )}
                    <span className="text-ts-text-pri">{c.label}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-[10.5px] uppercase tracking-[0.14em] text-ts-text-mut font-medium mb-1.5">
                    Contact
                  </p>
                  <p className="text-ts-text-pri">{vendor.contactEmail}</p>
                  {vendor.contactPhone && (
                    <p className="text-ts-text-sec font-ts-mono">{vendor.contactPhone}</p>
                  )}
                </div>
                {(vendor.rejectionReason || vendor.failureReason) && (
                  <div
                    className="rounded-md p-2.5 text-[12px]"
                    style={{
                      background: 'rgba(248,81,73,0.08)',
                      border: '1px solid rgba(248,81,73,0.3)',
                      color: '#F85149',
                    }}
                  >
                    <span className="font-medium">Reason: </span>
                    {vendor.rejectionReason || vendor.failureReason}
                  </div>
                )}
                {(status === 'failed' || status === 'rejected') && (
                  <TsButton variant="ghost" size="sm" leftIcon={<RefreshCw size={12} />}>
                    Re-submit verification
                  </TsButton>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function VendorsContent() {
  const { toasts, addToast, removeToast } = useToast();
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState<Filter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const data = await vendorService.getVendors();
      setVendors(data);
    } catch {
      addToast('Failed to load vendors — showing sample data', 'warning');
      setVendors(mockOrgVendors);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVendors(); /* eslint-disable-next-line */ }, []);

  // Poll every 10s while any vendor is pending
  useEffect(() => {
    if (!vendors.some((v) => v.status === 'pending')) return;
    const id = setInterval(async () => {
      try {
        const data = await vendorService.getVendors();
        setVendors(data);
        if (!data.some((v: any) => v.status === 'pending')) clearInterval(id);
      } catch { /* ignore */ }
    }, 10000);
    return () => clearInterval(id);
  }, [vendors]);

  const filtered = useMemo(() => vendors
    .filter((v) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        v.businessName?.toLowerCase().includes(q) ||
        v.contactEmail?.toLowerCase().includes(q);
      const matchesFilter = filter === 'all' || v.status === filter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  [vendors, search, filter]);

  const counts = useMemo(() => ({
    all:      vendors.length,
    verified: vendors.filter((v) => v.status === 'verified').length,
    pending:  vendors.filter((v) => v.status === 'pending').length,
    failed:   vendors.filter((v) => ['failed', 'rejected'].includes(v.status)).length,
  }), [vendors]);

  return (
    <>
      <DashShell items={NAV_ITEMS} activeItem="/vendors">
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-ts-display text-[28px] font-semibold tracking-tight text-ts-text-pri">
                Vendors
              </h1>
              <p className="text-[13px] text-ts-text-sec mt-1">
                {vendors.length} {vendors.length === 1 ? 'vendor' : 'vendors'} in your network
              </p>
            </div>
            <TsButton onClick={() => fetchVendors()} variant="ghost" size="sm" leftIcon={<RefreshCw size={13} />}>
              Refresh
            </TsButton>
          </div>

          {/* Search + filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ts-text-mut pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search by business name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-md text-[13.5px] outline-none transition-all"
                style={{
                  background: '#0D1117',
                  border: '1px solid #21262D',
                  color: '#E6EDF3',
                }}
              />
            </div>
            <div
              className="flex items-center p-1 rounded-md"
              style={{ background: '#0D1117', border: '1px solid #21262D' }}
            >
              {FILTERS.map((f) => {
                const active = filter === f;
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className="px-3 py-1.5 rounded text-[12px] font-medium capitalize transition-all duration-150 flex items-center gap-1.5"
                    style={{
                      background: active ? '#161B22' : 'transparent',
                      color: active ? '#E6EDF3' : '#8B949E',
                    }}
                  >
                    {f}
                    <span
                      className="text-[10px] font-ts-mono px-1.5 py-0.5 rounded"
                      style={{
                        background: active ? 'rgba(0,217,126,0.10)' : '#080C10',
                        color: active ? '#00D97E' : '#484F58',
                      }}
                    >
                      {counts[f]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* List */}
          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[72px] rounded-xl animate-pulse"
                  style={{
                    background: 'linear-gradient(90deg, #0D1117 25%, #161B22 50%, #0D1117 75%)',
                    backgroundSize: '400% 100%',
                  }}
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="rounded-xl py-16 text-center"
              style={{ background: '#0D1117', border: '1px solid #21262D' }}
            >
              <Store size={28} className="text-ts-text-mut mx-auto mb-3" />
              <p className="text-[14px] text-ts-text-sec">No vendors match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              <AnimatePresence initial={false}>
                {filtered.map((v) => (
                  <VendorCard
                    key={v.id}
                    vendor={v}
                    expanded={expandedId === v.id}
                    onToggle={() => setExpandedId((id) => (id === v.id ? null : v.id))}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </DashShell>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}

export default function VendorsPage() {
  return (
    <ProtectedRoute>
      <VendorsContent />
    </ProtectedRoute>
  );
}
