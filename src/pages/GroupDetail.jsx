import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useGroups from "../hooks/useGroups";
import useAuth from "../hooks/useAuth";
import AddMemberModal from "../components/AddMemberModal";
import DeleteGroupModal from "../components/DeleteGroupModal";
import AddExpenseModal from "../components/AddExpenseModal";
import ExpenseActionsModal from "../components/ExpenseActionsModal"; 

export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getGroupById } = useGroups();
  const { user } = useAuth();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showExpenseActionsModal, setShowExpenseActionsModal] = useState(false);  
  const [selectedExpense, setSelectedExpense] = useState(null);  

  useEffect(() => {
    loadGroupDetail();
  }, [id]);

  async function loadGroupDetail() {
    setLoading(true);
    setError(null);

    try {
      const groupData = await getGroupById(id);
      setGroup(groupData);
    } catch (err) {
      console.error("❌ Error al cargar grupo:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleMemberAdded() {
    await loadGroupDetail();
    setShowAddMemberModal(false);
  }

  async function handleExpenseAdded() {
    await loadGroupDetail();
    setShowAddExpenseModal(false);
  }

  async function handleExpenseUpdated() { 
    await loadGroupDetail();
    setShowExpenseActionsModal(false);
    setSelectedExpense(null);
  }

  function handleExpenseClick(expense) {
    console.log("💰 Gasto clickeado:", expense);
    console.log("📍 ID del grupo actual:", id);
    
    // ✅ Añadir grupo_id al expense antes de pasarlo
    const expenseWithGroupId = {
      ...expense,
      grupo_id: parseInt(id)
    };
    
    console.log("✅ Gasto con grupo_id:", expenseWithGroupId);
    
    // ✅ CORRECCIÓN: Pasar expenseWithGroupId
    setSelectedExpense(expenseWithGroupId);
    setShowExpenseActionsModal(true);
  }

  const isCreator = user?.id === group?.usuario_id;

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando grupo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="alert alert-error">
          ❌ {error}
        </div>
        <button className="btn btn-secondary" onClick={() => navigate("/grupos")}>
          ← Volver a grupos
        </button>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h2>Grupo no encontrado</h2>
          <button className="btn btn-secondary" onClick={() => navigate("/grupos")}>
            ← Volver a grupos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button className="btn-back" onClick={() => navigate("/grupos")}>
            ← Volver
          </button>
          <h1 className="title">{group.nombre_grupo}</h1>
        </div>
        
        {isCreator && (
          <button
            className="btn btn-danger"
            onClick={() => setShowDeleteModal(true)}
          >
             Eliminar grupo
          </button>
        )}
      </div>

      {/* Grid de 2 columnas */}
      <div className="group-detail-grid">
        {/* Columna izquierda: Miembros */}
        <div className="card">
          <div className="card-header">
            <h2>👥 Miembros ({group.miembros?.length || 0})</h2>
            <button
              className="btn btn-small btn-primary"
              onClick={() => setShowAddMemberModal(true)}
            >
              ➕ Añadir
            </button>
          </div>

          <div className="members-list">
            {group.miembros && group.miembros.length > 0 ? (
              group.miembros.map((member) => (
                <div key={member.id} className="member-item">
                  <div className={`avatar avatar--${member.avatar_color || "teal"}`}>
                    {member.nombre_usuario?.charAt(0).toUpperCase()}
                  </div>
                  <div className="member-info">
                    <div className="member-name">{member.nombre_usuario}</div>
                    <div className="member-email">{member.email}</div>
                  </div>
                  {member.role === "admin" && (
                    <span className="badge badge-admin">Admin</span>
                  )}
                </div>
              ))
            ) : (
              <p className="empty-message">No hay miembros en este grupo</p>
            )}
          </div>
        </div>

        {/* Columna derecha: Gastos recientes */}
        <div className="card">
          <div className="card-header">
            <h2>💰 Gastos recientes</h2>
            <button 
              className="btn btn-small btn-primary"
              onClick={() => setShowAddExpenseModal(true)}
            >
              ➕ Nuevo gasto
            </button>
          </div>

          <div className="expenses-list">
            {group.gastos_recientes && group.gastos_recientes.length > 0 ? (
              group.gastos_recientes.map((expense) => (
                <div 
                  key={expense.id} 
                  className="expense-item expense-item-clickable"  
                  onClick={() => handleExpenseClick(expense)}  
                >
                  <div className="expense-info">
                    <div className="expense-description">
                      {expense.descripcion}
                    </div>
                    <div className="expense-payer">
                      Pagado por {expense.pagador?.nombre_usuario}
                    </div>
                  </div>
                  <div className="expense-amount">
                    {expense.cantidad_total} {expense.moneda || "EUR"}
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-message">
                Aún no hay gastos registrados en este grupo
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modales */}
      <AddMemberModal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        groupId={id}
        onMemberAdded={handleMemberAdded}
      />

      <DeleteGroupModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        group={group}
      />

      <AddExpenseModal
        isOpen={showAddExpenseModal}
        onClose={() => setShowAddExpenseModal(false)}
        groupId={parseInt(id)}
        onExpenseAdded={handleExpenseAdded}
      />

      {/* ✅ Modal de acciones de gasto */}
      <ExpenseActionsModal
        expense={selectedExpense}
        isOpen={showExpenseActionsModal}
        onClose={() => {
          setShowExpenseActionsModal(false);
          setSelectedExpense(null);
        }}
        onExpenseUpdated={handleExpenseUpdated}
      />
    </div>
  );
}