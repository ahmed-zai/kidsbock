import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // track if auth status is loading

  // Login function
  const login = async (email, password) => {
    try {
      const res = await api.post("/users/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      console.error(err);
      throw err; // re-throw to handle errors in UI
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Set token in api headers - REMOVED, now handled by axios interceptor
          const res = await api.get("/users/me");
          setUser(res.data);
        } catch (err) {
          console.error("Failed to load user", err);
          logout(); // remove invalid token
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
