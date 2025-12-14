// Custom hook para consumir el contexto de autenticación
// en cualquier componente de forma sencilla: const { user } = useAuth();

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function useAuth() {
  // Obtenemos el valor actual del contexto
  const context = useContext(AuthContext);

  // Pequeña protección extra:
  // Si alguien usa useAuth fuera de un <AuthProvider>, lanzamos error.
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un <AuthProvider>");
  }

  return context;
}
