import { useState } from "react";
import useGroups from "../hooks/useGroups";
import { useNavigate } from "react-router-dom";

export default function DeleteGroupModal({ isOpen, onClose, group }) {
  const { deleteGroup } = useGroups();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmText, setConfirmText] = useState("");

  async function handleDelete(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (confirmText !== "ELIMINAR") {
        throw new Error('Debes escribir "ELIMINAR" para confirmar');
      }

      await deleteGroup(group.id);
      
      alert(`Grupo "${group.nombre_grupo}" eliminado exitosamente`);
      navigate("/grupos");
    } catch (err) {
      console.error("❌ Error al eliminar grupo:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setConfirmText("");
    setError(null);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content modal-danger" onClick={(e) => e.stopPropagation()}>
        <h2>⚠️ Eliminar grupo</h2>

        <div className="warning-box">
          <p><strong>Esta acción es irreversible.</strong></p>
          <p>Se eliminarán permanentemente:</p>
          <ul>
            <li>El grupo "{group.nombre_grupo}"</li>
            <li>Todos los miembros del grupo</li>
            <li>Todos los gastos asociados</li>
            <li>Todo el historial</li>
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
              {loading ? "Eliminando..." : "Eliminar grupo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}