// Página: Mis grupos
// Esta pantalla muestra todos los grupos del usuario y permite crear otros nuevos.

import { useState } from "react";

export default function Grupos() {
  const [grupos, setGrupos] = useState([
    "Piso compartido",
    "Viaje a Barcelona",
  ]);

  const [mostrarForm, setMostrarForm] = useState(false);
  const [nombreGrupo, setNombreGrupo] = useState("");
  const [error, setError] = useState("");

  // 🔹 NUEVO: mensaje de éxito
  const [success, setSuccess] = useState("");

  const crearGrupo = (e) => {
    e.preventDefault();

    if (!nombreGrupo.trim()) {
      setError("El nombre del grupo no puede estar vacío.");
      return;
    }

    setGrupos([...grupos, nombreGrupo.trim()]);

    // 🔹 Mensaje visual de éxito
    setSuccess("Grupo creado correctamente ✅");

    // Limpieza
    setNombreGrupo("");
    setError("");
    setMostrarForm(false);
  };

  const cancelar = () => {
    setMostrarForm(false);
    setNombreGrupo("");
    setError("");
    setSuccess(""); // 🔹 limpiamos mensaje
  };

  return (
    <div>
      <h1 className="title">Mis grupos</h1>

      {/* 🔹 MENSAJE DE ÉXITO */}
      {success && (
        <div
          className="card"
          style={{
            background: "rgba(72, 187, 120, 0.15)",
            borderLeft: "4px solid #48bb78",
            marginBottom: 16,
          }}
        >
          <p style={{ margin: 0 }}>{success}</p>
        </div>
      )}

      {/* LISTA DE GRUPOS */}
      <ul className="list" style={{ marginBottom: "20px" }}>
        {grupos.map((nombre, i) => (
          <li key={i}>{nombre}</li>
        ))}
      </ul>

      {/* BOTÓN PRINCIPAL */}
      <button
        className="btn primary"
        onClick={() => {
          setMostrarForm((v) => !v);
          setSuccess(""); // 🔹 ocultamos mensaje al abrir form
        }}
      >
        ➕ Crear nuevo grupo
      </button>

      {/* FORMULARIO DESPLEGABLE */}
      {mostrarForm && (
        <form className="form card" onSubmit={crearGrupo}>
          <label>Nombre del grupo</label>
          <input
            type="text"
            placeholder="Ej: Viaje a Madrid"
            value={nombreGrupo}
            onChange={(e) => {
              setNombreGrupo(e.target.value);
              setError("");
            }}
          />

          {error && (
            <p className="muted" style={{ color: "var(--red)", marginTop: 6 }}>
              {error}
            </p>
          )}

          <div className="actions" style={{ marginTop: 16 }}>
            <button className="btn primary" type="submit">
              Guardar grupo
            </button>

            <button className="btn outline" type="button" onClick={cancelar}>
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
