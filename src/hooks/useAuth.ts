import { useContext } from 'react';
import { AuthContext } from '@/features/auth/AuthContext';

/**
 * Convenience hook that exposes the current authentication context.
 * Must be used within an `<AuthProvider>`.
 *
 * @returns The auth context value (user, session, loading, sign-in/out helpers).
 * @throws  If used outside of an AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
