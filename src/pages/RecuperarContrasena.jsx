// Importamos el logo de FairShare
import logo from "../assets/img/FairShare_3.png";  

export default function RecuperarContrasena() {
  return (
    <div className="center-card">
      <h1 className="title">Recuperar contraseña de FairShare</h1>
      <img src={logo} alt="FairShare logo" className="auth-logo small" />

      <div className="form">
        <label>Correo electrónico</label>
        <input type="email" placeholder="usuario@email.com" />
        <button className="btn primary">Crear nueva contraseña</button>

        <p className="muted" style={{ marginTop: 8 }}>
          ¿Recuerdas tu contraseña? <a href="/">Volver al login</a>
        </p>
      </div>
    </div>
  );
}
