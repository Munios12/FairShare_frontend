import { useContext } from "react";
import { ExpensesContext } from "../context/ExpensesContext";

export default function useExpenses() {
  const context = useContext(ExpensesContext);

  if (!context) {
    throw new Error("useExpenses debe usarse dentro de un <ExpensesProvider>");
  }

  return context;
}
