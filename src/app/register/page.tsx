'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Eye, EyeOff, ArrowRight, ArrowLeft, Check,
  User, Building2, CreditCard, Wallet, Activity,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';
import { useTsScope } from '@/components/ts/useTsScope';
import TsInput  from '@/components/ts/TsInput';
import TsButton from '@/components/ts/TsButton';
import { PLAN_OPTIONS } from '@/constants/verifyTypes';

const registerSchema = z.object({
  contactPersonName: z.string().min(2, 'Contact name is required'),
  contactPersonRole: z.string().min(1, 'Role is required'),
  email:             z.string().email('Valid email is required'),
  password:          z.string().min(8, 'At least 8 characters'),
  organisationName:  z.string().min(2, 'Organisation name is required'),
  phone:             z.string().min(10, 'Phone number is required'),
  website:           z.string().optional(),
  industry:          z.string().min(1, 'Select an industry'),
  description:       z.string().optional(),
  webhookUrl:        z.string().optional(),
  plan:              z.string().min(1, 'Select a plan'),
});
type RegisterForm = z.infer<typeof registerSchema>;

const STEPS = [
  { id: 1, title: 'Your details',       Icon: User },
  { id: 2, title: 'Organisation info',  Icon: Building2 },
  { id: 3, title: 'Choose plan',        Icon: CreditCard },
];
const STEP_FIELDS: Record<number, (keyof RegisterForm)[]> = {
  1: ['contactPersonName', 'contactPersonRole', 'email', 'password'],
  2: ['organisationName', 'phone', 'industry'],
  3: ['plan'],
};

