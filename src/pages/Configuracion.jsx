import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { updateProfileRequest } from "../services/authService";
import ChangePasswordModal from "../components/ChangePasswordModal";
import DeleteAccountModal from "../components/DeleteAccountModal";

export default function Configuracion() {
  const navigate = useNavigate();
  const { user, token, updateUser } = useAuth();

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre_usuario: user?.nombre_usuario || "",
    email: user?.email || "",
  });

  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Modales
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Manejar cambios en los inputs
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
    setSuccess(false);
  }

  // Guardar cambios de perfil
  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!formData.nombre_usuario.trim()) {
        throw new Error("El nombre de usuario no puede estar vacío");
      }

      if (!formData.email.trim()) {
        throw new Error("El email no puede estar vacío");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("El formato del email no es válido");
      }

      console.log("📤 Enviando actualización de perfil:", formData);

      const updatedUser = await updateProfileRequest(token, {
        nombre_usuario: formData.nombre_usuario,
        email: formData.email,
      });

      console.log("✅ Usuario actualizado:", updatedUser);

      updateUser(updatedUser);
      setSuccess(true);

      setTimeout(() => {
        navigate(-1);
      }, 2000);

    } catch (err) {
      console.error("❌ Error al actualizar perfil:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <Settings className="dashboard-icon" size={32} />
          <div>
            <h1 className="title">Configuración</h1>
            <p className="subtitle">Gestiona tu perfil</p>
          </div>
        </div>
      </div>

      {/* Card del formulario */}
      <div className="form card padded">
        <form onSubmit={handleSave}>
          {/* Nombre */}
          <label htmlFor="nombre_usuario">Nombre</label>
          <input
            type="text"
            id="nombre_usuario"
            name="nombre_usuario"
            value={formData.nombre_usuario}
            onChange={handleChange}
            disabled={loading}
            required
          />

          {/* Correo */}
          <label htmlFor="email">Correo</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            required
          />

          {/* Contraseña */}
          <label>Contraseña</label>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowPasswordModal(true)}
            style={{ width: "100%", marginTop: "0.5rem" }}
          >
            🔒 Cambiar contraseña
          </button>

          {/* Mensajes de error */}
          {error && (
            <div className="alert alert-error" style={{ marginTop: "1rem" }}>
              ❌ {error}
            </div>
          )}

          {/* Mensajes de éxito */}
          {success && (
            <div className="alert alert-success" style={{ marginTop: "1rem" }}>
              ✅ Perfil actualizado correctamente. Redirigiendo...
            </div>
          )}

          {/* Botones de acción */}
          <div className="settings-actions">
            <button 
              type="submit" 
              className="btn save btn-center-text"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
            <button 
              type="button"
              className="btn delete btn-center-text"
              onClick={() => setShowDeleteModal(true)}
              disabled={loading}
            >
              Eliminar cuenta
            </button>
          </div>
        </form>
      </div>

      {/* Modales */}
      <ChangePasswordModal 
        isOpen={showPasswordModal} 
        onClose={() => setShowPasswordModal(false)} 
      />
      <DeleteAccountModal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)} 
      />
    </div>
  );
}