import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute() {
  const { user } = useAuth();

  // Si no hay sesión → fuera al login y reemplaza historial (no vuelve con "atrás")
  if (!user) return <Navigate to="/" replace />;

  // Si hay sesión → renderiza las rutas hijas protegidas
  return <Outlet />;
}
