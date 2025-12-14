// Componente Dashboard: pantalla principal que ve el usuario al iniciar sesión
// Aquí mostramos estadísticas, resúmenes de grupos y últimos gastos.

import { useNavigate } from "react-router-dom"; // Hook para navegar a otra ruta manteniendo <button>

export default function Dashboard() {
  // Inicializamos navigate para poder redirigir al usuario al pulsar botones
  const navigate = useNavigate();

  return (
    <div>
      {/* TÍTULO PRINCIPAL DE LA PÁGINA */}
      <h1 className="title">Dashboard – Inicio</h1>

      <div className="stats">
        {/* Tarjeta 1: Total gastado */}
        <div className="stat">
          <div className="n">€247,50</div>
          <div className="l">Total gastado</div> 
        </div>

        {/* Tarjeta 2: Cantidad de grupos activos */}
        <div className="stat">
          <div className="n">3</div>
          <div className="l">Grupos activos</div>
        </div>

        {/* Tarjeta 3: Dinero que debe recibir el usuario */}
        <div className="stat">
          <div className="n">€82,30</div>
          <div className="l">Debes recibir</div>
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
    </div>
  );
}
