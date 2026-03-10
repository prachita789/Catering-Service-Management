import { createContext, useContext, useState, useEffect, useMemo } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  // Stores authenticated user data
  const [user, setUser] = useState(null);

  // Indicates whether auth data is still loading
  const [loading, setLoading] = useState(true);

  // Load user from localStorage when app starts
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("userInfo");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Invalid user data in localStorage");
      localStorage.removeItem("userInfo");
    } finally {
      setLoading(false);
    }
  }, []);

  // Login function saves user data and updates state
  const login = (userData) => {
    localStorage.setItem("userInfo", JSON.stringify(userData));
    setUser(userData);
  };

  // Logout function clears stored user data
  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  // Helper flags for easier role and auth checking
  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    login,
    logout,
    loading,
    isAuthenticated,
    isAdmin
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing auth context
export const useAuth = () => useContext(AuthContext);
