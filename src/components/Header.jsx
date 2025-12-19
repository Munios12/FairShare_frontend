// Importamos el hook de navegación
import { useNavigate } from "react-router-dom";

// Importamos React hooks
import { useEffect, useRef, useState } from "react";

// Importamos el hook de Auth para poder hacer logout y actualizar usuario
import useAuth from "../hooks/useAuth";

// Importamos el logo de FairShare
import logo from "../assets/img/FairShare_3.png";

// Importamos el servicio para actualizar el avatar
import { updateAvatarRequest } from "../services/authService";

// Componente Header: barra superior fija en toda la aplicación
export default function Header() {
  const navigate = useNavigate();
  const { user, token, logout, updateUser } = useAuth();
  console.log("HEADER → TOKEN ACTUAL:", token);

  const [openUserMenu, setOpenUserMenu] = useState(false);

  const userName = user?.nombre_usuario || "Invitado";
  const userEmail = user?.email || "—";
  const userRole = user?.role || "user";

  const initials = user?.nombre_usuario
    ? user.nombre_usuario
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join("")
    : "FS";

  const avatarColor = user?.avatar_color || "teal";

  const colorOptions = [
    { id: "teal", label: "Turquesa" },
    { id: "blue", label: "Azul" },
    { id: "purple", label: "Morado" },
    { id: "pink", label: "Rosa" },
    { id: "yellow", label: "Amarillo" },
    { id: "red", label: "Rojo" },
  ];

  const userMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setOpenUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") setOpenUserMenu(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  function handleLogout() {
    logout();
    setOpenUserMenu(false);
    navigate("/", { replace: true });
  }

  // Cambio de color 
  async function handleAvatarChange(color) {
    try {
      console.log("🎨 Intentando cambiar color a:", color);
      console.log("🎫 Token que se enviará:", token); 
      
      const res = await updateAvatarRequest(token, color);
      if (res && res.user) {
        updateUser(res.user);
      }
    } catch (err) {
      console.error("❌ Error al actualizar avatar:", err.message);
    }
  }

  return (
    <header className="header">
      <div className="brand">
        <img src={logo} alt="FairShare logo" className="brand-logo" />
        <span className="logo-text">FairShare</span>
      </div>

      <div className="header-right">
        <div className="user-menu" ref={userMenuRef}>
          <button
            type="button"
            className="user-trigger"
            onClick={() => setOpenUserMenu((prev) => !prev)}
            aria-haspopup="menu"
            aria-expanded={openUserMenu}
          >
            <div className={`avatar avatar--${avatarColor}`}>{initials}</div>
            <span className="user-name">{userName}</span>
          </button>

          {openUserMenu && (
            <div className="user-dropdown" role="menu">
              <div className="user-dropdown-name">{userName}</div>
              <div className="user-dropdown-email">{userEmail}</div>
              <div className={`user-dropdown-role ${userRole}`}>
                {userRole}
              </div>

              <div className="user-dropdown-sep" />
              <div className="user-dropdown-label">Color del avatar</div>

              <div className="color-grid">
                {colorOptions.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`color-pick color-pick--${c.id} ${
                      avatarColor === c.id ? "active" : ""
                    }`}
                    onClick={() => handleAvatarChange(c.id)}
                    title={c.label}
                    aria-label={`Color ${c.label}`}
                  />
                ))}
              </div>

              <div className="user-dropdown-sep" />

              <button
                type="button"
                className="user-dropdown-item danger"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>

        <button className="btn ghost" onClick={() => navigate("/config")}>
          ⚙️ Ajustes
        </button>
      </div>
    </header>
  );
}
