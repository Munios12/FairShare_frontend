// AuthContext.jsx
// ----------------
// Gestión global de autenticación en la aplicación.
// Este archivo:
//   1) Crea el contexto de autenticación.
//   2) Define el proveedor <AuthProvider> que envuelve a la App.
//   3) Expone las funciones login / register / logout.
//   4) Permite acceder al usuario autenticado desde cualquier parte.

// ==================================================
//  IMPORTS
// ==================================================
import { createContext, useState } from "react";

// ==================================================
// 1) CONTEXTO DE AUTENTICACIÓN
// --------------------------------------------------
// Lo inicializamos con "null" (nadie está logueado por defecto).
// El AuthProvider será quien establezca el valor real.
export const AuthContext = createContext(null);

// ==================================================
// 2) PROVIDER: ENVUELVE A TODA LA APLICACIÓN
// --------------------------------------------------
// Usa export DEFAULT (estándar recomendado para Providers)
// para importar siempre:  import AuthProvider from "..."
export default function AuthProvider({ children }) {

  // Estado del usuario autenticado.
  // null significa que no hay sesión iniciada.
  const [user, setUser] = useState(null);

  // ==================================================
  // 3) ACCIONES DE AUTENTICACIÓN (por ahora falsas)
  // --------------------------------------------------
  // Más adelante conectarán con tu backend real (API).
  // De momento son simulaciones perfectas para desarrollo.

  // ---- LOGIN SIMULADO ----
  function login(email, password) {
    // Aquí normalmente usarías fetch() o axios para validar credenciales.
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

  // ==================================================
  // 4) PROVEER VALORES A TODA LA APP
  // --------------------------------------------------
  // Todo componente dentro del <AuthProvider> podrá usar:
  //    const { user, login, register, logout } = useAuth();
  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
