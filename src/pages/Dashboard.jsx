import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Home, TrendingUp, Users, Wallet, CreditCard, ArrowUpRight, ArrowDownRight } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { getDashboardDataRequest } from "../services/dashboardService";
import { getBalanceGeneralRequest } from "../services/balanceService";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [dashboardData, setDashboardData] = useState(null);
  const [balanceData, setBalanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modales
  const [openTotalModal, setOpenTotalModal] = useState(false);
  const [openGroupsModal, setOpenGroupsModal] = useState(false);
  const [openBalanceModal, setOpenBalanceModal] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, [token]);

  async function loadDashboard() {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const [dashboard, balance] = await Promise.all([
        getDashboardDataRequest(token),
        getBalanceGeneralRequest(token),
      ]);

      setDashboardData(dashboard);
      setBalanceData(balance);
    } catch (err) {
      console.error("❌ Error al cargar dashboard:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    });
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando dashboard...</p>
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
      </div>
    );
  }

  if (!dashboardData || !balanceData) {
    return (
      <div className="page-container">
        <p>No hay datos disponibles</p>
      </div>
    );
  }

  const {
    total_gastado,
    total_gastado_grupos,
    total_gastado_personal,
    grupos_activos,
    grupos,
    gastos_recientes,
  } = dashboardData;

  const {
    total_debes_recibir,
    total_debes_pagar,
    balance_neto,
  } = balanceData;

  const balanceLabel = balance_neto >= 0 ? "Debes recibir" : "Debes pagar";
  const balanceValue = Math.abs(balance_neto);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <Home className="dashboard-icon" size={32} />
          <div>
            <h1 className="title">¡Hola, {user?.nombre_usuario}! 👋</h1>
            <p className="subtitle">Aquí tienes un resumen de tu actividad</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {/* Total gastado */}
        <div
          className="stat-card stat-card-clickable"
          onClick={() => setOpenTotalModal(true)}
        >
          <div className="stat-card-icon stat-card-icon-primary">
            <TrendingUp size={24} />
          </div>
          <div className="stat-card-content">
            <div className="stat-card-label">Total gastado</div>
            <div className="stat-card-value">€{total_gastado.toFixed(2)}</div>
            <div className="stat-card-detail">
              Personal: €{total_gastado_personal.toFixed(2)} • 
              Grupos: €{total_gastado_grupos.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Grupos activos */}
        <div
          className="stat-card stat-card-clickable"
          onClick={() => setOpenGroupsModal(true)}
        >
          <div className="stat-card-icon stat-card-icon-info">
            <Users size={24} />
          </div>
          <div className="stat-card-content">
            <div className="stat-card-label">Grupos activos</div>
            <div className="stat-card-value">{grupos_activos}</div>
            <div className="stat-card-detail">
              {grupos_activos === 1 ? "grupo" : "grupos"} con actividad
            </div>
          </div>
        </div>

        {/* Balance */}
        <div
          className={`stat-card stat-card-clickable ${
            balance_neto >= 0 ? "stat-card-positive" : "stat-card-negative"
          }`}
          onClick={() => setOpenBalanceModal(true)}
        >
          <div
            className={`stat-card-icon ${
              balance_neto >= 0 ? "stat-card-icon-success" : "stat-card-icon-danger"
            }`}
          >
            <Wallet size={24} />
          </div>
          <div className="stat-card-content">
            <div className="stat-card-label">{balanceLabel}</div>
            <div className="stat-card-value">€{balanceValue.toFixed(2)}</div>
            <div className="stat-card-detail">
              {balance_neto >= 0 ? "A tu favor" : "Pendiente de pagar"}
            </div>
          </div>
        </div>
      </div>

      {/* Grid principal */}
      <div className="dashboard-grid">
        {/* Grupos destacados */}
        {grupos.length > 0 ? (
          grupos.slice(0, 2).map((grupo) => (
            <div
              key={grupo.id}
              className="card card-hover"
              onClick={() => navigate(`/grupos/${grupo.id}`)}
            >
              <div className="card-header">
                <h2 className="card-title">
                  <Users size={20} />
                  {grupo.nombre_grupo}
                </h2>
              </div>
              <div className="card-content">
                <div className="group-info">
                  <div className="group-stat">
                    <span className="group-stat-label">Participantes</span>
                    <span className="group-stat-value">{grupo.members_count}</span>
                  </div>
                  {grupo.last_expense && (
                    <div className="group-last-expense">
                      <div className="group-last-expense-label">Último gasto</div>
                      <div className="group-last-expense-content">
                        <span>{grupo.last_expense.descripcion}</span>
                        <span className="group-last-expense-amount">
                          €{grupo.last_expense.cantidad.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card">
            <div className="empty-state">
              <Users size={48} className="empty-icon" />
              <p>No tienes grupos aún</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/grupos")}
              >
                Crear grupo
              </button>
            </div>
          </div>
        )}

        {/* Gastos recientes */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">💰 Gastos recientes</h2>
          </div>

          {gastos_recientes && gastos_recientes.length > 0 ? (
            <div className="expenses-list-dashboard">
              {gastos_recientes.slice(0, 3).map((expense) => (
                <div
                  key={expense.id}
                  className={`expense-item-dashboard ${
                    expense.es_personal
                      ? "expense-item-personal"
                      : "expense-item-group"
                  }`}
                >
                  {/* Badge de tipo */}
                  <div
                    className={`expense-badge ${
                      expense.es_personal ? "expense-badge-personal" : "expense-badge-group"
                    }`}
                  >
                    {expense.es_personal ? (
                      <>
                        <CreditCard size={14} />
                        <span>Personal</span>
                      </>
                    ) : (
                      <>
                        <Users size={14} />
                        <span>Grupo</span>
                      </>
                    )}
                  </div>

                  {/* Información del gasto */}
                  <div className="expense-content">
                    <div className="expense-description">{expense.descripcion}</div>
                    <div className="expense-meta">
                      {expense.es_personal ? (
                        <span className="expense-meta-text">
                          {formatDate(expense.fecha_gasto)}
                        </span>
                      ) : (
                        <span className="expense-meta-text">
                          {expense.grupo_nombre} • {formatDate(expense.fecha_gasto)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Cantidad */}
                  <div className="expense-amount">
                    {expense.cantidad_total.toFixed(2)} {expense.moneda || "EUR"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Wallet size={48} className="empty-icon" />
              <p>No hay gastos recientes</p>
            </div>
          )}
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="actions-section">
        <button
          className="btn btn-primary btn-center-text"
          onClick={() => navigate("/gastos-personales")}
        >
          💳 Añadir gasto personal
        </button>
        <button className="btn btn-secondary btn-center-text" onClick={() => navigate("/grupos")}>
          👥 Ver todos los grupos
        </button>
      </div>

      {/* MODAL: TOTAL GASTADO */}
      {openTotalModal && (
        <div className="modal-overlay" onClick={() => setOpenTotalModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            <h2 className="modal-title">💰 Resumen del gasto</h2>

            <div className="modal-stats">
              <div className="modal-stat-item">
                <span className="modal-stat-label">Gastos en grupos</span>
                <span className="modal-stat-value">
                  €{total_gastado_grupos.toFixed(2)}
                </span>
              </div>
              <div className="modal-stat-item">
                <span className="modal-stat-label">Gastos personales</span>
                <span className="modal-stat-value">
                  €{total_gastado_personal.toFixed(2)}
                </span>
              </div>
            </div>

            {grupos.length > 0 && (
              <>
                <h3 className="modal-subtitle">Por grupo</h3>
                <ul className="modal-list">
                  {grupos.map((grupo) => (
                    <li key={grupo.id}>
                      <span>{grupo.nombre_grupo}</span>
                      <strong>
                        €
                        {grupo.last_expense
                          ? grupo.last_expense.cantidad.toFixed(2)
                          : "0.00"}
                      </strong>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className="modal-total">
              <strong>Total gastado:</strong>
              <strong>€{total_gastado.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: GRUPOS ACTIVOS */}
      {openGroupsModal && (
        <div className="modal-overlay" onClick={() => setOpenGroupsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>

            <h2 className="modal-title">👥 Grupos activos</h2>

            {grupos.length > 0 ? (
              <ul className="modal-list">
                {grupos.map((g) => (
                  <li
                    key={g.id}
                    className="modal-group-item"
                    onClick={() => {
                      setOpenGroupsModal(false);
                      navigate(`/grupos/${g.id}`);
                    }}
                  >
                    <div className="modal-group-content">
                      <strong className="modal-group-name">{g.nombre_grupo}</strong>
                      <div className="modal-group-meta">
                        <span>{g.members_count} participantes</span>
                        {g.last_expense && (
                          <span>
                            Último: {g.last_expense.descripcion} (€
                            {g.last_expense.cantidad.toFixed(2)})
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-state">
                <p>No tienes grupos activos</p>
              </div>
            )}

            <div className="modal-total">
              <strong>Total grupos:</strong>
              <strong>{grupos_activos}</strong>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: BALANCE */}
      {openBalanceModal && (
        <div className="modal-overlay" onClick={() => setOpenBalanceModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>

            <h2 className="modal-title">💼 Balance personal</h2>

            <div className="balance-sections">
              {/* TE DEBEN */}
              <div className="balance-section balance-section-positive">
                <div className="balance-section-icon">
                  <ArrowUpRight size={24} />
                </div>
                <div className="balance-section-content">
                  <div className="balance-section-header">
                    <strong>Te deben</strong>
                  </div>
                  <div className="balance-section-amount">
                    €{total_debes_recibir.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* TÚ DEBES */}
              <div className="balance-section balance-section-negative">
                <div className="balance-section-icon">
                  <ArrowDownRight size={24} />
                </div>
                <div className="balance-section-content">
                  <div className="balance-section-header">
                    <strong>Tú debes</strong>
                  </div>
                  <div className="balance-section-amount">
                    €{total_debes_pagar.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* NETO */}
            <div
              className={`modal-total modal-total-balance ${
                balance_neto >= 0 ? "balance-positive" : "balance-negative"
              }`}
            >
              <div className="balance-neto-label">
                <strong>
                  {balance_neto >= 0 ? "Debes recibir:" : "Debes pagar:"}
                </strong>
              </div>
              <div className="balance-neto-value">
                <strong>€{Math.abs(balance_neto).toFixed(2)}</strong>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-primary btn-block"
                onClick={() => {
                  setOpenBalanceModal(false);
                  navigate("/balance");
                }}
              >
                Ver balance detallado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}