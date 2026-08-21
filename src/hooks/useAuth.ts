import { useStore } from '../lib/store';
import { api } from '../lib/api';

/**
 * Authentication hook for HighLyAgent Manager
 * Provides login, logout, and session management functionality
 */
export function useAuth() {
  const { state, actions } = useStore();
  
  /**
   * Login with username/email and password
   * @param identifier - Username or email
   * @param password - User password
   * @returns true if login successful, false otherwise
   */
  const login = async (identifier: string, password: string): Promise<boolean> => {
    try {
      // Try real backend first
      const res = await api.login(identifier.trim(), password);
      
      // Backend returns JWT tokens
      // Store is updated automatically via API interceptor
      return true;
    } catch (e) {
      // Fall back to simulated auth if backend unavailable
      const success = actions.login(identifier.trim(), password);
      return success;
    }
  };
  
  /**
   * Logout and revoke tokens
   */
  const logout = () => {
    actions.logout();
  };
  
  /**
   * Refresh session using refresh token
   * @returns true if refresh successful, false otherwise
   */
  const refreshSession = async (): Promise<boolean> => {
    if (!state.session?.refreshToken) {
      return false;
    }
    
    try {
      const res = await api.refresh(state.session.refreshToken);
      // Session will be updated by the caller (App.tsx effect)
      return true;
    } catch (e) {
      actions.logout();
      return false;
    }
  };
  
  return {
    isAuthenticated: !!state.session,
    isLoading: !state.admin && !state.session,
    user: state.admin ? {
      username: state.admin.username,
      email: state.admin.email,
      role: 'admin' as const,
    } : null,
    login,
    logout,
    refreshSession,
    session: state.session,
  };
}
