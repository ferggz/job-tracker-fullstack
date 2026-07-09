import { useState } from "react";
import { AuthContext } from "./authContext";
import { logoutUser } from "../services/api";

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("accessToken")),
  );

  function login() {
    setIsAuthenticated(true);
  }

  async function logout() {
    await logoutUser();
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
