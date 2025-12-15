// Importamos el hook de navegación
import { useNavigate } from "react-router-dom";

// Importamos React hooks
import { useEffect, useRef, useState } from "react";

// Importamos el hook de Auth para poder hacer logout 
import useAuth from "../hooks/useAuth";

// Importamos el logo de FairShare
import logo from "../assets/img/FairShare_3.png";

// Componente Header: barra superior fija en toda la aplicación
export default function Header() {
  // Hook para navegar por rutas
  const navigate = useNavigate();

  // Sacamos logout del contexto de autenticación
  const { logout } = useAuth();

  // Dropdown usuario
  const [openUserMenu, setOpenUserMenu] = useState(false);

  // Iniciales del usuario (placeholder). En el futuro: user.name -> iniciales.
  const initials = "FS";

  // Color del avatar (lo que el usuario "elige")
  const [avatarColor, setAvatarColor] = useState("teal");

  // Nombre placeholder (más adelante: user.name)
  const userName = "—";

  // Colores disponibles (pensados para encajar con tu UI)
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

  // Acción “Cerrar sesión”: limpia sesión + redirige al login sin poder volver atrás
  function handleLogout() {
    logout(); // 1) user => null (AuthContext)
    setOpenUserMenu(false); // 2) cerramos dropdown
    navigate("/", { replace: true }); // 3) redirigimos al login y bloqueamos "atrás"
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
            {/* Iniciales fijas + color variable */}
            <div className={`avatar avatar--${avatarColor}`}>{initials}</div>
            <span className="user-name">{userName}</span>
          </button>

          {openUserMenu && (
            <div className="user-dropdown" role="menu">
              {/* Nombre (placeholder) */}
              <div className="user-dropdown-name">
                {userName === "—" ? "Invitado" : userName}
              </div>

              <div className="user-dropdown-sep" />

              {/* Cambiar color del avatar */}
              <div className="user-dropdown-label">Color del avatar</div>

              <div className="color-grid">
                {colorOptions.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`color-pick color-pick--${c.id} ${
                      avatarColor === c.id ? "active" : ""
                    }`}
                    onClick={() => setAvatarColor(c.id)}
                    title={c.label}
                    aria-label={`Color ${c.label}`}
                  />
                ))}
              </div>

              <div className="user-dropdown-sep" />

              {/* Cerrar sesión  */}
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
