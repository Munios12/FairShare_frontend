import { API_URL } from "./api";

// GET - Datos del dashboard
export async function getDashboardDataRequest(token) {
  console.log("📤 getDashboardDataRequest llamado");
  
  const res = await fetch(`${API_URL}/users/dashboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  console.log("📥 Respuesta dashboard:", json);

  if (!res.ok) {
    throw new Error(json.message || "Error al obtener datos del dashboard");
  }

  return json.data;
}