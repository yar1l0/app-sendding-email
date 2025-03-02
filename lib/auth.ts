import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useAuth = () => {
  const router = useRouter();

  const isAuthenticated = (): boolean => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('username') && !!localStorage.getItem('password');
    }
    return false;
  };

  const logout = (): void => {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    router.push('/');
  };

  return { isAuthenticated, logout };
};

export const useRequireAuth = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  return { isAuthenticated };
};