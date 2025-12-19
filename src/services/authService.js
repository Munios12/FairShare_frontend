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
    body: JSON.stringify({
      nombre_usuario: data.name,
      email: data.email,
      password: data.password,
    }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Error al registrarse");
  }

  return json;
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

// PATCH - Actualizar color del avatar
export async function updateAvatarRequest(token, avatar_color) {
  console.log("📤 updateAvatarRequest llamado con:");
  console.log("  - token:", token);
  console.log("  - avatar_color:", avatar_color);
  
  const res = await fetch("http://localhost:5000/api/users/update-avatar", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ color_avatar: avatar_color }),
  });

  const json = await res.json();
  console.log("📥 Respuesta del servidor:", json);

  if (!res.ok) {
    throw new Error(json.message || "Error al actualizar avatar");
  }

  return json.data;
}


// PATCH PROFILE
export async function updateProfileRequest(token, updates) {
  const res = await fetch(`${API_URL}/users/update-profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Error al actualizar el perfil");
  }

  return json.data.user;
}

// PATCH - Cambiar contraseña
export async function updatePasswordRequest(token, passwords) {
  console.log("📤 updatePasswordRequest llamado");
  
  const res = await fetch(`${API_URL}/users/update-password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(passwords), // { currentPassword, newPassword }
  });

  const json = await res.json();
  console.log("📥 Respuesta del servidor:", json);

  if (!res.ok) {
    throw new Error(json.message || "Error al cambiar contraseña");
  }

  return json;
}

// DELETE - Eliminar cuenta
export async function deleteAccountRequest(token, password) {
  console.log("📤 deleteAccountRequest llamado");
  
  const res = await fetch(`${API_URL}/users/delete-account`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ password }),
  });

  const json = await res.json();
  console.log("📥 Respuesta del servidor:", json);

  if (!res.ok) {
    throw new Error(json.message || "Error al eliminar cuenta");
  }

  return json;
}