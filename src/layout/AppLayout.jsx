import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../styles/global.css";
import { Outlet } from "react-router-dom";


export default function AppLayout() {
  return (
    // Raíz
    <div className="app">

      {/* HEADER SUPERIOR */}
      <Header />

      {/* LAYOUT PRINCIPAL */}
      {/* Contiene: Sidebar a la izquierda + contenido principal a la derecha */}
      <div className="layout">

        {/* SIDEBAR  */}
        <Sidebar />

        {/* CONTENIDO PRINCIPAL */}
        <main className="main">
          <Outlet />
        </main>

      </div>

      {/* FOOTER */}
      <footer className="footer">
        <small>FairShare © 2025 — Proyecto DAW — Grupo 10</small>
      </footer>
    </div>
  );
}
