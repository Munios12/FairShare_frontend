// IMPORTS
import { createContext, useState } from "react";

// CREAR CONTEXTO DE GRUPOS
// "null" indica que no hay valor aún: lo proveerá <GroupsProvider>.
export const GroupsContext = createContext(null);

// PROVIDER DEL CONTEXTO (export default)
export default function GroupsProvider({ children }) {

  // Estado: lista de grupos del usuario actual
  const [groups, setGroups] = useState([]);

  // Funciones fake para desarrollo
  // Cargar grupos desde backend (fake)
  function loadGroups() {
    // En backend real:
    //   const res = await fetch("/api/groups")
    //   setGroups(await res.json())
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

  // Crear un nuevo grupo
  function addGroup(newGroup) {

    const formatted = {
      id: Date.now(), // id simulado
      ...newGroup,
    };

    setGroups((prev) => [...prev, formatted]);
  }

  // EXPONER ESTADO + FUNCIONES A TODA LA APP
  // Acceso mediante hook useGroups()
  return (
    <GroupsContext.Provider value={{ groups, loadGroups, addGroup }}>
      {children}
    </GroupsContext.Provider>
  );
}
