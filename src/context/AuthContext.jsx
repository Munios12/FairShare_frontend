// IMPORTS
import { createContext, useEffect, useState } from "react";

// CONTEXTO DE AUTENTICACIÓN
export const AuthContext = createContext(null);

// Claves de LocalStorage
const LS_USER_KEY = "fairshare_user";
const LS_TOKEN_KEY = "fairshare_token";

// PROVIDER
export default function AuthProvider({ children }) {
  // Estado inicial cargado desde localStorage
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(LS_USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(LS_TOKEN_KEY) || null;
    } catch {
      return null;
    }
  });

  // Persistencia automática
  useEffect(() => {
    if (user) localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(LS_USER_KEY);
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem(LS_TOKEN_KEY, token);
    else localStorage.removeItem(LS_TOKEN_KEY);
  }, [token]);

  // LOGIN — RECIBE user + token DESDE EL BACKEND
  function login(userData, authToken) {
    setUser(userData);
    setToken(authToken);
  }

  // REGISTER
  function register(userData, authToken = null) {
    setUser(userData);
    setToken(authToken);
  }

  // ACTUALIZAR USER 
  function updateUser(patch) {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  // LOGOUT 
  function logout() {
    setUser(null);
    setToken(null);
  }

  // VALORES EXPORTADOS
  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
