// ExpensesContext.jsx
// -------------------
// 1) Crear contexto para gestionar gastos
// 2) Proveedor que almacena y expone los gastos
// 3) Funciones para cargar y añadir gastos (fake por ahora)
// 4) Preparado para conectarlo a un backend más adelante

// ==================================================
// IMPORTS
// ==================================================
import { createContext, useState } from "react";

// ==================================================
// 1) CREAR CONTEXTO DE GASTOS
// --------------------------------------------------
// Se inicializa en null (como todos los contextos bien diseñados)
// y el Provider será quien inyecte el valor real.
export const ExpensesContext = createContext(null);

// ==================================================
// 2) PROVIDER DEL CONTEXTO (export default)
// --------------------------------------------------
// Envolverá la parte de la App que necesita acceder a los gastos.
// Usa export default para estandarizar los Providers.
export default function ExpensesProvider({ children }) {

  // Estado interno: lista de gastos del grupo activo
  const [expenses, setExpenses] = useState([]);

  // ==================================================
  // 3) FUNCIONES SIMULADAS (mock frontend)
  // --------------------------------------------------
  // Más adelante se reemplazarán con llamadas reales al backend.

  // --------------------------
  // 🔸 Cargar gastos del grupo
  // --------------------------
  function loadExpenses(groupId) {
    // En backend sería:
    //   fetch(`/api/groups/${groupId}/expenses`)
    // Por ahora usamos datos fake:

    const fakeData = [
      {
        id: 1,
        concept: "Cena restaurante",
        amount: 45,
        paidBy: "Juan",
        participants: ["Juan", "Luismi", "Alex", "Jesús"],
      },
      {
        id: 2,
        concept: "Gasolina",
        amount: 35,
        paidBy: "Luismi",
        participants: ["Luismi", "Alex"],
      },
    ];

    setExpenses(fakeData);
  }

  // --------------------------
  // 🔸 Añadir un nuevo gasto
  // --------------------------
  function addExpense(expense) {
    // expense deberá contener:
    //   concept, amount, paidBy, participants...
    const formatted = {
      id: Date.now(), // id simulado
      ...expense,
    };

    setExpenses((prev) => [...prev, formatted]);
  }

  // ==================================================
  // 4) EXPONER ESTADO + FUNCIONES
  // --------------------------------------------------
  // Cualquier componente envuelto por <ExpensesProvider>
  // podrá llamar:
  //      const { expenses, loadExpenses, addExpense } = useExpenses();
  return (
    <ExpensesContext.Provider
      value={{
        expenses,
        loadExpenses,
        addExpense,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
}
