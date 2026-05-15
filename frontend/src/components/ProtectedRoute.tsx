import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'vendor' | 'admin';
}

export const ProtectedRoute = async ({
  children,
  requiredRole,
}: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuthStore.getState();

  if (!isAuthenticated) {
    redirect('/login');
  }

  if (requiredRole && user?.role !== requiredRole) {
    redirect(user?.role === 'vendor' ? '/dashboard/vendor' : '/dashboard/admin');
  }

  return children;
};
