// Importamos React hooks
import { useState } from "react";

// Importamos navegación
import { useNavigate } from "react-router-dom";

// Importamos Auth
import useAuth from "../hooks/useAuth";

// Importamos el logo de FairShare
import logo from "../assets/img/FairShare_3.png";

export default function Login() {
  // Navegación
  const navigate = useNavigate();

  // Auth
  const { login } = useAuth();

  // Estados del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Manejo del submit
  function handleSubmit(e) {
    e.preventDefault();

    // Credenciales fake de desarrollo
    if (email === "test@fairshare.com" && password === "1234") {
      setError(""); // ✅ limpiamos error si venía de un intento anterior
      login(email, password); // crea usuario en AuthContext
      navigate("/dashboard", { replace: true }); // entra a la app
    } else {
      setError("Credenciales incorrectas");
    }
  }

  return (
    <div className="center-card">
      <h1 className="title">Bienvenido a FairShare</h1>
      <img src={logo} alt="FairShare logo" className="auth-logo" />
      <h2 className="title">Inicia sesión</h2>

      <form className="form" onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          placeholder="usuario@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Contraseña</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Mensaje de error */}
        {error && <p className="error">{error}</p>}

        {/* ✅ importante: submit */}
        <button className="btn primary" type="submit">
          Iniciar sesión
        </button>

        <p className="muted" style={{ marginTop: 8 }}>
          ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
        </p>
        <p className="muted" style={{ marginTop: 8 }}>
          ¿Olvidaste tu contraseña? <a href="/recuperar">Recuperar Contraseña</a>
        </p>
      </form>
    </div>
  );
}
