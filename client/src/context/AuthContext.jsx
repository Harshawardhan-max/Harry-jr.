import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('ff_token');
    setUser(null);
  };

  const fetchMe = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('ff_token');
    if (token) fetchMe();
    else setLoading(false);
  }, []);

  const authAction = ({ token, user: incomingUser }) => {
    localStorage.setItem('ff_token', token);
    setUser(incomingUser);
  };

  const value = useMemo(() => ({ user, loading, logout, authAction, refresh: fetchMe }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
