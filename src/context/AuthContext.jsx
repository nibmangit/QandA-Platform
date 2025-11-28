import { createContext, useContext, useState, useEffect } from "react";
import { MOCK_USERS } from "../utils/mock/mockData";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");

  // ---------- LOAD FROM LOCAL STORAGE ----------
  useEffect(() => {
    async function loadData() {
      const savedUser = localStorage.getItem("currentUser");
      const savedUsers = localStorage.getItem("users");

      if (savedUsers) {
        setUsers(JSON.parse(savedUsers));
      } else {
        setUsers(MOCK_USERS);
      }

      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
        setIsLoggedIn(true);
      }
    }

    loadData();
  }, []);

  // ---------- SAVE USERS ----------
  useEffect(() => {
    async function saveUsers() {
      localStorage.setItem("users", JSON.stringify(users));
    }

    saveUsers();
  }, [users]);

  // ---------- LOGIN ----------
  const login = (email, password) => {
    setError("");

    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      setError("Invalid email or password!");
      return false;
    }

    setCurrentUser(user);
    setIsLoggedIn(true);
    localStorage.setItem("currentUser", JSON.stringify(user));

    return true;
  };

  // ---------- REGISTER ----------
  const register = ({ name, email, password }) => {
    setError("");

    if (users.some((u) => u.email === email)) {
      setError("Email already exists!");
      return false;
    }

    const newUser = {
      id: "user-" + Date.now(),
      name,
      email,
      password,
      role: "user",
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsLoggedIn(true);

    localStorage.setItem("currentUser", JSON.stringify(newUser));

    return true;
  };

  // ---------- LOGOUT ----------
  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider
      value={{
        users,
        currentUser,
        isLoggedIn,
        error,
        setError,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
