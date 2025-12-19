import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function useAuth() {
  // Obtenemos el valor actual del contexto
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de un <AuthProvider>");
  }

  return context;
}
