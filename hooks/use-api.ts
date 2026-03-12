'use client';

import { useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';

/**
 * Hook that returns an authenticated fetch function.
 * Automatically attaches the Bearer token from auth context.
 */
export function useApi() {
  const { getAccessToken, logout } = useAuth();

  const apiFetch = useCallback(
    async <T = unknown>(
      url: string,
      options: RequestInit = {},
    ): Promise<T> => {
      const token = getAccessToken();

      const res = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(options.headers ?? {}),
        },
      });

      if (res.status === 401) {
        logout();
        throw new Error('Session expired. Please log in again.');
      }

      if (res.status === 402) {
        throw new Error('Insufficient credits. Please top up your account.');
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? body.error ?? `Request failed: ${res.status}`);
      }

      const body = await res.json();
      // Unwrap the standard ApiResponse envelope if present
      return (body.data !== undefined ? body.data : body) as T;
    },
    [getAccessToken, logout],
  );

  return { apiFetch };
}

/**
 * Poll a status endpoint until it resolves or fails.
 */
export async function pollStatus<T extends { status: string }>(
  fetchFn: () => Promise<T>,
  {
    interval = 3000,
    maxAttempts = 120,
    isDone = (r: T) => r.status === 'completed' || r.status === 'failed',
  } = {},
): Promise<T> {
  for (let i = 0; i < maxAttempts; i++) {
    const result = await fetchFn();
    if (isDone(result)) return result;
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
  throw new Error('Generation timed out');
}
