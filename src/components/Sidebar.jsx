import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink className="nav-item" to="/dashboard">🏠 Inicio</NavLink>
      <NavLink className="nav-item" to="/grupos">👥 Grupos</NavLink>
      <NavLink className="nav-item" to="/nuevo-gasto">➕ Gastos personales</NavLink>
      <NavLink className="nav-item" to="/balance">📊 Balance personal</NavLink>
      <NavLink className="nav-item" to="/config">⚙️ Configuración</NavLink>
    </aside>
  );
}
