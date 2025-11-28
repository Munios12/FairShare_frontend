export default function Register() {
  return (
    <div className="center-card">
      <h1 className="title">Crear cuenta en FairShare</h1>

      <div className="form">
        <label>Nombre completo</label>
        <input type="text" placeholder="Tu nombre" />

        <label>Correo electrónico</label>
        <input type="email" placeholder="usuario@email.com" />

        <label>Contraseña</label>
        <input type="password" placeholder="••••••••" />

        <button className="btn primary">Registrarme</button>

        <p className="muted" style={{ marginTop: 8 }}>
          ¿Ya tienes cuenta? <a href="/login">Volver al login</a>
        </p>
      </div>
    </div>
  );
}
