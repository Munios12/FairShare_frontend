// Importamos el logo de FairShare
import logo from "../assets/img/FairShare_3.png";   // Ajusta la ruta si tu logo está en otra carpeta

// Componente Header: barra superior fija en toda la aplicación
export default function Header() {
  return (
    <header className="header">

      {/* === BRAND: LOGO + NOMBRE === */}
      <div className="brand">
        {/* Logo de FairShare */}
        <img src={logo} alt="FairShare logo" className="brand-logo" />

        {/* Nombre grande estilo branding */}
        <span className="logo-text">FairShare</span>
      </div>

      {/* === ZONA DERECHA: usuario + ajustes === */}
      <div className="header-right">

        {/* Información del usuario (de momento placeholder) */}
        <div className="user">
          <div className="avatar">FS</div>
          <span className="user-name">—</span>
        </div>

        {/* Botón de ajustes */}
        <button className="btn ghost">⚙️ Ajustes</button>
      </div>
    </header>
  );
}
