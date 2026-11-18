import { useCallback, useEffect, useState } from 'react';

const SESSION_STORAGE_KEY = 'gis_admin_session';
const USERS_STORAGE_KEY = 'gis_crm_users';

export interface AdminSession {
  username: string;
  fullName?: string;
  token: string;
}

export interface RegisteredUserProfile {
  id: string;
  fullName: string;
  email: string;
  username: string;
  createdAt: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
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
      return {
        username: parsed.username,
        fullName: typeof parsed.fullName === 'string' ? parsed.fullName : undefined,
        token: parsed.token,
      };
    }
    return null;
  } catch {
    return null;
  }
}

function readStoredUsers(): RegisteredUserProfile[] {
  try {
    const raw = window.localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as RegisteredUserProfile[]) : [];
  } catch {
    return [];
  }
}

function saveUserProfileToLocalStorage(user: RegisteredUserProfile): void {
  try {
    const existing = readStoredUsers();
    const deduped = [
      user,
      ...existing.filter(
        (u) =>
          u.username.toLowerCase() !== user.username.toLowerCase() &&
          u.email.toLowerCase() !== user.email.toLowerCase(),
      ),
    ];
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(deduped));
  } catch {
    // Ignore storage quota errors
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
        const data = (await res.json()) as {
          authenticated?: boolean;
          username?: string;
          fullName?: string;
        };
        if (!cancelled && data.authenticated && data.username) {
          setSession({
            username: data.username,
            fullName: data.fullName ?? stored.fullName,
            token: stored.token,
          });
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
          fullName?: string;
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
          fullName: data.fullName,
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

  const register = useCallback(
    async (
      payload: RegisterPayload,
    ): Promise<{ ok: boolean; user?: RegisteredUserProfile; error?: string }> => {
      const cleanName = payload.fullName.trim();
      const cleanEmail = payload.email.trim().toLowerCase();
      const cleanUsername = payload.username.trim().toLowerCase();

      // Pre-check localStorage cache as immediate client guard
      const localUsers = readStoredUsers();
      if (localUsers.some((u) => u.username.toLowerCase() === cleanUsername)) {
        return {
          ok: false,
          error: 'Username ini sudah didaftarkan. Sila pilih username lain atau log masuk.',
        };
      }
      if (localUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
        return {
          ok: false,
          error: 'Alamat emel ini sudah didaftarkan. Sila gunakan emel lain atau log masuk.',
        };
      }

      try {
        const res = await fetch('/api/admin/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: cleanName,
            email: cleanEmail,
            username: cleanUsername,
            password: payload.password,
            confirmPassword: payload.confirmPassword,
          }),
        });

        const data = (await res.json()) as {
          registered?: boolean;
          user?: RegisteredUserProfile;
          error?: string;
        };

        if (!res.ok || !data.registered || !data.user) {
          return {
            ok: false,
            error: data.error || 'Pendaftaran gagal. Sila semak maklumat anda.',
          };
        }

        saveUserProfileToLocalStorage(data.user);
        return { ok: true, user: data.user };
      } catch {
        return {
          ok: false,
          error: 'Tidak dapat menyambung ke pelayan pendaftaran. Sila cuba sebentar lagi.',
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
    fullName: session?.fullName ?? null,
    token: session?.token ?? null,
    isCheckingSession,
    login,
    register,
    logout,
  };
}
