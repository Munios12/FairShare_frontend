import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import useGroups from "../hooks/useGroups";

export default function AddExpenseModal({ 
  isOpen, 
  onClose, 
  groupId = null, 
  expenseToEdit = null,
  onExpenseAdded 
}) {
  const { user, token } = useAuth();
  const { groups, getGroupById } = useGroups();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  const isEditing = !!expenseToEdit;

  // Datos del formulario
  const [formData, setFormData] = useState({
    grupo_id: "",
    concepto: "",
    cantidad: "",
    pagador_id: "",
    participantes: [],
  });

  const [availableMembers, setAvailableMembers] = useState([]);

  // Inicializar datos cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      if (expenseToEdit) {
        // Modo edición: cargar datos del gasto
        console.log("🔄 Cargando gasto para editar:", expenseToEdit);
        setFormData({
          grupo_id: expenseToEdit.grupo_id || "",
          concepto: expenseToEdit.descripcion || "",
          cantidad: expenseToEdit.cantidad_total || "",
          pagador_id: expenseToEdit.pagador_id || "",
          participantes: [],
        });
      } else if (groupId) {
        // Modo crear con grupo específico
        setFormData(prev => ({
          ...prev,
          grupo_id: groupId,
          pagador_id: user?.id || "",
        }));
      } else {
        // Modo crear sin grupo específico
        setFormData({
          grupo_id: "",
          concepto: "",
          cantidad: "",
          pagador_id: user?.id || "",
          participantes: [],
        });
      }
    }
  }, [isOpen, expenseToEdit, groupId, user]);

  // Cargar participantes del gasto si estamos editando
  useEffect(() => {
    async function loadExpenseParticipants() {
      if (expenseToEdit && isOpen) {
        setLoadingParticipants(true);
        try {
          console.log("👥 Cargando participantes del gasto:", expenseToEdit.id);
          
          const response = await fetch(
            `http://localhost:5000/api/expenses/${expenseToEdit.id}/participants`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.ok) {
            const data = await response.json();
            console.log("✅ Participantes cargados:", data.data.participantes);
            
            setFormData(prev => ({
              ...prev,
              participantes: data.data.participantes.map(p => p.usuario_id)
            }));
          }
        } catch (err) {
          console.error("❌ Error al cargar participantes:", err);
        } finally {
          setLoadingParticipants(false);
        }
      }
    }
    loadExpenseParticipants();
  }, [expenseToEdit, isOpen, token]);

  // Cargar miembros del grupo cuando se selecciona/cambia grupo
  useEffect(() => {
    async function loadGroupMembers() {
      if (formData.grupo_id) {
        try {
          console.log("👥 Cargando miembros del grupo:", formData.grupo_id);
          
          const group = await getGroupById(formData.grupo_id);
          
          if (group.miembros) {
            console.log("✅ Miembros del grupo:", group.miembros);
            setAvailableMembers(group.miembros);
            
            // Solo auto-seleccionar si NO estamos editando Y no hay participantes ya
            if (!isEditing && formData.participantes.length === 0) {
              setFormData(prev => ({
                ...prev,
                participantes: group.miembros.map(m => m.usuario_id)
              }));
            }

            // Si estamos editando y no hay pagador seleccionado, usar el del usuario
            if (isEditing && !formData.pagador_id && group.miembros.length > 0) {
              setFormData(prev => ({
                ...prev,
                pagador_id: prev.pagador_id || user?.id || group.miembros[0].usuario_id
              }));
            }
          }
        } catch (err) {
          console.error("❌ Error al cargar miembros:", err);
        }
      }
    }
    loadGroupMembers();
  }, [formData.grupo_id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  }

  function handleParticipantToggle(userId) {
    setFormData(prev => ({
      ...prev,
      participantes: prev.participantes.includes(userId)
        ? prev.participantes.filter(id => id !== userId)
        : [...prev.participantes, userId]
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validaciones
      if (!formData.grupo_id) {
        throw new Error("Debes seleccionar un grupo");
      }
      if (!formData.concepto.trim()) {
        throw new Error("El concepto no puede estar vacío");
      }
      if (!formData.cantidad || parseFloat(formData.cantidad) <= 0) {
        throw new Error("La cantidad debe ser mayor a 0");
      }
      if (!formData.pagador_id) {
        throw new Error("Debes seleccionar quién pagó");
      }
      if (formData.participantes.length === 0) {
        throw new Error("Debe haber al menos un participante");
      }

      const url = isEditing
        ? `http://localhost:5000/api/expenses/${expenseToEdit.id}`
        : "http://localhost:5000/api/expenses";

      const method = isEditing ? "PUT" : "POST";

      console.log(`${method} ${url}`, formData);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          grupo_id: formData.grupo_id,
          descripcion: formData.concepto,
          cantidad_total: parseFloat(formData.cantidad),
          pagador_id: formData.pagador_id,
          participantes: formData.participantes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error al ${isEditing ? 'actualizar' : 'crear'} gasto`);
      }

      console.log(`✅ Gasto ${isEditing ? 'actualizado' : 'creado'} correctamente`);
      setSuccess(true);

      // Limpiar formulario solo si estamos creando
      if (!isEditing) {
        setFormData({
          grupo_id: groupId || "",
          concepto: "",
          cantidad: "",
          pagador_id: user?.id || "",
          participantes: [],
        });
      }

      // Notificar éxito y cerrar
      setTimeout(() => {
        if (onExpenseAdded) onExpenseAdded();
        onClose();
      }, 1500);

    } catch (err) {
      console.error(`❌ Error al ${isEditing ? 'actualizar' : 'crear'} gasto:`, err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setFormData({
      grupo_id: groupId || "",
      concepto: "",
      cantidad: "",
      pagador_id: user?.id || "",
      participantes: [],
    });
    setError(null);
    setSuccess(false);
    setAvailableMembers([]);
    onClose();
  }

  if (!isOpen) return null;

  const isGroupLocked = !!groupId || isEditing;
  const selectedGroup = groups.find(g => g.id === parseInt(formData.grupo_id));

  // Obtener el nombre del grupo a mostrar
  const groupNameToShow = selectedGroup?.nombre_grupo || 
                          (formData.grupo_id && availableMembers.length > 0 ? "Cargando..." : "");

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <h2>{isEditing ? "✏️ Editar gasto" : "💰 Añadir nuevo gasto"}</h2>

        <form onSubmit={handleSubmit}>
          {/* GRUPO */}
          <div className="form-group">
            <label htmlFor="grupo_id">Grupo</label>
            {isGroupLocked ? (
              <input
                type="text"
                value={groupNameToShow}
                disabled
                className="input-locked"
              />
            ) : (
              <select
                id="grupo_id"
                name="grupo_id"
                value={formData.grupo_id}
                onChange={handleChange}
                disabled={loading}
                required
              >
                <option value="">Selecciona un grupo</option>
                {groups.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.nombre_grupo}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* CONCEPTO */}
          <div className="form-group">
            <label htmlFor="concepto">Concepto</label>
            <input
              type="text"
              id="concepto"
              name="concepto"
              value={formData.concepto}
              onChange={handleChange}
              placeholder="Ej: Cena restaurante"
              disabled={loading}
              required
            />
          </div>

          {/* CANTIDAD */}
          <div className="form-group">
            <label htmlFor="cantidad">Cantidad (€)</label>
            <input
              type="number"
              id="cantidad"
              name="cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              disabled={loading}
              required
            />
          </div>

          {/* PAGADO POR */}
          <div className="form-group">
            <label htmlFor="pagador_id">Pagado por</label>
            <select
              id="pagador_id"
              name="pagador_id"
              value={formData.pagador_id}
              onChange={handleChange}
              disabled={loading}
              required
            >
              {availableMembers.length === 0 ? (
                <option value="">Cargando...</option>
              ) : (
                <>
                  <option value="">Selecciona quién pagó</option>
                  {availableMembers.map(member => (
                    <option key={member.usuario_id} value={member.usuario_id}>
                      {member.nombre_usuario}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* PARTICIPANTES */}
          <div className="form-group">
            <label>Participantes</label>
            <div className="participants-grid">
              {loadingParticipants ? (
                <p className="text-muted">Cargando participantes...</p>
              ) : availableMembers.length > 0 ? (
                availableMembers.map(member => (
                  <label key={member.usuario_id} className="participant-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.participantes.includes(member.usuario_id)}
                      onChange={() => handleParticipantToggle(member.usuario_id)}
                      disabled={loading}
                    />
                    <span>{member.nombre_usuario}</span>
                  </label>
                ))
              ) : (
                <p className="text-muted">Selecciona un grupo primero</p>
              )}
            </div>
          </div>

          {/* MENSAJES */}
          {error && (
            <div className="alert alert-error">
              ❌ {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              ✅ Gasto {isEditing ? 'actualizado' : 'creado'} correctamente
            </div>
          )}

          {/* BOTONES */}
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
              disabled={loading || success || (isEditing && loadingParticipants)}
            >
              {loading 
                ? "Guardando..." 
                : success 
                ? "¡Guardado!" 
                : loadingParticipants
                ? "Cargando..."
                : isEditing 
                ? "Actualizar gasto" 
                : "Guardar gasto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}