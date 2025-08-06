import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: Props) {
  const { isAuthenticated, role } = useAuth();
  const normalizedRole = role?.toLowerCase();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (
    allowedRoles &&
    !allowedRoles.map((r) => r.toLowerCase()).includes(normalizedRole || "")
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
