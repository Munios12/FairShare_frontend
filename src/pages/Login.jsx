// Importamos React hooks
import { useState } from "react";

// Importamos navegación
import { useNavigate } from "react-router-dom";

// Importamos Auth
import useAuth from "../hooks/useAuth";

// Importamos servicio real de backend
import { loginRequest } from "../services/authService";

// Importamos el logo de FairShare
import logo from "../assets/img/FairShare_3.png";

export default function Login() {
  const navigate = useNavigate();

  // AuthContext
  const { login } = useAuth();

  // Estados del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // SUBMIT 
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      // El backend devuelve { token, user } 
      const { token, user } = await loginRequest({ email, password });

      // Guardar token + user
      login(user, token);

      // Redirigir
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
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

        {error && <p className="error">{error}</p>}

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
