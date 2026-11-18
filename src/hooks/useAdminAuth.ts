import { useCallback, useEffect, useState } from 'react';

const SESSION_STORAGE_KEY = 'gis_admin_session';

export interface AdminSession {
  username: string;
  token: string;
}

function readStoredSession(): AdminSession | null {
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AdminSession>;
    if (
      typeof parsed.username === 'string' &&
      typeof parsed.token === 'string' &&
      parsed.token.length > 0
    ) {
      return { username: parsed.username, token: parsed.token };
    }
    return null;
  } catch {
    return null;
  }
}

export function useAdminAuth() {
  const [session, setSession] = useState<AdminSession | null>(() => readStoredSession());
  const [isCheckingSession, setIsCheckingSession] = useState<boolean>(() =>
    Boolean(readStoredSession()),
  );

  useEffect(() => {
    const stored = readStoredSession();
    if (!stored) {
      setIsCheckingSession(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/admin/session', {
          headers: { Authorization: `Bearer ${stored.token}` },
        });
        if (!res.ok) {
          throw new Error('Sesi tamat');
        }
        const data = (await res.json()) as { authenticated?: boolean; username?: string };
        if (!cancelled && data.authenticated && data.username) {
          setSession({ username: data.username, token: stored.token });
        } else if (!cancelled) {
          window.localStorage.removeItem(SESSION_STORAGE_KEY);
          setSession(null);
        }
      } catch {
        if (!cancelled) {
          window.localStorage.removeItem(SESSION_STORAGE_KEY);
          setSession(null);
        }
      } finally {
        if (!cancelled) {
          setIsCheckingSession(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(
    async (
      username: string,
      password: string,
    ): Promise<{ ok: boolean; error?: string }> => {
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: username.trim(), password }),
        });

        const data = (await res.json()) as {
          authenticated?: boolean;
          username?: string;
          token?: string;
          error?: string;
        };

        if (!res.ok || !data.authenticated || !data.token || !data.username) {
          return {
            ok: false,
            error: data.error || 'Nama pengguna atau kata laluan tidak tepat.',
          };
        }

        const nextSession: AdminSession = {
          username: data.username,
          token: data.token,
        };
        window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
        setSession(nextSession);
        return { ok: true };
      } catch {
        return {
          ok: false,
          error: 'Tidak dapat menyambung ke pelayan pengesahan. Sila cuba sebentar lagi.',
        };
      }
    },
    [],
  );

  const logout = useCallback(() => {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    setSession(null);
  }, []);

  return {
    isAuthenticated: Boolean(session),
    username: session?.username ?? null,
    token: session?.token ?? null,
    isCheckingSession,
    login,
    logout,
  };
}
