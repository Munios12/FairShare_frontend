import { useContext } from "react";
import { GroupsContext } from "../context/GroupsContext";

export default function useGroups() {
  const context = useContext(GroupsContext);

  if (!context) {
    throw new Error("useGroups debe usarse dentro de GroupsProvider");
  }

  return context;
}