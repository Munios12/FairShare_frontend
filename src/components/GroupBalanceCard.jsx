import { useState, useEffect } from "react";
import { TrendingUp, ArrowRight, Users, AlertCircle } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { getBalanceWithTransactionsRequest } from "../services/balanceService";

export default function GroupBalanceCard({ groupId }) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [balanceData, setBalanceData] = useState(null);

  useEffect(() => {
    if (groupId) {
      loadBalance();
    }
  }, [groupId]);

  async function loadBalance() {
    setLoading(true);
    setError(null);

    try {
      const data = await getBalanceWithTransactionsRequest(token, groupId);
      setBalanceData(data);
    } catch (err) {
      console.error("❌ Error al cargar balance:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="card-header">
          <h2>💰 Balance del grupo</h2>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Calculando balance...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-header">
          <h2>💰 Balance del grupo</h2>
        </div>
        <div className="alert alert-error">
          <AlertCircle size={20} />
          {error}
        </div>
      </div>
    );
  }

  if (!balanceData) {
    return null;
  }

  const { members, transactions } = balanceData;

  return (
    <div className="card group-balance-card">
      <div className="card-header">
        <h2>
          <TrendingUp size={20} />
          Balance del grupo
        </h2>
      </div>

      {/* Resumen de miembros */}
      <div className="balance-members-section">
        <h3 className="balance-subtitle">
          <Users size={18} />
          Resumen por miembro
        </h3>

        <div className="balance-members-grid">
          {members.map((member) => (
            <div
              key={member.usuario_id}
              className={`balance-member-card ${
                member.balance_neto > 0
                  ? "balance-positive"
                  : member.balance_neto < 0
                  ? "balance-negative"
                  : "balance-neutral"
              }`}
            >
              <div className="balance-member-header">
                <div className={`avatar avatar--${member.avatar_color || "teal"}`}>
                  {member.nombre_usuario.charAt(0).toUpperCase()}
                </div>
                <div className="balance-member-info">
                  <div className="balance-member-name">{member.nombre_usuario}</div>
                  <div className="balance-member-status">
                    {member.balance_neto > 0 && (
                      <span className="balance-status-positive">
                        Le deben €{member.balance_neto.toFixed(2)}
                      </span>
                    )}
                    {member.balance_neto < 0 && (
                      <span className="balance-status-negative">
                        Debe €{Math.abs(member.balance_neto).toFixed(2)}
                      </span>
                    )}
                    {member.balance_neto === 0 && (
                      <span className="balance-status-neutral">
                        Sin deudas
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="balance-member-details">
                <div className="balance-detail-item">
                  <span className="balance-detail-label">Aportado</span>
                  <span className="balance-detail-value">
                    €{member.total_aportado.toFixed(2)}
                  </span>
                </div>
                <div className="balance-detail-item">
                  <span className="balance-detail-label">Debe pagar</span>
                  <span className="balance-detail-value balance-detail-negative">
                    €{member.total_debe.toFixed(2)}
                  </span>
                </div>
                <div className="balance-detail-item">
                  <span className="balance-detail-label">Le deben</span>
                  <span className="balance-detail-value balance-detail-positive">
                    €{member.total_recibe.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transacciones sugeridas */}
      <div className="balance-transactions-section">
        <h3 className="balance-subtitle">
          <ArrowRight size={18} />
          Transacciones para saldar cuentas
        </h3>

        {transactions.length === 0 ? (
          <div className="balance-settled">
            <div className="balance-settled-icon">✅</div>
            <div className="balance-settled-text">
              <strong>¡Todo está saldado!</strong>
              <p>No hay deudas pendientes en este grupo</p>
            </div>
          </div>
        ) : (
          <div className="balance-transactions-list">
            {transactions.map((transaction, index) => (
              <div key={index} className="balance-transaction-item">
                <div className="transaction-from">
                  <div className={`avatar avatar-small avatar--${transaction.de_avatar || "teal"}`}>
                    {transaction.de.charAt(0).toUpperCase()}
                  </div>
                  <span className="transaction-name">{transaction.de}</span>
                </div>

                <div className="transaction-arrow">
                  <ArrowRight size={20} />
                </div>

                <div className="transaction-amount">
                  €{transaction.cantidad.toFixed(2)}
                </div>

                <div className="transaction-arrow">
                  <ArrowRight size={20} />
                </div>

                <div className="transaction-to">
                  <div className={`avatar avatar-small avatar--${transaction.a_avatar || "teal"}`}>
                    {transaction.a.charAt(0).toUpperCase()}
                  </div>
                  <span className="transaction-name">{transaction.a}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}