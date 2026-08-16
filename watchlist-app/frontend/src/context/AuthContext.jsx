import { createContext, useContext, useEffect, useState } from "react";
import axiosClient, {
  setAuthTokens,
  clearAuthTokens,
  getStoredTokens,
} from "../api/axiosClient.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, trust an existing access token in storage (a request
  // interceptor + 401 refresh flow keeps it valid from here on).
  useEffect(() => {
    const { access } = getStoredTokens();
    if (access) {
      setUser({ username: localStorage.getItem("username") || "" });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const { data } = await axiosClient.post("/auth/token/", {
      username,
      password,
    });
    setAuthTokens({ access: data.access, refresh: data.refresh });
    localStorage.setItem("username", username);
    setUser({ username });
  };

  const logout = () => {
    clearAuthTokens();
    localStorage.removeItem("username");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
