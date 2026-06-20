import { create } from 'zustand';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role?: 'buyer' | 'maker' | 'customer' | 'seller' | 'vendor';
}

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  firstTime : boolean;
  setFirstTime : (firstTime : boolean) => void;
  setAuth: (user: UserProfile, accessToken: string, refreshToken: string) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  firstTime : true,

  setFirstTime : (firstTime : boolean) => set({ firstTime }),

  setAuth: (user, accessToken, refreshToken) =>
    set({ user, accessToken, refreshToken, isAuthenticated: true }),

  setTokens: (accessToken, refreshToken) => 
    set({ accessToken, refreshToken }),

  logout: () =>
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
}));