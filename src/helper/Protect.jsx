import { useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom"; // Added Navigate here
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, openLogin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      openLogin();
    }
  }, [isLoggedIn, openLogin]);

  if (!isLoggedIn) {
    // Redirect to home, but keep the attempted path in state
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};
 