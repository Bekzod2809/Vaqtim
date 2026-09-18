import { createContext, useContext, useState } from 'react';
import { authApi } from '../api/auth';
import { AUTH_KALIT } from '../api/client';

const AuthContext = createContext(null);

function saqlanganniOqish() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KALIT));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  // { token, foydalanuvchi } yoki null. Sahifa yangilansa ham localStorage'dan tiklanadi
  const [auth, setAuth] = useState(saqlanganniOqish);

  const kirish = async (usernameYokiEmail, parol) => {
    const javob = await authApi.kirish({ usernameYokiEmail, parol });
    localStorage.setItem(AUTH_KALIT, JSON.stringify(javob));
    setAuth(javob);
    return javob.foydalanuvchi;
  };

  const chiqish = () => {
    localStorage.removeItem(AUTH_KALIT);
    setAuth(null);
  };

  const qiymat = {
    foydalanuvchi: auth?.foydalanuvchi ?? null,
    adminmi: auth?.foydalanuvchi?.rol === 2,
    kirish,
    chiqish,
  };

  return <AuthContext.Provider value={qiymat}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
