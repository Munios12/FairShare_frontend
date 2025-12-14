export default function Balance() {
  // Datos estáticos temporales 
  //   Más adelante los conectaremos con el backend y con el contexto global.
  const usuarios = [
    { nombre: "Juan", debe: 0, recibe: 0 },
    { nombre: "Luismi", debe: 0, recibe: 0 },
    { nombre: "Alex", debe: 0, recibe: 0 },
    { nombre: "Jesús", debe: 0, recibe: 0 }
  ];

  return (
    <div>
      {/* Título principal de la página */}
      <h1 className="title">Balance general</h1>

      {/* Contenedor principal tipo tarjeta  */}
      <div className="card padded">
        <table className="table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Debe (€)</th>
              <th>Recibe (€)</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((u) => (
              <tr key={u.nombre}>
                {/* Nombre de usuario */}
                <td>{u.nombre}</td>

                {/* Cantidad que debe (en rojo) */}
                <td className="neg">€{u.debe.toFixed(2)}</td>

                {/* Cantidad que recibe (en verde) */}
                <td className="pos">€{u.recibe.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/*  BOTÓN "DESCARGAR REPORTE"     */}
        <div className="actions end">
          <button className="btn outline">Descargar reporte</button>
        </div>
      </div>
    </div>
  );
}
