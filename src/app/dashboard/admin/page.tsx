'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  BarChart3,
  Store,
  FileCheck,
  AlertTriangle,
  Wallet,
} from 'lucide-react';
import { DashShell } from '@/components/layout/DashShell';
import { AOverview } from '@/components/admin/AOverview';
import { AVendors } from '@/components/admin/AVendors';
import { AFlagged } from '@/components/admin/AFlagged';
import { ASquadLedger } from '@/components/admin/ASquadLedger';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';
import { adminService } from '@/services/adminService';
import {
  mockAdminOverview,
  mockVendors,
  mockFlagged,
  mockSquadLedger,
} from '@/mocks/mockData';

function AdminDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuthStore();
  const { toasts, addToast, removeToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});

  const currentPanel = searchParams.get('panel') || 'overview';

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const [overview, vendors, flagged, ledger] = await Promise.allSettled([
          adminService.getOverview(),
          adminService.getVendors(),
          adminService.getFlagged(),
          adminService.getSquadLedger(),
        ]).then((results) =>
          results.map((r) => (r.status === 'fulfilled' ? r.value : null))
        );

        setData({
          overview: overview || mockAdminOverview,
          vendors: vendors || mockVendors,
          flagged: flagged || mockFlagged,
          ledger: ledger || mockSquadLedger,
        });
      } catch (error) {
        addToast('Failed to load dashboard data', 'error');
        setData({
          overview: mockAdminOverview,
          vendors: mockVendors,
          flagged: mockFlagged,
          ledger: mockSquadLedger,
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, user, router, addToast]);

  const sidebarItems = [
    { label: 'Overview', href: '/dashboard/admin', icon: BarChart3 },
    { label: 'All Vendors', href: '/dashboard/admin?panel=vendors', icon: Store },
    {
      label: 'Certificates',
      href: '/dashboard/admin?panel=certificates',
      icon: FileCheck,
    },
    {
      label: 'Flagged',
      href: '/dashboard/admin?panel=flagged',
      icon: AlertTriangle,
      badge: data.flagged?.length || 0,
    },
    { label: 'Squad Ledger', href: '/dashboard/admin?panel=ledger', icon: Wallet },
  ];

  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-12">Loading...</div>;
    }

    switch (currentPanel) {
      case 'vendors':
        return (
          <div className="max-w-6xl mx-auto px-6 py-8">
            <AVendors vendors={data.vendors || []} />
          </div>
        );
      case 'flagged':
        return (
          <div className="max-w-6xl mx-auto px-6 py-8">
            <AFlagged
              flaggedItems={data.flagged || []}
              onSuspend={(vendorId) => {
                adminService.suspendVendor(vendorId);
                addToast('Vendor suspended successfully', 'success');
              }}
              onReverify={(vendorId) => {
                adminService.reverifyVendor(vendorId);
                addToast('Re-verification triggered', 'success');
              }}
            />
          </div>
        );
      case 'ledger':
        return (
          <div className="max-w-6xl mx-auto px-6 py-8">
            <ASquadLedger ledgerData={data.ledger || mockSquadLedger} />
          </div>
        );
      case 'certificates':
        return (
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="text-center py-12 bg-surface border border-border rounded-lg">
              <FileCheck size={48} className="mx-auto text-muted mb-4" />
              <p className="text-muted">Certificate verification module coming soon</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="max-w-6xl mx-auto px-6 py-8">
            <AOverview overviewData={data.overview || mockAdminOverview} />
          </div>
        );
    }
  };

  return (
    <>
      <DashShell
        items={sidebarItems}
        activeItem={
          currentPanel === 'overview' || !currentPanel
            ? '/dashboard/admin'
            : `/dashboard/admin?panel=${currentPanel}`
        }
      >
        {renderContent()}
      </DashShell>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
