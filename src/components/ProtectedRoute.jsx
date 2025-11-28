import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // TODO: conectarlo luego con AuthContext
  const isAuthenticated = false;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
