import { API_URL } from "./api";

export async function getExpenses() {
  return fetch(`${API_URL}/expenses`);
}

export async function addExpense(data) {
  return fetch(`${API_URL}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
