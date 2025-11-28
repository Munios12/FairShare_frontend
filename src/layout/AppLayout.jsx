import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../styles/global.css";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="app-layout">
      <Header />

      <div className="layout">
        <Sidebar />
        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
