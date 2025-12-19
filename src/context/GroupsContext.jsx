import { createContext, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import {
  getAllGroupsRequest,
  createGroupRequest,
  getGroupByIdRequest,
  addMemberToGroupRequest,
  deleteGroupRequest
} from "../services/groupsService";

export const GroupsContext = createContext(null);

export default function GroupsProvider({ children }) {
  const { token } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar grupos al montar el componente
  useEffect(() => {
    if (token) {
      loadGroups();
    }
  }, [token]);

  // Cargar todos los grupos del usuario
  async function loadGroups() {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const groupsData = await getAllGroupsRequest(token);
      setGroups(groupsData);
    } catch (err) {
      console.error("❌ Error al cargar grupos:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Crear nuevo grupo
  async function createGroup(nombre_grupo) {
    if (!token) throw new Error("No autenticado");

    try {
      const newGroup = await createGroupRequest(token, nombre_grupo);
      setGroups((prev) => [newGroup, ...prev]);
      return newGroup;
    } catch (err) {
      console.error("❌ Error al crear grupo:", err.message);
      throw err;
    }
  }

  // Obtener detalle de un grupo
  async function getGroupById(groupId) {
    if (!token) throw new Error("No autenticado");

    try {
      const group = await getGroupByIdRequest(token, groupId);
      return group;
    } catch (err) {
      console.error("❌ Error al obtener grupo:", err.message);
      throw err;
    }
  }

  // Añadir miembro a un grupo
  async function addMemberToGroup(groupId, email) {
    if (!token) throw new Error("No autenticado");

    try {
      const member = await addMemberToGroupRequest(token, groupId, email);
      // Recargar grupos para actualizar la lista
      await loadGroups();
      return member;
    } catch (err) {
      console.error("❌ Error al añadir miembro:", err.message);
      throw err;
    }
  }

  // Eliminar grupo
  async function deleteGroup(groupId) {
    if (!token) throw new Error("No autenticado");

    try {
      await deleteGroupRequest(token, groupId);
      // Actualizar lista local eliminando el grupo
      setGroups((prev) => prev.filter((g) => g.id !== groupId));
    } catch (err) {
      console.error("❌ Error al eliminar grupo:", err.message);
      throw err;
    }
  }

  return (
    <GroupsContext.Provider
      value={{
        groups,
        loading,
        error,
        loadGroups,
        createGroup,
        getGroupById,
        addMemberToGroup,
        deleteGroup,
      }}
    >
      {children}
    </GroupsContext.Provider>
  );
}