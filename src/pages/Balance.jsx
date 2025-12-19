import { useState, useEffect } from "react";
import { Wallet, TrendingUp, TrendingDown, Users, ArrowUpRight, ArrowDownRight, ChartColumnStacked } from "lucide-react";
import useAuth from "../hooks/useAuth";
import {
  getBalanceGeneralRequest,
  getGastosPersonalesDetalleRequest,
  getResumenGruposRequest,
} from "../services/balanceService";

export default function Balance() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [balanceGeneral, setBalanceGeneral] = useState(null);
  const [gastosPersonales, setGastosPersonales] = useState([]);
  const [totalPersonal, setTotalPersonal] = useState(0);
  const [resumenGrupos, setResumenGrupos] = useState([]);

  useEffect(() => {
    loadBalanceData();
  }, []);

  async function loadBalanceData() {
    setLoading(true);
    setError(null);

    try {
      const [balance, personal, grupos] = await Promise.all([
        getBalanceGeneralRequest(token),
        getGastosPersonalesDetalleRequest(token),
        getResumenGruposRequest(token),
      ]);

      setBalanceGeneral(balance);
      setGastosPersonales(personal.gastos);
      setTotalPersonal(personal.total);
      setResumenGrupos(grupos.grupos);
    } catch (err) {
      console.error("❌ Error al cargar balance:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando balance...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="alert alert-error">❌ {error}</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="balance-header">
        <div className="balance-title-section">
          <ChartColumnStacked className="balance-icon" size={36} />
          <div>
            <h1 className="title">Balance Personal</h1>
            <p className="subtitle">Resumen completo de tus finanzas</p>
          </div>
        </div>
      </div>

      {/* Cards de resumen */}
      <div className="balance-summary-grid">
        {/* Total gastado */}
        <div className="balance-summary-card balance-card-primary">
          <div className="balance-card-icon">
            <TrendingUp size={24} />
          </div>
          <div className="balance-card-content">
            <div className="balance-card-label">Total Gastado</div>
            <div className="balance-card-value">
              €{balanceGeneral?.total_gastado.toFixed(2)}
            </div>
            <div className="balance-card-detail">
              Personal: €{balanceGeneral?.total_gastado_personal.toFixed(2)} • 
              Grupos: €{balanceGeneral?.total_gastado_grupos.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Te deben */}
        <div className="balance-summary-card balance-card-success">
          <div className="balance-card-icon">
            <ArrowUpRight size={24} />
          </div>
          <div className="balance-card-content">
            <div className="balance-card-label">Te Deben</div>
            <div className="balance-card-value">
              €{balanceGeneral?.total_debes_recibir.toFixed(2)}
            </div>
            <div className="balance-card-detail">Dinero a recibir</div>
          </div>
        </div>

        {/* Tú debes */}
        <div className="balance-summary-card balance-card-danger">
          <div className="balance-card-icon">
            <ArrowDownRight size={24} />
          </div>
          <div className="balance-card-content">
            <div className="balance-card-label">Tú Debes</div>
            <div className="balance-card-value">
              €{balanceGeneral?.total_debes_pagar.toFixed(2)}
            </div>
            <div className="balance-card-detail">Dinero a pagar</div>
          </div>
        </div>

        {/* Balance neto */}
        <div
          className={`balance-summary-card ${
            balanceGeneral?.balance_neto >= 0
              ? "balance-card-success-alt"
              : "balance-card-danger-alt"
          }`}
        >
          <div className="balance-card-icon">
            <Wallet size={24} />
          </div>
          <div className="balance-card-content">
            <div className="balance-card-label">Balance Neto</div>
            <div className="balance-card-value">
              €{Math.abs(balanceGeneral?.balance_neto || 0).toFixed(2)}
            </div>
            <div className="balance-card-detail">
              {balanceGeneral?.balance_neto >= 0 ? "A tu favor" : "En contra"}
            </div>
          </div>
        </div>
      </div>

      {/* GASTOS PERSONALES */}
      <div className="balance-section">
        <div className="balance-section-header">
          <div className="balance-section-title">
            <Wallet size={24} className="section-icon" />
            <h2> Gastos Personales</h2>
          </div>
          <div className="balance-section-total">
            Total: <strong>€{totalPersonal.toFixed(2)}</strong>
          </div>
        </div>

        <div className="balance-table-container">
          {gastosPersonales.length === 0 ? (
            <div className="empty-state">
              <Wallet size={48} className="empty-icon" />
              <p>No tienes gastos personales registrados</p>
            </div>
          ) : (
            <table className="balance-table">
              <thead>
                <tr>
                  <th>Concepto</th>
                  <th>Cantidad</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {gastosPersonales.map((gasto) => (
                  <tr key={gasto.id}>
                    <td className="table-concept">{gasto.descripcion}</td>
                    <td className="table-amount">
                      €{gasto.cantidad.toFixed(2)} {gasto.moneda}
                    </td>
                    <td className="table-date">{formatDate(gasto.fecha)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="table-footer-label">Total Personal</td>
                  <td className="table-footer-amount" colSpan="2">
                    €{totalPersonal.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>

      {/* BALANCE DE GRUPOS */}
      <div className="balance-section">
        <div className="balance-section-header">
          <div className="balance-section-title">
            <Users size={24} className="section-icon" />
            <h2> Balance por Grupos</h2>
          </div>
        </div>

        <div className="balance-table-container">
          {resumenGrupos.length === 0 ? (
            <div className="empty-state">
              <Users size={48} className="empty-icon" />
              <p>No participas en ningún grupo</p>
            </div>
          ) : (
            <table className="balance-table balance-table-groups">
              <thead>
                <tr>
                  <th>Grupo</th>
                  <th>Aportado</th>
                  <th>Debes</th>
                  <th>Te Deben</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {resumenGrupos.map((grupo) => (
                  <tr key={grupo.grupo_id}>
                    <td className="table-group-name">
                      <div className="group-name-badge">
                        {grupo.nombre_grupo}
                      </div>
                    </td>
                    <td className="table-amount">€{grupo.total_aportado.toFixed(2)}</td>
                    <td className="table-amount-negative">
                      €{grupo.total_debe.toFixed(2)}
                    </td>
                    <td className="table-amount-positive">
                      €{grupo.total_recibe.toFixed(2)}
                    </td>
                    <td
                      className={`table-balance ${
                        grupo.balance_neto >= 0
                          ? "table-balance-positive"
                          : "table-balance-negative"
                      }`}
                    >
                      {grupo.balance_neto >= 0 ? "+" : ""}€
                      {grupo.balance_neto.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}