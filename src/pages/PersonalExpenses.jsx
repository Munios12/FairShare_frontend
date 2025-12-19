import { useState, useEffect } from "react";
import { Trash2, Plus, Wallet } from "lucide-react";
import useAuth from "../hooks/useAuth";
import {
  createPersonalExpenseRequest,
  getPersonalExpensesRequest,
  deletePersonalExpenseRequest,
} from "../services/personalExpensesService";

export default function PersonalExpenses() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    concepto: "",
    cantidad: "",
  });

  const [expenses, setExpenses] = useState([]);
  const [totalGastado, setTotalGastado] = useState(0);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  async function loadExpenses() {
    setLoadingExpenses(true);
    try {
      const data = await getPersonalExpensesRequest(token);
      setExpenses(data.gastos);
      setTotalGastado(data.total_gastado);
    } catch (err) {
      console.error("❌ Error al cargar gastos:", err.message);
    } finally {
      setLoadingExpenses(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!formData.concepto.trim()) {
        throw new Error("El concepto no puede estar vacío");
      }

      if (!formData.cantidad || parseFloat(formData.cantidad) <= 0) {
        throw new Error("La cantidad debe ser mayor a 0");
      }

      await createPersonalExpenseRequest(token, {
        descripcion: formData.concepto,
        cantidad_total: parseFloat(formData.cantidad),
      });

      setSuccess(true);
      setFormData({ concepto: "", cantidad: "" });

      // Recargar gastos
      await loadExpenses();

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("❌ Error al crear gasto:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(expenseId) {
    try {
      await deletePersonalExpenseRequest(token, expenseId);
      await loadExpenses();
      setExpenseToDelete(null);
    } catch (err) {
      console.error("❌ Error al eliminar gasto:", err.message);
      setError(err.message);
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-section">
          <Wallet className="page-icon" size={32} />
          <div>
            <h1 className="title">Gastos Personales</h1>
            <p className="subtitle">Gestiona tus gastos individuales</p>
          </div>
        </div>
      </div>

      {/* Card de total */}
      <div className="personal-total-card">
        <div className="personal-total-label">Total Gastado</div>
        <div className="personal-total-amount">{totalGastado.toFixed(2)} EUR</div>
      </div>

      {/* Formulario */}
      <div className="card">
        <h2 className="card-title">
          <Plus size={20} />
          Añadir nuevo gasto
        </h2>

        <form onSubmit={handleSubmit} className="personal-expense-form">
          <div className="form-row">
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
          </div>

          {error && (
            <div className="alert alert-error">
              ❌ {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              ✅ Gasto añadido correctamente
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar gasto"}
          </button>
        </form>
      </div>

      {/* Lista de gastos */}
      <div className="card">
        <h2 className="card-title">Tus gastos personales</h2>

        {loadingExpenses ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando gastos...</p>
          </div>
        ) : expenses.length === 0 ? (
          <div className="empty-state">
            <Wallet size={48} className="empty-icon" />
            <p>Aún no has añadido gastos personales</p>
          </div>
        ) : (
          <div className="personal-expenses-grid">
            {expenses.map((expense) => (
              <div key={expense.id} className="personal-expense-card">
                <div className="personal-expense-header">
                  <h3 className="personal-expense-title">
                    {expense.descripcion}
                  </h3>
                  <button
                    className="btn-icon-danger"
                    onClick={() => setExpenseToDelete(expense)}
                    title="Eliminar gasto"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="personal-expense-amount">
                  {expense.cantidad_total.toFixed(2)} {expense.moneda}
                </div>
                <div className="personal-expense-date">
                  {formatDate(expense.fecha_gasto)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {expenseToDelete && (
        <div className="modal-overlay" onClick={() => setExpenseToDelete(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>🗑️ Eliminar gasto</h2>
            <p>¿Estás seguro de que quieres eliminar este gasto?</p>

            <div className="expense-preview">
              <strong>{expenseToDelete.descripcion}</strong>
              <div className="expense-amount-large">
                {expenseToDelete.cantidad_total.toFixed(2)} {expenseToDelete.moneda}
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setExpenseToDelete(null)}
              >
                Cancelar
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(expenseToDelete.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}