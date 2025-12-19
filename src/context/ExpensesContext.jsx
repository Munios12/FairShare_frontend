// IMPORTS

import { createContext, useState } from "react";

// CREAR CONTEXTO DE GASTOS
export const ExpensesContext = createContext(null);

// PROVIDER DEL CONTEXTO
export default function ExpensesProvider({ children }) {

  // Estado interno: lista de gastos del grupo activo
  const [expenses, setExpenses] = useState([]);


  //  Cargar gastos del grupo
  function loadExpenses(groupId) {
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

  // Añadir un nuevo gasto
  function addExpense(expense) {
    // expense deberá contener:
    //   concept, amount, paidBy, participants...
    const formatted = {
      id: Date.now(), // id simulado
      ...expense,
    };

    setExpenses((prev) => [...prev, formatted]);
  }

  // EXPONER ESTADO + FUNCIONES
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
