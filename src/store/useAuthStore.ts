import { create } from 'zustand';

const STORAGE_KEY = 'vendorshield_auth';

export interface User {
  id: string;
  name: string;
  email: string;
  contactPersonName?: string;
  contactPersonRole?: string;
  phone?: string;
  website?: string;
  industry?: string;
  description?: string;
  webhookUrl?: string;
  plan?: string;
  apiKey?: string;
  role?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  hydrated: false,

  login: (token, user) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
    set({ token, user, isAuthenticated: true, hydrated: true });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ token: null, user: null, isAuthenticated: false });
  },

  hydrate: () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const { token, user } = JSON.parse(stored);
        set({ token, user, isAuthenticated: true, hydrated: true });
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        set({ hydrated: true });
      }
    } else {
      set({ hydrated: true });
    }
  },

  setUser: (user) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...parsed, user }));
    }
    set({ user });
  },
}));