export default function RegisterPage() {
  useTsScope();
  const router = useRouter();
  const { toasts, addToast, removeToast } = useToast();
  const [loading, setLoading]               = useState(false);
  const [currentStep, setCurrentStep]       = useState(1);
  const [selectedPlan, setSelectedPlan]     = useState<string | null>(null);
  const [showPassword, setShowPassword]     = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    trigger,
    watch,
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema), mode: 'onTouched' });

  // Live preview values
  const w = watch();
  const previewName = w.organisationName?.trim() || 'Your organisation';
  const previewIndustry = w.industry || 'industry';
  const previewContact  = w.contactPersonName?.trim() || w.email || '';

  const handleNext = async () => {
    const ok = await trigger(STEP_FIELDS[currentStep]);
    if (ok) setCurrentStep((s) => s + 1);
  };

  const onSubmit = async (formData: RegisterForm) => {
    setLoading(true);
    try {
      const res = await authService.register({
        name: formData.organisationName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        website: formData.website || '',
        industry: formData.industry,
        description: formData.description || '',
        webhookUrl: formData.webhookUrl || '',
        contactPersonName: formData.contactPersonName,
        contactPersonRole: formData.contactPersonRole,
        plan: (selectedPlan || formData.plan).toLowerCase(),
      });
      const token = res.token || res.data?.token;
      const org   = res.organisation || res.user || res.data;
      useAuthStore.getState().login(token, org);
      addToast('Account created — welcome aboard.', 'success');
      const destination = org?.role === 'vendor' ? '/dashboard/vendor' : '/dashboard';
      setTimeout(() => router.push(destination), 700);
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('email', { message: 'This email is already registered' });
        setCurrentStep(1);
      } else {
        addToast(
          err.response?.data?.message || 'Registration failed. Please try again.',
          'error',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const progress = useMemo(() => ((currentStep - 1) / (STEPS.length - 1)) * 100, [currentStep]);

  return (
    <div className="ts-landing min-h-screen relative overflow-x-hidden">
      <div aria-hidden className="absolute inset-0 ts-grid-bg pointer-events-none opacity-30" />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 30% 20%, rgba(0,217,126,0.08), transparent 60%)',
        }}
      />

      {/* Logo */}
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2.5 z-20">
        <div
          className="w-7 h-7 flex items-center justify-center rounded-md"
          style={{
            background: 'linear-gradient(135deg, rgba(0,217,126,0.25), rgba(0,217,126,0.05))',
            boxShadow: 'inset 0 0 0 1px rgba(0,217,126,0.35)',
          }}
        >
          <ShieldCheck size={15} className="text-ts-green" strokeWidth={2.4} />
        </div>
        <span className="font-ts-display text-[15px] font-semibold text-ts-text-pri">
          VendorShield
        </span>
      </Link>

      <div className="relative grid grid-cols-1 lg:grid-cols-[60fr_40fr] min-h-screen z-10">
        {/* ── LEFT — form ─────────────────────────────────────────────── */}
        <div className="px-6 lg:px-16 pt-24 lg:pt-28 pb-16 flex flex-col">
          <div className="max-w-[520px] w-full">
            <h1 className="font-ts-display text-[30px] md:text-[34px] font-semibold tracking-tight text-ts-text-pri mb-2">
              Create your account
            </h1>
            <p className="text-[14px] text-ts-text-sec mb-8">
              Join 12 platforms already verifying with VendorShield.
            </p>

            {/* Stepper */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                {STEPS.map((s) => {
                  const done = currentStep > s.id;
                  const active = currentStep === s.id;
                  return (
                    <div key={s.id} className="flex flex-col items-center gap-2 flex-1">
                      <motion.div
                        animate={{
                          scale: active ? 1.05 : 1,
                          boxShadow: active
                            ? '0 0 0 4px rgba(0,217,126,0.15)'
                            : '0 0 0 0 transparent',
                        }}
                        transition={{ duration: 0.25 }}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-medium"
                        style={{
                          background: done ? '#00D97E' : '#0D1117',
                          color:      done ? '#080C10' : active ? '#00D97E' : '#484F58',
                          border: done
                            ? '1.5px solid #00D97E'
                            : active
                            ? '1.5px solid #00D97E'
                            : '1.5px solid #21262D',
                        }}
                      >
                        {done ? <Check size={14} strokeWidth={3} /> : s.id}
                      </motion.div>
                      <span
                        className={`text-[11px] font-medium tracking-wide ${
                          active ? 'text-ts-text-pri' : 'text-ts-text-mut'
                        }`}
                      >
                        {s.title}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="relative h-[2px] bg-ts-border rounded-full overflow-hidden mt-1">
                <motion.div
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-y-0 left-0 bg-ts-green"
                  style={{ boxShadow: '0 0 12px rgba(0,217,126,0.4)' }}
                />
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{    opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <TsInput
                        label="Full name"
                        placeholder="Taiwo Adeyemi"
                        error={errors.contactPersonName?.message}
                        {...register('contactPersonName')}
                      />
                      <TsInput
                        label="Your role"
                        placeholder="CEO"
                        error={errors.contactPersonRole?.message}
                        {...register('contactPersonRole')}
                      />
                    </div>
                    <TsInput
                      label="Business email"
                      type="email"
                      placeholder="taiwo@company.com"
                      error={errors.email?.message}
                      {...register('email')}
                    />
                    <TsInput
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="At least 8 characters"
                      error={errors.password?.message}
                      rightSlot={
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="p-1 hover:text-ts-text-pri transition-colors"
                        >
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      }
                      {...register('password')}
                    />
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{    opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-5"
                  >
                    <TsInput
                      label="Organisation name"
                      placeholder="Global Dynamics Ltd"
                      error={errors.organisationName?.message}
                      {...register('organisationName')}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <TsInput
                        label="Phone"
                        type="tel"
                        placeholder="08012345678"
                        error={errors.phone?.message}
                        {...register('phone')}
                      />
                      <div>
                        <label className="block text-[11px] uppercase tracking-[0.08em] font-medium mb-1.5 text-ts-text-sec">
                          Industry
                        </label>
                        <select
                          {...register('industry')}
                          className="w-full px-3.5 py-2.5 rounded-md text-[14px] bg-ts-surface border border-ts-border text-ts-text-pri focus:border-ts-green/70 focus:ring-2 focus:ring-ts-green/15 outline-none transition-all"
                        >
                          <option value="">Select industry</option>
                          <option value="logistics">Logistics</option>
                          <option value="technology">Technology</option>
                          <option value="retail">Retail</option>
                          <option value="services">Services</option>
                          <option value="manufacturing">Manufacturing</option>
                          <option value="finance">Finance</option>
                          <option value="healthcare">Healthcare</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.industry && (
                          <p className="text-[11px] mt-1.5 text-ts-red">{errors.industry.message}</p>
                        )}
                      </div>
                    </div>
                    <TsInput
                      label="Website (optional)"
                      type="url"
                      placeholder="https://yourcompany.com"
                      {...register('website')}
                    />
                    <TsInput
                      label="Webhook URL (optional)"
                      type="url"
                      placeholder="https://yourcompany.com/webhook"
                      {...register('webhookUrl')}
                    />
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{    opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-3"
                  >
                    {PLAN_OPTIONS.map((plan) => {
                      const active = selectedPlan === plan.id;
                      return (
                        <button
                          key={plan.id}
                          type="button"
                          onClick={() => {
                            setSelectedPlan(plan.id);
                            setValue('plan', plan.id, { shouldValidate: true });
                          }}
                          className="w-full text-left p-5 rounded-xl transition-all duration-150"
                          style={{
                            background: active ? 'rgba(0,217,126,0.06)' : '#0D1117',
                            border: active
                              ? '1.5px solid rgba(0,217,126,0.5)'
                              : '1.5px solid #21262D',
                            boxShadow: active
                              ? '0 0 30px -10px rgba(0,217,126,0.3)'
                              : 'none',
                          }}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                                style={{
                                  background: active ? '#00D97E' : 'transparent',
                                  border: active ? '1.5px solid #00D97E' : '1.5px solid #30363D',
                                }}
                              >
                                {active && <Check size={11} strokeWidth={3} className="text-[#080C10]" />}
                              </div>
                              <div>
                                <p className="text-[15px] font-medium text-ts-text-pri">{plan.name}</p>
                                <p className="text-[12.5px] text-ts-text-sec mt-0.5">{plan.desc}</p>
                              </div>
                            </div>
                            <p className="text-[15px] font-semibold text-ts-green flex-shrink-0">
                              {plan.price ? `₦${plan.price.toLocaleString()}/mo` : 'Custom'}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                    {errors.plan && (
                      <p className="text-[11px] text-ts-red mt-2">{errors.plan.message}</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Nav buttons */}
              <div className="flex items-center gap-3 pt-2">
                {currentStep > 1 && (
                  <TsButton
                    type="button"
                    variant="ghost"
                    onClick={() => setCurrentStep((s) => s - 1)}
                    leftIcon={<ArrowLeft size={15} />}
                  >
                    Back
                  </TsButton>
                )}
                {currentStep < STEPS.length ? (
                  <TsButton
                    type="button"
                    onClick={handleNext}
                    rightIcon={<ArrowRight size={15} strokeWidth={2.4} />}
                    fullWidth={currentStep === 1}
                    className={currentStep === 1 ? '' : 'flex-1'}
                  >
                    Continue
                  </TsButton>
                ) : (
                  <TsButton
                    type="submit"
                    loading={loading}
                    rightIcon={<ArrowRight size={15} strokeWidth={2.4} />}
                    className="flex-1"
                  >
                    Create account
                  </TsButton>
                )}
              </div>
            </form>

            <p className="mt-6 text-[13px] text-ts-text-sec">
              Already have an account?{' '}
              <Link href="/login" className="text-ts-green hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* ── RIGHT — live preview ────────────────────────────────────── */}
        <aside
          className="hidden lg:flex flex-col px-12 pt-28 pb-16 border-l"
          style={{ background: '#0B0F14', borderColor: '#21262D' }}
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-ts-green font-medium mb-3">
            Live preview
          </p>
          <h2 className="font-ts-display text-[22px] font-semibold tracking-tight text-ts-text-pri mb-8">
            Your VendorShield dashboard
          </h2>

          {/* Mock dashboard card */}
          <div
            className="rounded-2xl p-6 mb-6"
            style={{
              background: '#0D1117',
              border: '1px solid #21262D',
              boxShadow: '0 30px 80px -30px rgba(0,0,0,0.6)',
            }}
          >
            {/* Org header */}
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                key={previewName}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="w-10 h-10 rounded-lg flex items-center justify-center font-ts-display font-semibold text-[14px]"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,217,126,0.2), rgba(0,217,126,0.05))',
                  color: '#00D97E',
                  border: '1px solid rgba(0,217,126,0.3)',
                }}
              >
                {previewName.split(' ').map((s) => s[0]).join('').slice(0, 2).toUpperCase()}
              </motion.div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-medium text-ts-text-pri truncate">
                  {previewName}
                </p>
                <p className="text-[11.5px] text-ts-text-mut capitalize truncate">
                  {previewIndustry === 'industry' ? 'Industry' : previewIndustry} · Starter plan
                </p>
              </div>
            </div>

            {/* Wallet */}
            <div
              className="rounded-xl p-4 mb-4"
              style={{
                background: 'linear-gradient(135deg, rgba(0,217,126,0.08), rgba(0,0,0,0))',
                border: '1px solid rgba(0,217,126,0.20)',
              }}
            >
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-ts-text-mut mb-1.5">
                <Wallet size={11} />
                Wallet balance
              </div>
              <p className="font-ts-display text-[24px] font-semibold text-ts-text-pri">
                ₦0.00
              </p>
              <p className="text-[11.5px] text-ts-text-sec mt-0.5">Top up to start verifying</p>
            </div>

            {/* Metric */}
            <div className="grid grid-cols-3 gap-2.5 mb-4">
              {[
                { label: 'Verified', value: '0', color: '#00D97E' },
                { label: 'Pending',  value: '0', color: '#F0A500' },
                { label: 'Failed',   value: '0', color: '#F85149' },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-lg p-2.5"
                  style={{ background: '#080C10', border: '1px solid #21262D' }}
                >
                  <p className="text-[9.5px] uppercase tracking-wider text-ts-text-mut mb-1">{m.label}</p>
                  <p className="font-ts-display text-[18px] font-semibold" style={{ color: m.color }}>
                    {m.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Empty state */}
            <div className="flex items-center gap-2 text-[12px] text-ts-text-sec px-1">
              <Activity size={12} className="text-ts-green animate-ts-pulse-dot" />
              <span>Waiting for first verification</span>
              <span className="flex gap-1 ml-auto">
                <span className="w-1 h-1 rounded-full bg-ts-text-mut animate-ts-pulse-dot" style={{ animationDelay: '0s' }} />
                <span className="w-1 h-1 rounded-full bg-ts-text-mut animate-ts-pulse-dot" style={{ animationDelay: '0.2s' }} />
                <span className="w-1 h-1 rounded-full bg-ts-text-mut animate-ts-pulse-dot" style={{ animationDelay: '0.4s' }} />
              </span>
            </div>

            {previewContact && (
              <div
                className="mt-5 pt-4 border-t flex items-center gap-2 text-[11.5px] text-ts-text-sec"
                style={{ borderColor: '#21262D' }}
              >
                <User size={12} className="text-ts-text-mut" />
                Logged in as {previewContact}
              </div>
            )}
          </div>

          {/* Trust badges */}
          <div className="space-y-2 mt-auto">
            {[
              'Backed by Squad Financial Infrastructure',
              'CAC Registry Integrated',
              'AI-Powered Document Analysis',
            ].map((t) => (
              <div
                key={t}
                className="flex items-center gap-2 text-[12px] text-ts-text-sec px-3 py-2 rounded-md"
                style={{ background: 'rgba(13,17,23,0.6)', border: '1px solid #21262D' }}
              >
                <Check size={12} className="text-ts-green flex-shrink-0" strokeWidth={2.5} />
                {t}
              </div>
            ))}
          </div>
        </aside>
      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
