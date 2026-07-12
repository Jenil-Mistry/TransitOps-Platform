import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const getInitialAuth = () => {
  const token = localStorage.getItem('transitops_token') || localStorage.getItem('token');
  const storedUser = localStorage.getItem('transitops_user');
  if (token) {
    try {
      if (storedUser) return JSON.parse(storedUser);
    } catch (e) {
      // ignore
    }
    return {
      id: '1',
      name: 'Admin Fleet',
      email: 'manager@transitops.com',
      role: 'Fleet Manager' as const,
    };
  }
  return null;
};

const initialUser = getInitialAuth();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  isAuthenticated: Boolean(initialUser),
  login: (user) => {
    localStorage.setItem('transitops_user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('transitops_token');
    localStorage.removeItem('token');
    localStorage.removeItem('transitops_user');
    set({ user: null, isAuthenticated: false });
  },
}));
