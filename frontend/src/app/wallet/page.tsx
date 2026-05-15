'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Store, Upload, Wallet as WalletIcon, Settings, X,
  ArrowUpRight, ArrowDownLeft, Plus,
} from 'lucide-react';
import { DashShell } from '@/components/layout/DashShell';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Badge } from '@/components/ui/Badge';
import TsButton from '@/components/ts/TsButton';
import TsInput  from '@/components/ts/TsInput';
import CountUp  from '@/components/ts/CountUp';
import { useAuthStore } from '@/store/useAuthStore';
import { walletService } from '@/services/walletService';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';
import { mockWallet, mockTransactions } from '@/mocks/mockData';

const NAV_ITEMS = [
  { label: 'Overview',       href: '/dashboard', icon: Home },
  { label: 'Vendors',        href: '/vendors',   icon: Store },
  { label: 'Submit vendor',  href: '/submit',    icon: Upload },
  { label: 'Wallet',         href: '/wallet',    icon: WalletIcon },
  { label: 'Settings',       href: '/settings',  icon: Settings },
];

const PRESETS = [5000, 10000, 25000, 50000];

function WalletContent() {
  const { user } = useAuthStore();
  const { toasts, addToast, removeToast } = useToast();
  const [walletData, setWalletData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading]           = useState(true);
  const [showTopUp, setShowTopUp]       = useState(false);
  const [amount, setAmount]             = useState('');
  const [topping, setTopping]           = useState(false);

  useEffect(() => {
    const fetchWallet = async () => {
      setLoading(true);
      const [wRes, tRes] = await Promise.allSettled([
        walletService.getWallet(user!.id),
        walletService.getTransactions(user!.id),
      ]);
      setWalletData(wRes.status === 'fulfilled' ? wRes.value : mockWallet);
      setTransactions(tRes.status === 'fulfilled' ? tRes.value : mockTransactions);
      setLoading(false);
    };
    if (user?.id) fetchWallet();
  }, [user?.id]);

  const handleTopUp = async () => {
    const n = Number(amount);
    if (!amount || n < 100) {
      addToast('Minimum top up is ₦100', 'error');
      return;
    }
    setTopping(true);
    try {
      const res = await walletService.topUp(user!.id, n);
      const url = res.checkoutUrl || res.checkout_url || res.data?.checkoutUrl || res.data?.checkout_url;
      if (url) {
        window.open(url, '_blank');
        addToast('Redirecting to Squad payment page…', 'success');
        setShowTopUp(false);
        setAmount('');
      } else {
        addToast('Could not get payment link from Squad', 'error');
      }
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Top up failed. Please try again.', 'error');
    } finally {
      setTopping(false);
    }
  };

  const balance = walletData?.balance ?? 0;

  return (
    <>
      <DashShell items={NAV_ITEMS} activeItem="/wallet">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          <div>
            <h1 className="font-ts-display text-[28px] font-semibold tracking-tight text-ts-text-pri">
              Wallet
            </h1>
            <p className="text-[13px] text-ts-text-sec mt-1">
              Fund your verifications · Powered by Squad Financial
            </p>
          </div>

          {/* Hero balance */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-2xl p-7"
            style={{
              background: 'linear-gradient(135deg, #0D2B1E 0%, #0D1117 70%)',
              border: '1px solid rgba(0,217,126,0.30)',
              boxShadow: '0 0 60px -10px rgba(0,217,126,0.18), 0 30px 80px -30px rgba(0,0,0,0.6)',
            }}
          >
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 60% 80% at 100% 0%, rgba(0,217,126,0.18), transparent 60%)',
              }}
            />
            <div className="relative flex items-end justify-between flex-wrap gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2 text-[10.5px] uppercase tracking-[0.18em] font-medium text-ts-text-mut">
                  <WalletIcon size={11} />
                  Organisation wallet
                </div>
                <p
                  className="font-ts-display text-[48px] md:text-[60px] font-semibold tracking-tight leading-none text-ts-green"
                  style={{ textShadow: '0 0 40px rgba(0,217,126,0.5)' }}
                >
                  {loading ? '—' : <CountUp to={balance} prefix="₦" duration={1.4} />}
                </p>
                <div className="flex items-center gap-2 mt-3 text-[11.5px] text-ts-text-sec">
                  <span
                    className="px-2 py-0.5 rounded font-ts-mono"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid #21262D',
                    }}
                  >
                    NGN
                  </span>
                  Secured by <span className="text-ts-text-pri font-medium">Squad</span>
                </div>
              </div>
              <div className="flex gap-2">
                <TsButton variant="ghost" size="md">
                  History
                </TsButton>
                <TsButton variant="gold" size="md" onClick={() => setShowTopUp(true)} leftIcon={<Plus size={15} strokeWidth={2.5} />}>
                  Top up
                </TsButton>
              </div>
            </div>
          </motion.div>

          {/* Transactions timeline */}
          <div
            className="rounded-xl p-6"
            style={{ background: '#0D1117', border: '1px solid #21262D' }}
          >
            <h2 className="text-[15px] font-ts-display font-semibold text-ts-text-pri mb-5">
              Transaction history
            </h2>

            {loading ? (
              <div className="space-y-3">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-14 rounded-lg animate-pulse"
                    style={{
                      background: 'linear-gradient(90deg, #0D1117 25%, #161B22 50%, #0D1117 75%)',
                      backgroundSize: '400% 100%',
                    }}
                  />
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <p className="text-[13px] text-ts-text-sec text-center py-10">No transactions yet.</p>
            ) : (
              <div className="relative pl-5">
                <div
                  className="absolute left-1.5 top-1 bottom-1 w-px"
                  style={{ background: '#21262D' }}
                />
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {transactions.map((tx, i) => {
                      const credit = tx.type === 'credit';
                      const dotColor = credit ? '#00D97E' : '#F0A500';
                      return (
                        <motion.div
                          key={tx.id || i}
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, delay: i * 0.04 }}
                          className="relative flex items-center gap-4 px-4 py-3 rounded-lg"
                          style={{ background: '#0B0F14', border: '1px solid #21262D' }}
                        >
                          <span
                            className="absolute -left-[14px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                            style={{
                              background: dotColor,
                              border: '2px solid #0D1117',
                              boxShadow: `0 0 8px ${dotColor}`,
                            }}
                          />
                          <div
                            className="w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0"
                            style={{
                              background: credit ? 'rgba(0,217,126,0.10)' : 'rgba(240,165,0,0.10)',
                              border: `1px solid ${credit ? 'rgba(0,217,126,0.3)' : 'rgba(240,165,0,0.3)'}`,
                            }}
                          >
                            {credit
                              ? <ArrowDownLeft size={15} className="text-ts-green" strokeWidth={2.4} />
                              : <ArrowUpRight  size={15} className="text-ts-amber" strokeWidth={2.4} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13.5px] font-medium text-ts-text-pri truncate">
                              {tx.description || (credit ? 'Top up' : 'Verification charge')}
                            </p>
                            <p className="text-[11.5px] text-ts-text-mut font-ts-mono">
                              {new Date(tx.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <p
                            className="font-ts-display font-semibold text-[15px] flex-shrink-0"
                            style={{ color: credit ? '#00D97E' : '#E6EDF3' }}
                          >
                            {credit ? '+' : '−'}₦{Number(tx.amount).toLocaleString()}
                          </p>
                          {tx.status && (
                            <Badge variant={tx.status as any}>
                              {String(tx.status).charAt(0).toUpperCase() + String(tx.status).slice(1)}
                            </Badge>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </div>
      </DashShell>

      {/* Top up modal */}
      <AnimatePresence>
        {showTopUp && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{    opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowTopUp(false)}
              className="fixed inset-0 z-[280]"
              style={{ background: 'rgba(8,12,16,0.78)', backdropFilter: 'blur(6px)' }}
            />
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0,  scale: 1 }}
              exit={{    opacity: 0, y: 40, scale: 0.96 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-4 bottom-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-[290] sm:w-[420px]"
            >
              <div
                className="rounded-2xl p-6"
                style={{
                  background: '#0D1117',
                  border: '1px solid #21262D',
                  boxShadow: '0 30px 80px -20px rgba(0,0,0,0.7)',
                }}
              >
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-ts-display text-[20px] font-semibold text-ts-text-pri">
                      Top up wallet
                    </h2>
                    <p className="text-[12px] text-ts-text-sec mt-0.5">
                      Funds settle instantly via Squad
                    </p>
                  </div>
                  <button
                    onClick={() => setShowTopUp(false)}
                    className="p-1.5 rounded-md text-ts-text-sec hover:text-ts-text-pri hover:bg-ts-elevated transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[14px] text-ts-text-sec">
                      ₦
                    </span>
                    <TsInput
                      label="Amount"
                      type="number"
                      placeholder="10,000"
                      min={100}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      hint="Minimum ₦100"
                      className="pl-7"
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {PRESETS.map((p) => (
                      <button
                        key={p}
                        onClick={() => setAmount(String(p))}
                        className="py-2 rounded-md text-[12px] font-medium transition-all duration-150 hover:-translate-y-px"
                        style={{
                          background: amount === String(p) ? 'rgba(0,217,126,0.10)' : '#0B0F14',
                          color:      amount === String(p) ? '#00D97E' : '#E6EDF3',
                          border: amount === String(p) ? '1px solid rgba(0,217,126,0.4)' : '1px solid #21262D',
                        }}
                      >
                        ₦{(p / 1000)}k
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <TsButton variant="ghost" onClick={() => setShowTopUp(false)} className="flex-1">
                      Cancel
                    </TsButton>
                    <TsButton
                      variant="gold"
                      loading={topping}
                      onClick={handleTopUp}
                      className="flex-1"
                      rightIcon={<ArrowUpRight size={15} strokeWidth={2.4} />}
                    >
                      Pay with Squad
                    </TsButton>
                  </div>

                  <div className="text-center text-[11px] text-ts-text-mut">
                    Secured end-to-end by <span className="text-ts-text-sec">Squad</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}

export default function WalletPage() {
  return (
    <ProtectedRoute>
      <WalletContent />
    </ProtectedRoute>
  );
}
