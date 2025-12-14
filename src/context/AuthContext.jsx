
//  IMPORTS

import { createContext, useState } from "react";

// CONTEXTO DE AUTENTICACIÓN
export const AuthContext = createContext(null);

// PROVIDER: ENVUELVE A TODA LA APLICACIÓN
export default function AuthProvider({ children }) {

  // Estado del usuario autenticado.
  // null significa que no hay sesión iniciada.
  const [user, setUser] = useState(null);

  // ACCIONES DE AUTENTICACIÓN (por ahora falsas)
  // ---- LOGIN SIMULADO ----
  function login(email, password) {
    // De momento devolvemos un usuario fijo.
    const fakeUser = {
      id: 1,
      name: "Juan Díaz",
      email,
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
    };

    setUser(newUser);
  }

  // ---- LOGOUT ----
  function logout() {
    setUser(null); // Limpiamos al usuario => vuelve al estado sin sesión
  }

  // PROVEER VALORES A TODA LA APP
  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
