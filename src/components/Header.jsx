// Importamos el hook de navegación
import { useNavigate } from "react-router-dom";

// Importamos React hooks
import { useEffect, useRef, useState } from "react";

// Importamos el hook de Auth para poder hacer logout y actualizar usuario
import useAuth from "../hooks/useAuth";

// Importamos el logo de FairShare
import logo from "../assets/img/FairShare_3.png";

// Componente Header: barra superior fija en toda la aplicación
export default function Header() {
  // Hook para navegar por rutas
  const navigate = useNavigate();

  // Auth
  const { user, logout, updateUser } = useAuth();

  // Dropdown usuario
  const [openUserMenu, setOpenUserMenu] = useState(false);

  // Nombre/email/rol (si no hay user, placeholders)
  const userName = user?.name || "Invitado";
  const userEmail = user?.email || "—";
  const userRole = user?.role || "user"; // backend en el futuro: "admin" | "user"

  // Iniciales dinámicas desde el nombre
  const initials = user?.name
    ? user.name
        .trim()
        .split(/\s+/)              // separa por espacios
        .filter(Boolean)
        .slice(0, 2)               // máximo 2 palabras → 2 iniciales
        .map((w) => w[0].toUpperCase())
        .join("")
    : "FS";

  // Color del avatar DESDE el usuario (persistente)
  const avatarColor = user?.avatarColor || "teal";

  // Colores disponibles
  const colorOptions = [
    { id: "teal", label: "Turquesa" },
    { id: "blue", label: "Azul" },
    { id: "purple", label: "Morado" },
    { id: "pink", label: "Rosa" },
    { id: "yellow", label: "Amarillo" },
    { id: "red", label: "Rojo" },
  ];

  // Ref para detectar click fuera
  const userMenuRef = useRef(null);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setOpenUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cerrar menú con Escape
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") setOpenUserMenu(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Cerrar sesión
  function handleLogout() {
    logout();
    setOpenUserMenu(false);
    navigate("/", { replace: true });
  }

  return (
    <header className="header">
      {/* === BRAND: LOGO + NOMBRE === */}
      <div className="brand">
        <img src={logo} alt="FairShare logo" className="brand-logo" />
        <span className="logo-text">FairShare</span>
      </div>

      {/* === ZONA DERECHA: usuario + ajustes === */}
      <div className="header-right">
        {/* Usuario con desplegable */}
        <div className="user-menu" ref={userMenuRef}>
          <button
            type="button"
            className="user-trigger"
            onClick={() => setOpenUserMenu((prev) => !prev)}
            aria-haspopup="menu"
            aria-expanded={openUserMenu}
          >
            {/* Avatar con iniciales dinámicas + color persistente */}
            <div className={`avatar avatar--${avatarColor}`}>{initials}</div>
            <span className="user-name">{userName}</span>
          </button>

          {openUserMenu && (
            <div className="user-dropdown" role="menu">
              {/* Nombre */}
              <div className="user-dropdown-name">{userName}</div>

              {/* Email debajo del nombre */}
              <div className="user-dropdown-email">{userEmail}</div>

              {/* Rol visible  */}
              {/* Rol visible */}
              <div className={`user-dropdown-role ${userRole}`}>
                {userRole}
              </div>

              <div className="user-dropdown-sep" />


              {/* Selector de color */}
              <div className="user-dropdown-label">Color del avatar</div>

              <div className="color-grid">
                {colorOptions.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`color-pick color-pick--${c.id} ${
                      avatarColor === c.id ? "active" : ""
                    }`}
                    onClick={() => updateUser({ avatarColor: c.id })}
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

        {/* Botón de ajustes */}
        <button className="btn ghost" onClick={() => navigate("/config")}>
          ⚙️ Ajustes
        </button>
      </div>
    </header>
  );
}
