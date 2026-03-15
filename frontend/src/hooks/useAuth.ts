import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { createUser, getCurrentUser, login, logout } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  return {
    token: auth.token,
    user: auth.user,
    loading: auth.loading,
    error: auth.error,
    isAuthenticated: auth.isAuthenticated,
    login: (email: string, password: string) => dispatch(login({ email, password })),
    register: (userData: {
      email: string;
      password: string;
      full_name: string;
      organization_id: string;
    }) => dispatch(createUser(userData)),
    createUser: (userData: {
      email: string;
      password: string;
      full_name: string;
      organization_id: string;
    }) => dispatch(createUser(userData)),
    getCurrentUser: () => dispatch(getCurrentUser()),
    logout: () => dispatch(logout()),
  };
};

export default useAuth;