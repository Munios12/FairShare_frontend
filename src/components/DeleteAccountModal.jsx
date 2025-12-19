import { useState } from "react";
import { deleteAccountRequest } from "../services/authService";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function DeleteAccountModal({ isOpen, onClose }) {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleDelete(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (confirmText !== "ELIMINAR") {
        throw new Error('Debes escribir "ELIMINAR" para confirmar');
      }

      if (!password) {
        throw new Error("Debes ingresar tu contraseña");
      }

      await deleteAccountRequest(token, password);

      logout();
      alert("Tu cuenta ha sido eliminada exitosamente");
      navigate("/");

    } catch (err) {
      console.error("❌ Error al eliminar cuenta:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setPassword("");
    setConfirmText("");
    setError(null);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content modal-danger" onClick={(e) => e.stopPropagation()}>
        <h2>⚠️ Eliminar cuenta</h2>

        <div className="warning-box">
          <p><strong>Esta acción es irreversible.</strong></p>
          <p>Se eliminarán permanentemente:</p>
          <ul>
            <li>Tu cuenta y perfil</li>
            <li>Todos tus grupos</li>
            <li>Todos tus gastos</li>
            <li>Todo tu historial</li>
          </ul>
        </div>

        <form onSubmit={handleDelete}>
          <div className="form-group">
            <label htmlFor="confirmText">
              Escribe <strong>ELIMINAR</strong> para confirmar
            </label>
            <input
              type="text"
              id="confirmText"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              disabled={loading}
              required
              placeholder="ELIMINAR"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Ingresa tu contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="alert alert-error">
              ❌ {error}
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
              className="btn btn-danger"
              disabled={loading || confirmText !== "ELIMINAR"}
            >
              {loading ? "Eliminando..." : "Eliminar cuenta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
