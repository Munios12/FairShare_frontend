import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { registerRequest } from "../services/authService";
import logo from "../assets/img/FairShare_3.png";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      
      const { user } = await registerRequest({
        name,
        email,
        password,
      });

      login(user, ""); // inicia sesión tras registrar

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Error al registrarse");
    }
  }

  return (
    <div className="center-card">
      <h1 className="title">Crear cuenta en FairShare</h1>
      <img src={logo} alt="FairShare logo" className="auth-logo small" />

      <form className="form" onSubmit={handleSubmit}>
        <label>Nombre completo</label>
        <input
          type="text"
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Correo electrónico</label>
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
          Registrarme
        </button>

        <p className="muted" style={{ marginTop: 8 }}>
          ¿Ya tienes cuenta? <a href="/">Volver al login</a>
        </p>
      </form>
    </div>
  );
}