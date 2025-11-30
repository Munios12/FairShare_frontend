/**

 * Pantalla de "Configuración de usuario".
 * Respeta exactamente la estructura visual: título → card → formulario → botones.
 *
 * Más adelante esta pantalla se conectará al backend (GET usuario + PUT update + DELETE).
 */

export default function Configuracion() {

  // 🔹 Datos por defecto del mockup (luego vendrán del contexto o backend)
  const usuario = {
    nombre: "Juan Díaz",
    correo: "juan@email.com",
  };

  return (
    <div>
      {/* ----------- Título principal ----------- */}
      <h1 className="title">Configuración</h1>

      {/* ----------- Card blanca del formulario ----------- */}
      <div className="form card padded">

        {/* === Nombre === */}
        <label>Nombre</label>
        <input
          type="text"
          defaultValue={usuario.nombre}
        />

        {/* === Correo === */}
        <label>Correo</label>
        <input
          type="email"
          defaultValue={usuario.correo}
        />

        {/* === Contraseña === */}
        <label>Contraseña</label>
        <input
          type="password"
          placeholder="••••••••"
        />

        {/* === Botones de acción === */}
        <div className="settings-actions">
          <button className="btn save">Guardar cambios</button>
          <button className="btn delete">Eliminar cuenta</button>
        </div>
      </div>
    </div>
  );
}
