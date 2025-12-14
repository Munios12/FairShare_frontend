// Hook personalizado para acceder al contexto de Grupos
// Garantiza que siempre se use dentro de <GroupsProvider>

import { useContext } from "react";
import { GroupsContext } from "../context/GroupsContext";

export default function useGroups() {
  const context = useContext(GroupsContext);

  // Evitamos errores si este hook se usa fuera del Provider
  if (!context) {
    throw new Error("useGroups debe usarse dentro de un <GroupsProvider>");
  }

  return context;
}
