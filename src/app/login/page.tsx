'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Eye, EyeOff, ArrowRight, Lock } from 'lucide-react';
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

const loginSchema = z.object({
  email:    z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password is required'),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  useTsScope();
  const router = useRouter();
  const { toasts, addToast, removeToast } = useToast();
  const [loading, setLoading]         = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess]         = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (formData: LoginForm) => {
    setLoading(true);
    try {
      const res = await authService.login({
        email: formData.email,
        password: formData.password,
      });
      const token = res.token || res.data?.token;
      const org   = res.organisation || res.user || res.data;
      useAuthStore.getState().login(token, org);
      addToast('Welcome back!', 'success');
      setSuccess(true);
      const destination = org?.role === 'vendor' ? '/dashboard/vendor' : '/dashboard';
      // Card fades + scales out, then we navigate
      setTimeout(() => router.push(destination), 700);
    } catch (err: any) {
      if (err.response?.status === 401) {
        addToast('Incorrect email or password', 'error');
      } else {
        addToast(
          err.response?.data?.message || 'Login failed. Please try again.',
          'error',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ts-landing min-h-screen flex items-center justify-center px-6 py-16 relative overflow-hidden">
      {/* Ambient backdrop */}
      <div aria-hidden className="absolute inset-0 ts-grid-bg pointer-events-none opacity-40" />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 60% at 50% 30%, rgba(0,217,126,0.08), transparent 60%)',
        }}
      />

      {/* Logo top-left */}
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2.5 group z-10">
        <div
          className="relative w-7 h-7 flex items-center justify-center rounded-md"
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

      <AnimatePresence mode="wait">
        {!success && (
          <motion.div
            key="login-card"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{    opacity: 0, scale: 0.92, transition: { duration: 0.35 } }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[400px] z-10"
          >
            <div
              className="rounded-2xl p-8"
              style={{
                background: '#0D1117',
                border: '1px solid #21262D',
                boxShadow:
                  '0 0 60px -10px rgba(0,217,126,0.18), 0 30px 80px -30px rgba(0,0,0,0.7)',
              }}
            >
              <div className="mb-7">
                <h1 className="font-ts-display text-[26px] font-semibold tracking-tight text-ts-text-pri mb-1.5">
                  Welcome back
                </h1>
                <p className="text-[13.5px] text-ts-text-sec">
                  Sign in to continue verifying vendors
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <TsInput
                  label="Email"
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  error={errors.email?.message}
                  {...register('email')}
                />

                <TsInput
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  error={errors.password?.message}
                  rightSlot={
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="p-1 hover:text-ts-text-pri transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  }
                  {...register('password')}
                />

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-[12.5px] text-ts-text-sec cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-3.5 h-3.5 rounded border-ts-border bg-ts-base accent-ts-green"
                    />
                    Remember me
                  </label>
                  <a href="#" className="text-[12.5px] text-ts-green hover:underline">
                    Forgot password?
                  </a>
                </div>

                <TsButton
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={loading}
                  fullWidth
                  rightIcon={<ArrowRight size={16} strokeWidth={2.4} />}
                  className="mt-2"
                >
                  Sign in
                </TsButton>
              </form>

              <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-wider text-ts-text-mut">
                <span className="flex-1 h-px bg-ts-border" />
                <span>or</span>
                <span className="flex-1 h-px bg-ts-border" />
              </div>

              <p className="text-center text-[13px] text-ts-text-sec">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-ts-green hover:underline font-medium">
                  Create one
                </Link>
              </p>
            </div>

            <p className="mt-5 text-center text-[11px] text-ts-text-mut flex items-center justify-center gap-1.5">
              <Lock size={11} />
              Secured with end-to-end encryption
            </p>
          </motion.div>
        )}

        {success && (
          <motion.div
            key="login-success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col items-center gap-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.15, 1] }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(0,217,126,0.15)',
                boxShadow: '0 0 50px rgba(0,217,126,0.5)',
                border: '1px solid rgba(0,217,126,0.5)',
              }}
            >
              <ShieldCheck size={28} className="text-ts-green" strokeWidth={2.4} />
            </motion.div>
            <p className="text-ts-text-pri text-[15px] font-medium">Signed in</p>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
