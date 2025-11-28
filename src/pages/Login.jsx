export default function Login() {
  return (
    <div className="center-card">
      <h1 className="title">Inicia sesión en FairShare</h1>

      <div className="form">
        <label>Email</label>
        <input type="email" placeholder="usuario@email.com" />

        <label>Contraseña</label>
        <input type="password" placeholder="••••••••" />

        <button className="btn primary">Iniciar sesión</button>

        <p className="muted" style={{ marginTop: 8 }}>
          ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
}
