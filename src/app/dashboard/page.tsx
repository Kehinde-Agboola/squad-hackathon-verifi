'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Home, Store, Upload, Wallet as WalletIcon, Settings,
  ArrowRight, ArrowUpRight, TrendingUp, Plus, Code2,
  CheckCircle2, Clock, XCircle, Layers,
} from 'lucide-react';
import { DashShell } from '@/components/layout/DashShell';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Badge } from '@/components/ui/Badge';
import CountUp from '@/components/ts/CountUp';
import TsButton from '@/components/ts/TsButton';
import { useAuthStore } from '@/store/useAuthStore';
import { vendorService } from '@/services/vendorService';
import { walletService } from '@/services/walletService';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';
import { mockOrgVendors, mockWallet } from '@/mocks/mockData';

const NAV_ITEMS = [
  { label: 'Overview',       href: '/dashboard', icon: Home },
  { label: 'Vendors',        href: '/vendors',   icon: Store },
  { label: 'Submit vendor',  href: '/submit',    icon: Upload },
  { label: 'Wallet',         href: '/wallet',    icon: WalletIcon },
  { label: 'Settings',       href: '/settings',  icon: Settings },
];

function MetricCard({
  label, value, color, icon: Icon, delta, delay,
}: {
  label: string; value: number; color: string; icon: any; delta?: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      className="rounded-xl p-5 transition-all duration-200"
      style={{
        background: '#0D1117',
        border: '1px solid #21262D',
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-[10.5px] uppercase tracking-[0.12em] font-medium text-ts-text-mut">
          {label}
        </span>
        <Icon size={14} className="text-ts-text-mut" strokeWidth={2} />
      </div>
      <div
        className="font-ts-display text-[28px] font-semibold tracking-tight leading-none"
        style={{
          color,
          textShadow: color !== '#E6EDF3' ? `0 0 24px ${color}40` : undefined,
        }}
      >
        <CountUp to={value} />
      </div>
      {delta && (
        <div className="flex items-center gap-1 mt-3 text-[11.5px] text-ts-text-mut">
          <TrendingUp size={11} className="text-ts-green" />
          {delta}
        </div>
      )}
    </motion.div>
  );
}

function DashboardContent() {
  const { user } = useAuthStore();
  const { toasts, removeToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState<any[]>([]);
  const [wallet, setWalletData] = useState<any>(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const [vendorsResult, walletResult] = await Promise.allSettled([
        vendorService.getVendors(),
        walletService.getWallet(user!.id),
      ]);
      setVendors(vendorsResult.status === 'fulfilled' ? vendorsResult.value : mockOrgVendors);
      setWalletData(walletResult.status === 'fulfilled' ? walletResult.value : mockWallet);
      setLoading(false);
    };
    if (user?.id) fetchAll();
  }, [user?.id]);

  const total    = vendors.length;
  const verified = vendors.filter((v) => v.status === 'verified').length;
  const pending  = vendors.filter((v) => v.status === 'pending').length;
  const failed   = vendors.filter((v) => ['failed', 'rejected'].includes(v.status)).length;

  const recent = [...vendors]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const balance = wallet?.balance ?? 0;
  const greeting =
    new Date().getHours() < 12 ? 'Good morning' :
    new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <>
      <DashShell items={NAV_ITEMS} activeItem="/dashboard">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-end justify-between mb-8 flex-wrap gap-4"
          >
            <div>
              <p className="text-[12px] text-ts-text-sec mb-1">{greeting},</p>
              <h1 className="font-ts-display text-[28px] font-semibold tracking-tight text-ts-text-pri">
                {user?.contactPersonName || user?.name || 'there'}
              </h1>
            </div>
            <Link href="/submit">
              <TsButton variant="primary" size="md" rightIcon={<ArrowRight size={15} strokeWidth={2.4} />}>
                Submit a vendor
              </TsButton>
            </Link>
          </motion.div>

          {/* Wallet hero card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-2xl p-7 mb-6"
            style={{
              background: 'linear-gradient(135deg, #0D2B1E 0%, #0D1117 70%)',
              border: '1px solid rgba(0,217,126,0.30)',
              boxShadow: '0 0 60px -10px rgba(0,217,126,0.18), 0 30px 80px -30px rgba(0,0,0,0.6)',
            }}
          >
            {/* Glow */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 60% 80% at 0% 100%, rgba(0,217,126,0.18), transparent 60%)',
              }}
            />

            <div className="relative flex items-center justify-between gap-6 flex-wrap">
              <div>
                <p className="text-[10.5px] uppercase tracking-[0.18em] font-medium text-ts-text-mut mb-2">
                  Wallet balance
                </p>
                <div className="flex items-baseline gap-3">
                  <p
                    className="font-ts-display text-[44px] md:text-[52px] font-semibold tracking-tight leading-none text-ts-green"
                    style={{ textShadow: '0 0 40px rgba(0,217,126,0.5)' }}
                  >
                    <CountUp to={balance} prefix="₦" duration={1.4} />
                  </p>
                  <span className="text-[12px] text-ts-text-sec font-ts-mono">NGN</span>
                </div>
                <p className="text-[12px] text-ts-text-sec mt-2">
                  Powered by <span className="text-ts-text-pri font-medium">Squad Financial Infrastructure</span>
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Link href="/wallet">
                  <TsButton variant="gold" size="md" rightIcon={<ArrowUpRight size={15} strokeWidth={2.4} />}>
                    Top up wallet
                  </TsButton>
                </Link>
                <Link href="/wallet" className="text-[12px] text-ts-text-sec hover:text-ts-text-pri transition-colors text-center">
                  View transactions →
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Metric cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <MetricCard label="Total"    value={total}    color="#E6EDF3" icon={Layers}        delta={loading ? undefined : `${total} all-time`} delay={0.10} />
            <MetricCard label="Verified" value={verified} color="#00D97E" icon={CheckCircle2}  delta={verified ? `${Math.round((verified / Math.max(1, total)) * 100)}% pass rate` : undefined} delay={0.18} />
            <MetricCard label="Pending"  value={pending}  color="#F0A500" icon={Clock}         delta={pending ? `${pending} awaiting review` : undefined} delay={0.26} />
            <MetricCard label="Failed"   value={failed}   color="#F85149" icon={XCircle}       delta={failed ? `${failed} need attention` : undefined} delay={0.34} />
          </div>

          {/* Recent vendors */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="rounded-xl p-5 mb-6"
            style={{ background: '#0D1117', border: '1px solid #21262D' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px] font-ts-display font-semibold text-ts-text-pri">
                Recent submissions
              </h2>
              <Link href="/vendors" className="text-[12px] text-ts-green hover:underline">
                View all →
              </Link>
            </div>

            {loading ? (
              <div className="space-y-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-14 rounded-lg animate-pulse"
                    style={{ background: 'linear-gradient(90deg, #161B22 25%, #1C2128 50%, #161B22 75%)', backgroundSize: '400% 100%' }}
                  />
                ))}
              </div>
            ) : recent.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-[13px] text-ts-text-sec mb-3">No vendors submitted yet.</p>
                <Link href="/submit">
                  <TsButton variant="ghost" size="sm" leftIcon={<Plus size={14} />}>
                    Submit your first vendor
                  </TsButton>
                </Link>
              </div>
            ) : (
              <div className="space-y-1.5">
                {recent.map((v, i) => {
                  const initials = v.businessName?.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() || '?';
                  const score = v.trustScore;
                  const scoreColor =
                    score == null ? '#484F58' :
                    score >= 70   ? '#00D97E' :
                    score >= 40   ? '#F0A500' : '#F85149';
                  return (
                    <motion.div
                      key={v.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, delay: 0.45 + i * 0.05 }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-ts-elevated transition-colors cursor-pointer group"
                    >
                      <div
                        className="w-9 h-9 rounded-md flex items-center justify-center font-ts-display font-semibold text-[12px] flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${scoreColor}33, ${scoreColor}0A)`,
                          color: scoreColor,
                          border: `1px solid ${scoreColor}40`,
                        }}
                      >
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13.5px] font-medium text-ts-text-pri truncate">
                          {v.businessName}
                        </p>
                        <p className="text-[11.5px] text-ts-text-mut truncate">{v.contactEmail}</p>
                      </div>
                      <div className="hidden sm:block text-[11px] text-ts-text-mut font-ts-mono mr-2">
                        {new Date(v.createdAt).toLocaleDateString()}
                      </div>
                      {score != null && (
                        <span
                          className="text-[12.5px] font-ts-display font-semibold mr-2"
                          style={{ color: scoreColor }}
                        >
                          {score}
                        </span>
                      )}
                      <Badge variant={(v.status as any) || 'pending'}>
                        {String(v.status).charAt(0).toUpperCase() + String(v.status).slice(1)}
                      </Badge>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                href: '/submit', icon: Upload, label: 'Submit a vendor',
                desc: 'Run a new KYB + bank match check', accent: '#00D97E', primary: true,
              },
              {
                href: '/wallet', icon: WalletIcon, label: 'Top up wallet',
                desc: 'Pay via Squad to fund verifications', accent: '#D29922',
              },
              {
                href: '/settings', icon: Code2, label: 'API documentation',
                desc: 'Integrate VendorShield into your platform', accent: '#58A6FF',
              },
            ].map((q, i) => (
              <motion.div
                key={q.href}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.55 + i * 0.08 }}
              >
                <Link href={q.href}>
                  <div
                    className="rounded-xl p-5 hover:-translate-y-0.5 transition-all duration-150 group h-full"
                    style={{
                      background: '#0D1117',
                      border: q.primary ? `1px solid ${q.accent}55` : '1px solid #21262D',
                      boxShadow: q.primary ? `0 0 30px -10px ${q.accent}33` : 'none',
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                      style={{
                        background: `${q.accent}1A`,
                        border: `1px solid ${q.accent}40`,
                      }}
                    >
                      <q.icon size={16} style={{ color: q.accent }} strokeWidth={2.2} />
                    </div>
                    <p className="text-[14px] font-medium text-ts-text-pri mb-1 flex items-center justify-between">
                      {q.label}
                      <ArrowRight size={13} className="text-ts-text-mut group-hover:text-ts-text-pri group-hover:translate-x-0.5 transition-all" />
                    </p>
                    <p className="text-[12px] text-ts-text-sec">{q.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </DashShell>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
