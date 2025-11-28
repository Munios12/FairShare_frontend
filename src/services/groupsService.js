import { API_URL } from "./api";

export async function getGroups() {
  return fetch(`${API_URL}/groups`);
}

export async function createGroup(data) {
  return fetch(`${API_URL}/groups`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
