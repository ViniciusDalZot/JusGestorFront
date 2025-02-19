import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  return !!token;
};

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;