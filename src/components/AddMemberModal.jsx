import { useState } from "react";
import useGroups from "../hooks/useGroups";

export default function AddMemberModal({ isOpen, onClose, groupId, onMemberAdded }) {
  const { addMemberToGroup } = useGroups();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!email.trim()) {
        throw new Error("El email no puede estar vacío");
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("El formato del email no es válido");
      }

      await addMemberToGroup(groupId, email.trim());
      
      setSuccess(true);
      setEmail("");

      // Esperar un momento para mostrar el éxito y luego cerrar
      setTimeout(() => {
        onMemberAdded();
      }, 1500);
      
    } catch (err) {
      console.error("❌ Error al añadir miembro:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setEmail("");
    setError(null);
    setSuccess(false);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>👥 Añadir miembro al grupo</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email del usuario</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@ejemplo.com"
              disabled={loading || success}
              required
              autoFocus
            />
            <small>El usuario debe estar registrado en FairShare</small>
          </div>

          {error && (
            <div className="alert alert-error">
              ❌ {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              ✅ Miembro añadido correctamente
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
              disabled={loading || success}
            >
              {loading ? "Añadiendo..." : success ? "¡Añadido!" : "Añadir miembro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}