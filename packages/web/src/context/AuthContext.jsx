import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('olivas_token');
    const savedUser = localStorage.getItem('olivas_user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch { localStorage.removeItem('olivas_token'); localStorage.removeItem('olivas_user'); }
    }
    setLoading(false);
  }, []);

  async function login(email, password) {
    const data = await api.post('/auth/login', { email, password });
    localStorage.setItem('olivas_token', data.token);
    localStorage.setItem('olivas_user', JSON.stringify(data.usuario));
    setUser(data.usuario);
    return data;
  }

  async function register(email, password, nombre) {
    const data = await api.post('/auth/register', { email, password, nombre });
    localStorage.setItem('olivas_token', data.token);
    localStorage.setItem('olivas_user', JSON.stringify(data.usuario));
    setUser(data.usuario);
    return data;
  }

  function logout() {
    localStorage.removeItem('olivas_token');
    localStorage.removeItem('olivas_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}