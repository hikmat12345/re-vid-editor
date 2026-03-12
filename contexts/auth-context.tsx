'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { User, AuthResponse } from '@/lib/types';
import { API_AUTH, API_USERS, API_CREDITS } from '@/lib/constants/api';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  creditsRemaining: number;

  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  deductCreditsLocally: (amount: number) => void;
  getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'mf_access_token';
const REFRESH_KEY = 'mf_refresh_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [creditsRemaining, setCreditsRemaining] = useState(0);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ─── Token helpers ───────────────────────────────────────────────────────

  const getAccessToken = useCallback(() => {
    return typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  }, []);

  const saveTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
    // Signal middleware that the user is authenticated
    document.cookie = 'mf_authed=1; path=/; max-age=604800; SameSite=Lax';
  };

  const clearTokens = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    // Clear the middleware cookie
    document.cookie = 'mf_authed=; path=/; max-age=0; SameSite=Lax';
  };

  // ─── Authenticated fetch ─────────────────────────────────────────────────

  const authFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const token = getAccessToken();
      return fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options.headers,
        },
      });
    },
    [getAccessToken],
  );

  // ─── Load user ────────────────────────────────────────────────────────────

  const refreshUser = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const [userRes, creditsRes] = await Promise.all([
        authFetch(API_USERS.ME),
        authFetch(API_CREDITS.BALANCE),
      ]);

      if (!userRes.ok) {
        // Token may be expired — try refresh
        await attemptTokenRefresh();
        return;
      }

      const userData = await userRes.json();
      const creditsData = await creditsRes.json();

      setUser(userData.data ?? userData);
      setCreditsRemaining(creditsData.data?.creditsRemaining ?? creditsData.creditsRemaining ?? 0);
    } catch {
      // Silently fail — user stays unauthenticated
    } finally {
      setIsLoading(false);
    }
  }, [authFetch, getAccessToken]); // eslint-disable-line react-hooks/exhaustive-deps

  const attemptTokenRefresh = async () => {
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    if (!refreshToken) {
      logout();
      return;
    }

    try {
      const res = await fetch(API_AUTH.REFRESH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) {
        logout();
        return;
      }

      const data = await res.json();
      const tokens = data.data ?? data;
      saveTokens(tokens.accessToken, tokens.refreshToken);
      await refreshUser();
    } catch {
      logout();
    }
  };

  // ─── Auth actions ─────────────────────────────────────────────────────────

  const login = async (email: string, password: string) => {
    const res = await fetch(API_AUTH.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message ?? 'Login failed');
    }

    const body = await res.json();
    const responseData: AuthResponse = body.data ?? body;
    saveTokens(responseData.accessToken, responseData.refreshToken);
    setUser(responseData.user);
    setCreditsRemaining(responseData.user.creditsRemaining);
  };

  const register = async (email: string, password: string, name: string) => {
    const res = await fetch(API_AUTH.REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message ?? 'Registration failed');
    }

    const body = await res.json();
    const responseData: AuthResponse = body.data ?? body;
    saveTokens(responseData.accessToken, responseData.refreshToken);
    setUser(responseData.user);
    setCreditsRemaining(responseData.user.creditsRemaining);
  };

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    setCreditsRemaining(0);
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
    }
  }, []);

  const deductCreditsLocally = useCallback((amount: number) => {
    setCreditsRemaining((prev) => Math.max(0, prev - amount));
  }, []);

  // ─── Init ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    refreshUser();

    // Refresh user data every 5 minutes to keep credits in sync
    refreshTimerRef.current = setInterval(refreshUser, 5 * 60 * 1000);

    return () => {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: true,
        creditsRemaining,
        login,
        register,
        logout,
        refreshUser,
        deductCreditsLocally,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
