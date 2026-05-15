'use client';

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

interface TsInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  rightSlot?: React.ReactNode;
}

export const TsInput = forwardRef<HTMLInputElement, TsInputProps>(
  ({ label, error, hint, rightSlot, className = '', id, ...rest }, ref) => {
    const inputId = id || rest.name;
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={`block text-[11px] uppercase tracking-[0.08em] font-medium mb-1.5 transition-colors ${
              error ? 'text-ts-red' : 'text-ts-text-sec'
            }`}
          >
            {label}
          </label>
        )}
        <motion.div
          animate={error ? { x: [0, -4, 4, -3, 3, 0] } : { x: 0 }}
          transition={{ duration: 0.32 }}
          className="relative"
        >
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full px-3.5 py-2.5 rounded-md
              text-[14px] font-ts text-ts-text-pri placeholder:text-ts-text-mut
              transition-all duration-150 outline-none
              ${error ? 'border-ts-red/70 bg-ts-red/[0.04]' : 'border-ts-border bg-ts-surface focus:border-ts-green/70'}
              border focus:ring-2 focus:ring-ts-green/15
              ${rightSlot ? 'pr-11' : ''}
              ${className}
            `}
            {...rest}
          />
          {rightSlot && (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center text-ts-text-sec">
              {rightSlot}
            </div>
          )}
        </motion.div>
        {(error || hint) && (
          <p className={`text-[11px] mt-1.5 ${error ? 'text-ts-red' : 'text-ts-text-mut'}`}>
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);
TsInput.displayName = 'TsInput';

export default TsInput;
