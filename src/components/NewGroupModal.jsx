import { useState } from "react";
import useGroups from "../hooks/useGroups";

export default function NewGroupModal({ isOpen, onClose }) {
  const { createGroup } = useGroups();

  const [nombre_grupo, setNombreGrupo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!nombre_grupo.trim()) {
        throw new Error("El nombre del grupo no puede estar vacío");
      }

      await createGroup(nombre_grupo.trim());
      
      // Limpiar y cerrar
      setNombreGrupo("");
      onClose();
      
    } catch (err) {
      console.error("❌ Error al crear grupo:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setNombreGrupo("");
    setError(null);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>➕ Crear nuevo grupo</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre_grupo">Nombre del grupo</label>
            <input
              type="text"
              id="nombre_grupo"
              value={nombre_grupo}
              onChange={(e) => setNombreGrupo(e.target.value)}
              placeholder="Ej: Viaje a Barcelona"
              disabled={loading}
              required
              autoFocus
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
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creando..." : "Crear grupo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}