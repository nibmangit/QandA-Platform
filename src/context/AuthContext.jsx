import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, getProfile } from "../api/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const openLogin = () => {
    setError("");
    setIsRegisterMode(false);
    setIsAuthOpen(true);
  };

  const openRegister = () => {
    setError("");
    setIsRegisterMode(true);
    setIsAuthOpen(true);
  };

  const closeAuth = () => {
    setIsAuthOpen(false);
    setError("");
  };

  // ---------- LOAD USER FROM LOCAL STORAGE ----------
  useEffect(() => {
    async function loadUser() {
      const savedUser = localStorage.getItem("currentUser");
      const accessToken = localStorage.getItem("accessToken");

      if (savedUser && accessToken) {
        try {
          const user = JSON.parse(savedUser);
          setCurrentUser(user);
          setIsLoggedIn(true);
        } catch (err) {
          console.error("Invalid localStorage user data, clearing it");
          localStorage.removeItem("currentUser");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      }

      setIsLoading(false);
    }

    loadUser();
  }, []);

  // ---------- LOGIN ----------
  const login = async (email, password) => {
    setError(""); 
    try {
      const data = await loginUser(email, password); 
      if (!data.access || !data.refresh) {
        throw { detail: "Login failed: no tokens returned" };
      }
 
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh); 

      const user = await getProfile();
      localStorage.setItem("currentUser", JSON.stringify(user));
 
      setCurrentUser(user);
      setIsLoggedIn(true); 
 
      return true;
    } catch {  
      return false;
    }
  };

  // ---------- REGISTER ----------
  const register = async ({ name, email, password }) => {
    setError(""); 
    try { 
      await registerUser({ name, email, password });
 
      console.log("Registration successful. Please log in.");
      return true;
    } catch (err) {
      console.error("Register error:", err);
      setError(err.detail || "Registration failed"); 
      return false;
    }
  };

  // ---------- LOGOUT ----------
  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };
 
  const updateCurrentUser = (updatedUser) => {
  setCurrentUser(updatedUser);
  localStorage.setItem("currentUser", JSON.stringify(updatedUser));
};


  return (
    <AuthContext.Provider
      value={{
        currentUser,
        updateCurrentUser,
        isLoggedIn,
        isLoading,
        error,
        setError,
        login,
        register,
        logout, 
        isAuthOpen,
        isRegisterMode,
        setIsRegisterMode,
        openLogin,
        openRegister,
        closeAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
