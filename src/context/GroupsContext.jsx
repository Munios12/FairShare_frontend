import { createContext, useState } from "react";

export const GroupsContext = createContext();

export default function GroupsProvider({ children }) {
  const [groups, setGroups] = useState([]);

  // TODO: implementación real del backend
  const loadGroups = () => {};
  const addGroup = () => {};

  return (
    <GroupsContext.Provider value={{ groups, loadGroups, addGroup }}>
      {children}
    </GroupsContext.Provider>
  );
}
