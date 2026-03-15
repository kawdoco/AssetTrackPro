import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { loginUser, registerUser, logout, clearError, getCurrentUser } from '../store/slices/authSlice';

/**
 * Custom hook for authentication
 * Provides auth state and actions
 */
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  return {
    // State
    token: auth.token,
    user: auth.user,
    loading: auth.loading,
    error: auth.error,
    isAuthenticated: auth.isAuthenticated,

    // Actions
    login: (email: string, password: string) => {
      return dispatch(loginUser({ email, password }));
    },
    register: (userData: {
      email: string;
      password: string;
      full_name: string;
      organization_id: string;
    }) => {
      return dispatch(registerUser(userData));
    },
    logout: () => {
      dispatch(logout());
    },
    clearError: () => {
      dispatch(clearError());
    },
    getCurrentUser: () => {
      return dispatch(getCurrentUser());
    },
  };
};
