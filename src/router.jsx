import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import RecuperarContrasena from "./pages/RecuperarContrasena";

import Dashboard from "./pages/Dashboard";
import Grupos from "./pages/Grupos";
import NuevoGasto from "./pages/NuevoGasto";
import GastosPersonales from "./pages/PersonalExpenses";
import Balance from "./pages/Balance";
import Configuracion from "./pages/Configuracion";

import ProtectedRoute from "./components/ProtectedRoute";
import GroupDetail from "./pages/GroupDetail";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recuperar" element={<RecuperarContrasena />} />

        {/* Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/grupos" element={<Grupos />} />
            <Route path="/nuevo-gasto" element={<NuevoGasto />} />
            <Route path="/gastos-personales" element={<GastosPersonales />} />
            <Route path="/balance" element={<Balance />} />
            <Route path="/config" element={<Configuracion />} />
            <Route path="/grupos" element={<Grupos />} />
            <Route path="/grupos/:id" element={<GroupDetail />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}