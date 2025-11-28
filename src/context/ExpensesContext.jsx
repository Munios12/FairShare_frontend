import { createContext, useState } from "react";

export const ExpensesContext = createContext();

export default function ExpensesProvider({ children }) {
  const [expenses, setExpenses] = useState([]);

  const loadExpenses = () => {};
  const addExpense = () => {};

  return (
    <ExpensesContext.Provider value={{ expenses, loadExpenses, addExpense }}>
      {children}
    </ExpensesContext.Provider>
  );
}
