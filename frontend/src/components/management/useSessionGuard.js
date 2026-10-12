import { useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * Turns an API error into a readable message. When the login has expired (401)
 * the manager is signed out so they land on the login screen instead of staring
 * at screens that can no longer load.
 */
export const useSessionGuard = () => {
  const { logout } = useAuth();

  return useCallback(
    (error, fallback = 'Something went wrong. Please try again.') => {
      if (error?.response?.status === 401) {
        if (logout) logout();
        return 'Your session has expired. Please sign in again.';
      }
      if (!error?.response) {
        return 'Cannot reach the server. Check your connection and try again.';
      }
      return error.response.data?.message || fallback;
    },
    [logout]
  );
};

export default useSessionGuard;
