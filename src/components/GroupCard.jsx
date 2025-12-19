import { useNavigate } from "react-router-dom";

export default function GroupCard({ group }) {
  const navigate = useNavigate();

  // Calcular número de miembros 
  const membersCount = group.miembros?.length || 0;

  // Formatear fecha
  const lastUpdate = new Date(group.ultima_actualizacion).toLocaleDateString(
    "es-ES",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  function handleClick() {
    navigate(`/grupos/${group.id}`);
  }

  return (
    <div className="group-card" onClick={handleClick}>
      <div className="group-card-header">
        <h3>{group.nombre_grupo}</h3>
        <span className="group-members">
          👥 {membersCount} {membersCount === 1 ? "miembro" : "miembros"}
        </span>
      </div>

      <div className="group-card-body">
        <div className="group-info">
          <span className="group-date">📅 Actualizado: {lastUpdate}</span>
        </div>
      </div>

      <div className="group-card-footer">
        <button className="btn-link">Ver detalles →</button>
      </div>
    </div>
  );
}