import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

export function CustomerProtectedRoute({ children }: Props) {
  const customerToken = localStorage.getItem("customerToken");

  if (!customerToken) {
    return <Navigate to="/restaurant" replace />;
  }

  return <>{children}</>;
}
