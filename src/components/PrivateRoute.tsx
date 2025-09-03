// PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import { useAuth } from "../context/AuthContext";

interface PrivateRouteProps {
  children: JSX.Element;
  allowedRoles?: string[]; // optional, if not provided -> any role is allowed
}

const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // or your spinner component
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  const role = user?.role;

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // User is authenticated but not allowed
    return role === "staff" ? (
      <Navigate to="/dashboard" replace />
    ) : (
      <Navigate to="/" replace />
    );
  }

  return children;
};

export default PrivateRoute;