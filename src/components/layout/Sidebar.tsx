'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon, LogOut, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
  badge?: number;
}

interface SidebarProps {
  items: SidebarItem[];
  isOpen?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ items, isOpen = true }) => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const initials =
    (user?.name || user?.contactPersonName || 'V')
      .split(' ')
      .map((s) => s[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  return (
    <aside
      className={`flex-shrink-0 h-screen flex flex-col transition-all border-r ${
        isOpen ? 'w-[220px]' : 'w-0 md:w-[220px]'
      } overflow-hidden`}
      style={{ background: '#0D1117', borderColor: '#21262D' }}
    >
      {/* Logo bar — matches TopNav height */}
      <Link
        href="/"
        className="h-14 flex items-center gap-2.5 px-5 border-b flex-shrink-0"
        style={{ borderColor: '#21262D' }}
      >
        <div
          className="relative w-7 h-7 flex items-center justify-center rounded-md"
          style={{
            background: 'linear-gradient(135deg, rgba(0,217,126,0.25), rgba(0,217,126,0.05))',
            boxShadow: 'inset 0 0 0 1px rgba(0,217,126,0.35)',
          }}
        >
          <ShieldCheck size={15} className="text-ts-green" strokeWidth={2.4} />
        </div>
        <span className="font-ts-display text-[14px] font-semibold text-ts-text-pri tracking-tight">
          VendorShield
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-all duration-150 ${
                item.active ? 'text-ts-text-pri' : 'text-ts-text-sec hover:text-ts-text-pri'
              }`}
              style={{
                background: item.active ? '#161B22' : 'transparent',
              }}
            >
              {item.active && (
                <span
                  className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r"
                  style={{ background: '#00D97E' }}
                />
              )}
              <Icon
                size={16}
                strokeWidth={item.active ? 2.4 : 2}
                className={item.active ? 'text-ts-green' : ''}
              />
              <span className="flex-1 font-medium">{item.label}</span>
              {item.badge != null && item.badge > 0 && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                  style={{ background: '#F85149', color: '#080C10' }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer — org chip + logout */}
      <div
        className="px-3 py-3 border-t flex-shrink-0 space-y-2"
        style={{ borderColor: '#21262D' }}
      >
        <div
          className="flex items-center gap-2.5 px-2 py-2 rounded-md"
          style={{ background: '#161B22' }}
        >
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center font-ts-display font-semibold text-[12px] flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(0,217,126,0.2), rgba(0,217,126,0.05))',
              color: '#00D97E',
              border: '1px solid rgba(0,217,126,0.25)',
            }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12.5px] font-medium text-ts-text-pri truncate leading-tight">
              {user?.name || user?.contactPersonName || 'Organisation'}
            </p>
            <p className="text-[10.5px] text-ts-text-mut capitalize truncate">
              {user?.plan || 'starter'} plan
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[12.5px] text-ts-text-sec hover:text-ts-red transition-colors"
        >
          <LogOut size={14} strokeWidth={2.2} />
          Sign out
        </button>
      </div>
    </aside>
  );
};
