import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute() {
  const { user } = useAuth();
  const token = localStorage.getItem("fairshare_token"); // ← nuevo

  // Si no hay token o no hay usuario → no permitir acceso
  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  // Si existe user + token → permitir acceso
  return <Outlet />;
}
