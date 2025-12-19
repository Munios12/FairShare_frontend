import { createContext, useState } from "react";

export const ExpensesContext = createContext(null);

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
    const formatted = {
      id: Date.now(), 
      ...expense,
    };

    setExpenses((prev) => [...prev, formatted]);
  }

  // ESTADO + FUNCIONES
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
