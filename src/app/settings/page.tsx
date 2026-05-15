'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Store, Upload, Wallet as WalletIcon, Settings as SettingsIcon,
  Copy, Check, RefreshCw, Eye, EyeOff, AlertTriangle, X, Key, Webhook, Building2, Pencil,
} from 'lucide-react';
import { DashShell } from '@/components/layout/DashShell';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import TsButton from '@/components/ts/TsButton';
import TsInput  from '@/components/ts/TsInput';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';

const NAV_ITEMS = [
  { label: 'Overview',       href: '/dashboard', icon: Home },
  { label: 'Vendors',        href: '/vendors',   icon: Store },
  { label: 'Submit vendor',  href: '/submit',    icon: Upload },
  { label: 'Wallet',         href: '/wallet',    icon: WalletIcon },
  { label: 'Settings',       href: '/settings',  icon: SettingsIcon },
];

/** Tiny JSON syntax highlighter — keys / strings / numbers / braces */
function HighlightedJson({ json }: { json: string }) {
  // very small token highlighter to avoid pulling in a syntax library
  const html = useMemo(() => {
    return json
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      // strings (after a colon → value)
      .replace(/("(?:\\.|[^"\\])*")(?=\s*:)/g, '<span style="color:#79C0FF">$1</span>')
      // string values
      .replace(/:\s*("(?:\\.|[^"\\])*")/g, ': <span style="color:#A5D6FF">$1</span>')
      // numbers / true/false/null
      .replace(/:\s*(-?\d+\.?\d*|true|false|null)/g, ': <span style="color:#F2CC60">$1</span>')
      // braces & brackets
      .replace(/([{}[\],])/g, '<span style="color:#E6EDF3">$1</span>');
  }, [json]);
  return (
    <pre
      className="font-ts-mono text-[12.5px] leading-relaxed overflow-x-auto p-4 rounded-lg"
      style={{ background: '#080C10', border: '1px solid #21262D', color: '#8B949E' }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

const EXAMPLE_PAYLOAD = `{
  "event": "verification.completed",
  "vendor": {
    "id": "ven_8d2f1a",
    "businessName": "Mama Cass Restaurant Ltd",
    "trustScore": 91,
    "status": "verified"
  },
  "checks": {
    "cacRegistry": "match",
    "bankNameMatch": "match",
    "documentAuthenticity": "passed"
  },
  "timestamp": 1747315822
}`;

function SettingsContent() {
  const { user } = useAuthStore();
  const { toasts, addToast, removeToast } = useToast();

  const [profile, setProfile] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [confirmRegen, setConfirmRegen] = useState(false);

  const [editingWebhook, setEditingWebhook] = useState(false);
  const [webhookDraft, setWebhookDraft] = useState('');

  const [formData, setFormData] = useState({
    phone: '', website: '', industry: '', description: '', webhookUrl: '',
    contactPersonName: '', contactPersonRole: '', plan: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getProfile();
        applyProfile(data);
        useAuthStore.getState().setUser(data);
      } catch {
        const stored = useAuthStore.getState().user;
        if (stored) applyProfile(stored);
      }
    };
    const applyProfile = (data: any) => {
      setProfile(data);
      setApiKey(data.apiKey || '');
      setWebhookDraft(data.webhookUrl || '');
      setFormData({
        phone: data.phone || '',
        website: data.website || '',
        industry: data.industry || '',
        description: data.description || '',
        webhookUrl: data.webhookUrl || '',
        contactPersonName: data.contactPersonName || '',
        contactPersonRole: data.contactPersonRole || '',
        plan: data.plan || '',
      });
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await authService.updateProfile(formData);
      useAuthStore.getState().setUser(res);
      setProfile(res);
      addToast('Profile updated', 'success');
      setEditMode(false);
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally { setSaving(false); }
  };

  const handleSaveWebhook = async () => {
    try {
      const res = await authService.updateProfile({ webhookUrl: webhookDraft });
      useAuthStore.getState().setUser(res);
      setProfile(res);
      addToast('Webhook URL updated', 'success');
      setEditingWebhook(false);
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Failed to update webhook', 'error');
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const res = await authService.regenerateApiKey();
      const newKey = res.apiKey || res.key || res.data?.apiKey;
      setApiKey(newKey);
      addToast('API key regenerated. Update your apps now.', 'success');
      setConfirmRegen(false);
    } catch {
      addToast('Failed to regenerate API key', 'error');
    } finally { setRegenerating(false); }
  };

  const handleCopy = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const maskedKey = apiKey
    ? `${apiKey.slice(0, 12)}${'•'.repeat(16)}${apiKey.slice(-4)}`
    : '';

  return (
    <>
      <DashShell items={NAV_ITEMS} activeItem="/settings">
        <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
          <div>
            <h1 className="font-ts-display text-[28px] font-semibold tracking-tight text-ts-text-pri">
              Settings
            </h1>
            <p className="text-[13px] text-ts-text-sec mt-1">
              Manage your organisation profile, API credentials, and webhook integrations.
            </p>
          </div>

          {/* ── Organisation profile ─────────────────────────────────────── */}
          <SectionCard
            icon={Building2}
            title="Organisation profile"
            description="Visible on your trust badge and in webhook payloads."
            action={
              !editMode ? (
                <TsButton variant="ghost" size="sm" onClick={() => setEditMode(true)} leftIcon={<Pencil size={12} />}>
                  Edit
                </TsButton>
              ) : (
                <div className="flex gap-2">
                  <TsButton variant="ghost" size="sm" onClick={() => setEditMode(false)}>Cancel</TsButton>
                  <TsButton size="sm" loading={saving} onClick={handleSaveProfile}>Save</TsButton>
                </div>
              )
            }
          >
            {!editMode ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {[
                  { label: 'Organisation', value: profile?.name },
                  { label: 'Email',        value: profile?.email },
                  { label: 'Contact',      value: profile?.contactPersonName },
                  { label: 'Role',         value: profile?.contactPersonRole },
                  { label: 'Phone',        value: profile?.phone },
                  { label: 'Industry',     value: profile?.industry },
                  { label: 'Website',      value: profile?.website },
                  { label: 'Plan',         value: profile?.plan },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10.5px] uppercase tracking-[0.14em] text-ts-text-mut font-medium mb-1">
                      {label}
                    </p>
                    <p className="text-[13.5px] text-ts-text-pri truncate">{value || '—'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TsInput label="Contact name" value={formData.contactPersonName} onChange={(e) => setFormData((f) => ({ ...f, contactPersonName: e.target.value }))} />
                <TsInput label="Role"         value={formData.contactPersonRole} onChange={(e) => setFormData((f) => ({ ...f, contactPersonRole: e.target.value }))} />
                <TsInput label="Phone"        type="tel" value={formData.phone}    onChange={(e) => setFormData((f) => ({ ...f, phone: e.target.value }))} />
                <TsInput label="Industry"     value={formData.industry}            onChange={(e) => setFormData((f) => ({ ...f, industry: e.target.value }))} />
                <TsInput label="Website"      type="url" value={formData.website}  onChange={(e) => setFormData((f) => ({ ...f, website: e.target.value }))} />
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.08em] font-medium text-ts-text-sec mb-1.5">
                    Plan
                  </label>
                  <select
                    value={formData.plan}
                    onChange={(e) => setFormData((f) => ({ ...f, plan: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-md text-[14px] bg-ts-surface border border-ts-border text-ts-text-pri focus:border-ts-green/70 focus:ring-2 focus:ring-ts-green/15 outline-none transition-all"
                  >
                    <option value="starter">Starter</option>
                    <option value="growth">Growth</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] uppercase tracking-[0.08em] font-medium text-ts-text-sec mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-md text-[14px] bg-ts-surface border border-ts-border text-ts-text-pri focus:border-ts-green/70 focus:ring-2 focus:ring-ts-green/15 outline-none transition-all resize-none"
                  />
                </div>
              </div>
            )}
          </SectionCard>

          {/* ── API credentials ──────────────────────────────────────────── */}
          <SectionCard
            icon={Key}
            title="API credentials"
            description="Use this key to authenticate every request via the x-api-key header."
          >
            <div
              className="flex items-stretch rounded-md overflow-hidden"
              style={{ background: '#080C10', border: '1px solid #21262D' }}
            >
              <div className="flex-1 px-4 py-3 font-ts-mono text-[13px] text-ts-text-pri overflow-x-auto whitespace-nowrap">
                {apiKey ? (showKey ? apiKey : maskedKey) : 'No key generated yet'}
              </div>
              <button
                onClick={() => setShowKey((v) => !v)}
                className="px-3 border-l text-ts-text-sec hover:text-ts-text-pri hover:bg-ts-elevated transition-colors"
                style={{ borderColor: '#21262D' }}
                title={showKey ? 'Hide' : 'Reveal'}
              >
                {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
              <button
                onClick={handleCopy}
                className="px-3 border-l text-ts-text-sec hover:text-ts-text-pri hover:bg-ts-elevated transition-colors relative"
                style={{ borderColor: '#21262D' }}
                title="Copy to clipboard"
              >
                {copied ? <Check size={15} className="text-ts-green" /> : <Copy size={15} />}
                <AnimatePresence>
                  {copied && (
                    <motion.span
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{    opacity: 0, y: -4 }}
                      className="absolute -bottom-7 right-0 px-1.5 py-0.5 rounded text-[10.5px] font-medium whitespace-nowrap"
                      style={{ background: '#00D97E', color: '#080C10' }}
                    >
                      Copied!
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-[11.5px] text-ts-text-mut">
                Last 4 chars are always visible to help you identify the key.
              </p>
              <TsButton
                variant="danger"
                size="sm"
                onClick={() => setConfirmRegen(true)}
                leftIcon={<RefreshCw size={12} />}
              >
                Regenerate
              </TsButton>
            </div>
          </SectionCard>

          {/* ── Webhook ──────────────────────────────────────────────────── */}
          <SectionCard
            icon={Webhook}
            title="Webhook endpoint"
            description="We POST verification events to this URL in real time."
            action={
              !editingWebhook ? (
                <TsButton variant="ghost" size="sm" onClick={() => setEditingWebhook(true)} leftIcon={<Pencil size={12} />}>
                  Edit
                </TsButton>
              ) : (
                <div className="flex gap-2">
                  <TsButton variant="ghost" size="sm" onClick={() => { setEditingWebhook(false); setWebhookDraft(profile?.webhookUrl || ''); }}>
                    Cancel
                  </TsButton>
                  <TsButton size="sm" onClick={handleSaveWebhook}>Save</TsButton>
                </div>
              )
            }
          >
            {!editingWebhook ? (
              <div
                className="px-4 py-3 rounded-md font-ts-mono text-[13px] text-ts-text-pri break-all"
                style={{ background: '#080C10', border: '1px solid #21262D' }}
              >
                {profile?.webhookUrl || <span className="text-ts-text-mut">No webhook configured</span>}
              </div>
            ) : (
              <TsInput
                placeholder="https://yourcompany.com/webhooks/verifyshield"
                value={webhookDraft}
                onChange={(e) => setWebhookDraft(e.target.value)}
              />
            )}

            <div className="mt-5">
              <p className="text-[10.5px] uppercase tracking-[0.14em] font-medium text-ts-text-mut mb-2">
                Example payload
              </p>
              <HighlightedJson json={EXAMPLE_PAYLOAD} />
            </div>
          </SectionCard>
        </div>
      </DashShell>

      {/* Confirm regenerate modal */}
      <AnimatePresence>
        {confirmRegen && (
          <>
            <motion.div
              key="o"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setConfirmRegen(false)}
              className="fixed inset-0 z-[280]"
              style={{ background: 'rgba(8,12,16,0.78)', backdropFilter: 'blur(6px)' }}
            />
            <motion.div
              key="m"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0,  scale: 1 }}
              exit={{    opacity: 0, y: 30, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[290] w-[420px] max-w-[calc(100vw-2rem)]"
            >
              <div
                className="rounded-2xl p-6"
                style={{ background: '#0D1117', border: '1px solid #21262D' }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(248,81,73,0.10)', border: '1px solid rgba(248,81,73,0.4)' }}
                  >
                    <AlertTriangle size={18} className="text-ts-red" />
                  </div>
                  <div>
                    <h2 className="font-ts-display text-[18px] font-semibold text-ts-text-pri mb-1">
                      Regenerate API key?
                    </h2>
                    <p className="text-[13px] text-ts-text-sec leading-relaxed">
                      Your old key is invalidated immediately. Any apps still using it will start getting 401 errors.
                    </p>
                  </div>
                  <button
                    onClick={() => setConfirmRegen(false)}
                    className="p-1.5 -m-1.5 rounded-md text-ts-text-sec hover:text-ts-text-pri hover:bg-ts-elevated transition-colors"
                  >
                    <X size={15} />
                  </button>
                </div>
                <div className="flex gap-2 mt-5">
                  <TsButton variant="ghost" onClick={() => setConfirmRegen(false)} className="flex-1">
                    Cancel
                  </TsButton>
                  <TsButton variant="danger" loading={regenerating} onClick={handleRegenerate} className="flex-1">
                    Regenerate key
                  </TsButton>
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

function SectionCard({
  icon: Icon, title, description, action, children,
}: {
  icon: any; title: string; description?: string; action?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl p-6"
      style={{ background: '#0D1117', border: '1px solid #21262D' }}
    >
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(0,217,126,0.08)',
              border: '1px solid rgba(0,217,126,0.25)',
            }}
          >
            <Icon size={16} className="text-ts-green" strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <h2 className="text-[15px] font-ts-display font-semibold text-ts-text-pri">{title}</h2>
            {description && (
              <p className="text-[12.5px] text-ts-text-sec mt-0.5">{description}</p>
            )}
          </div>
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
      {children}
    </motion.section>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}
