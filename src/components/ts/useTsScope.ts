'use client';

import { useEffect } from 'react';

/**
 * Apply the Trust OS dark scope at the document root for the lifetime of
 * the calling component. Mirrors what the landing page does so login /
 * register / dashboard pages share the same dark backdrop without bleeding
 * into legacy light-themed pages still in transition.
 */
export function useTsScope() {
  useEffect(() => {
    document.documentElement.classList.add('ts-landing-html');
    document.body.classList.add('ts-landing');
    return () => {
      document.documentElement.classList.remove('ts-landing-html');
      document.body.classList.remove('ts-landing');
    };
  }, []);
}
