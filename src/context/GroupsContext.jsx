// GroupsContext.jsx
// ------------------
// 1) Gestiona los grupos creados por el usuario
// 2) Permite cargarlos desde el backend (por ahora datos simulados)
// 3) Permite crear nuevos grupos
// 4) Más adelante se conectará a la API real

// ==================================================
// IMPORTS
// ==================================================
import { createContext, useState } from "react";

// ==================================================
// 1) CREAR CONTEXTO DE GRUPOS
// --------------------------------------------------
// Export nombrado (named export) porque no es el valor por defecto.
// "null" indica que no hay valor aún: lo proveerá <GroupsProvider>.
export const GroupsContext = createContext(null);

// ==================================================
// 2) PROVIDER DEL CONTEXTO (export default)
// --------------------------------------------------
// Envolverá la parte de la App que necesita acceder a los grupos.
// Esto permite importarlo como:
//    import GroupsProvider from "../context/GroupsContext";
export default function GroupsProvider({ children }) {

  // Estado: lista de grupos del usuario actual
  const [groups, setGroups] = useState([]);

  // =======================================
  // 🚀 Funciones fake para desarrollo
  // =======================================

  // --------------------------
  // 🔸 Cargar grupos desde backend (fake)
  // --------------------------
  function loadGroups() {
    // En backend real:
    //   const res = await fetch("/api/groups")
    //   setGroups(await res.json())
    // De momento simulamos los del mockup:
    const fakeGroups = [
      {
        id: 1,
        name: "Viaje a Barcelona",
        lastExpense: "Cena restaurante (€45,00)",
        participants: 4,
        balance: -12.5,
      },
      {
        id: 2,
        name: "Piso compartido",
        lastExpense: "Supermercado (€67,80)",
        participants: 3,
        balance: +22.6,
      },
    ];

    setGroups(fakeGroups);
  }

  // --------------------------
  // 🔸 Crear un nuevo grupo
  // --------------------------
  function addGroup(newGroup) {
    // newGroup deberá tener:
    //   - name
    //   - participants
    //   - lastExpense (opcional)
    // El backend normalmente devuelve el id real.
    const formatted = {
      id: Date.now(), // id simulado
      ...newGroup,
    };

    setGroups((prev) => [...prev, formatted]);
  }

  // ==================================================
  // 3) EXPONER ESTADO + FUNCIONES A TODA LA APP
  // --------------------------------------------------
  // Acceso mediante hook useGroups()
  return (
    <GroupsContext.Provider value={{ groups, loadGroups, addGroup }}>
      {children}
    </GroupsContext.Provider>
  );
}
