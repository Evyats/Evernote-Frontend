import type { User } from 'src/utils/api';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { getMe } from 'src/utils/api';

type AuthContextValue = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isChecking: boolean;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_TOKEN_KEY = 'evernote_auth_token';

function getStoredToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<User | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(Boolean(token));

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (token) {
      window.localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    let isMounted = true;
    if (!token) {
      setUser(null);
      setIsChecking(false);
    } else {
      setIsChecking(true);

      getMe(token)
        .then((result) => {
          if (!isMounted) {
            return;
          }
          setUser(result.user);
        })
        .catch(() => {
          if (!isMounted) {
            return;
          }
          setTokenState(null);
          setUser(null);
        })
        .finally(() => {
          if (isMounted) {
            setIsChecking(false);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isChecking,
      setToken: setTokenState,
      setUser,
      clearAuth: () => {
        setTokenState(null);
        setUser(null);
      },
    }),
    [token, user, isChecking]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
