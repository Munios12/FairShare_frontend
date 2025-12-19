import { API_URL } from "./api";

// GET - Obtener todos los grupos del usuario
export async function getAllGroupsRequest(token) {
  console.log("📤 getAllGroupsRequest llamado");
  
  const res = await fetch(`${API_URL}/groups`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  console.log("📥 Respuesta grupos:", json);

  if (!res.ok) {
    throw new Error(json.message || "Error al obtener grupos");
  }

  return json.data.groups;
}

// POST - Crear nuevo grupo
export async function createGroupRequest(token, nombre_grupo) {
  console.log("📤 createGroupRequest llamado:", nombre_grupo);
  
  const res = await fetch(`${API_URL}/groups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ nombre_grupo }),
  });

  const json = await res.json();
  console.log("📥 Respuesta crear grupo:", json);

  if (!res.ok) {
    throw new Error(json.message || "Error al crear grupo");
  }

  return json.data.group;
}

// GET - Obtener detalle de un grupo
export async function getGroupByIdRequest(token, groupId) {
  console.log("📤 getGroupByIdRequest llamado:", groupId);
  
  const res = await fetch(`${API_URL}/groups/${groupId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  console.log("📥 Respuesta detalle grupo:", json);

  if (!res.ok) {
    throw new Error(json.message || "Error al obtener grupo");
  }

  return json.data.group;
}

// POST - Añadir miembro al grupo
export async function addMemberToGroupRequest(token, groupId, email) {
  console.log("📤 addMemberToGroupRequest llamado:", { groupId, email });
  
  const res = await fetch(`${API_URL}/groups/${groupId}/add-member`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email }),
  });

  const json = await res.json();
  console.log("📥 Respuesta añadir miembro:", json);

  if (!res.ok) {
    throw new Error(json.message || "Error al añadir miembro");
  }

  return json.data.member;
}

// DELETE - Eliminar grupo
export async function deleteGroupRequest(token, groupId) {
  console.log("📤 deleteGroupRequest llamado:", groupId);
  
  const res = await fetch(`${API_URL}/groups/${groupId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  console.log("📥 Respuesta eliminar grupo:", json);

  if (!res.ok) {
    throw new Error(json.message || "Error al eliminar grupo");
  }

  return json;
}
