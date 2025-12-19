const API_URL = "http://localhost:5000/api/balance";

// Obtener balance general
export async function getBalanceGeneralRequest(token) {
  console.log("💼 getBalanceGeneralRequest llamado");

  try {
    const response = await fetch(`${API_URL}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    console.log("📥 Respuesta balance general:", result);

    if (!response.ok) {
      throw new Error(result.message || "Error al obtener balance general");
    }

    return result.data;
  } catch (error) {
    console.error("❌ Error en getBalanceGeneralRequest:", error.message);
    throw error;
  }
}

// Obtener gastos personales detalle
export async function getGastosPersonalesDetalleRequest(token) {
  console.log("💳 getGastosPersonalesDetalleRequest llamado");

  try {
    const response = await fetch(`${API_URL}/personal`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    console.log("📥 Respuesta gastos personales:", result);

    if (!response.ok) {
      throw new Error(result.message || "Error al obtener gastos personales");
    }

    return result.data;
  } catch (error) {
    console.error("❌ Error en getGastosPersonalesDetalleRequest:", error.message);
    throw error;
  }
}

// Obtener resumen de grupos
export async function getResumenGruposRequest(token) {
  console.log("👥 getResumenGruposRequest llamado");

  try {
    const response = await fetch(`${API_URL}/grupos`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    console.log("📥 Respuesta resumen grupos:", result);

    if (!response.ok) {
      throw new Error(result.message || "Error al obtener resumen de grupos");
    }

    return result.data;
  } catch (error) {
    console.error("❌ Error en getResumenGruposRequest:", error.message);
    throw error;
  }
}

// Obtener balance por grupo
export async function getBalanceByGroupRequest(token, groupId) {
  console.log("👥 getBalanceByGroupRequest llamado para grupo:", groupId);

  try {
    const response = await fetch(`${API_URL}/group/${groupId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    console.log("📥 Respuesta balance grupo:", result);

    if (!response.ok) {
      throw new Error(result.message || "Error al obtener balance del grupo");
    }

    return result.data;
  } catch (error) {
    console.error("❌ Error en getBalanceByGroupRequest:", error.message);
    throw error;
  }
}

// Obtener balance con transacciones del grupo
export async function getBalanceWithTransactionsRequest(token, groupId) {
  console.log("💰 getBalanceWithTransactionsRequest llamado para grupo:", groupId);

  try {
    const response = await fetch(`${API_URL}/group/${groupId}/transactions`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    console.log("📥 Respuesta balance con transacciones:", result);

    if (!response.ok) {
      throw new Error(result.message || "Error al obtener balance del grupo");
    }

    return result.data;
  } catch (error) {
    console.error("❌ Error en getBalanceWithTransactionsRequest:", error.message);
    throw error;
  }
}