'use client';

import React from 'react';

type Variant = 'primary' | 'gold' | 'ghost' | 'danger';
type Size    = 'sm' | 'md' | 'lg';

interface TsButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: Variant;
  size?:    Size;
  loading?: boolean;
  leftIcon?:  React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const SIZE_CLASS: Record<Size, string> = {
  sm: 'h-9  px-3.5 text-[13px]',
  md: 'h-11 px-4   text-[14px]',
  lg: 'h-12 px-5   text-[15px]',
};

const VARIANT_STYLE: Record<Variant, React.CSSProperties> = {
  primary: {
    background: '#00D97E',
    color: '#080C10',
    boxShadow: '0 0 0 1px rgba(0,217,126,0.55), 0 10px 28px -10px rgba(0,217,126,0.55)',
  },
  gold: {
    background: '#D29922',
    color: '#080C10',
    boxShadow: '0 0 0 1px rgba(210,153,34,0.55), 0 12px 32px -12px rgba(210,153,34,0.55)',
  },
  ghost: {
    background: 'rgba(13,17,23,0.65)',
    color: '#E6EDF3',
    border: '1px solid #30363D',
    boxShadow: 'none',
  },
  danger: {
    background: 'rgba(248,81,73,0.10)',
    color: '#F85149',
    border: '1px solid rgba(248,81,73,0.45)',
    boxShadow: 'none',
  },
};

export const TsButton: React.FC<TsButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...rest
}) => {
  const isDisabled = disabled || loading;
  return (
    <button
      {...rest}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2 rounded-md font-medium font-ts
        transition-all duration-150
        hover:-translate-y-px active:translate-y-0
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
        ${SIZE_CLASS[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      style={VARIANT_STYLE[variant]}
    >
      {loading ? (
        <>
          <span
            className="inline-block w-4 h-4 rounded-full border-2 border-current border-r-transparent animate-spin"
            aria-hidden
          />
          <span>Working…</span>
        </>
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
};

export default TsButton;
