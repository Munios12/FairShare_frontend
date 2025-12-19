import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { getDashboardDataRequest } from "../services/dashboardService";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [dashboardData, setDashboardData] = useState(null);
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
      const data = await getDashboardDataRequest(token);
      setDashboardData(data);
    } catch (err) {
      console.error("❌ Error al cargar dashboard:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

  if (!dashboardData) {
    return (
      <div className="page-container">
        <p>No hay datos disponibles</p>
      </div>
    );
  }

  const { total_gastado, grupos_activos, balance, grupos, gastos_recientes } = dashboardData;

  const balanceLabel = balance.neto >= 0 ? "Debes recibir" : "Debes pagar";
  const balanceValue = Math.abs(balance.neto);

  return (
    <div>
      {/* TÍTULO PRINCIPAL */}
      <h1 className="title">Bienvenido {user?.nombre_usuario}</h1>

      <div className="stats">
        {/* Tarjeta 1: Total gastado */}
        <div
          className="stat stat--clickable"
          onClick={() => setOpenTotalModal(true)}
        >
          <div className="n">€{total_gastado.toFixed(2)}</div>
          <div className="l">Total gastado</div>
        </div>

        {/* Tarjeta 2: Grupos activos */}
        <div
          className="stat stat--clickable"
          onClick={() => setOpenGroupsModal(true)}
        >
          <div className="n">{grupos_activos}</div>
          <div className="l">Grupos activos</div>
        </div>

        {/* Tarjeta 3: Balance */}
        <div
          className={`stat stat--clickable ${
            balance.neto >= 0 ? "stat--positive" : "stat--negative"
          }`}
          onClick={() => setOpenBalanceModal(true)}
        >
          <div className="n">€{balanceValue.toFixed(2)}</div>
          <div className="l">{balanceLabel}</div>
        </div>
      </div>

      <div className="grid">
        {/* Cards de grupos (primeros 2) */}
        {grupos.slice(0, 2).map((grupo) => (
          <div
            key={grupo.id}
            className="card card--clickable"
            onClick={() => navigate(`/grupos/${grupo.id}`)}
          >
            <div className="card-title">Grupo: {grupo.nombre_grupo}</div>
            <p className="muted">
              {grupo.last_expense ? (
                <>
                  Último gasto: {grupo.last_expense.descripcion} (€
                  {grupo.last_expense.cantidad.toFixed(2)})
                </>
              ) : (
                "Sin gastos aún"
              )}
              <br />
              Participantes: {grupo.members_count}{" "}
              {grupo.members_count === 1 ? "persona" : "personas"}
            </p>
          </div>
        ))}

        {/* Card de gastos recientes */}
        <div className="card">
          <div className="card-title">Gastos recientes</div>
          <ul className="list">
            {gastos_recientes.length > 0 ? (
              gastos_recientes.slice(0, 3).map((gasto) => (
                <li key={gasto.id}>
                  {gasto.descripcion} — €{gasto.cantidad_total.toFixed(2)}
                </li>
              ))
            ) : (
              <li>No hay gastos recientes</li>
            )}
          </ul>
        </div>
      </div>

      <div className="actions">
        <button className="btn primary" onClick={() => navigate("/nuevo-gasto")}>
          ➕ Añadir nuevo gasto
        </button>
        <button className="btn primary" onClick={() => navigate("/grupos")}>
          👥 Ver grupos
        </button>
      </div>

      {/* MODAL: TOTAL GASTADO */}
      {openTotalModal && (
        <div className="modal-overlay" onClick={() => setOpenTotalModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setOpenTotalModal(false)}
            >
              ✕
            </button>

            <h2 className="modal-title">Resumen del gasto</h2>

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

            <div className="modal-total" style={{ marginTop: 12 }}>
              <strong>Total gastado:</strong>
              <strong>€{total_gastado.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: GRUPOS ACTIVOS */}
      {openGroupsModal && (
        <div className="modal-overlay" onClick={() => setOpenGroupsModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setOpenGroupsModal(false)}
            >
              ✕
            </button>

            <h2 className="modal-title">Grupos activos</h2>

            <ul className="modal-list">
              {grupos.map((g) => (
                <li
                  key={g.id}
                  className="modal-group-item"
                  onClick={() => {
                    setOpenGroupsModal(false);
                    navigate(`/grupos/${g.id}`);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div className="modal-group-content">
                    <strong className="modal-group-name">{g.nombre_grupo}</strong>
                    <div className="modal-group-meta">
                      <span>{g.members_count} participantes</span>
                      {g.last_expense && (
                        <span>
                          Último gasto: {g.last_expense.descripcion} (€
                          {g.last_expense.cantidad.toFixed(2)})
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="modal-total-groups" style={{ marginTop: 12 }}>
              <strong>Total grupos activos:</strong>
              <strong>{grupos_activos}</strong>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: BALANCE */}
      {openBalanceModal && (
        <div className="modal-overlay" onClick={() => setOpenBalanceModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setOpenBalanceModal(false)}
            >
              ✕
            </button>

            <h2 className="modal-title">Balance personal</h2>

            {/* TE DEBEN */}
            <div className="balance-section-title balance-section-title--positive">
              <strong>Te deben</strong>
            </div>

            <div className="modal-total" style={{ marginTop: 12 }}>
              <strong>Total te deben:</strong>
              <strong>€{balance.te_deben.toFixed(2)}</strong>
            </div>

            {/* TÚ DEBES */}
            <div className="balance-section-title balance-section-title--negative">
              <strong>Tú debes</strong>
            </div>

            <div className="modal-total" style={{ marginTop: 12 }}>
              <strong>Total debes:</strong>
              <strong>€{balance.debes.toFixed(2)}</strong>
            </div>

            {/* NETO */}
            <div
              className={`modal-total modal-total--net ${
                balance.neto >= 0 ? "net--positive" : "net--negative"
              }`}
              style={{ marginTop: 16 }}
            >
              <strong>
                {balance.neto >= 0 ? "Debes recibir:" : "Debes pagar:"}
              </strong>
              <strong>€{Math.abs(balance.neto).toFixed(2)}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}