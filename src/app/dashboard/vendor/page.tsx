'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Home, Shield, File, Award, CreditCard } from 'lucide-react';
import { DashShell } from '@/components/layout/DashShell';
import { VOverview } from '@/components/vendor/VOverview';
import { VVerifications } from '@/components/vendor/VVerifications';
import { VDocuments } from '@/components/vendor/VDocuments';
import { VBadge } from '@/components/vendor/VBadge';
import { VBilling } from '@/components/vendor/VBilling';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';
import { vendorService } from '@/services/vendorService';
import {
  mockOverview,
  mockVerifications,
  mockDocuments,
  mockBadge,
  mockBilling,
} from '@/mocks/mockData';

function VendorDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, hydrated } = useAuthStore();
  const { toasts, addToast, removeToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});

  const currentPanel = searchParams.get('panel') || 'overview';

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated || user?.role !== 'vendor') {
      router.push('/login');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const [overview, verifications, documents, badge, billing] = await Promise.allSettled([
          vendorService.getOverview(),
          vendorService.getVerifications(),
          vendorService.getDocuments(),
          vendorService.getBadge(),
          vendorService.getBilling(),
        ]).then((results) =>
          results.map((r) => (r.status === 'fulfilled' ? r.value : null))
        );

        setData({
          overview: overview || mockOverview,
          verifications: verifications || mockVerifications,
          documents: documents || mockDocuments,
          badge: badge || mockBadge,
          billing: billing || mockBilling,
        });
      } catch (error) {
        addToast('Failed to load dashboard data', 'error');
        setData({
          overview: mockOverview,
          verifications: mockVerifications,
          documents: mockDocuments,
          badge: mockBadge,
          billing: mockBilling,
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, user, hydrated, router, addToast]);

  const sidebarItems = [
    { label: 'Overview', href: '/dashboard/vendor', icon: Home },
    { label: 'Verifications', href: '/dashboard/vendor?panel=verifications', icon: Shield },
    { label: 'Documents', href: '/dashboard/vendor?panel=documents', icon: File },
    { label: 'Trust Badge', href: '/dashboard/vendor?panel=badge', icon: Award },
    { label: 'Billing', href: '/dashboard/vendor?panel=billing', icon: CreditCard },
  ];

  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-12">Loading...</div>;
    }

    switch (currentPanel) {
      case 'verifications':
        return (
          <div className="max-w-6xl mx-auto px-6 py-8">
            <VVerifications verifications={data.verifications || []} />
          </div>
        );
      case 'documents':
        return (
          <div className="max-w-6xl mx-auto px-6 py-8">
            <VDocuments
              documents={data.documents || []}
              onDownload={(docId) => vendorService.downloadDocument(docId)}
            />
          </div>
        );
      case 'badge':
        return (
          <div className="max-w-6xl mx-auto px-6 py-8">
            <VBadge badgeData={data.badge || mockBadge} />
          </div>
        );
      case 'billing':
        return (
          <div className="max-w-6xl mx-auto px-6 py-8">
            <VBilling billingData={data.billing || mockBilling} />
          </div>
        );
      default:
        return (
          <div className="max-w-6xl mx-auto px-6 py-8">
            <VOverview vendorData={data.overview || mockOverview} />
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
            ? '/dashboard/vendor'
            : `/dashboard/vendor?panel=${currentPanel}`
        }
      >
        {renderContent()}
      </DashShell>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}

export default function VendorDashboard() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <VendorDashboardContent />
    </Suspense>
  );
}
