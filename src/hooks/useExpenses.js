import { useContext } from "react";
import { ExpensesContext } from "../context/ExpensesContext";

export default function useExpenses() {
  return useContext(ExpensesContext);
}
