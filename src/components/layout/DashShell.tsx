'use client';

import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { TopNav } from './TopNav';
import { Sidebar } from './Sidebar';
import { useTsScope } from '@/components/ts/useTsScope';

interface DashShellItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

interface DashShellProps {
  items: DashShellItem[];
  children: React.ReactNode;
  activeItem: string;
}

export const DashShell: React.FC<DashShellProps> = ({
  items,
  children,
  activeItem,
}) => {
  useTsScope();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarItems = items.map((item) => ({
    ...item,
    active: item.href === activeItem,
  }));

  return (
    <div className="ts-landing flex h-screen" style={{ background: '#080C10' }}>
      <Sidebar items={sidebarItems} isOpen={sidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav onMenuToggle={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1 overflow-y-auto" style={{ background: '#080C10' }}>
          {children}
        </main>
      </div>
    </div>
  );
};
