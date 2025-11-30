// Página: Mis grupos
// Esta pantalla muestra todos los grupos del usuario y permite crear otros nuevos.
// Por ahora, los datos se muestran estáticos (modo mockup).
// Más adelante se conectarán al backend con GroupsContext + groupsService.

import { useState } from "react";

export default function Grupos() {
  // =============================
  //  ESTADO LOCAL TEMPORAL
  // =============================
  // En el mockup original, los grupos estaban en un array:
  // ["Piso compartido", "Viaje a Barcelona"]
  //
  // Más adelante este estado vendrá del backend:
  //   const { groups } = useGroups();
  //
  const [grupos, setGrupos] = useState([
    "Piso compartido",
    "Viaje a Barcelona",
  ]);

  // =============================
  //  MANEJAR CREACIÓN DE GRUPOS
  // =============================
  // Simula la creación de un grupo como hacía el app.js original.
  // Más adelante esto será:
  //   groupsService.create()
  //   context.addGroup()
  //
  const crearGrupo = () => {
    const nombre = prompt("Introduce el nombre del nuevo grupo:");

    if (nombre && nombre.trim() !== "") {
      setGrupos([...grupos, nombre.trim()]);
      alert("Grupo creado correctamente ✅");

      // En el futuro:
      // navigate(`/grupos/${nuevoID}`);
    }
  };

  return (
    <div>
      {/* TÍTULO PRINCIPAL */}
      {/* Igual que el mockup original */}
      <h1 className="title">Mis grupos</h1>

      {/* LISTA DE GRUPOS */}
      {/* Cada grupo se representa como un <li> (igual que en el mockup) */}
      <ul className="list" style={{ marginBottom: "20px" }}>
        {grupos.map((nombre, i) => (
          <li key={i}>{nombre}</li>
        ))}
      </ul>

      {/* BOTÓN PRINCIPAL */}
      {/* Sigue el estilo FairShare: botón verde primario */}
      <button className="btn primary" onClick={crearGrupo}>
        ➕ Crear nuevo grupo
      </button>
    </div>
  );
}
