import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();
  const checked = useRef(false);

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      setAdmin(data.data);
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Public visitors never trigger an auth check; the session is only
  // verified the first time someone lands on an /admin route.
  useEffect(() => {
    if (checked.current) return;
    if (pathname.startsWith('/admin')) {
      checked.current = true;
      fetchMe();
    } else {
      setLoading(false);
    }
  }, [pathname, fetchMe]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    checked.current = true;
    setAdmin(data.data);
    return data.data;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, refresh: fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
