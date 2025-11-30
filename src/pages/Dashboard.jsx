// Componente Dashboard: pantalla principal que ve el usuario al iniciar sesión
// Aquí mostramos estadísticas, resúmenes de grupos y últimos gastos.

export default function Dashboard() {
  return (
    <div>

      {/* TÍTULO PRINCIPAL DE LA PÁGINA */}
      {/* Coincide exactamente con el mockup original */}
      <h1 className="title">Dashboard – Inicio</h1>


      {/* ============================== */}
      {/*   TARJETAS DE ESTADÍSTICAS     */}
      {/* ============================== */}
      {/* Se muestran 3 tarjetas: 
          - Total gastado
          - Grupos activos
          - Dinero que debe recibir el usuario
          
          Ahora mismo están estáticas (mockup),
          pero más adelante recibirán datos reales desde el backend.
      */}
      <div className="stats">

        {/* Tarjeta 1: Total gastado */}
        <div className="stat">
          <div className="n">€247,50</div>   {/* Número grande */}
          <div className="l">Total gastado</div> {/* Etiqueta descriptiva */}
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



      {/* ============================== */}
      {/*   GRID DE TARJETAS INFORMATIVAS */}
      {/* ============================== */}
      {/* Cada card muestra información útil:
          - Resumen del grupo "Viaje a Barcelona"
          - Resumen del grupo "Piso compartido"
          - Lista de gastos recientes
          
          Igual que las stats, estas cards más adelante recibirán datos reales.
      */}
      <div className="grid">

        {/* CARD 1: Grupo "Viaje a Barcelona" */}
        <div className="card">
          <div className="card-title">Grupo: Viaje a Barcelona</div>
          <p className="muted">
            Último gasto: Cena restaurante (€45,00)<br />
            Participantes: 4 personas<br />
            Balance: Debes €12,50
          </p>
        </div>

        {/* CARD 2: Grupo "Piso compartido" */}
        <div className="card">
          <div className="card-title">Grupo: Piso compartido</div>
          <p className="muted">
            Último gasto: Supermercado (€67,80)<br />
            Participantes: 3 personas<br />
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



      {/* ============================== */}
      {/*      BOTONES DE ACCIÓN         */}
      {/* ============================== */}
      {/* Dos botones principales:
          - Añadir nuevo gasto
          - Crear grupo
          
          Más adelante estarán conectados a sus rutas (/nuevo-gasto y /grupos)
      */}
      <div className="actions">

        {/* Botón verde → añadir gasto */}
        <button className="btn primary">➕ Añadir nuevo gasto</button>

        {/* Botón outline → crear grupo */}
        <button className="btn outline">👥 Crear grupo</button>

      </div>

    </div>
  );
}
