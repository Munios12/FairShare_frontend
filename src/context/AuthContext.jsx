import { createContext, useState, useContext } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // TODO: implementar login y register reales
  const login = () => {};
  const register = () => {};
  const logout = () => {};

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
