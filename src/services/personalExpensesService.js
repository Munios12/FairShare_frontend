const API_URL = "http://localhost:5000/api/expenses";

// Crear gasto personal
export async function createPersonalExpenseRequest(token, data) {
  console.log("💳 createPersonalExpenseRequest llamado:", data);

  try {
    const response = await fetch(`${API_URL}/personal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("📥 Respuesta crear gasto personal:", result);

    if (!response.ok) {
      throw new Error(result.message || "Error al crear gasto personal");
    }

    return result.data.expense;
  } catch (error) {
    console.error("❌ Error en createPersonalExpenseRequest:", error.message);
    throw error;
  }
}

// Obtener gastos personales
export async function getPersonalExpensesRequest(token) {
  console.log("💳 getPersonalExpensesRequest llamado");

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
    console.error("❌ Error en getPersonalExpensesRequest:", error.message);
    throw error;
  }
}

// Eliminar gasto personal
export async function deletePersonalExpenseRequest(token, expenseId) {
  console.log("🗑️ deletePersonalExpenseRequest llamado:", expenseId);

  try {
    const response = await fetch(`${API_URL}/personal/${expenseId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    console.log("📥 Respuesta eliminar gasto personal:", result);

    if (!response.ok) {
      throw new Error(result.message || "Error al eliminar gasto personal");
    }

    return result;
  } catch (error) {
    console.error("❌ Error en deletePersonalExpenseRequest:", error.message);
    throw error;
  }
}