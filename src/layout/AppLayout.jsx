// Importamos el componente Header (barra superior de la app)
import Header from "../components/Header";

// Importamos el Sidebar (menú lateral izquierdo)
import Sidebar from "../components/Sidebar";

// Importamos los estilos globales de la app (variables, layout, botones…)
import "../styles/global.css";

// Importamos Outlet, el componente de React Router que muestra las páginas
import { Outlet } from "react-router-dom";


// Componente principal que define el layout completo de la aplicación.
// Todo lo que envuelva AppLayout se mostrará en TODAS las páginas (header, sidebar, footer).
export default function AppLayout() {
  return (
    // Contenedor raíz del layout
    <div className="app">

      {/* HEADER SUPERIOR */}
      {/* Siempre visible. Contiene logo, usuario y botón de ajustes */}
      <Header />

      {/* LAYOUT PRINCIPAL */}
      {/* Contiene: Sidebar a la izquierda + contenido principal a la derecha */}
      <div className="layout">

        {/* SIDEBAR (menú de navegación) */}
        <Sidebar />

        {/* CONTENIDO PRINCIPAL */}
        {/* "Outlet" se reemplaza automáticamente por la página correspondiente */}
        {/* Ej: /dashboard → se pinta Dashboard.jsx dentro de <Outlet /> */}
        <main className="main">
          <Outlet />
        </main>

      </div>

      {/* FOOTER FIJO PARA TODA LA APLICACIÓN */}
      <footer className="footer">
        <small>FairShare © 2025 — Proyecto DAW — Grupo 10</small>
      </footer>
    </div>
  );
}
