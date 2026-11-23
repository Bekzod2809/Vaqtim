import { createContext, useContext, useState } from 'react';
import { authApi } from '../api/auth';
import { AUTH_KEY } from '../api/client';

const AuthContext = createContext(null);

function readSaved() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  // { token, foydalanuvchi } yoki null. Sahifa yangilansa ham localStorage'dan tiklanadi
  const [auth, setAuth] = useState(readSaved);

  const login = async (username, password) => {
    const response = await authApi.login({ username, password });
    localStorage.setItem(AUTH_KEY, JSON.stringify(response));
    setAuth(response);
    return response.user;
  };

  const resetPassword = async (payload) => {
    const response = await authApi.resetPassword(payload);
    localStorage.setItem(AUTH_KEY, JSON.stringify(response));
    setAuth(response);
    return response.user;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setAuth(null);
  };

  const updateUser = (user) => {
    const nextAuth = { ...auth, user };
    localStorage.setItem(AUTH_KEY, JSON.stringify(nextAuth));
    setAuth(nextAuth);
  };

  const value = {
    user: auth?.user ?? null,
    isAdmin: auth?.user?.role === 2,
    login,
    resetPassword,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
