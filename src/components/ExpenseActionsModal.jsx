import { useState } from "react";
import AddExpenseModal from "./AddExpenseModal";
import useAuth from "../hooks/useAuth";

export default function ExpenseActionsModal({ expense, isOpen, onClose, onExpenseUpdated }) {
  const { token } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  async function handleDelete() {
    setDeleting(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/expenses/${expense.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar gasto");
      }

      // Notificar que se eliminó
      if (onExpenseUpdated) onExpenseUpdated();
      onClose();
    } catch (err) {
      console.error("❌ Error al eliminar gasto:", err.message);
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  }

  function handleEdit() {
    setShowEditModal(true);
  }

  function handleEditClose() {
    setShowEditModal(false);
    onClose();
  }

  function handleEditSuccess() {
    setShowEditModal(false);
    if (onExpenseUpdated) onExpenseUpdated();
    onClose();
  }

  if (!isOpen) return null;

  // Mostrar modal de edición
  if (showEditModal) {
    return (
      <AddExpenseModal
        isOpen={true}
        onClose={handleEditClose}
        groupId={expense.grupo_id}
        expenseToEdit={expense}
        onExpenseAdded={handleEditSuccess}
      />
    );
  }

  // Confirmación de eliminación
  if (showDeleteConfirm) {
    return (
      <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2> Eliminar gasto</h2>
          <p>¿Estás seguro de que quieres eliminar este gasto?</p>
          
          <div className="expense-preview">
            <strong>{expense.descripcion}</strong>
            <div className="expense-amount-large">
              {expense.cantidad_total} {expense.moneda || "EUR"}
            </div>
          </div>

          {error && (
            <div className="alert alert-error">
              ❌ {error}
            </div>
          )}

          <div className="modal-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={deleting}
            >
              Cancelar
            </button>
            <button
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Eliminando..." : "Eliminar gasto"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Menú principal: Editar o Eliminar
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-actions-menu" onClick={(e) => e.stopPropagation()}>
        <h2>💰 {expense.descripcion}</h2>
        <p className="expense-detail">
          <strong>{expense.cantidad_total} {expense.moneda || "EUR"}</strong>
          <br />
          <span className="text-muted">
            Pagado por {expense.pagador?.nombre_usuario || "Desconocido"}
          </span>
        </p>

        <div className="action-buttons">
          <button
            className="btn btn-primary btn-block"
            onClick={handleEdit}
          >
             Editar gasto
          </button>
          <button
            className="btn btn-danger btn-block"
            onClick={() => setShowDeleteConfirm(true)}
          >
             Eliminar gasto
          </button>
          <button
            className="btn btn-secondary btn-block"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}