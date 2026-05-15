'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/services/api';

export function HydrationProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const store = useAuthStore.getState();
    store.hydrate();

    // After hydrating, validate the stored token against the server.
    // This is the only place we should force-logout — when the token is
    // genuinely invalid/expired, not when a data endpoint happens to 401.
    const { token } = useAuthStore.getState();
    if (token) {
      api.get('/organisations/profile').catch((err) => {
        if (err.response?.status === 401) {
          useAuthStore.getState().logout();
        }
      });
    }
  }, []);

  return <>{children}</>;
}
