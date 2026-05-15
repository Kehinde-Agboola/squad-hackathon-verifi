'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Bell, Settings as SettingsIcon, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

interface TopNavProps {
  onMenuToggle?: () => void;
}

const SECTION_LABEL: Record<string, string> = {
  '/dashboard':       'Overview',
  '/dashboard/vendor':'Vendor portal',
  '/dashboard/admin': 'Admin',
  '/vendors':         'Vendors',
  '/submit':          'Submit vendor',
  '/wallet':          'Wallet',
  '/settings':        'Settings',
};

export const TopNav: React.FC<TopNavProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname() || '';
  const sectionLabel = SECTION_LABEL[pathname] || 'Dashboard';

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

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
    <header
      className="h-14 flex items-center justify-between px-5 border-b flex-shrink-0 sticky top-0 z-30"
      style={{ background: 'rgba(8,12,16,0.85)', borderColor: '#21262D', backdropFilter: 'blur(12px)' }}
    >
      {/* Left — breadcrumb */}
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="md:hidden p-1.5 rounded-md text-ts-text-sec hover:text-ts-text-pri hover:bg-ts-elevated transition-colors"
            aria-label="Toggle menu"
          >
            <Menu size={18} />
          </button>
        )}
        <nav className="flex items-center gap-2 text-[13px]">
          <span className="text-ts-text-mut">VendorShield</span>
          <span className="text-ts-text-mut">/</span>
          <span className="text-ts-text-pri font-medium">{sectionLabel}</span>
        </nav>
      </div>

      {/* Right — bell + avatar */}
      <div className="flex items-center gap-1">
        <button
          className="relative p-2 rounded-md text-ts-text-sec hover:text-ts-text-pri hover:bg-ts-elevated transition-colors"
          aria-label="Notifications"
        >
          <Bell size={16} />
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: '#00D97E', boxShadow: '0 0 6px #00D97E' }}
          />
        </button>

        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-ts-elevated transition-colors"
          >
            <div className="relative">
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center font-ts-display font-semibold text-[11px]"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,217,126,0.2), rgba(0,217,126,0.05))',
                  color: '#00D97E',
                  border: '1px solid rgba(0,217,126,0.3)',
                }}
              >
                {initials}
              </div>
              <span
                className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border"
                style={{
                  background: '#00D97E',
                  borderColor: '#080C10',
                  boxShadow: '0 0 6px #00D97E',
                }}
              />
            </div>
            <ChevronDown size={13} className="text-ts-text-sec" />
          </button>

          {open && (
            <div
              className="absolute right-0 mt-2 min-w-[200px] rounded-lg overflow-hidden py-1.5"
              style={{
                background: '#0D1117',
                border: '1px solid #21262D',
                boxShadow: '0 12px 36px -8px rgba(0,0,0,0.6)',
              }}
            >
              <div className="px-3.5 py-2 border-b" style={{ borderColor: '#21262D' }}>
                <p className="text-[12.5px] font-medium text-ts-text-pri truncate">
                  {user?.name || 'Organisation'}
                </p>
                <p className="text-[11px] text-ts-text-mut truncate">{user?.email}</p>
              </div>
              <Link
                href="/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2 text-[12.5px] text-ts-text-sec hover:text-ts-text-pri hover:bg-ts-elevated transition-colors"
              >
                <SettingsIcon size={13} />
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[12.5px] text-ts-text-sec hover:text-ts-red hover:bg-ts-elevated transition-colors"
              >
                <LogOut size={13} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
