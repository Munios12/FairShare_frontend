// Importamos el logo de FairShare
import logo from "../assets/img/FairShare_3.png";  

export default function Login() {
  return (
    <div className="center-card">
      <h1 className="title">Bienvenido a FairShare</h1>
      <img src={logo} alt="FairShare logo" className="auth-logo" />
      <h2 className="title">Inicia sesión</h2>

      <div className="form">
        <label>Email</label>
        <input type="email" placeholder="usuario@email.com" />

        <label>Contraseña</label>
        <input type="password" placeholder="••••••••" />

        <button className="btn primary">Iniciar sesión</button>

        <p className="muted" style={{ marginTop: 8 }}>
          ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
        </p>
        <p className="muted" style={{ marginTop: 8 }}>
          ¿Olvidaste tu contraseña? <a href="/recuperar">Recuperar Contraseña</a>
        </p>
      </div>
    </div>
  );
}
