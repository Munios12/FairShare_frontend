import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Grupos from "./pages/Grupos";
import NuevoGasto from "./pages/NuevoGasto";
import Balance from "./pages/Balance";
import Configuracion from "./pages/Configuracion";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/grupos" element={<Grupos />} />
          <Route path="/nuevo-gasto" element={<NuevoGasto />} />
          <Route path="/balance" element={<Balance />} />
          <Route path="/config" element={<Configuracion />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
