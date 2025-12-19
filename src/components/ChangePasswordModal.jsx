import { useState } from "react";
import { updatePasswordRequest } from "../services/authService";
import useAuth from "../hooks/useAuth";

export default function ChangePasswordModal({ isOpen, onClose }) {
  const { token, logout } = useAuth();

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
    setSuccess(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!passwords.currentPassword) {
        throw new Error("Debes ingresar tu contraseña actual");
      }

      if (!passwords.newPassword) {
        throw new Error("Debes ingresar una nueva contraseña");
      }

      if (passwords.newPassword.length < 6) {
        throw new Error("La nueva contraseña debe tener al menos 6 caracteres");
      }

      if (passwords.newPassword !== passwords.confirmPassword) {
        throw new Error("Las contraseñas nuevas no coinciden");
      }

      if (passwords.currentPassword === passwords.newPassword) {
        throw new Error("La nueva contraseña debe ser diferente a la actual");
      }

      await updatePasswordRequest(token, {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      setSuccess(true);

      setTimeout(() => {
        logout();
        onClose();
        alert("Contraseña actualizada. Por favor, inicia sesión nuevamente.");
      }, 2000);

    } catch (err) {
      console.error("❌ Error al cambiar contraseña:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setError(null);
    setSuccess(false);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>🔒 Cambiar contraseña</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="currentPassword">Contraseña actual</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handleChange}
              disabled={loading}
              required
              autoComplete="current-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">Nueva contraseña</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleChange}
              disabled={loading}
              required
              minLength={6}
              autoComplete="new-password"
            />
            <small>Mínimo 6 caracteres</small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar nueva contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              required
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="alert alert-error">
              ❌ {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              ✅ Contraseña actualizada. Cerrando sesión...
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Cambiando..." : "Cambiar contraseña"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}