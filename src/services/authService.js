import { API_URL } from "./api";

// LOGIN
export async function loginRequest(data) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Error al iniciar sesión");
  }

  return json; // { token, user }
}

// REGISTER
export async function registerRequest(data) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Error al registrarse");
  }

  return json; // { user }
}

// GET USER FROM TOKEN
export async function getMeRequest(token) {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Token inválido");
  }

  return json; // { user }
}
