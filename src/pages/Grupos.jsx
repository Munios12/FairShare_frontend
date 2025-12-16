import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Grupos() {
  const navigate = useNavigate();

  // Grupos FAKE
  const [grupos, setGrupos] = useState([
    {
      id: 1,
      name: "Piso compartido",
      members: 3,
      lastExpense: "Supermercado (€67,80)",
      balance: "Te deben €22,60",
      miembros: ["Luismi", "Alex", "Jesús"],
    },
    {
      id: 2,
      name: "Viaje a Barcelona",
      members: 4,
      lastExpense: "Cena restaurante (€45,00)",
      balance: "Debes €12,50",
      miembros: ["Luismi", "Nicky", "Marta", "Juan"],
    },
  ]);

  // FORM CREAR GRUPO
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nombreGrupo, setNombreGrupo] = useState("");
  const [miembros, setMiembros] = useState([]);
  const [nuevoMiembro, setNuevoMiembro] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // MODAL DETALLE GRUPO
  const [openGroupModal, setOpenGroupModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  // MODAL CONFIRMAR ELIMINACIÓN
  const [confirmDelete, setConfirmDelete] = useState(false);

  // EDITAR GRUPO
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");

  // Edición de miembros en el modal
  const [editMembers, setEditMembers] = useState([]);
  const [newEditMember, setNewEditMember] = useState("");

  const selectedGroup = useMemo(
    () => grupos.find((g) => g.id === selectedGroupId) || null,
    [grupos, selectedGroupId]
  );

  // CREAR GRUPO
  function agregarMiembro() {
    const name = nuevoMiembro.trim();

    if (!name) {
      setError("El nombre del participante no puede estar vacío.");
      return;
    }

    if (miembros.includes(name)) {
      setError("Ese participante ya está añadido.");
      return;
    }

    setMiembros([...miembros, name]);
    setNuevoMiembro("");
    setError("");
  }

  function eliminarMiembro(index) {
    setMiembros(miembros.filter((_, i) => i !== index));
  }

  const crearGrupo = (e) => {
    e.preventDefault();

    if (!nombreGrupo.trim()) {
      setError("El nombre del grupo no puede estar vacío.");
      return;
    }

    if (miembros.length === 0) {
      setError("Debes añadir al menos un participante.");
      return;
    }

    const nuevo = {
      id: Date.now(),
      name: nombreGrupo.trim(),
      members: miembros.length,
      miembros: miembros,
      lastExpense: "—",
      balance: "—",
    };

    setGrupos((prev) => [nuevo, ...prev]);
    setSuccess("Grupo creado correctamente ✅");

    setNombreGrupo("");
    setMiembros([]);
    setNuevoMiembro("");
    setError("");
    setMostrarForm(false);
  };

  const cancelar = () => {
    setMostrarForm(false);
    setNombreGrupo("");
    setMiembros([]);
    setNuevoMiembro("");
    setError("");
    setSuccess("");
  };

  // MODAL DETALLE
  function openModalForGroup(group) {
    setSelectedGroupId(group.id);
    setEditName(group.name);
    setEditMembers(group.miembros); // cargamos los miembros 
    setIsEditing(false);
    setOpenGroupModal(true);
  }

  function closeModal() {
    setOpenGroupModal(false);
    setSelectedGroupId(null);
    setIsEditing(false);
    setEditName("");
    setEditMembers([]);
    setNewEditMember("");
  }

  // ACCIONES MODAL
  function handleAddExpenseToGroup() {
    navigate("/nuevo-gasto", {
      state: { groupId: selectedGroup.id, groupName: selectedGroup.name },
    });

    closeModal();
  }

  function handleStartEdit() {
    setIsEditing(true);
    setEditName(selectedGroup.name);
    setEditMembers(selectedGroup.miembros);
  }

  function handleCancelEdit() {
    setIsEditing(false);
    setEditName(selectedGroup.name);
    setEditMembers(selectedGroup.miembros);
    setNewEditMember("");
  }

  // GUARDAR CAMBIOS DEL GRUPO
  function handleSaveEdit() {
    const name = editName.trim();
    if (!name) return;

    const updated = {
      ...selectedGroup,
      name,
      miembros: editMembers,
      members: editMembers.length,
    };

    setGrupos((prev) =>
      prev.map((g) => (g.id === selectedGroup.id ? updated : g))
    );

  // ACTUALIZA selectedGroup para refrescar el modal
  setEditMembers(updated.miembros);
  setEditName(updated.name);
  
  setIsEditing(false);
  setSuccess("Grupo actualizado correctamente ✅");
}

  // ELIMINAR GRUPO
  function handleDeleteGroup() {
    setConfirmDelete(true);
  }

  function confirmDeleteGroup() {
    setGrupos((prev) => prev.filter((g) => g.id !== selectedGroup.id));
    setSuccess("Grupo eliminado correctamente ❌");

    setConfirmDelete(false);
    closeModal();
  }

  // RENDER
  return (
    <div>
      <h1 className="title">Mis grupos</h1>

      {/* MENSAJE ÉXITO */}
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

      {/* GRID DE GRUPOS */}
      <div className="grid" style={{ marginTop: 12 }}>
        {grupos.map((g) => (
          <div
            key={g.id}
            className="card"
            style={{ cursor: "pointer" }}
            onClick={() => openModalForGroup(g)}
          >
            <div className="card-title">{g.name}</div>

            <p className="muted" style={{ marginTop: 10 }}>
              Miembros: {g.miembros.length}
              <br />
              Último gasto: {g.lastExpense}
              <br />
              Balance: {g.balance}
            </p>
          </div>
        ))}
      </div>

      {/* BOTÓN CREAR GRUPO */}
      <button
        className="btn primary"
        style={{ marginTop: 16 }}
        onClick={() => {
          setMostrarForm((v) => !v);
          setSuccess("");
        }}
      >
        ➕ Crear nuevo grupo
      </button>

      {/* FORM CREAR GRUPO */}
      {mostrarForm && (
        <form className="form card" onSubmit={crearGrupo} style={{ marginTop: 16 }}>
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

          {/* PARTICIPANTES */}
          <label style={{ marginTop: 20 }}>Añadir participantes</label>

          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <input
              type="text"
              placeholder="Ej: Alex"
              value={nuevoMiembro}
              onChange={(e) => setNuevoMiembro(e.target.value)}
            />
            <button className="btn primary" type="button" onClick={agregarMiembro}>
              Añadir
            </button>
          </div>

          {/* Lista de participantes */}
          {miembros.length > 0 && (
            <ul className="list" style={{ marginTop: 12 }}>
              {miembros.map((m, i) => (
                <li
                  key={i}
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  {m}
                  <button
                    type="button"
                    style={{
                      color: "var(--red)",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                    }}
                    onClick={() => eliminarMiembro(i)}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}

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

      {/* MODAL DETALLE / EDICIÓN    */}
      {openGroupModal && selectedGroup && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ✕
            </button>

            {/* MODO EDICIÓN */}
            {isEditing ? (
              <>
                <h2 className="modal-title">Editar grupo</h2>

                {/* NOMBRE DEL GRUPO          */}
                <div style={{ marginBottom: 20, marginTop: 10 }}>
                  <label
                    style={{
                      display: "block",
                      fontWeight: 600,
                      marginBottom: 6,
                      fontSize: "15px",
                    }}
                  >
                    Nombre del grupo
                  </label>

                  <input
                    type="text"
                    className="input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      fontSize: "15px",
                    }}
                  />
                </div>

                {/* PARTICIPANTES             */}
                <div style={{ marginBottom: 12 }}>
                  <label
                    style={{
                      display: "block",
                      fontWeight: 600,
                      marginBottom: 6,
                      fontSize: "15px",
                    }}
                  >
                    Participantes
                  </label>

                  <ul className="list" style={{ marginTop: 4 }}>
                    {editMembers.map((m, i) => (
                      <li
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "6px 0",
                        }}
                      >
                        {m}
                        <button
                          type="button"
                          style={{
                            color: "var(--red)",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "18px",
                          }}
                          onClick={() =>
                            setEditMembers(editMembers.filter((_, idx) => idx !== i))
                          }
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* AÑADIR NUEVO MIEMBRO      */}
                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                  <input
                    type="text"
                    placeholder="Nuevo miembro"
                    className="input"
                    value={newEditMember}
                    onChange={(e) => setNewEditMember(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                  />

                  <button
                    className="btn primary"
                    type="button"
                    onClick={() => {
                      const n = newEditMember.trim();
                      if (!n) return;
                      if (!editMembers.includes(n)) {
                        setEditMembers([...editMembers, n]);
                      }
                      setNewEditMember("");
                    }}
                  >
                    Añadir
                  </button>
                </div>

                {/* BOTONES                   */}
                <div className="actions" style={{ marginTop: 20 }}>
                  <button className="btn primary" onClick={handleSaveEdit}>
                    Guardar cambios
                  </button>
                  <button className="btn outline" onClick={handleCancelEdit}>
                    Cancelar
                  </button>
                </div>
              </>
            ) : (

              <>
                {/* MODO VISUAL */}
                <h2 className="modal-title">{selectedGroup.name}</h2>

                <ul className="modal-list">
                  <li>
                    <span>Miembros</span>
                    <strong>{selectedGroup.members}</strong>
                  </li>
                  <li>
                    <span>Último gasto</span>
                    <strong>{selectedGroup.lastExpense}</strong>
                  </li>
                  <li>
                    <span>Balance</span>
                    <strong>{selectedGroup.balance}</strong>
                  </li>
                </ul>

                <div className="actions" style={{ marginTop: 20 }}>
                  <button
                    className="btn primary"
                    onClick={handleAddExpenseToGroup}
                  >
                    ➕ Añadir gasto a este grupo
                  </button>

                  <button className="btn outline" onClick={handleStartEdit}>
                    Editar grupo
                  </button>

                  <button
                    className="btn outline"
                    style={{ borderColor: "var(--red)", color: "var(--red)" }}
                    onClick={handleDeleteGroup}
                  >
                    Eliminar grupo
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAR ELIMINACIÓN */}
      {confirmDelete && selectedGroup && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setConfirmDelete(false)}
            >
              ✕
            </button>

            <h2 className="modal-title">Eliminar grupo</h2>

            <p style={{ marginTop: 10 }}>
              ¿Seguro que deseas eliminar el grupo{" "}
              <strong>{selectedGroup.name}</strong>?
              <br />
              Esta acción no se puede deshacer.
            </p>

            <div className="actions" style={{ marginTop: 20 }}>
              <button
                className="btn outline"
                onClick={() => setConfirmDelete(false)}
              >
                Cancelar
              </button>

              <button className="btn danger" onClick={confirmDeleteGroup}>
                Eliminar grupo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
