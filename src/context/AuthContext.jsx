//  IMPORTS
import { createContext, useEffect, useState } from "react";

// CONTEXTO DE AUTENTICACIÓN
export const AuthContext = createContext(null);

// Clave de LocalStorage donde guardamos la sesión
const LS_USER_KEY = "fairshare_user";

// PROVIDER: ENVUELVE A TODA LA APLICACIÓN
export default function AuthProvider({ children }) {

  // Estado del usuario autenticado.
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(LS_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      // Si el JSON estuviera corrupto o falla algo, empezamos sin sesión.
      return null;
    }
  });

  // Cada vez que cambie "user", lo persistimos (o lo borramos si es null)
  useEffect(() => {
    if (user) {
      localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LS_USER_KEY);
    }
  }, [user]);

  // ---- LOGIN SIMULADO ----
  function login(email, password) {
    // De momento devolvemos un usuario fijo.
    const fakeUser = {
      id: 1,
      name: "Luismi Herraz",
      email,
      avatarColor: "teal",
    };

    setUser(fakeUser);
  }

  // ---- REGISTRO SIMULADO ----
  function register(name, email, password) {
    // Simulación de registro real.
    const newUser = {
      id: Date.now(), // ID simulado
      name,
      email,
      avatarColor: "teal",
    };

    setUser(newUser);
  }

  function updateUser(patch) {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  // ---- LOGOUT ----
  function logout() {
    setUser(null); // Limpiamos al usuario => vuelve al estado sin sesión
  }

  // PROVEER VALORES A TODA LA APP
  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
