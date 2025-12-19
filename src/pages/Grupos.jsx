import { useEffect, useState } from "react";
import useGroups from "../hooks/useGroups";
import GroupCard from "../components/GroupCard";
import NewGroupModal from "../components/NewGroupModal";

export default function Grupos() {
  const { groups, loading, error, loadGroups } = useGroups();
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);

  useEffect(() => {
    loadGroups();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando grupos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header con título y botón */}
      <div className="page-header">
        <h1 className="title">Mis Grupos</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowNewGroupModal(true)}
        >
          ➕ Nuevo grupo
        </button>
      </div>

      {/* Mensajes de error */}
      {error && (
        <div className="alert alert-error">
          ❌ {error}
        </div>
      )}

      {/* Lista de grupos */}
      {groups.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📂</div>
          <h2>No tienes grupos aún</h2>
          <p>Crea tu primer grupo para empezar a gestionar gastos compartidos</p>
          <button
            className="btn btn-primary"
            onClick={() => setShowNewGroupModal(true)}
          >
            ➕ Crear mi primer grupo
          </button>
        </div>
      ) : (
        <div className="groups-grid">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      )}

      {/* Modal para crear grupo */}
      <NewGroupModal
        isOpen={showNewGroupModal}
        onClose={() => setShowNewGroupModal(false)}
      />
    </div>
  );
}