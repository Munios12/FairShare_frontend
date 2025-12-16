import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Dashboard() {
  // Inicializamos navigate para poder redirigir al usuario al pulsar botones
  const navigate = useNavigate();

  // Modal "Total gastado"
  const [openTotalModal, setOpenTotalModal] = useState(false);

  // Modal "Grupos activos"
  const [openGroupsModal, setOpenGroupsModal] = useState(false);

  // Modal "Balance (Debes recibir / pagar)"
  const [openBalanceModal, setOpenBalanceModal] = useState(false);

  const gastosResumen = [
    { label: "Viaje a Barcelona", amount: 112.3 },
    { label: "Piso compartido", amount: 95.2 },
    { label: "Otros", amount: 40 },
  ];

  // Total gastado calculado a partir de los datos simulados
  const totalGastado = gastosResumen.reduce((acc, item) => acc + item.amount, 0);

  // Datos FAKE de grupos activos
  const gruposActivos = [
    {
      id: 1,
      name: "Viaje a Barcelona",
      participants: 4,
      lastExpense: "Cena restaurante (€45,00)",
    },
    {
      id: 2,
      name: "Piso compartido",
      participants: 3,
      lastExpense: "Supermercado (€67,80)",
    },
    {
      id: 3,
      name: "Cumpleaños Marta",
      participants: 6,
      lastExpense: "Cena pizza (€28,50)",
    },
  ];

  //  DATOS FAKE DE BALANCE 
  const peopleOweYou = [
    { name: "Alex", amount: 22.6 },
    { name: "Jesús", amount: 15.0 },
    { name: "Marta", amount: 44.7 },
  ];

  const youOwePeople = [
    { name: "Juan", amount: 12.5 },
    { name: "Nicky", amount: 6.5 },
  ];

  const totalTeDeben = peopleOweYou.reduce((acc, p) => acc + p.amount, 0);
  const totalDebes = youOwePeople.reduce((acc, p) => acc + p.amount, 0);

  // Neto: positivo => recibes, negativo => pagas
  const neto = totalTeDeben - totalDebes;

  const balanceLabel = neto >= 0 ? "Debes recibir" : "Debes pagar";
  const balanceValue = Math.abs(neto);

  return (
    <div>
      {/* TÍTULO PRINCIPAL DE LA PÁGINA */}
      <h1 className="title">Dashboard – Inicio</h1>

      <div className="stats">
        {/* Tarjeta 1: Total gastado */}
        <div
          className="stat stat--clickable"
          onClick={() => setOpenTotalModal(true)}
        >
          <div className="n">€247,50</div>
          <div className="l">Total gastado</div>
        </div>

        {/* Tarjeta 2: Cantidad de grupos activos */}
        <div
          className="stat stat--clickable"
          onClick={() => setOpenGroupsModal(true)}
        >
          <div className="n">3</div>
          <div className="l">Grupos activos</div>
        </div>

        {/* Tarjeta 3: Dinero que debe recibir / pagar el usuario */}
        <div
          className={`stat stat--clickable ${neto >= 0 ? "stat--positive" : "stat--negative"}`}
          onClick={() => setOpenBalanceModal(true)}
        >
          <div className="n">€{balanceValue.toFixed(2)}</div>
          <div className="l">{balanceLabel}</div>
        </div>
      </div>

      <div className="grid">
        {/* CARD 1: Grupo "Viaje a Barcelona" */}
        <div className="card">
          <div className="card-title">Grupo: Viaje a Barcelona</div>
          <p className="muted">
            Último gasto: Cena restaurante (€45,00)
            <br />
            Participantes: 4 personas
            <br />
            Balance: Debes €12,50
          </p>
        </div>

        {/* CARD 2: Grupo "Piso compartido" */}
        <div className="card">
          <div className="card-title">Grupo: Piso compartido</div>
          <p className="muted">
            Último gasto: Supermercado (€67,80)
            <br />
            Participantes: 3 personas
            <br />
            Balance: Te deben €22,60
          </p>
        </div>

        {/* CARD 3: Lista de últimos gastos */}
        <div className="card">
          <div className="card-title">Gastos recientes</div>

          {/* Lista simple de 3 items */}
          <ul className="list">
            <li>Gasolina – €35,00</li>
            <li>Cena pizza – €28,50</li>
            <li>Supermercado – €67,80</li>
          </ul>
        </div>
      </div>

      <div className="actions">
        {/* Botón verde → añadir gasto */}
        <button
          className="btn primary"
          onClick={() => navigate("/nuevo-gasto")} // Navega a la pantalla de “Añadir gasto”
        >
          ➕ Añadir nuevo gasto
        </button>

        {/* Botón → crear grupo */}
        <button
          className="btn primary"
          onClick={() => navigate("/grupos")} // Navega a la pantalla de “GruposS”
        >
          👥 Crear grupo
        </button>
      </div>

      {/*   MODAL: RESUMEN TOTAL GASTADO  */}
      {openTotalModal && (
        <div className="modal-overlay" onClick={() => setOpenTotalModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setOpenTotalModal(false)}
              aria-label="Cerrar"
            >
              ✕
            </button>

            <h2 className="modal-title">Resumen del gasto</h2>

            {/* Datos FAKE  */}
            <ul className="modal-list">
              {gastosResumen.map((item) => (
                <li key={item.label}>
                  <span>{item.label}</span>
                  <strong>€{item.amount.toFixed(2)}</strong>
                </li>
              ))}
            </ul>

            {/* Total calculado */}
            <div className="modal-total" style={{ marginTop: 12 }}>
              <strong>Total gastado:</strong>
              <strong>€{totalGastado.toFixed(2)}</strong>
            </div>

            <p className="muted" style={{ marginTop: 12 }}></p>
          </div>
        </div>
      )}

      {/* MODAL: GRUPOS ACTIVOS */}
      {openGroupsModal && (
        <div
          className="modal-overlay"
          onClick={() => setOpenGroupsModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setOpenGroupsModal(false)}
              aria-label="Cerrar"
            >
              ✕
            </button>

            <h2 className="modal-title">Grupos activos</h2>

            {/* Datos FAKE  */}
            <ul className="modal-list">
              {gruposActivos.map((g) => (
                <li key={g.id} className="modal-group-item">
                  <div className="modal-group-content">
                    <strong className="modal-group-name">{g.name}</strong>

                    <div className="modal-group-meta">
                      <span>{g.participants} participantes</span>
                      <span>Último gasto: {g.lastExpense}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="modal-total-groups" style={{ marginTop: 12 }}>
              <strong>Total grupos activos:</strong>
              <strong>{gruposActivos.length}</strong>
            </div>

            <p className="muted" style={{ marginTop: 12 }}></p>
          </div>
        </div>
      )}

      {/* MODAL: BALANCE (Debes recibir / pagar) */}
      {openBalanceModal && (
        <div
          className="modal-overlay"
          onClick={() => setOpenBalanceModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setOpenBalanceModal(false)}
              aria-label="Cerrar"
            >
              ✕
            </button>

            <h2 className="modal-title">Balance personal</h2>

            {/* TE DEBEN */}
            <div className="balance-section-title balance-section-title--positive">
              <strong>Te deben</strong>
            </div>

            <ul className="modal-list">
              {peopleOweYou.length === 0 ? (
                <li>
                  <span className="balance-empty">Nadie te debe dinero</span>
                  <strong>€0.00</strong>
                </li>
              ) : (
                peopleOweYou.map((p) => (
                  <li key={`owed-${p.name}`}>
                    <span>{p.name}</span>
                    <strong>€{p.amount.toFixed(2)}</strong>
                  </li>
                ))
              )}
            </ul>

            <div className="modal-total" style={{ marginTop: 12 }}>
              <strong>Total te deben:</strong>
              <strong>€{totalTeDeben.toFixed(2)}</strong>
            </div>

            {/* TÚ DEBES */}
            <div className="balance-section-title balance-section-title--negative">
              <strong>Tú debes</strong>
            </div>

            <ul className="modal-list">
              {youOwePeople.length === 0 ? (
                <li>
                  <span className="balance-empty">No debes dinero a nadie</span>
                  <strong>€0.00</strong>
                </li>
              ) : (
                youOwePeople.map((p) => (
                  <li key={`owe-${p.name}`}>
                    <span>{p.name}</span>
                    <strong>€{p.amount.toFixed(2)}</strong>
                  </li>
                ))
              )}
            </ul>

            <div className="modal-total" style={{ marginTop: 12 }}>
              <strong>Total debes:</strong>
              <strong>€{totalDebes.toFixed(2)}</strong>
            </div>

            {/* NETO (verde si recibes / rojo si pagas) */}
            <div
              className={`modal-total modal-total--net ${
                neto >= 0 ? "net--positive" : "net--negative"
              }`}
              style={{ marginTop: 16 }}
            >
              <strong>{neto >= 0 ? "Debes recibir:" : "Debes pagar:"}</strong>
              <strong>€{Math.abs(neto).toFixed(2)}</strong>
            </div>

            <p className="muted" style={{ marginTop: 12 }}></p>
          </div>
        </div>
      )}
    </div>
  );
}
